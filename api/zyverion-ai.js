import {
  ZYVERION_BRAND,
  createSituationBlueprint,
  buildSystemKnowledgePrompt,
  getTrustLines,
  getObjectionAnswer,
} from "./zyverion-knowledge.js";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(request) {
  try {
    const apiKey =
      process.env.OPENAI_API_KEY ||
      process.env.OPENAI_KEY ||
      process.env.ZYVERION_OPENAI_API_KEY;

    if (!apiKey) {
      return json(
        {
          error: "Missing OPENAI_API_KEY on the server.",
        },
        500
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(
        {
          error: "Invalid JSON body.",
        },
        400
      );
    }

    const message =
      typeof body?.message === "string" ? body.message.trim() : "";
    const language = normalizeLanguage(body?.language);
    const sessionContext = sanitizeSessionContext(body?.sessionContext);

    if (!message) {
      return json(
        {
          error: "Message is required.",
        },
        400
      );
    }

    if (message.length > 2000) {
      return json(
        {
          error: "Message is too long.",
        },
        400
      );
    }

    const analysisSeed = buildAnalysisSeed(message, sessionContext);
    const blueprint = createSituationBlueprint(analysisSeed, { language });
    const intent = detectIntent(message);

    const fallback = buildFallbackReply({
      message,
      language,
      intent,
      blueprint,
      sessionContext,
    });

    if (intent === "offtopic") {
      return json(fallback, 200);
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: buildSystemPrompt(language, blueprint, sessionContext),
          },
          {
            role: "user",
            content: buildUserPrompt(message, language, blueprint, sessionContext),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "zyverion_consultative_reply",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                textReply: {
                  type: "string",
                },
                spokenReply: {
                  type: "string",
                },
                answerMode: {
                  type: "string",
                  enum: [
                    "direct",
                    "discovery",
                    "recommendation",
                    "pricing",
                    "objection",
                    "support",
                  ],
                },
                followUpQuestions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                situationSummary: {
                  type: "string",
                },
                recommendedSolutions: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      id: {
                        type: "string",
                      },
                      name: {
                        type: "string",
                      },
                      category: {
                        type: "string",
                      },
                      purpose: {
                        type: "string",
                      },
                    },
                    required: ["id", "name", "category", "purpose"],
                  },
                },
                suggestedAction: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    type: {
                      type: "string",
                      enum: ["estimator", "contact", "work", "none"],
                    },
                    label: {
                      type: "string",
                    },
                    href: {
                      type: "string",
                    },
                  },
                  required: ["type", "label", "href"],
                },
                situation: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    businessTypeId: {
                      type: "string",
                    },
                    stage: {
                      type: "string",
                    },
                    goals: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                    capabilities: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                  required: ["businessTypeId", "stage", "goals", "capabilities"],
                },
              },
              required: [
                "textReply",
                "spokenReply",
                "answerMode",
                "followUpQuestions",
                "situationSummary",
                "recommendedSolutions",
                "suggestedAction",
                "situation",
              ],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const detail = await safeReadText(response);
      return json(
        {
          ...fallback,
          debug: {
            source: "openai_http_error",
            status: response.status,
            detail: detail.slice(0, 500),
          },
        },
        200
      );
    }

    const data = await response.json();
    const outputText =
      typeof data?.output_text === "string" ? data.output_text.trim() : "";

    if (!outputText) {
      return json(fallback, 200);
    }

    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      return json(fallback, 200);
    }

    return json(
      sanitizeReply({
        parsed,
        language,
        fallback,
        blueprint,
      }),
      200
    );
  } catch {
    return json(
      buildFallbackReply({
        message: "",
        language: "en",
        intent: "general",
        blueprint: createSituationBlueprint("", { language: "en" }),
        sessionContext: {},
        forceSupport:
          "Zyverion AI is temporarily using fallback mode. Please try again.",
      }),
      200
    );
  }
}

function corsHeaders(extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json; charset=utf-8",
    ...extra,
  };
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders(),
  });
}

function normalizeLanguage(value) {
  return value === "si" || value === "ta" || value === "en" ? value : "en";
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function sanitizeSessionContext(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return {
    businessSummary:
      typeof value.businessSummary === "string" ? value.businessSummary.trim() : "",
    userGoal:
      typeof value.userGoal === "string" ? value.userGoal.trim() : "",
    knownBusinessTypeId:
      typeof value.knownBusinessTypeId === "string"
        ? value.knownBusinessTypeId.trim()
        : "",
    knownStage:
      typeof value.knownStage === "string" ? value.knownStage.trim() : "",
    notes:
      typeof value.notes === "string" ? value.notes.trim() : "",
  };
}

function buildAnalysisSeed(message, sessionContext) {
  const bits = [
    sessionContext.businessSummary || "",
    sessionContext.userGoal || "",
    sessionContext.knownBusinessTypeId || "",
    sessionContext.knownStage || "",
    sessionContext.notes || "",
    message || "",
  ].filter(Boolean);

  return bits.join(" ");
}

function buildSystemPrompt(language, blueprint, sessionContext) {
  const corePrompt = buildSystemKnowledgePrompt(language);
  const trustLines = getTrustLines(language, 3);
  const objectionWhyZyverion = getObjectionAnswer("why_zyverion", language);
  const profile = blueprint.profile;
  const snapshot = blueprint.snapshot;

  return `
${corePrompt}

Current brand context:
- Brand name: ${ZYVERION_BRAND.fullName}
- Positioning: ${ZYVERION_BRAND.positioning}

Current inferred situation:
- Business type id: ${profile.businessTypeId}
- Stage: ${profile.stage}
- Goals: ${(profile.goals || []).join(", ") || "unknown"}
- Capabilities: ${(profile.capabilities || []).join(", ") || "unknown"}
- Intent mode: ${profile.intentMode}
- High intent: ${profile.highIntent ? "yes" : "no"}
- Unsure user: ${profile.unsureUser ? "yes" : "no"}

Recommended solution direction:
${(snapshot.recommendedWebsiteTypes || [])
  .slice(0, 3)
  .map(
    (item) =>
      `- ${item.name} (${item.category}): ${item.purpose}`
  )
  .join("\n")}

Recommended service buckets:
${(snapshot.recommendedServiceBuckets || [])
  .slice(0, 4)
  .map((item) => `- ${item.label}: ${item.summary}`)
  .join("\n")}

Consultation guidance:
${(snapshot.consultationGuidance || []).map((line) => `- ${line}`).join("\n")}

Trust references:
${trustLines.map((line) => `- ${line}`).join("\n")}

Why Zyverion reference:
- ${objectionWhyZyverion}

Response rules:
- Do not behave like a simple page router.
- Give a genuinely useful answer first.
- Recommend the right website type or solution type when the situation calls for it.
- If the user is unsure, move into discovery mode and ask up to 2 smart follow-up questions.
- If the user clearly needs a recommendation, explain what fits and why.
- If pricing is asked, explain what affects price before guiding to the Estimator.
- If the business situation suggests website + system, say that directly.
- If a simple website is enough, say that directly and do not overbuild.
- Keep everything inside Zyverion's actual service scope.
- Keep textReply premium, human, natural, and clearly explained.
- Keep spokenReply shorter, smoother, and easier to say aloud.
- Avoid repetitive "please use this page" phrasing.
- Only use suggestedAction when it naturally supports the answer.
- followUpQuestions should be empty when not needed.
- situationSummary should briefly explain what you currently understand about the user's situation.
- recommendedSolutions should contain up to 3 relevant website or solution types.
- suggestedAction.type must be one of: estimator, contact, work, none.
- If the question is unrelated to Zyverion, refuse politely and redirect back to Zyverion-only help.

Session context:
${JSON.stringify(sessionContext)}
`.trim();
}

function buildUserPrompt(message, language, blueprint, sessionContext) {
  const snapshot = blueprint.snapshot;
  const recommendationExplanation = blueprint.recommendationExplanation || "";
  const nextStepGuidance = blueprint.nextStepGuidance || "";
  const discoveryPrompt = blueprint.discoveryPrompt || "";

  return `
Selected language: ${language}

User message:
${message}

Current situation snapshot:
${JSON.stringify(
  {
    businessType: snapshot.businessType,
    goals: snapshot.goals?.map((item) => item?.id || item?.label || ""),
    capabilities: snapshot.capabilities?.map((item) => item?.id || item?.label || ""),
    stage: snapshot.stage?.id || "",
    suggestedAction: snapshot.suggestedAction,
  },
  null,
  2
)}

Recommendation notes:
- ${recommendationExplanation}
- ${nextStepGuidance}
- ${discoveryPrompt}

Return the response in the selected language.
`.trim();
}
function sanitizeReply({ parsed, language, fallback, blueprint }) {
  const textReply =
    typeof parsed?.textReply === "string" && parsed.textReply.trim()
      ? parsed.textReply.trim()
      : fallback.textReply;

  const spokenReplyRaw =
    typeof parsed?.spokenReply === "string" && parsed.spokenReply.trim()
      ? parsed.spokenReply.trim()
      : textReply;

  const answerMode = normalizeAnswerMode(parsed?.answerMode, fallback.answerMode);

  const followUpQuestions = Array.isArray(parsed?.followUpQuestions)
    ? parsed.followUpQuestions
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => item.trim())
        .slice(0, 2)
    : fallback.followUpQuestions;

  const situationSummary =
    typeof parsed?.situationSummary === "string" && parsed.situationSummary.trim()
      ? parsed.situationSummary.trim()
      : fallback.situationSummary;

  const recommendedSolutions = sanitizeRecommendedSolutions(
    parsed?.recommendedSolutions,
    fallback.recommendedSolutions
  );

  const suggestedAction = sanitizeSuggestedAction(
    parsed?.suggestedAction,
    fallback.suggestedAction
  );

  const situation = sanitizeSituation(
    parsed?.situation,
    fallback.situation,
    blueprint
  );

  return {
    textReply,
    spokenReply: cleanupSpokenReply(spokenReplyRaw, language),
    answerMode,
    followUpQuestions,
    situationSummary,
    recommendedSolutions,
    suggestedAction,
    situation,
  };
}

function normalizeAnswerMode(value, fallback = "support") {
  const allowed = new Set([
    "direct",
    "discovery",
    "recommendation",
    "pricing",
    "objection",
    "support",
  ]);

  return allowed.has(value) ? value : fallback;
}

function sanitizeRecommendedSolutions(value, fallback) {
  if (!Array.isArray(value) || !value.length) {
    return fallback;
  }

  const cleaned = value
    .map((item) => ({
      id: typeof item?.id === "string" ? item.id.trim() : "",
      name: typeof item?.name === "string" ? item.name.trim() : "",
      category: typeof item?.category === "string" ? item.category.trim() : "",
      purpose: typeof item?.purpose === "string" ? item.purpose.trim() : "",
    }))
    .filter(
      (item) => item.id && item.name && item.category && item.purpose
    )
    .slice(0, 3);

  return cleaned.length ? cleaned : fallback;
}

function sanitizeSuggestedAction(value, fallback) {
  const type =
    typeof value?.type === "string" ? value.type.trim() : fallback.type;

  const safeType = ["estimator", "contact", "work", "none"].includes(type)
    ? type
    : fallback.type;

  let label = typeof value?.label === "string" ? value.label.trim() : "";
  let href = typeof value?.href === "string" ? value.href.trim() : "";

  if (safeType === "estimator") {
    label = label || "Open Estimator";
    href = href || "estimator.html";
  } else if (safeType === "contact") {
    label = label || "Contact Zyverion";
    href = href || "contact.html";
  } else if (safeType === "work") {
    label = label || "View Our Work";
    href = href || "projects.html";
  } else {
    label = "";
    href = "";
  }

  return {
    type: safeType,
    label,
    href,
  };
}

function sanitizeSituation(value, fallback, blueprint) {
  const profile = blueprint?.profile || {};
  const safeFallback = fallback || {
    businessTypeId: profile.businessTypeId || "general_service_business",
    stage: profile.stage || "unknown",
    goals: profile.goals || [],
    capabilities: profile.capabilities || [],
  };

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return safeFallback;
  }

  return {
    businessTypeId:
      typeof value.businessTypeId === "string" && value.businessTypeId.trim()
        ? value.businessTypeId.trim()
        : safeFallback.businessTypeId,
    stage:
      typeof value.stage === "string" && value.stage.trim()
        ? value.stage.trim()
        : safeFallback.stage,
    goals: Array.isArray(value.goals)
      ? value.goals
          .filter((item) => typeof item === "string" && item.trim())
          .map((item) => item.trim())
          .slice(0, 6)
      : safeFallback.goals,
    capabilities: Array.isArray(value.capabilities)
      ? value.capabilities
          .filter((item) => typeof item === "string" && item.trim())
          .map((item) => item.trim())
          .slice(0, 6)
      : safeFallback.capabilities,
  };
}

function buildFallbackReply({
  message,
  language,
  intent,
  blueprint,
  sessionContext,
  forceSupport = "",
}) {
  const profile = blueprint.profile;
  const snapshot = blueprint.snapshot;
  const topSolutions = (snapshot.recommendedWebsiteTypes || []).slice(0, 3);
  const suggestedAction = normalizeSuggestedAction(
    blueprint.suggestedAction,
    {
      type: "none",
      label: "",
      href: "",
    }
  );

  const answerMode = decideFallbackAnswerMode(intent, profile);
  const followUpQuestions =
    answerMode === "discovery"
      ? (snapshot.discoveryQuestions || []).slice(0, 2)
      : [];

  const situationSummary =
    forceSupport || buildSituationSummary(profile, language, sessionContext);

  let textReply = forceSupport || buildSupportAnswer({
    intent,
    language,
    profile,
    snapshot,
    sessionContext,
    followUpQuestions,
  });

  let spokenReply = forceSupport || buildSpokenReply({
    intent,
    language,
    profile,
    snapshot,
    followUpQuestions,
  });

  return {
    textReply,
    spokenReply: cleanupSpokenReply(spokenReply, language),
    answerMode,
    followUpQuestions,
    situationSummary,
    recommendedSolutions: topSolutions.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      purpose: item.purpose,
    })),
    suggestedAction,
    situation: {
      businessTypeId: profile.businessTypeId || "general_service_business",
      stage: profile.stage || "unknown",
      goals: profile.goals || [],
      capabilities: profile.capabilities || [],
    },
  };
}

function decideFallbackAnswerMode(intent, profile) {
  if (intent === "pricing") return "pricing";
  if (intent === "objection") return "objection";
  if (profile?.unsureUser || profile?.intentMode === "discovery") {
    return "discovery";
  }
  if (profile?.intentMode === "recommendation") {
    return "recommendation";
  }
  return "support";
}

function buildSituationSummary(profile, language, sessionContext = {}) {
  const businessName =
    sessionContext.businessSummary ||
    profile?.businessType?.name ||
    businessTypeLabel(profile?.businessTypeId);

  const stageLabel = stageLabelForLanguage(profile?.stage, language);
  const goalLabels = (profile?.goals || [])
    .slice(0, 2)
    .map((goal) => goalLabelForLanguage(goal, language));

  if (language === "si") {
    const goalText = goalLabels.length ? ` ප්‍රධාන focus එක ${goalLabels.join(" සහ ")} වගේ පේනවා.` : "";
    return `දැනට පේන්නේ මේක ${businessName || "business"} situation එකක්, stage එක ${stageLabel} වගේ.${goalText}`.trim();
  }

  if (language === "ta") {
    const goalText = goalLabels.length ? ` முக்கிய focus ${goalLabels.join(" மற்றும் ")} போல தெரிகிறது.` : "";
    return `இப்போது இது ${businessName || "business"} situation போல தெரிகிறது, stage ${stageLabel} போல உள்ளது.${goalText}`.trim();
  }

  const goalText = goalLabels.length
    ? ` The main focus appears to be ${goalLabels.join(" and ")}.`
    : "";
  return `This currently looks like a ${businessName || "business"} situation at a ${stageLabel} stage.${goalText}`;
}

function buildSupportAnswer({
  intent,
  language,
  profile,
  snapshot,
  sessionContext,
  followUpQuestions,
}) {
  if (intent === "objection") {
    return buildObjectionAnswer(language);
  }

  if (intent === "pricing") {
    return buildPricingAnswer(profile, snapshot, language);
  }

  if (profile?.unsureUser || profile?.intentMode === "discovery") {
    return buildDiscoveryAnswer(profile, snapshot, language, followUpQuestions);
  }

  if (profile?.intentMode === "recommendation") {
    return buildRecommendationAnswer(profile, snapshot, language);
  }

  return buildGeneralConsultativeAnswer(profile, snapshot, language, sessionContext);
}

function buildSpokenReply({
  intent,
  language,
  profile,
  snapshot,
  followUpQuestions,
}) {
  if (intent === "pricing") {
    if (language === "si") {
      return "Price එක depend වෙන්නේ build type එක, features, design level, සහ system depth එක මතයි. Accurate direction එකකට Estimator එක තමයි best next step.";
    }
    if (language === "ta") {
      return "Price என்பது build type, features, design level, மற்றும் system depth மீது பொருந்தும். Accurate direction க்கு Estimator தான் best next step.";
    }
    return "Pricing depends on the build type, features, design level, and system depth. The Estimator is the best next step for accurate direction.";
  }

  if (profile?.unsureUser || profile?.intentMode === "discovery") {
    if (language === "si") {
      return `ඔයාගේ situation එකට right solution එක recommend කරන්න කලින් ${followUpQuestions[0] || "business type එක"} ගැන තේරුම් ගන්න ඕනේ.`;
    }
    if (language === "ta") {
      return `உங்கள் situation க்கு right solution recommend செய்யும் முன் ${followUpQuestions[0] || "business type"} பற்றி புரிந்துகொள்ள வேண்டும்.`;
    }
    return `Before I recommend the right solution, I need to understand ${followUpQuestions[0] || "your business situation"} first.`;
  }

  if (profile?.intentMode === "recommendation") {
    const top = snapshot?.recommendedWebsiteTypes?.[0];
    if (language === "si") {
      return `ඔයාගේ situation එකට strongest direction එක ${top?.name || "business website"} වගේ solution එකක්.`;
    }
    if (language === "ta") {
      return `உங்கள் situation க்கு strongest direction ${top?.name || "business website"} மாதிரியான solution.`;
    }
    return `For your situation, the strongest direction looks like a ${top?.name || "business website"} solution.`;
  }

  if (language === "si") {
    return "Zyverion website විතරක් නොව business situation එකට fit වෙන digital solution direction එක recommend කරන්නත් focus කරනවා.";
  }
  if (language === "ta") {
    return "Zyverion website மட்டும் அல்ல, business situation க்கு fit ஆகும் digital solution direction ஐ recommend செய்வதிலும் focus செய்கிறது.";
  }
  return "Zyverion focuses not just on websites, but on recommending the right digital solution direction for the business situation.";
}

function buildDiscoveryAnswer(profile, snapshot, language, followUpQuestions) {
  const top = snapshot?.recommendedWebsiteTypes?.[0];
  const questionBlock = followUpQuestions.length
    ? followUpQuestions.map((q) => `- ${q}`).join("\n")
    : "";

  if (language === "si") {
    return `දැනට පේන්නේ straight answer එකකට වඩා discovery approach එකක් useful වෙන්න පුළුවන්. ඔයාට simple website එකක් enough ද, නැත්නම් website + system direction එකක් better ද කියන එක business type එක, goal එක, සහ required functionality එක මත depend වෙනවා.${top ? ` මේ stage එකේ likely direction එක ${top.name} වගේ solution එකක්.` : ""}\n\nProperly guide කරන්න කලින් මට මේ දෙක තේරුම් ගන්න ඕනේ:\n${questionBlock}`;
  }

  if (language === "ta") {
    return `இப்போது straight answer விட discovery approach தான் அதிகம் useful ஆக இருக்கும். Simple website போதுமா அல்லது website + system direction தேவைப்படுமா என்பது business type, goal, மற்றும் required functionality மீது பொருந்தும்.${top ? ` இந்த stage இல் likely direction ${top.name} மாதிரியான solution ஆக இருக்கும்.` : ""}\n\nProperly guide செய்ய முன் இதை புரிந்துகொள்ள வேண்டும்:\n${questionBlock}`;
  }

  return `Right now, a discovery-first approach would be more useful than a rushed answer. Whether you need a simple website or a website plus system solution depends on your business type, your real goal, and the level of functionality you need.${top ? ` At this stage, the likely direction looks closer to a ${top.name}.` : ""}\n\nBefore I guide you properly, I need to understand:\n${questionBlock}`;
}

function buildRecommendationAnswer(profile, snapshot, language) {
  const top = snapshot?.recommendedWebsiteTypes?.[0];
  const second = snapshot?.recommendedWebsiteTypes?.[1];
  const buckets = (snapshot?.recommendedServiceBuckets || []).slice(0, 2);

  if (language === "si") {
    return `ඔයාගේ situation එක බලද්දී strongest direction එක ${top?.name || "business website"} solution එකක්. ඒකට හේතුව මේකේ goal එක, business type එක, සහ required functionality එක align වෙන්නේ trust, conversion, සහ practical usability එක්ක. ${second ? `Advanced stage එකකට grow වෙනකොට ${second.name} direction එකත් relevant වෙන්න පුළුවන්.` : ""} Zyverion side එකෙන් මේක mainly ${buckets.map((b) => b.label).join(" සහ ")} scope එකට fit වෙනවා.`;
  }

  if (language === "ta") {
    return `உங்கள் situation பார்க்கும்போது strongest direction ${top?.name || "business website"} solution ஆகும். காரணம் இது உங்கள் goal, business type, மற்றும் required functionality உடன் நல்ல alignment கொடுக்கிறது. ${second ? `Later stage இல் ${second.name} direction கூட relevant ஆகலாம்.` : ""} Zyverion side இல் இது mainly ${buckets.map((b) => b.label).join(" மற்றும் ")} scope க்கு fit ஆகிறது.`;
  }

  return `Based on your situation, the strongest direction looks like a ${top?.name || "business website"} solution. That fits because your likely goal, business type, and required functionality point more toward clarity, conversion, and practical business use than a generic site build. ${second ? `As the project grows, a ${second.name} direction could also become relevant.` : ""} From Zyverion's side, this mainly fits within ${buckets.map((b) => b.label).join(" and ")}.`;
}

function buildPricingAnswer(profile, snapshot, language) {
  const top = snapshot?.recommendedWebsiteTypes?.[0];

  if (language === "si") {
    return `Pricing එක fixed answer එකක් නෙවෙයි, because මේක depend වෙන්නේ project type එක, page depth, feature set එක, design quality, සහ website-only solution එකක්ද නැත්නම් system logic එකත් තියෙන build එකක්ද කියන එක මතයි. ${top ? `ඔයාගේ current situation එක ${top.name} වගේ direction එකකට fit වෙනවා නම්, simple presentation build එකක price range එක සහ hybrid system build එකක price range එක එකම නොවෙයි.` : ""} Exact direction එකකට Estimator එක තමයි strongest next step, because ඒකෙන් build scope එකට close estimate එකක් ගන්න පුළුවන්.`;
  }

  if (language === "ta") {
    return `Pricing என்பது fixed answer அல்ல, ஏனெனில் அது project type, page depth, feature set, design quality, மற்றும் website-only solution ஆ அல்லது system logic உடன் build ஆ என்பதின் மீது பொருந்தும். ${top ? `உங்கள் current situation ${top.name} மாதிரி direction க்கு fit ஆகிறதானால், simple presentation build மற்றும் hybrid system build இன் price range ஒரே மாதிரி இருக்காது.` : ""} Exact direction க்கு Estimator தான் strongest next step, ஏனெனில் அது build scope க்கு அருகிலான estimate தரும்.`;
  }

  return `Pricing is not a fixed one-line answer, because it depends on the project type, page depth, feature set, design level, and whether the build is website-only or includes system logic as well. ${top ? `If your current situation fits something like a ${top.name}, the price direction will be very different from a simple presentation site versus a hybrid business system.` : ""} For a more accurate direction, the Estimator is the strongest next step because it gets much closer to the real scope.`;
}

function buildGeneralConsultativeAnswer(profile, snapshot, language, sessionContext) {
  const top = snapshot?.recommendedWebsiteTypes?.[0];
  const businessType = snapshot?.businessType?.name || businessTypeLabel(profile?.businessTypeId);
  const trustLines = getTrustLines(language, 1);

  if (language === "si") {
    return `Zyverion simple website answer එකක් දෙන්නෙ නැහැ — business situation එකට fit වෙන solution direction එක recommend කරනවා. ${businessType ? `${businessType} type situation එකකට` : "මෙම situation එකට"} usually trust, presentation, conversion, සහ operational practicality කියන factors balance කරන්න වෙනවා. ${top ? `ඒක බලද්දී ${top.name} direction එක strong fit එකක් වගේ පේනවා.` : ""} ${trustLines[0] || ""}`;
  }

  if (language === "ta") {
    return `Zyverion simple website answer மட்டும் தராது — business situation க்கு fit ஆகும் solution direction ஐ recommend செய்கிறது. ${businessType ? `${businessType} type situation க்கு` : "இந்த situation க்கு"} trust, presentation, conversion, மற்றும் operational practicality ஆகியவை balance செய்யப்பட வேண்டும். ${top ? `${top.name} direction இங்கு strong fit போல தெரிகிறது.` : ""} ${trustLines[0] || ""}`;
  }

  return `Zyverion is not designed to answer like a simple website menu. It is meant to recommend the solution direction that actually fits the business situation. ${businessType ? `For a ${businessType} type situation,` : "For this kind of situation,"} trust, presentation, conversion, and operational practicality usually need to be balanced together. ${top ? `That is why a ${top.name} direction looks like a strong fit here.` : ""} ${trustLines[0] || ""}`;
}

function buildObjectionAnswer(language) {
  const line = getObjectionAnswer("why_zyverion", language);
  const support = getObjectionAnswer("only_websites", language);

  if (language === "si") {
    return `${line} ${support}`;
  }

  if (language === "ta") {
    return `${line} ${support}`;
  }

  return `${line} ${support}`;
}

function businessTypeLabel(id) {
  const map = {
    general_service_business: "general service business",
    gym_fitness: "gym or fitness business",
    restaurant_cafe: "restaurant or cafe",
    salon_spa_beauty: "salon, spa, or beauty business",
    medical_clinic: "clinic or medical service",
    education_training: "education or training business",
    ecommerce_retail: "retail or product business",
    creative_portfolio: "creative or portfolio-based business",
    construction_real_estate: "construction or real estate business",
    corporate_professional: "corporate or professional brand",
  };

  return map[id] || "business";
}

function stageLabelForLanguage(stage, language) {
  const labels = {
    en: {
      idea_stage: "very early or planning",
      existing_business: "existing business",
      digital_upgrade: "digital upgrade",
      unknown: "unclear",
    },
    si: {
      idea_stage: "very early හෝ planning",
      existing_business: "existing business",
      digital_upgrade: "digital upgrade",
      unknown: "unclear",
    },
    ta: {
      idea_stage: "very early அல்லது planning",
      existing_business: "existing business",
      digital_upgrade: "digital upgrade",
      unknown: "unclear",
    },
  };

  return labels[language]?.[stage] || labels.en[stage] || "unclear";
}

function goalLabelForLanguage(goalId, language) {
  const labels = {
    trust: {
      en: "trust and credibility",
      si: "trust සහ credibility",
      ta: "trust மற்றும் credibility",
    },
    leads: {
      en: "more inquiries",
      si: "more inquiries",
      ta: "more inquiries",
    },
    sales: {
      en: "sales",
      si: "sales",
      ta: "sales",
    },
    bookings: {
      en: "bookings",
      si: "bookings",
      ta: "bookings",
    },
    operations: {
      en: "better operations",
      si: "better operations",
      ta: "better operations",
    },
    member_management: {
      en: "member or account handling",
      si: "member හෝ account handling",
      ta: "member அல்லது account handling",
    },
    visibility: {
      en: "visibility",
      si: "visibility",
      ta: "visibility",
    },
    clarity: {
      en: "clarity",
      si: "clarity",
      ta: "clarity",
    },
    growth: {
      en: "long-term growth",
      si: "long-term growth",
      ta: "long-term growth",
    },
  };

  return labels[goalId]?.[language] || labels[goalId]?.en || goalId;
}

function cleanupSpokenReply(text, language) {
  let cleaned = String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\bcontinue\b/gi, "")
    .trim();

  if (language === "si") {
    cleaned = cleaned
      .replace(/\bservices\b/gi, "සේවා")
      .replace(/\bwebsite solutions\b/gi, "වෙබ් අඩවි විසඳුම්")
      .replace(/\bpricing guidance\b/gi, "මිල මාර්ගදර්ශනය")
      .replace(/\bproject guidance\b/gi, "ප්‍රොජෙක්ට් මාර්ගදර්ශනය")
      .replace(/\bContact page\b/gi, "සම්බන්ධතා පිටුව")
      .replace(/\bEstimator page\b/gi, "එස්ටිමේටර් පිටුව")
      .replace(/\bWork page\b/gi, "වැඩ පිටුව")
      .replace(/\bpage\b/gi, "පිටුව")
      .replace(/\bdirection\b/gi, "මාර්ගදර්ශනය")
      .replace(/\bproject\b/gi, "ප්‍රොජෙක්ට්")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (language === "ta") {
    cleaned = cleaned
      .replace(/\bservices\b/gi, "சேவைகள்")
      .replace(/\bwebsite solutions\b/gi, "இணையதள தீர்வுகள்")
      .replace(/\bpricing guidance\b/gi, "விலை வழிகாட்டல்")
      .replace(/\bproject guidance\b/gi, "திட்ட வழிகாட்டல்")
      .replace(/\bContact page\b/gi, "தொடர்பு பக்கம்")
      .replace(/\bEstimator page\b/gi, "எஸ்டிமேட்டர் பக்கம்")
      .replace(/\bWork page\b/gi, "வேலை பக்கம்")
      .replace(/\bpage\b/gi, "பக்கம்")
      .replace(/\bdirection\b/gi, "வழிகாட்டல்")
      .replace(/\bproject\b/gi, "திட்டம்")
      .replace(/\s+/g, " ")
      .trim();
  }

  return cleaned;
}

function detectIntent(text) {
  const value = String(text || "").toLowerCase();

  const hasAny = (words) => words.some((word) => value.includes(word));

  if (
    hasAny([
      "weather",
      "movie",
      "movies",
      "song",
      "songs",
      "football",
      "cricket",
      "politics",
      "president",
      "game",
      "games",
      "homework",
      "doctor",
      "medical",
      "law",
      "news",
      "වර්ෂාව",
      "ගේම්",
      "දේශපාලන",
      "காலநிலை",
      "சினிமா",
      "அரசியல்",
      "விளையாட்டு",
    ])
  ) {
    return "offtopic";
  }

  if (
    hasAny([
      "why zyverion",
      "why should i choose",
      "can i trust",
      "are you only websites",
      "do you only build websites",
      "why your agency",
      "why your business",
      "trust your company",
      "why choose you",
      "ඇයි zyverion",
      "trust කරන්න පුලුවන්ද",
      "உங்களை ஏன் தேர்வு செய்ய வேண்டும்",
      "நம்பலாமா",
    ])
  ) {
    return "objection";
  }

  if (
    hasAny([
      "price",
      "pricing",
      "cost",
      "quote",
      "quotation",
      "estimate",
      "estimator",
      "budget",
      "මිල",
      "ගාන",
      "ගාණ",
      "වැය",
      "விலை",
      "காசு",
      "கட்டணம்",
    ])
  ) {
    return "pricing";
  }

  return "general";
}
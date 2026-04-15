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
      return json({ error: "Missing OPENAI_API_KEY on the server." }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const language = normalizeLanguage(body?.language);
    const sessionContext = sanitizeSessionContext(body?.sessionContext);

    if (!message) {
      return json({ error: "Message is required." }, 400);
    }

    if (message.length > 2000) {
      return json({ error: "Message is too long." }, 400);
    }

    const analysisSeed = buildAnalysisSeed(message, sessionContext);
    const blueprint = createSituationBlueprint(analysisSeed, { language });
    const intent = detectIntent(message);

    const deterministic = buildDeterministicReply({
      message,
      language,
      intent,
      blueprint,
      sessionContext,
    });

    if (deterministic) {
      return json(deterministic, 200);
    }

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
                textReply: { type: "string" },
                spokenReply: { type: "string" },
                answerMode: {
                  type: "string",
                  enum: ["direct", "discovery", "recommendation", "pricing", "objection", "support"],
                },
                followUpQuestions: {
                  type: "array",
                  items: { type: "string" },
                },
                situationSummary: { type: "string" },
                recommendedSolutions: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      category: { type: "string" },
                      purpose: { type: "string" },
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
                    label: { type: "string" },
                    href: { type: "string" },
                  },
                  required: ["type", "label", "href"],
                },
                situation: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    businessTypeId: { type: "string" },
                    stage: { type: "string" },
                    goals: { type: "array", items: { type: "string" } },
                    capabilities: { type: "array", items: { type: "string" } },
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
      return json({
        ...fallback,
        debug: {
          source: "openai_http_error",
          status: response.status,
          detail: detail.slice(0, 500),
        },
      }, 200);
    }

    const data = await response.json();
    const outputText = typeof data?.output_text === "string" ? data.output_text.trim() : "";

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
        forceSupport: "Zyverion AI is temporarily unavailable. Please try again in a moment.",
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
    businessSummary: typeof value.businessSummary === "string" ? value.businessSummary.trim() : "",
    userGoal: typeof value.userGoal === "string" ? value.userGoal.trim() : "",
    knownBusinessTypeId: typeof value.knownBusinessTypeId === "string" ? value.knownBusinessTypeId.trim() : "",
    knownStage: typeof value.knownStage === "string" ? value.knownStage.trim() : "",
    notes: typeof value.notes === "string" ? value.notes.trim() : "",
  };
}

function buildAnalysisSeed(message, sessionContext) {
  return [
    sessionContext.businessSummary || "",
    sessionContext.userGoal || "",
    sessionContext.knownBusinessTypeId || "",
    sessionContext.knownStage || "",
    sessionContext.notes || "",
    message || "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildSystemPrompt(language, blueprint, sessionContext) {
  const corePrompt = buildSystemKnowledgePrompt(language);
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

Possible solution direction:
${(snapshot.recommendedWebsiteTypes || [])
  .slice(0, 3)
  .map((item) => `- ${item.name} (${item.category}): ${item.purpose}`)
  .join("\n")}

Critical response rules:
- Never say "Zyverion is not designed to answer like a simple website menu."
- Never give generic brand-pitch filler when the user is asking about their own business.
- If the user gives a business type such as gym, salon, restaurant, clinic, store, course, or company, ask the next specific question needed for that business.
- Discovery answers should usually be 2 to 4 sentences only.
- For discovery answers, keep situationSummary empty unless it adds real value.
- For discovery answers, keep recommendedSolutions empty unless enough detail exists for a real recommendation.
- Only recommend solutions when enough detail exists, or the user explicitly asks what they should build.
- Keep follow-up questions practical, short, and specific.
- Keep textReply clear and human.
- Keep spokenReply slightly shorter and easier to say aloud.
- Do not push Contact, Work, or Estimator too early.
- Keep everything inside Zyverion's actual service scope.
- If the question is unrelated to Zyverion, refuse politely and redirect back to Zyverion-only help.

Session context:
${JSON.stringify(sessionContext)}
`.trim();
}

function buildUserPrompt(message, language, blueprint, sessionContext) {
  const profile = blueprint.profile;
  const snapshot = blueprint.snapshot;

  return `
Selected language: ${language}

User message:
${message}

Current situation snapshot:
${JSON.stringify(
  {
    businessTypeId: profile.businessTypeId,
    goals: profile.goals,
    capabilities: profile.capabilities,
    stage: profile.stage,
    discoveryQuestions: snapshot.discoveryQuestions,
    suggestedAction: snapshot.suggestedAction,
    sessionContext,
  },
  null,
  2
)}

Important instruction:
Reply like a smart business consultant. If more detail is needed, ask the next specific question. Do not output generic brand-positioning filler.
`.trim();
}

function sanitizeReply({ parsed, language, fallback, blueprint }) {
  const answerMode = normalizeAnswerMode(parsed?.answerMode, fallback.answerMode);

  let textReply = typeof parsed?.textReply === "string" && parsed.textReply.trim()
    ? parsed.textReply.trim()
    : fallback.textReply;

  textReply = postprocessTextReply(textReply, language, answerMode, blueprint);

  const spokenReplyRaw = typeof parsed?.spokenReply === "string" && parsed.spokenReply.trim()
    ? parsed.spokenReply.trim()
    : textReply;

  const followUpQuestions = Array.isArray(parsed?.followUpQuestions)
    ? parsed.followUpQuestions
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => item.trim())
        .slice(0, 3)
    : fallback.followUpQuestions;

  let situationSummary = typeof parsed?.situationSummary === "string" && parsed.situationSummary.trim()
    ? parsed.situationSummary.trim()
    : fallback.situationSummary;

  let recommendedSolutions = sanitizeRecommendedSolutions(
    parsed?.recommendedSolutions,
    fallback.recommendedSolutions
  );

  const suggestedAction = sanitizeSuggestedAction(
    parsed?.suggestedAction,
    fallback.suggestedAction
  );

  const situation = sanitizeSituation(parsed?.situation, fallback.situation, blueprint);

  if (answerMode === "discovery") {
    situationSummary = "";
    recommendedSolutions = [];
  }

  return {
    textReply,
    spokenReply: cleanupSpokenReply(spokenReplyRaw || textReply, language),
    answerMode,
    followUpQuestions,
    situationSummary,
    recommendedSolutions,
    suggestedAction,
    situation,
  };
}

function normalizeAnswerMode(value, fallback = "support") {
  const allowed = new Set(["direct", "discovery", "recommendation", "pricing", "objection", "support"]);
  return allowed.has(value) ? value : fallback;
}

function sanitizeRecommendedSolutions(value, fallback) {
  if (!Array.isArray(value) || !value.length) {
    return Array.isArray(fallback) ? fallback : [];
  }

  const cleaned = value
    .map((item) => ({
      id: typeof item?.id === "string" ? item.id.trim() : "",
      name: typeof item?.name === "string" ? item.name.trim() : "",
      category: typeof item?.category === "string" ? item.category.trim() : "",
      purpose: typeof item?.purpose === "string" ? item.purpose.trim() : "",
    }))
    .filter((item) => item.id && item.name && item.category && item.purpose)
    .slice(0, 3);

  return cleaned.length ? cleaned : Array.isArray(fallback) ? fallback : [];
}

function sanitizeSuggestedAction(value, fallback) {
  const type = typeof value?.type === "string" ? value.type.trim() : fallback?.type || "none";
  const safeType = ["estimator", "contact", "work", "none"].includes(type) ? type : fallback?.type || "none";

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

  return { type: safeType, label, href };
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
      ? value.goals.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()).slice(0, 6)
      : safeFallback.goals,
    capabilities: Array.isArray(value.capabilities)
      ? value.capabilities.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()).slice(0, 6)
      : safeFallback.capabilities,
  };
}

function buildFallbackReply({ message, language, intent, blueprint, sessionContext, forceSupport = "" }) {
  const profile = blueprint.profile;
  const snapshot = blueprint.snapshot;
  const answerMode = decideFallbackAnswerMode(intent, profile);
  const discoveryQuestions = (snapshot.discoveryQuestions || []).slice(0, 3);

  const textReply = forceSupport || buildSupportAnswer({
    message,
    intent,
    language,
    profile,
    snapshot,
    sessionContext,
    followUpQuestions: discoveryQuestions,
  });

  const recommendedSolutions = answerMode === "recommendation" || answerMode === "pricing"
    ? (snapshot.recommendedWebsiteTypes || []).slice(0, 2).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        purpose: item.purpose,
      }))
    : [];

  return {
    textReply,
    spokenReply: cleanupSpokenReply(textReply, language),
    answerMode,
    followUpQuestions: answerMode === "discovery" ? discoveryQuestions : [],
    situationSummary: answerMode === "recommendation" ? buildSituationSummary(profile, language, sessionContext) : "",
    recommendedSolutions,
    suggestedAction: sanitizeSuggestedAction(
      answerMode === "pricing"
        ? { type: "estimator", label: "Open Estimator", href: "estimator.html" }
        : { type: "none", label: "", href: "" },
      { type: "none", label: "", href: "" }
    ),
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
  if (profile?.unsureUser || profile?.intentMode === "discovery") return "discovery";
  if (profile?.intentMode === "recommendation") return "recommendation";
  return "support";
}

function buildDeterministicReply({ message, language, intent, blueprint, sessionContext }) {
  const profile = blueprint.profile;
  const businessTypeId = getActiveBusinessTypeId(profile, sessionContext);

  if (intent === "offtopic") {
    return buildOfftopicReply(language, profile);
  }

  if (intent === "pricing") {
    return buildDeterministicPricingReply(language, profile, blueprint.snapshot);
  }

  if (intent === "objection") {
    return buildDeterministicObjectionReply(language, profile);
  }

  if (!businessTypeId || businessTypeId === "general_service_business") {
    if (looksLikeBusinessIntro(message)) {
      return buildBusinessTypeFirstReply(language, profile);
    }
    return null;
  }

  if (!shouldUseGuidedFlow(message, profile, sessionContext)) {
    return null;
  }

  if (businessTypeId === "gym_fitness") {
    return buildGymReply({ message, language, profile, snapshot: blueprint.snapshot, sessionContext });
  }

  return buildGenericBusinessReply({
    message,
    language,
    businessTypeId,
    profile,
    snapshot: blueprint.snapshot,
    sessionContext,
  });
}

function buildOfftopicReply(language, profile) {
  const textReply = language === "si"
    ? "මම Zyverion related business guidance සඳහා build කරලා තියෙන්නේ. ඔයාගේ business type එක හෝ project goal එක කියන්න, මම next step එක guide කරන්නම්."
    : language === "ta"
    ? "நான் Zyverion தொடர்பான business guidance க்காக உருவாக்கப்பட்டுள்ளேன். உங்கள் business type அல்லது project goal ஐ சொல்லுங்கள், அடுத்த step ஐ guide செய்கிறேன்."
    : "I’m built for Zyverion-related business guidance. Tell me your business type or project goal, and I’ll guide the next step.";

  return {
    textReply,
    spokenReply: cleanupSpokenReply(textReply, language),
    answerMode: "support",
    followUpQuestions: [],
    situationSummary: "",
    recommendedSolutions: [],
    suggestedAction: { type: "none", label: "", href: "" },
    situation: {
      businessTypeId: profile.businessTypeId || "general_service_business",
      stage: profile.stage || "unknown",
      goals: profile.goals || [],
      capabilities: profile.capabilities || [],
    },
  };
}

function buildDeterministicPricingReply(language, profile, snapshot) {
  const top = snapshot?.recommendedWebsiteTypes?.[0];
  const textReply = language === "si"
    ? `Pricing එක depend වෙන්නේ project type එක, features, design level එක, සහ website-only build එකක්ද නැත්නම් system features එකත් ඇතුළත්ද කියන එක මතයි.${top ? ` දැනට ඔයාගේ situation එක ${top.name} වගේ direction එකකට fit වෙනවා.` : ""} Accurate direction එකකට Estimator එක තමයි best next step.`
    : language === "ta"
    ? `Pricing என்பது project type, features, design level, மற்றும் website-only build ஆ அல்லது system features உடனா என்பதின் மீது பொருந்தும்.${top ? ` இப்போது உங்கள் situation ${top.name} direction க்கு fit ஆகிறது.` : ""} Accurate direction க்கு Estimator தான் best next step.`
    : `Pricing depends on the project type, the features, the design level, and whether this is a website-only build or a website plus system build.${top ? ` Right now your situation looks closer to a ${top.name} direction.` : ""} For accurate direction, the Estimator is the best next step.`;

  return {
    textReply,
    spokenReply: cleanupSpokenReply(textReply, language),
    answerMode: "pricing",
    followUpQuestions: [],
    situationSummary: "",
    recommendedSolutions: top ? [{ id: top.id, name: top.name, category: top.category, purpose: top.purpose }] : [],
    suggestedAction: { type: "estimator", label: "Open Estimator", href: "estimator.html" },
    situation: {
      businessTypeId: profile.businessTypeId || "general_service_business",
      stage: profile.stage || "unknown",
      goals: profile.goals || [],
      capabilities: profile.capabilities || [],
    },
  };
}

function buildDeterministicObjectionReply(language, profile) {
  const line = getObjectionAnswer("why_zyverion", language);
  const support = getObjectionAnswer("only_websites", language);
  const textReply = `${line} ${support}`.trim();

  return {
    textReply,
    spokenReply: cleanupSpokenReply(textReply, language),
    answerMode: "objection",
    followUpQuestions: [],
    situationSummary: "",
    recommendedSolutions: [],
    suggestedAction: { type: "none", label: "", href: "" },
    situation: {
      businessTypeId: profile.businessTypeId || "general_service_business",
      stage: profile.stage || "unknown",
      goals: profile.goals || [],
      capabilities: profile.capabilities || [],
    },
  };
}

function buildBusinessTypeFirstReply(language, profile) {
  const textReply = language === "si"
    ? "මට first thing එක තේරුම් ගන්න ඕනේ — මේක කුමන business type එකකටද? example විදිහට gym, salon, restaurant, clinic, course business, shop, හෝ company website කියලා කියන්න."
    : language === "ta"
    ? "முதலில் ஒரு விஷயம் புரிந்துகொள்ள வேண்டும் — இது எந்த business type க்காக? உதாரணமாக gym, salon, restaurant, clinic, course business, shop, அல்லது company website என்று சொல்லுங்கள்."
    : "First, I need to understand one thing — what type of business is this for? For example: gym, salon, restaurant, clinic, course business, shop, or a company website.";

  return {
    textReply,
    spokenReply: cleanupSpokenReply(textReply, language),
    answerMode: "discovery",
    followUpQuestions: language === "si"
      ? ["Gym", "Salon", "Restaurant", "Company website"]
      : language === "ta"
      ? ["Gym", "Salon", "Restaurant", "Company website"]
      : ["Gym", "Salon", "Restaurant", "Company website"],
    situationSummary: "",
    recommendedSolutions: [],
    suggestedAction: { type: "none", label: "", href: "" },
    situation: {
      businessTypeId: profile.businessTypeId || "general_service_business",
      stage: profile.stage || "unknown",
      goals: profile.goals || [],
      capabilities: profile.capabilities || [],
    },
  };
}

function shouldUseGuidedFlow(message, profile, sessionContext) {
  const value = normalizeText(message);
  if (!value) return false;
  if (profile?.unsureUser || profile?.intentMode === "discovery") return true;
  if (looksLikeBusinessIntro(message)) return true;
  if (looksLikeSelectionReply(message)) return true;
  if (!profile?.goals?.length) return true;
  if (sessionContext?.knownBusinessTypeId && value.length <= 80) return true;
  return false;
}

function buildGymReply({ message, language, profile, snapshot }) {
  const route = parseGymRoute(message, profile);

  if (!route.goal) {
    const textReply = language === "si"
      ? "හරි — මේක gym business එකක්. First question එක මෙන්න: දැන් ඔයාට වැඩියෙන් ඕනේ new members ගන්න එකද, current members manage කරන එකද, නැත්නම් දෙකමද?"
      : language === "ta"
      ? "சரி — இது gym business. முதல் question இது: இப்போது உங்களுக்கு அதிகம் வேண்டியது new members வாங்குவதா, current members manage செய்வதா, அல்லது இரண்டுமா?"
      : "Got it — this is for a gym. First question: right now, do you mainly want more new members, better current member management, or both?";

    return buildGuidedReply({
      language,
      profile,
      textReply,
      followUpQuestions:
        language === "si"
          ? ["More new members", "Manage current members", "Both", "Just need a website first"]
          : language === "ta"
          ? ["More new members", "Manage current members", "Both", "Just need a website first"]
          : ["More new members", "Manage current members", "Both", "Just need a website first"],
      goals: profile.goals,
      capabilities: profile.capabilities,
    });
  }

  if (!route.depth) {
    const textReply = route.goal === "new_members"
      ? language === "si"
        ? "හරි — එහෙනම් new members පැත්ත main focus එක. Next thing එක: ඔයාට trust-building website එකක් විතරක් first stage එකට enough ද, නැත්නම් later member හෝ admin features එකත් ඇතුළත් direction එකක්ද ඕනේ?"
        : language === "ta"
        ? "சரி — அப்படியானால் new members தான் main focus. அடுத்தது: first stage க்கு trust-building website மட்டும் போதுமா, அல்லது later member அல்லது admin features உடன் direction வேண்டுமா?"
        : "Understood — so new members are the main focus. Next question: is a trust-building website enough for the first stage, or do you also want a direction that leaves room for member or admin features later?"
      : language === "si"
      ? "හරි — එහෙනම් member handling පැත්ත important. Next thing එක: ඔයාට member login, QR check-in, admin dashboard, නැත්නම් full member system එකක්ද ඕනේ?"
      : language === "ta"
      ? "சரி — அப்படியானால் member handling முக்கியம். அடுத்தது: member login, QR check-in, admin dashboard, அல்லது full member system வேண்டுமா?"
      : "Got it — so member handling matters. Next question: do you need member login, QR check-in, an admin dashboard, or a full member system?";

    const followUpQuestions = route.goal === "new_members"
      ? ["Only website first", "Website + member features later", "Website + admin system later", "Not sure yet"]
      : ["Member login", "QR check-in", "Admin dashboard", "Full member system"];

    return buildGuidedReply({
      language,
      profile,
      textReply,
      followUpQuestions,
      goals: buildGoalsForGym(route.goal),
      capabilities: profile.capabilities,
    });
  }

  const topSolutions = pickGymSolutions(route, snapshot);
  const textReply = buildGymRecommendationText(route, language, topSolutions[0]);

  return buildRecommendationShape({
    language,
    profile,
    textReply,
    recommendedSolutions: topSolutions,
    suggestedAction: { type: "contact", label: "Contact Zyverion", href: "contact.html" },
    goals: buildGoalsForGym(route.goal),
    capabilities: buildCapabilitiesForGym(route),
  });
}

function buildGenericBusinessReply({ message, language, businessTypeId, profile, snapshot }) {
  const route = parseGenericRoute(message, businessTypeId, profile);

  if (!route.goal) {
    const promptMap = {
      salon_spa_beauty:
        language === "si"
          ? "හරි — මේක beauty business එකක්. දැන් main focus එක bookings ද, stronger brand presentation ද, නැත්නම් දෙකමද?"
          : language === "ta"
          ? "சரி — இது beauty business. இப்போது main focus bookings ஆ, stronger brand presentation ஆ, அல்லது இரண்டுமா?"
          : "Got it — this is a beauty business. Right now, is the main focus more bookings, stronger brand presentation, or both?",
      restaurant_cafe:
        language === "si"
          ? "හරි — මේක restaurant හෝ cafe business එකක්. දැන් ඔයාට menu showcase එකද, reservations ද, online orders ද, නැත්නම් mixed direction එකක්ද වැදගත්?"
          : language === "ta"
          ? "சரி — இது restaurant அல்லது cafe business. இப்போது menu showcase, reservations, online orders, அல்லது mixed direction இல் எது முக்கியம்?"
          : "Got it — this is a restaurant or cafe business. Right now, what matters more: menu showcase, reservations, online orders, or a mixed direction?",
      ecommerce_retail:
        language === "si"
          ? "හරි — මේක product business එකක්. First question එක: ඔයාට full online selling එකද ඕනේ, නැත්නම් products showcase කරලා inquiries හෝ WhatsApp orders එකෙන් start කරන්නද?"
          : language === "ta"
          ? "சரி — இது product business. முதல் question: உங்களுக்கு full online selling வேண்டுமா, அல்லது products showcase செய்து inquiries அல்லது WhatsApp orders மூலம் ஆரம்பிக்க வேண்டுமா?"
          : "Got it — this is a product business. First question: do you want full online selling, or do you want to start with product showcase and inquiry or WhatsApp orders?",
      medical_clinic:
        language === "si"
          ? "හරි — මේක clinic හෝ medical service එකක්. Patientsලාට දැන් වැඩියෙන් ඕනේ information ද, appointment bookings ද, නැත්නම් දෙකමද?"
          : language === "ta"
          ? "சரி — இது clinic அல்லது medical service. Patients க்கு இப்போது அதிகம் வேண்டியது information ஆ, appointment bookings ஆ, அல்லது இரண்டுமா?"
          : "Got it — this is a clinic or medical service. Right now, do patients mainly need information, appointment bookings, or both?",
      education_training:
        language === "si"
          ? "හරි — මේක education හෝ training business එකක්. Main focus එක student inquiries ද, student portal ද, නැත්නම් දෙකමද?"
          : language === "ta"
          ? "சரி — இது education அல்லது training business. Main focus student inquiries ஆ, student portal ஆ, அல்லது இரண்டுமா?"
          : "Got it — this is an education or training business. Is the main focus student inquiries, a student portal, or both?",
    };

    const textReply = promptMap[businessTypeId] || (
      language === "si"
        ? "හරි — business type එක තේරුණා. දැන් main goal එක මොකද්ද: trust build කරන එකද, more inquiries ගන්න එකද, bookings ද, sales ද, නැත්නම් system features ද?"
        : language === "ta"
        ? "சரி — business type புரிந்தது. இப்போது main goal என்ன: trust build செய்வதா, more inquiries வாங்குவதா, bookings ஆ, sales ஆ, அல்லது system features ஆ?"
        : "Got it — I understand the business type. Now tell me the main goal: trust, more inquiries, bookings, sales, or system features?"
    );

    return buildGuidedReply({
      language,
      profile,
      textReply,
      followUpQuestions: route.defaultFollowUps,
      goals: profile.goals,
      capabilities: profile.capabilities,
    });
  }

  if (!route.depth) {
    const textReply = language === "si"
      ? "හරි — main goal එක clear. Next thing එක: ඔයාට simple website එකක් enough ද, නැත්නම් admin, booking, portal, හෝ selling features වගේ deeper functionality එකක්ද ඕනේ?"
      : language === "ta"
      ? "சரி — main goal clear. அடுத்தது: simple website போதுமா, அல்லது admin, booking, portal, அல்லது selling features போன்ற deeper functionality வேண்டுமா?"
      : "Understood — the main goal is clear. Next question: is a simple website enough, or do you need deeper functionality such as admin, booking, portal, or selling features?";

    return buildGuidedReply({
      language,
      profile,
      textReply,
      followUpQuestions: ["Only website", "Booking features", "Admin features", "Not sure yet"],
      goals: route.goals,
      capabilities: profile.capabilities,
    });
  }

  const topSolutions = pickGenericSolutions(route, snapshot);
  const textReply = buildGenericRecommendationText(route, businessTypeId, language, topSolutions[0]);

  return buildRecommendationShape({
    language,
    profile,
    textReply,
    recommendedSolutions: topSolutions,
    suggestedAction: { type: "contact", label: "Contact Zyverion", href: "contact.html" },
    goals: route.goals,
    capabilities: route.capabilities,
  });
}

function buildGuidedReply({ language, profile, textReply, followUpQuestions, goals, capabilities }) {
  return {
    textReply,
    spokenReply: cleanupSpokenReply(textReply, language),
    answerMode: "discovery",
    followUpQuestions: followUpQuestions.slice(0, 4),
    situationSummary: "",
    recommendedSolutions: [],
    suggestedAction: { type: "none", label: "", href: "" },
    situation: {
      businessTypeId: profile.businessTypeId || "general_service_business",
      stage: profile.stage || "unknown",
      goals: goals || profile.goals || [],
      capabilities: capabilities || profile.capabilities || [],
    },
  };
}

function buildRecommendationShape({ language, profile, textReply, recommendedSolutions, suggestedAction, goals, capabilities }) {
  return {
    textReply,
    spokenReply: cleanupSpokenReply(textReply, language),
    answerMode: "recommendation",
    followUpQuestions: [],
    situationSummary: "",
    recommendedSolutions: recommendedSolutions.slice(0, 2).map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      purpose: item.purpose,
    })),
    suggestedAction: sanitizeSuggestedAction(suggestedAction, { type: "none", label: "", href: "" }),
    situation: {
      businessTypeId: profile.businessTypeId || "general_service_business",
      stage: profile.stage || "unknown",
      goals: goals || profile.goals || [],
      capabilities: capabilities || profile.capabilities || [],
    },
  };
}

function getActiveBusinessTypeId(profile, sessionContext) {
  return sessionContext?.knownBusinessTypeId || profile?.businessTypeId || "general_service_business";
}

function looksLikeBusinessIntro(message) {
  const value = normalizeText(message);
  return [
    "my business is",
    "i have a",
    "i run a",
    "this is for my",
    "for my gym",
    "for my salon",
    "for my restaurant",
    "for my clinic",
    "for my company",
    "gym",
    "salon",
    "restaurant",
    "clinic",
    "store",
    "shop",
  ].some((item) => value.includes(item));
}

function looksLikeSelectionReply(message) {
  const value = normalizeText(message);
  return [
    "both",
    "only website",
    "just website",
    "member login",
    "qr",
    "admin dashboard",
    "full member system",
    "more new members",
    "manage current members",
    "bookings",
    "sales",
    "online orders",
    "portal",
    "not sure yet",
  ].some((item) => value.includes(item));
}

function parseGymRoute(message, profile) {
  const value = normalizeText(message);
  const goals = new Set(profile?.goals || []);
  const capabilities = new Set(profile?.capabilities || []);

  let goal = "";
  if (value.includes("both")) goal = "both";
  else if (value.includes("manage") || value.includes("current members") || value.includes("member management") || value.includes("qr") || value.includes("portal") || value.includes("admin")) goal = "manage_members";
  else if (value.includes("new members") || value.includes("more members") || value.includes("inquiries") || value.includes("leads") || value.includes("more customers")) goal = "new_members";
  else if (goals.has("member_management") && goals.has("leads")) goal = "both";
  else if (goals.has("member_management") || goals.has("operations")) goal = "manage_members";
  else if (goals.has("leads") || goals.has("trust") || goals.has("visibility")) goal = "new_members";

  let depth = "";
  if (value.includes("only website") || value.includes("just website") || value.includes("simple website")) depth = "website_only";
  else if (value.includes("website +") || value.includes("website and") || value.includes("system") || value.includes("portal") || value.includes("member login") || value.includes("admin dashboard") || value.includes("qr") || value.includes("full member system")) depth = "system_features";
  else if (capabilities.has("website_plus_system") || capabilities.has("user_accounts") || capabilities.has("admin_tools")) depth = "system_features";
  else if (capabilities.has("just_website")) depth = "website_only";

  const features = [];
  if (value.includes("member login") || value.includes("portal") || capabilities.has("user_accounts")) features.push("member_login");
  if (value.includes("qr") || value.includes("check in") || value.includes("check-in")) features.push("qr_checkin");
  if (value.includes("admin") || value.includes("dashboard") || capabilities.has("admin_tools")) features.push("admin_dashboard");
  if (value.includes("full member system") || value.includes("all")) features.push("full_system");

  return { goal, depth, features };
}

function buildGoalsForGym(goal) {
  if (goal === "new_members") return ["leads", "trust"];
  if (goal === "manage_members") return ["member_management", "operations"];
  if (goal === "both") return ["leads", "member_management", "operations"];
  return [];
}

function buildCapabilitiesForGym(route) {
  if (route.depth === "website_only") return ["just_website"];
  const values = [];
  if (route.depth === "system_features") values.push("website_plus_system");
  if (route.features.includes("member_login") || route.features.includes("full_system")) values.push("user_accounts");
  if (route.features.includes("admin_dashboard") || route.features.includes("full_system")) values.push("admin_tools");
  return values.length ? values : ["website_plus_system"];
}

function pickGymSolutions(route, snapshot) {
  const byId = new Map((snapshot?.recommendedWebsiteTypes || []).map((item) => [item.id, item]));
  const out = [];

  const push = (id) => {
    if (byId.has(id)) out.push(byId.get(id));
  };

  if (route.goal === "new_members" && route.depth === "website_only") {
    push("business_profile");
    push("lead_generation");
  } else if (route.goal === "new_members") {
    push("hybrid_website_system");
    push("business_profile");
  } else if (route.goal === "manage_members" || route.goal === "both") {
    push("hybrid_website_system");
    push("membership_portal");
    push("admin_dashboard");
  } else {
    push("business_profile");
  }

  return out.filter(Boolean).slice(0, 2);
}

function buildGymRecommendationText(route, language, topSolution) {
  const topName = topSolution?.name || "Hybrid Website and System Solution";

  if (language === "si") {
    if (route.goal === "new_members" && route.depth === "website_only") {
      return `Gym එකක් සඳහා new members main focus නම්, first stage එකට ${topName} direction එක strong fit එකක්. ඒක trust build කරන්න, services explain කරන්න, සහ inquiries හෝ signups වැඩි කරන්න help කරනවා.`;
    }
    return `Gym එකක් සඳහා ${route.goal === "both" ? "new members සහ member handling දෙකම" : "member handling"} important නම්, strongest direction එක ${topName} වගේ website + system setup එකක්. Public website එක trust සහ inquiries handle කරනවා, system side එක member access, admin flow, හෝ QR style management handle කරනවා.`;
  }

  if (language === "ta") {
    if (route.goal === "new_members" && route.depth === "website_only") {
      return `Gym க்கு new members தான் main focus என்றால், first stage க்கு ${topName} direction strong fit. அது trust build செய்ய, services explain செய்ய, மற்றும் inquiries அல்லது signups அதிகரிக்க உதவும்.`;
    }
    return `Gym க்கு ${route.goal === "both" ? "new members மற்றும் member handling இரண்டும்" : "member handling"} முக்கியமானால், strongest direction ${topName} போன்ற website + system setup. Public website trust மற்றும் inquiries க்கு உதவும், system side member access, admin flow, அல்லது QR style management ஐ handle செய்யும்.`;
  }

  if (route.goal === "new_members" && route.depth === "website_only") {
    return `For a gym where new members are the main focus, a ${topName} direction is a strong first-stage fit. It helps build trust, explain your services clearly, and turn visitors into inquiries or signups.`;
  }

  return `For a gym where ${route.goal === "both" ? "both new members and member handling matter" : "member handling matters"}, the strongest direction is a ${topName} style website plus system setup. The public website handles trust and inquiries, while the system side supports member access, admin flow, or QR-style management.`;
}

function parseGenericRoute(message, businessTypeId, profile) {
  const value = normalizeText(message);
  const goals = new Set(profile?.goals || []);
  const capabilities = new Set(profile?.capabilities || []);

  let goal = "";
  if (value.includes("both")) goal = "both";
  else if (value.includes("booking") || value.includes("appointment") || goals.has("bookings")) goal = "bookings";
  else if (value.includes("sell") || value.includes("orders") || value.includes("checkout") || goals.has("sales")) goal = "sales";
  else if (value.includes("portal") || value.includes("admin") || value.includes("system") || goals.has("member_management") || goals.has("operations")) goal = "system";
  else if (value.includes("trust") || value.includes("more inquiries") || value.includes("leads") || goals.has("leads") || goals.has("trust") || goals.has("visibility")) goal = "trust_leads";

  let depth = "";
  if (value.includes("only website") || value.includes("just website")) depth = "website_only";
  else if (value.includes("system") || value.includes("portal") || value.includes("admin") || value.includes("booking") || value.includes("checkout") || capabilities.has("website_plus_system") || capabilities.has("admin_tools") || capabilities.has("user_accounts") || capabilities.has("booking_flow") || capabilities.has("ecommerce")) depth = "extended";

  return {
    goal,
    depth,
    goals: profile.goals,
    capabilities: profile.capabilities,
    defaultFollowUps: defaultFollowUpsForBusinessType(businessTypeId, languageAgnosticLabelSet(businessTypeId)),
  };
}

function languageAgnosticLabelSet(businessTypeId) {
  const map = {
    salon_spa_beauty: ["More bookings", "Better brand presentation", "Both", "Not sure yet"],
    restaurant_cafe: ["Menu showcase", "Reservations", "Online orders", "Mixed direction"],
    ecommerce_retail: ["Full online selling", "Product showcase first", "WhatsApp orders first", "Not sure yet"],
    medical_clinic: ["Information", "Appointments", "Both", "Not sure yet"],
    education_training: ["More student inquiries", "Student portal", "Both", "Not sure yet"],
  };
  return map[businessTypeId] || ["Trust and inquiries", "Bookings", "System features", "Not sure yet"];
}

function defaultFollowUpsForBusinessType(_businessTypeId, labels) {
  return labels;
}

function pickGenericSolutions(route, snapshot) {
  const byId = new Map((snapshot?.recommendedWebsiteTypes || []).map((item) => [item.id, item]));
  const out = [];
  const push = (id) => {
    if (byId.has(id)) out.push(byId.get(id));
  };

  if (route.goal === "sales") {
    push("ecommerce_store");
    push("catalog_showcase");
  } else if (route.goal === "bookings") {
    push("booking_appointment");
    push("business_profile");
  } else if (route.goal === "system" || route.depth === "extended") {
    push("hybrid_website_system");
    push("admin_dashboard");
  } else {
    push("business_profile");
    push("lead_generation");
  }

  return out.filter(Boolean).slice(0, 2);
}

function buildGenericRecommendationText(route, businessTypeId, language, topSolution) {
  const typeName = businessTypeLabel(businessTypeId);
  const topName = topSolution?.name || "Business Profile Website";

  if (language === "si") {
    return `${typeName} type business එකකට, දැනට strongest direction එක ${topName} solution එකක්. මේකේ main goal එක ${goalSentence(route.goal, language)} පැත්තට යන නිසා, simple presentation, conversion flow, සහ practical business use එක balance වෙන build එකක් තමයි best fit.`;
  }

  if (language === "ta") {
    return `${typeName} type business க்கு, இப்போது strongest direction ${topName} solution. இதன் main goal ${goalSentence(route.goal, language)} என்பதனால், simple presentation, conversion flow, மற்றும் practical business use ஐ balance செய்யும் build தான் best fit.`;
  }

  return `For a ${typeName} type business, the strongest direction right now is a ${topName} solution. Since the main goal is ${goalSentence(route.goal, language)}, the best fit is a build that balances presentation, conversion flow, and practical business use.`;
}

function goalSentence(goal, language) {
  const labels = {
    en: {
      both: "more than one business need at once",
      bookings: "bookings",
      sales: "sales",
      system: "internal handling or account-side features",
      trust_leads: "trust and inquiries",
    },
    si: {
      both: "එකට needs කීපයක් handle කරන එක",
      bookings: "bookings",
      sales: "sales",
      system: "internal handling හෝ account-side features",
      trust_leads: "trust සහ inquiries",
    },
    ta: {
      both: "பல தேவைகளை ஒன்றாக handle செய்வது",
      bookings: "bookings",
      sales: "sales",
      system: "internal handling அல்லது account-side features",
      trust_leads: "trust மற்றும் inquiries",
    },
  };

  return labels[language]?.[goal] || labels.en[goal] || "business growth";
}

function buildSituationSummary(profile, language, sessionContext = {}) {
  const businessName = sessionContext.businessSummary || profile?.businessType?.name || businessTypeLabel(profile?.businessTypeId);
  const stageLabel = stageLabelForLanguage(profile?.stage, language);
  const goalLabels = (profile?.goals || []).slice(0, 2).map((goal) => goalLabelForLanguage(goal, language));

  if (goalLabels.length === 0 && (!profile?.capabilities || profile.capabilities.length === 0)) {
    return "";
  }

  if (language === "si") {
    const goalText = goalLabels.length ? ` ප්‍රධාන focus එක ${goalLabels.join(" සහ ")} වගේ පේනවා.` : "";
    return `දැනට පේන්නේ මේක ${businessName || "business"} situation එකක්, stage එක ${stageLabel} වගේ.${goalText}`.trim();
  }

  if (language === "ta") {
    const goalText = goalLabels.length ? ` முக்கிய focus ${goalLabels.join(" மற்றும் ")} போல தெரிகிறது.` : "";
    return `இப்போது இது ${businessName || "business"} situation போல தெரிகிறது, stage ${stageLabel} போல உள்ளது.${goalText}`.trim();
  }

  const goalText = goalLabels.length ? ` The main focus appears to be ${goalLabels.join(" and ")}.` : "";
  return `This currently looks like a ${businessName || "business"} situation at a ${stageLabel} stage.${goalText}`;
}

function buildSupportAnswer({ message, intent, language, profile, snapshot, followUpQuestions }) {
  if (intent === "objection") return buildObjectionAnswer(language);
  if (intent === "pricing") return buildPricingAnswer(profile, snapshot, language);

  if (profile?.unsureUser || profile?.intentMode === "discovery") {
    return buildDiscoveryAnswer(profile, snapshot, language, followUpQuestions);
  }

  if (profile?.intentMode === "recommendation") {
    return buildRecommendationAnswer(profile, snapshot, language);
  }

  return buildGeneralConsultativeAnswer(message, profile, language);
}

function buildDiscoveryAnswer(profile, _snapshot, language, followUpQuestions) {
  const question = followUpQuestions?.[0] || (
    language === "si"
      ? "මේක කුමන business type එකකටද?"
      : language === "ta"
      ? "இது எந்த business type க்காக?"
      : "What type of business is this for?"
  );

  if (language === "si") {
    return `Properly guide කරන්න කලින් මට එක detail එකක් ඕනේ. ${question}`;
  }

  if (language === "ta") {
    return `Properly guide செய்ய முன் எனக்கு ஒரு detail வேண்டும். ${question}`;
  }

  return `Before I guide you properly, I need one detail first. ${question}`;
}

function buildRecommendationAnswer(profile, snapshot, language) {
  const top = snapshot?.recommendedWebsiteTypes?.[0];
  if (!top) {
    return buildGeneralConsultativeAnswer("", profile, language);
  }

  if (language === "si") {
    return `ඔයාගේ current situation එක බලද්දී strongest direction එක ${top.name} solution එකක්. ඒක trust, usability, සහ business flow එක balance කරන practical direction එකක්.`;
  }

  if (language === "ta") {
    return `உங்கள் current situation பார்த்தால் strongest direction ${top.name} solution. அது trust, usability, மற்றும் business flow ஐ balance செய்யும் practical direction.`;
  }

  return `Based on your current situation, the strongest direction is a ${top.name} solution. It is a practical direction that balances trust, usability, and business flow.`;
}

function buildPricingAnswer(profile, snapshot, language) {
  const top = snapshot?.recommendedWebsiteTypes?.[0];
  if (language === "si") {
    return `Pricing එක depend වෙන්නේ build type එක, features, design level, සහ website-only ද system features එක්කද කියන එක මතයි.${top ? ` දැනට ඔයාගේ situation එක ${top.name} වගේ direction එකකට fit වෙනවා.` : ""} Exact direction එකකට Estimator එක best next step.`;
  }
  if (language === "ta") {
    return `Pricing என்பது build type, features, design level, மற்றும் website-only ஆ system features உடனா என்பதின் மீது பொருந்தும்.${top ? ` இப்போது உங்கள் situation ${top.name} direction க்கு fit ஆகிறது.` : ""} Exact direction க்கு Estimator best next step.`;
  }
  return `Pricing depends on the build type, features, design level, and whether this is website-only or includes system features.${top ? ` Right now your situation looks closer to a ${top.name} direction.` : ""} For exact direction, the Estimator is the best next step.`;
}

function buildGeneralConsultativeAnswer(message, profile, language) {
  const businessType = businessTypeLabel(profile?.businessTypeId);
  const value = normalizeText(message);

  if (businessType !== "general service business") {
    if (language === "si") {
      return `${businessType} type situation එකක් වගේ පේනවා. Next best step එක වෙන්නේ main goal එක narrow කරන එක — more inquiries ද, bookings ද, sales ද, නැත්නම් system features ද?`;
    }
    if (language === "ta") {
      return `${businessType} type situation போல தெரிகிறது. Next best step என்பது main goal ஐ narrow செய்வது — more inquiries ஆ, bookings ஆ, sales ஆ, அல்லது system features ஆ?`;
    }
    return `This looks like a ${businessType} type situation. The next best step is narrowing the main goal — more inquiries, bookings, sales, or system features?`;
  }

  if (!value) {
    return language === "si"
      ? "ඔයාගේ business type එක හෝ project goal එක කියන්න, මම step by step narrow කරන්නම්."
      : language === "ta"
      ? "உங்கள் business type அல்லது project goal ஐ சொல்லுங்கள், நான் step by step narrow செய்கிறேன்."
      : "Tell me your business type or project goal, and I’ll narrow it down step by step.";
  }

  return buildBusinessTypeFirstReply(language, profile).textReply;
}

function buildObjectionAnswer(language) {
  const line = getObjectionAnswer("why_zyverion", language);
  const support = getObjectionAnswer("only_websites", language);
  return `${line} ${support}`.trim();
}

function postprocessTextReply(text, language, answerMode, blueprint) {
  let cleaned = String(text || "").trim();

  cleaned = cleaned
    .replace(/Zyverion is not designed to answer like a simple website menu\.?/gi, "")
    .replace(/Right now, a discovery-first approach would be more useful than a rushed answer\.?/gi, "")
    .replace(/Before I guide you properly, I need to understand:\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return answerMode === "discovery"
      ? buildDiscoveryAnswer(blueprint?.profile || {}, blueprint?.snapshot || {}, language, [])
      : buildGeneralConsultativeAnswer("", blueprint?.profile || {}, language);
  }

  return cleaned;
}

function buildSpokenReply({ intent, language, profile, snapshot, followUpQuestions }) {
  if (intent === "pricing") {
    return cleanupSpokenReply(buildPricingAnswer(profile, snapshot, language), language);
  }

  if (profile?.unsureUser || profile?.intentMode === "discovery") {
    const question = followUpQuestions?.[0] || "your business";
    if (language === "si") {
      return `මට next thing එක narrow කරන්න ${question} ගැන detail එකක් ඕනේ.`;
    }
    if (language === "ta") {
      return `Next thing ஐ narrow செய்ய ${question} பற்றி ஒரு detail வேண்டும்.`;
    }
    return `To narrow the next step, I need one more detail about ${question}.`;
  }

  return cleanupSpokenReply(buildGeneralConsultativeAnswer("", profile, language), language);
}

function businessTypeLabel(id) {
  const map = {
    general_service_business: "general service business",
    gym_fitness: "gym or fitness business",
    restaurant_cafe: "restaurant or cafe",
    salon_spa_beauty: "salon or beauty business",
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
    en: { idea_stage: "very early or planning", existing_business: "existing business", digital_upgrade: "digital upgrade", unknown: "unclear" },
    si: { idea_stage: "very early හෝ planning", existing_business: "existing business", digital_upgrade: "digital upgrade", unknown: "unclear" },
    ta: { idea_stage: "very early அல்லது planning", existing_business: "existing business", digital_upgrade: "digital upgrade", unknown: "unclear" },
  };
  return labels[language]?.[stage] || labels.en[stage] || "unclear";
}

function goalLabelForLanguage(goalId, language) {
  const labels = {
    trust: { en: "trust and credibility", si: "trust සහ credibility", ta: "trust மற்றும் credibility" },
    leads: { en: "more inquiries", si: "more inquiries", ta: "more inquiries" },
    sales: { en: "sales", si: "sales", ta: "sales" },
    bookings: { en: "bookings", si: "bookings", ta: "bookings" },
    operations: { en: "better operations", si: "better operations", ta: "better operations" },
    member_management: { en: "member or account handling", si: "member හෝ account handling", ta: "member அல்லது account handling" },
    visibility: { en: "visibility", si: "visibility", ta: "visibility" },
    clarity: { en: "clarity", si: "clarity", ta: "clarity" },
    growth: { en: "long-term growth", si: "long-term growth", ta: "long-term growth" },
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
      .replace(/\bdirection\b/gi, "මාර්ගය")
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
      .replace(/\bdirection\b/gi, "வழி")
      .replace(/\bproject\b/gi, "திட்டம்")
      .replace(/\s+/g, " ")
      .trim();
  }

  return cleaned;
}

function detectIntent(text) {
  const value = String(text || "").toLowerCase();
  const hasAny = (words) => words.some((word) => value.includes(word));

  if (hasAny(["weather", "movie", "movies", "song", "songs", "football", "cricket", "politics", "president", "game", "games", "homework", "doctor", "medical", "law", "news", "වර්ෂාව", "ගේම්", "දේශපාලන", "காலநிலை", "சினிமா", "அரசியல்", "விளையாட்டு"])) {
    return "offtopic";
  }

  if (hasAny(["why zyverion", "why should i choose", "can i trust", "are you only websites", "do you only build websites", "why your agency", "why your business", "trust your company", "why choose you", "ඇයි zyverion", "trust කරන්න පුලුවන්ද", "உங்களை ஏன் தேர்வு செய்ய வேண்டும்", "நம்பலாமா"])) {
    return "objection";
  }

  if (hasAny(["price", "pricing", "cost", "quote", "quotation", "estimate", "estimator", "budget", "මිල", "ගාන", "ගාණ", "වැය", "விலை", "காசு", "கட்டணம்"])) {
    return "pricing";
  }

  return "general";
}
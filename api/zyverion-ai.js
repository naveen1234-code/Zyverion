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

    if (!message) {
      return json(
        {
          error: "Message is required.",
        },
        400
      );
    }

    if (message.length > 1600) {
      return json(
        {
          error: "Message is too long.",
        },
        400
      );
    }

    const fallback = buildFallbackReply(message, language);
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
            content: buildSystemPrompt(language),
          },
          {
            role: "user",
            content: message,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "zyverion_reply",
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
              },
              required: ["textReply", "spokenReply", "suggestedAction"],
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
            detail: detail.slice(0, 400),
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

    return json(sanitizeReply(parsed, language, fallback), 200);
  } catch {
    return json(
      buildFallbackReply("", "en", {
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

function buildSystemPrompt(language) {
  const langName =
    language === "si" ? "Sinhala" : language === "ta" ? "Tamil" : "English";

  const languageRule =
    language === "si"
      ? "Reply in natural Sinhala. Keep spokenReply fully Sinhala except the brand name Zyverion and essential page names only if necessary. Avoid random English filler words."
      : language === "ta"
      ? "Reply in natural Tamil. Keep spokenReply fully Tamil except the brand name Zyverion and essential page names only if necessary. Avoid random English filler words."
      : "Reply in clear, premium, concise English.";

  return `
You are Zyverion AI, the assistant for the Zyverion website.

Allowed topics only:
- Zyverion services
- website solutions
- software systems
- automation workflows
- digital business solutions
- project guidance
- pricing direction
- estimator guidance
- work / portfolio guidance
- contact / inquiry guidance
- official verification guidance

Forbidden behavior:
- Do not answer general knowledge questions.
- Do not act like general ChatGPT.
- Do not invent prices, deadlines, employees, addresses, or promises.
- Do not give legal, medical, political, gaming, entertainment, sports, or unrelated answers.

Language:
- Selected language is ${langName}.
- ${languageRule}

Style:
- Keep textReply concise, polished, trustworthy, and useful.
- Keep spokenReply slightly shorter and easier to speak aloud.
- When the user asks exact pricing, guide them to the Estimator.
- When the user asks how to start or contact, guide them to Contact.
- When the user asks about examples or past work, guide them to Work.
- If the request is off-topic, politely refuse and redirect to Zyverion-only help.

Action mapping:
- estimator => label "Open Estimator", href "estimator.html"
- contact => label "Contact Zyverion", href "contact.html"
- work => label "View Our Work", href "projects.html"
- none => label "", href ""

Return valid JSON only with this exact shape:
{
  "textReply": "string",
  "spokenReply": "string",
  "suggestedAction": {
    "type": "estimator" | "contact" | "work" | "none",
    "label": "string",
    "href": "string"
  }
}
`.trim();
}

function buildFallbackReply(message, language, override = {}) {
  const intent = detectIntent(message || "");
  const pack = fallbackPack(language);

  let textReply = override.forceSupport || pack.support;
  let spokenReply = override.forceSupport || pack.support;
  let suggestedAction = {
    type: "none",
    label: "",
    href: "",
  };

  if (intent === "offtopic") {
    textReply = pack.refusal;
    spokenReply = pack.refusal;
  } else if (intent === "pricing") {
    textReply = pack.pricing;
    spokenReply = pack.pricing;
    suggestedAction = {
      type: "estimator",
      label: "Open Estimator",
      href: "estimator.html",
    };
  } else if (intent === "contact" || intent === "start" || intent === "verification") {
    textReply = intent === "verification" ? pack.verification : pack.contact;
    spokenReply = textReply;
    suggestedAction = {
      type: "contact",
      label: "Contact Zyverion",
      href: "contact.html",
    };
  } else if (intent === "work") {
    textReply = pack.work;
    spokenReply = pack.work;
    suggestedAction = {
      type: "work",
      label: "View Our Work",
      href: "projects.html",
    };
  } else if (intent === "services") {
    textReply = pack.services;
    spokenReply = pack.services;
  }

  return {
    textReply,
    spokenReply: cleanupSpokenReply(spokenReply, language),
    suggestedAction,
  };
}

function fallbackPack(language) {
  const packs = {
    si: {
      pricing:
        "නිවැරදි මිල ගණන් බලන්න Estimator page එක භාවිතා කරන්න. ඒකෙන් ඔයාගේ project එකට ගැලපෙන direction එක ලැබෙනවා.",
      contact:
        "Project එක ආරම්භ කරන්න Contact page එක භාවිතා කරන්න. එතැනින් Zyverion එක්ක directly connect වෙන්න පුළුවන්.",
      work:
        "අපි කරපු වැඩ බලන්න Work page එක විවෘත කරන්න.",
      services:
        "Zyverion විසින් business websites, software systems, automation workflows, සහ digital business solutions ලබාදෙනවා.",
      verification:
        "Official verification සඳහා verification page එක භාවිතා කරන්න.",
      support:
        "Zyverion ගැන services, pricing guidance, website solutions, සහ project support ගැන මම උදව් කරන්න පුළුවන්.",
      refusal:
        "මම Zyverion AI. මට උදව් කරන්න පුළුවන් Zyverion services, website solutions, project guidance, සහ pricing direction ගැන විතරයි.",
    },
    en: {
      pricing:
        "For accurate pricing, please use the Estimator page. That will give the best direction for your project.",
      contact:
        "To start a project, please use the Contact page so you can connect with Zyverion directly.",
      work:
        "To see completed work and flagship projects, please open the Work page.",
      services:
        "Zyverion provides business websites, software systems, automation workflows, and digital business solutions.",
      verification:
        "For official verification, please use the verification page.",
      support:
        "I can help with Zyverion services, pricing guidance, website solutions, and project support.",
      refusal:
        "I'm Zyverion AI. I can help only with Zyverion services, website solutions, project guidance, and pricing direction.",
    },
    ta: {
      pricing:
        "சரியான விலை தெரிந்துகொள்ள Estimator page பயன்படுத்துங்கள். அது உங்கள் project க்கு சரியான direction தரும்.",
      contact:
        "Project ஆரம்பிக்க Contact page பயன்படுத்துங்கள். அங்கிருந்து Zyverion உடன் direct ஆக தொடர்பு கொள்ளலாம்.",
      work:
        "நாங்கள் செய்த வேலைகளை பார்க்க Work page திறக்கவும்.",
      services:
        "Zyverion business websites, software systems, automation workflows, மற்றும் digital business solutions வழங்குகிறது.",
      verification:
        "Official verification க்கு verification page பயன்படுத்துங்கள்.",
      support:
        "Zyverion services, pricing guidance, website solutions, மற்றும் project support பற்றி நான் உதவ முடியும்.",
      refusal:
        "நான் Zyverion AI. Zyverion services, website solutions, project guidance, மற்றும் pricing direction பற்றித்தான் உதவ முடியும்.",
    },
  };

  return packs[language] || packs.en;
}

function sanitizeReply(parsed, language, fallback) {
  const textReply =
    typeof parsed?.textReply === "string" && parsed.textReply.trim()
      ? parsed.textReply.trim()
      : fallback.textReply;

  const spokenReplyRaw =
    typeof parsed?.spokenReply === "string" && parsed.spokenReply.trim()
      ? parsed.spokenReply.trim()
      : textReply;

  const rawType =
    typeof parsed?.suggestedAction?.type === "string"
      ? parsed.suggestedAction.type.trim()
      : "";

  const type =
    rawType === "estimator" ||
    rawType === "contact" ||
    rawType === "work" ||
    rawType === "none"
      ? rawType
      : fallback.suggestedAction.type;

  let label =
    typeof parsed?.suggestedAction?.label === "string"
      ? parsed.suggestedAction.label.trim()
      : "";

  let href =
    typeof parsed?.suggestedAction?.href === "string"
      ? parsed.suggestedAction.href.trim()
      : "";

  if (type === "estimator") {
    label = label || "Open Estimator";
    href = href || "estimator.html";
  } else if (type === "contact") {
    label = label || "Contact Zyverion";
    href = href || "contact.html";
  } else if (type === "work") {
    label = label || "View Our Work";
    href = href || "projects.html";
  } else {
    label = "";
    href = "";
  }

  return {
    textReply,
    spokenReply: cleanupSpokenReply(spokenReplyRaw, language),
    suggestedAction: {
      type,
      label,
      href,
    },
  };
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
      "verify",
      "verification",
      "verify employee",
      "verify team",
      "verify member",
      "verify official",
      "සත්‍යාපනය",
      "உறுதிப்படுத்து",
      "சரிபார்",
    ])
  ) {
    return "verification";
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

  if (
    hasAny([
      "contact",
      "call",
      "phone",
      "email",
      "whatsapp",
      "reach",
      "අමතන්න",
      "සම්බන්ධ",
      "தொடர்பு",
      "அழைக்க",
      "மின்னஞ்சல்",
    ])
  ) {
    return "contact";
  }

  if (
    hasAny([
      "work",
      "project",
      "projects",
      "portfolio",
      "example",
      "sample",
      "වැඩ",
      "ප්‍රොජෙක්ට්",
      "வேலை",
      "திட்டம்",
      "போர்ட்ஃபோலியோ",
    ])
  ) {
    return "work";
  }

  if (
    hasAny([
      "start",
      "begin",
      "get started",
      "how to start",
      "how do i start",
      "පටන්",
      "ආරම්භ",
      "ஆரம்பிக்க",
      "தொடங்கு",
    ])
  ) {
    return "start";
  }

  if (
    hasAny([
      "service",
      "services",
      "website",
      "websites",
      "software",
      "system",
      "systems",
      "dashboard",
      "automation",
      "workflow",
      "portal",
      "සේවා",
      "වෙබ්",
      "සොෆ්ට්වෙයාර්",
      "සිස්ටම්",
      "சேவை",
      "இணையதளம்",
      "மென்பொருள்",
      "சிஸ்டம்",
    ])
  ) {
    return "services";
  }

  return "general";
}
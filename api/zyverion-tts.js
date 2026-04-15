const DEFAULT_MODEL = "gpt-4o-mini-tts";
const DEFAULT_FORMAT = "mp3";
const DEFAULT_VOICE = "marin";

const ALLOWED_VOICES = new Set([
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
  "verse",
  "marin",
  "cedar",
]);

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

    const rawText = typeof body?.text === "string" ? body.text : "";
    const language = normalizeLanguage(body?.language);
    const requestedVoice =
      typeof body?.voice === "string" ? body.voice.trim().toLowerCase() : "";
    const text = sanitizeSpeechInput(rawText, language);

    if (!text) {
      return json(
        {
          error: "Text is required.",
        },
        400
      );
    }

    const voice = pickVoice(requestedVoice, language);
    const instructions = buildVoiceInstructions(language, voice);

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        voice,
        format: DEFAULT_FORMAT,
        input: text,
        instructions,
      }),
    });

    if (!response.ok) {
      const detail = await safeReadText(response);
      return json(
        {
          error: "TTS generation failed.",
          detail: detail.slice(0, 700),
        },
        500
      );
    }

    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...corsHeaders({
          "Content-Type": contentType,
          "Cache-Control": "no-store",
        }),
      },
    });
  } catch (error) {
    return json(
      {
        error: "Unexpected TTS server error.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}

function corsHeaders(extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...extra,
  };
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function normalizeLanguage(value) {
  return value === "si" || value === "ta" || value === "en" ? value : "en";
}

function pickVoice(requestedVoice, language) {
  if (requestedVoice && ALLOWED_VOICES.has(requestedVoice)) {
    return requestedVoice;
  }

  if (language === "en") return "marin";
  if (language === "si") return "cedar";
  if (language === "ta") return "cedar";

  return DEFAULT_VOICE;
}

function sanitizeSpeechInput(value, language) {
  let text = String(value || "");

  text = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[*_#~>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  text = removeUiNoise(text, language);
  text = cleanRepeatedPhrases(text);

  if (text.length > 2600) {
    text = text.slice(0, 2600).trim();
  }

  return text;
}

function removeUiNoise(text, language) {
  let cleaned = text;

  const sharedNoise = [
    "Open Estimator",
    "Contact Zyverion",
    "View Our Work",
    "Estimator",
    "Contact",
    "Work",
    "Replay",
    "Mute",
    "Tap to speak",
    "ZYVERION AI",
    "Assistant",
    "NEXT QUESTIONS",
    "Recommended Direction",
  ];

  sharedNoise.forEach((item) => {
    const escaped = escapeRegExp(item);
    cleaned = cleaned.replace(new RegExp(escaped, "gi"), " ");
  });

  if (language === "si") {
    cleaned = cleaned
      .replace(/\bcontinue\b/gi, " ")
      .replace(/\bwebsite\b/gi, "වෙබ් අඩවිය")
      .replace(/\bsystem\b/gi, "සිස්ටම්")
      .replace(/\badmin\b/gi, "පරිපාලන")
      .replace(/\bmember\b/gi, "සාමාජික");
  }

  if (language === "ta") {
    cleaned = cleaned
      .replace(/\bcontinue\b/gi, " ")
      .replace(/\bwebsite\b/gi, "இணையதளம்")
      .replace(/\bsystem\b/gi, "சிஸ்டம்")
      .replace(/\badmin\b/gi, "நிர்வாக")
      .replace(/\bmember\b/gi, "உறுப்பினர்");
  }

  return cleaned.replace(/\s+/g, " ").trim();
}
function cleanRepeatedPhrases(text) {
  return text
    .replace(/\b(Speaking|speaking)\b\.?/g, " ")
    .replace(/\b(Tap to speak|tap to speak)\b/g, " ")
    .replace(/\b(ZYVERION AI)\b\s+\b(ZYVERION AI)\b/gi, "ZYVERION AI")
    .replace(/\s+/g, " ")
    .trim();
}

function buildVoiceInstructions(language, voice) {
  if (language === "si") {
    return [
      "Speak in Sinhala with a calm, premium, warm, business-consultant tone.",
      "Keep the delivery smooth, natural, and polished.",
      "Do not sound robotic, rushed, or overly dramatic.",
      "Use clean Sinhala pronunciation and avoid reading UI labels or formatting noise.",
      "If an English brand or technical term appears, say it naturally and continue smoothly in Sinhala.",
      `Preferred voice character: ${voice}.`,
    ].join(" ");
  }

  if (language === "ta") {
    return [
      "Speak in Tamil with a calm, premium, warm, business-consultant tone.",
      "Keep the delivery smooth, natural, and polished.",
      "Do not sound robotic, rushed, or overly dramatic.",
      "Use clean Tamil pronunciation and avoid reading UI labels or formatting noise.",
      "If an English brand or technical term appears, say it naturally and continue smoothly in Tamil.",
      `Preferred voice character: ${voice}.`,
    ].join(" ");
  }

  return [
    "Speak in English with a premium, warm, confident business-consultant tone.",
    "Sound natural, polished, and trustworthy.",
    "Do not sound robotic, overly excited, or salesy.",
    "Keep pacing smooth and clear, with natural pauses.",
    "Avoid reading labels, buttons, or interface fragments unless they are part of the actual sentence.",
    `Preferred voice character: ${voice}.`,
  ].join(" ");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
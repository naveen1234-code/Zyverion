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

    const rawText = typeof body?.text === "string" ? body.text.trim() : "";
    const language = normalizeLanguage(body?.language);
    const voice =
      typeof body?.voice === "string" && body.voice.trim()
        ? body.voice.trim()
        : "marin";

    if (!rawText) {
      return json(
        {
          error: "Text is required.",
        },
        400
      );
    }

    if (rawText.length > 1800) {
      return json(
        {
          error: "Text is too long.",
        },
        400
      );
    }

    const cleanedText = cleanupSpeechText(rawText, language);
    const model = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";

    const upstream = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice,
        input: cleanedText,
      }),
    });

    if (!upstream.ok) {
      const detail = await safeReadText(upstream);

      return json(
        {
          error: "TTS request failed.",
          detail: detail.slice(0, 400),
        },
        500
      );
    }

    const contentType =
      upstream.headers.get("content-type") || "audio/mpeg";
    const audioBuffer = await upstream.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...corsHeaders({
          "Content-Type": contentType,
          "Cache-Control": "no-store",
        }),
      },
    });
  } catch {
    return json(
      {
        error: "Unable to generate speech right now.",
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

function cleanupSpeechText(text, language) {
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
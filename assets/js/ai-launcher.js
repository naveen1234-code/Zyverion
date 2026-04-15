(function () {
  const launcher = document.getElementById("aiLauncher");
  const voiceOverlay = document.getElementById("aiVoiceOverlay");

  if (!launcher) return;

  const STORAGE_KEYS = {
    language: "zyverion-ai-language",
    preferredVoice: "zyverion-ai-voice-v2",
    hintShown: "zyverion-ai-hint-shown-v3",
    workPopupShown: "zyverion-work-popup-shown-v3",
    sessionState: "zyverion-ai-session-state-v2",
  };

  const SELECTORS = {
    panel: "#zyverionAiPanel",
    panelShell: "#zyverionAiPanel .zyverion-ai-panel-shell",
    backdrop: "#zyverionAiPanelBackdrop",
    hint: "#zyverionAiHint",

    languageSelect: "#zyverionAiLanguageSelect",
    languagePicker: "#zyverionAiLanguagePicker",
    languageOption: "[data-ai-language]",

    status: "#zyverionAiStatus",
    transcript: "#zyverionAiTranscript",
    headerIntro: "#zyverionAiHeaderIntro",
    contextSummary: "#zyverionAiContextSummary",

    messages: "#zyverionAiMessages",
    answerCard: ".zyverion-ai-answer-card",
    answerText: ".zyverion-ai-answer-text",

    orbZone: "#zyverionAiOrbZone",
    orbButton: "#zyverionAiOrbButton",
    orbStateText: "#zyverionAiOrbStateText",
    orbHintText: "#zyverionAiOrbHintText",

    recommendationRail: "#zyverionAiRecommendationRail",
    followUpRail: "#zyverionAiFollowUpRail",

    actionDock: "#zyverionAiActionDock",
    estimatorLink: "#zyverionAiEstimatorLink",
    contactLink: "#zyverionAiContactLink",
    workLink: "#zyverionAiWorkLink",

    utilityDock: "#zyverionAiUtilityDock",
    muteBtn: "#zyverionAiMuteBtn",
    replayBtn: "#zyverionAiReplayBtn",

    legacyControls: ".zyverion-ai-controls",
    legacyStartBtn: "#zyverionAiStartBtn",
    legacyStopBtn: "#zyverionAiStopBtn",
  };

  const STATUS_TEXT = {
    idle: {
      en: "Tell me about your business.",
      si: "ඔයාගේ business එක ගැන කියන්න.",
      ta: "உங்கள் business பற்றி சொல்லுங்கள்.",
    },
    chooseLanguage: {
      en: "Choose your language.",
      si: "ඔයාගේ භාෂාව තෝරන්න.",
      ta: "உங்கள் மொழியை தேர்வு செய்யுங்கள்.",
    },
    listening: {
      en: "Listening...",
      si: "සවන් දෙමින් සිටියි...",
      ta: "கேட்டு கொண்டிருக்கிறது...",
    },
    thinking: {
      en: "Thinking...",
      si: "සිතමින් සිටියි...",
      ta: "யோசிக்கிறது...",
    },
    speaking: {
      en: "Speaking...",
      si: "කතා කරමින් සිටියි...",
      ta: "பேசுகிறது...",
    },
    muted: {
      en: "Voice is muted.",
      si: "හඬ mute කරලා තියෙන්නේ.",
      ta: "குரல் mute செய்யப்பட்டுள்ளது.",
    },
    notHeard: {
      en: "I couldn't hear that clearly.",
      si: "පැහැදිලිව අහන්න ලැබුණේ නැහැ.",
      ta: "தெளிவாக கேட்கவில்லை.",
    },
    micBlocked: {
      en: "Microphone access is blocked.",
      si: "Microphone access block කරලා තියෙන්නේ.",
      ta: "Microphone access block செய்யப்பட்டுள்ளது.",
    },
    unsupported: {
      en: "Voice recognition is not supported here.",
      si: "මෙතැන voice recognition support නැහැ.",
      ta: "இங்கு voice recognition support இல்லை.",
    },
    backendVoice: {
      en: "Preparing voice...",
      si: "හඬ සකස් කරමින් සිටියි...",
      ta: "குரல் தயாராகிறது...",
    },
    ttsFallback: {
      en: "Using fallback voice.",
      si: "Fallback voice භාවිතා කරයි.",
      ta: "Fallback voice பயன்படுத்துகிறது.",
    },
  };

  const LANGUAGE_CONFIG = {
    en: {
      recognition: "en-GB",
      speech: "en-GB",
      welcome:
        "Hello. I'm Zyverion AI. Tell me what kind of business you have, and I’ll guide you toward the right website or system direction.",
      switchMessage:
        "Language switched to English.",
      orbHintIdle: "Tap to speak",
      orbHintListening: "Tap to stop",
      orbHintSpeaking: "Tap to stop voice",
      overlaySpeaking: "Speaking...",
      preferredVoice: "marin",
    },
    si: {
      recognition: "si-LK",
      speech: "si-LK",
      welcome:
        "ආයුබෝවන්. මම Zyverion AI. ඔයාගේ business එක මොන type එකක්ද කියන්න, ඒකට fit වෙන website හෝ system direction එක මම guide කරන්නම්.",
      switchMessage:
        "සිංහල භාෂාවට මාරු වුණා.",
      orbHintIdle: "කතා කරන්න තට්ටු කරන්න",
      orbHintListening: "නවත්වන්න ආයෙත් තට්ටු කරන්න",
      orbHintSpeaking: "හඬ නවත්වන්න තට්ටු කරන්න",
      overlaySpeaking: "කතා කරමින් සිටියි...",
      preferredVoice: "marin",
    },
    ta: {
      recognition: "ta-IN",
      speech: "ta-IN",
      welcome:
        "வணக்கம். நான் Zyverion AI. உங்கள் business type என்ன என்று சொல்லுங்கள், அதற்கு பொருத்தமான website அல்லது system direction ஐ நான் guide செய்கிறேன்.",
      switchMessage:
        "தமிழ் மொழிக்கு மாற்றப்பட்டது.",
      orbHintIdle: "பேச தட்டவும்",
      orbHintListening: "நிறுத்த மீண்டும் தட்டவும்",
      orbHintSpeaking: "குரலை நிறுத்த தட்டவும்",
      overlaySpeaking: "பேசுகிறது...",
      preferredVoice: "marin",
    },
  };

  const DEFAULT_LANGUAGE = "en";

  const SpeechRecognitionCtor =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const synth = "speechSynthesis" in window ? window.speechSynthesis : null;

  let recognition = null;
  let activeAudio = null;
  let activeAudioUrl = "";
  let activeTtsController = null;

  let isPanelOpen = false;
  let isMuted = false;
  let isListening = false;
  let isProcessing = false;
  let isSpeaking = false;
  let currentTranscriptText = "";
  let shouldAutoSendOnEnd = false;
  let lastSpokenText = "";
  let lastSpokenLanguage = null;
  let hasWelcomedThisOpen = false;
  let pendingNavigationTimer = null;

  let sessionState = loadSessionState();

  function createEmptySessionState() {
    return {
      businessSummary: "",
      userGoal: "",
      knownBusinessTypeId: "",
      knownStage: "",
      notes: "",
      lastSituationSummary: "",
      lastRecommendedSolutions: [],
      lastFollowUpQuestions: [],
      lastSuggestedAction: {
        type: "none",
        label: "",
        href: "",
      },
      answerMode: "",
      latestUserText: "",
      latestAssistantText: "",
    };
  }

  function normalizeSessionState(value) {
    const base = createEmptySessionState();

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return base;
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
      lastSituationSummary:
        typeof value.lastSituationSummary === "string"
          ? value.lastSituationSummary.trim()
          : "",
      lastRecommendedSolutions: Array.isArray(value.lastRecommendedSolutions)
        ? value.lastRecommendedSolutions.slice(0, 3)
        : [],
      lastFollowUpQuestions: Array.isArray(value.lastFollowUpQuestions)
        ? value.lastFollowUpQuestions.slice(0, 3)
        : [],
      lastSuggestedAction:
        value.lastSuggestedAction && typeof value.lastSuggestedAction === "object"
          ? {
              type: typeof value.lastSuggestedAction.type === "string"
                ? value.lastSuggestedAction.type.trim()
                : "none",
              label: typeof value.lastSuggestedAction.label === "string"
                ? value.lastSuggestedAction.label.trim()
                : "",
              href: typeof value.lastSuggestedAction.href === "string"
                ? value.lastSuggestedAction.href.trim()
                : "",
            }
          : base.lastSuggestedAction,
      answerMode:
        typeof value.answerMode === "string" ? value.answerMode.trim() : "",
      latestUserText:
        typeof value.latestUserText === "string" ? value.latestUserText.trim() : "",
      latestAssistantText:
        typeof value.latestAssistantText === "string"
          ? value.latestAssistantText.trim()
          : "",
    };
  }

  function loadSessionState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.sessionState);
      if (!raw) return createEmptySessionState();
      return normalizeSessionState(JSON.parse(raw));
    } catch (error) {
      return createEmptySessionState();
    }
  }

  function persistSessionState() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.sessionState,
        JSON.stringify(sessionState)
      );
    } catch (error) {}
  }

  function resetSessionState() {
    sessionState = createEmptySessionState();
    persistSessionState();
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function safeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function uniqueArray(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
  }

  function getPanel() {
    return qs(SELECTORS.panel);
  }

  function getPanelShell() {
    return qs(SELECTORS.panelShell);
  }

  function getBackdrop() {
    return qs(SELECTORS.backdrop);
  }

  function getHint() {
    return qs(SELECTORS.hint);
  }

  function getLanguageSelect() {
    return qs(SELECTORS.languageSelect);
  }

  function getLanguagePicker() {
    return qs(SELECTORS.languagePicker);
  }

  function getStatus() {
    return qs(SELECTORS.status);
  }

  function getTranscript() {
    return qs(SELECTORS.transcript);
  }

  function getHeaderIntro() {
    return qs(SELECTORS.headerIntro);
  }

  function getContextSummary() {
    return qs(SELECTORS.contextSummary);
  }

  function getMessages() {
    return qs(SELECTORS.messages);
  }

  function getAnswerCard() {
    return qs(SELECTORS.answerCard);
  }

  function getAnswerText() {
    return qs(SELECTORS.answerText);
  }

  function getOrbZone() {
    return qs(SELECTORS.orbZone);
  }

  function getOrbButton() {
    return qs(SELECTORS.orbButton);
  }

  function getOrbStateText() {
    return qs(SELECTORS.orbStateText);
  }

  function getOrbHintText() {
    return qs(SELECTORS.orbHintText);
  }

  function getRecommendationRail() {
    return qs(SELECTORS.recommendationRail);
  }

  function getFollowUpRail() {
    return qs(SELECTORS.followUpRail);
  }

  function getActionDock() {
    return qs(SELECTORS.actionDock);
  }

  function getEstimatorLink() {
    return qs(SELECTORS.estimatorLink);
  }

  function getContactLink() {
    return qs(SELECTORS.contactLink);
  }

  function getWorkLink() {
    return qs(SELECTORS.workLink);
  }

  function getUtilityDock() {
    return qs(SELECTORS.utilityDock);
  }

  function getMuteBtn() {
    return qs(SELECTORS.muteBtn);
  }

  function getReplayBtn() {
    return qs(SELECTORS.replayBtn);
  }

  function getVoiceOverlayTitle() {
    return voiceOverlay ? voiceOverlay.querySelector("strong") : null;
  }

  function getVoiceOverlaySubtitle() {
    return voiceOverlay ? voiceOverlay.querySelector("span") : null;
  }

function getSavedLanguage() {
    const value = localStorage.getItem(STORAGE_KEYS.language);
    return value === "si" || value === "en" || value === "ta"
      ? value
      : DEFAULT_LANGUAGE;
  }

  function getLanguagePack(language) {
    return LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.en;
  }

  function getStatusText(key, language) {
    const lang = language || getSavedLanguage() || "en";
    const table = STATUS_TEXT[key];

    if (table && table[lang]) return table[lang];
    if (table && table.en) return table.en;
    return key;
  }

  function setStatus(textOrKey, language) {
    const status = getStatus();
    if (!status) return;
    status.textContent = getStatusText(textOrKey, language);
  }

  function setTranscript(text) {
    const transcript = getTranscript();
    if (!transcript) return;

    if (!text) {
      transcript.hidden = true;
      transcript.textContent = "";
      return;
    }

    transcript.hidden = false;
    transcript.textContent = text;
  }

  function setHeaderIntro(text) {
    const el = getHeaderIntro();
    if (!el) return;

    if (!text) {
      el.hidden = true;
      el.textContent = "";
      return;
    }

    el.hidden = false;
    el.textContent = text;
  }

  function setContextSummary(text) {
    const el = getContextSummary();
    if (!el) return;

    if (!text) {
      el.hidden = true;
      el.textContent = "";
      return;
    }

    el.hidden = false;
    el.textContent = text;
  }

  function setCurrentAnswer(text) {
    const answerText = getAnswerText();
    const messages = getMessages();
    if (!answerText || !messages) return;

    const finalText = safeText(text) || "Welcome to Zyverion AI. Tell me what kind of business you have.";
    answerText.textContent = finalText;

    sessionState.latestAssistantText = finalText;
    persistSessionState();
  }
  function syncLanguageSelect(language) {
    const select = getLanguageSelect();
    if (select) select.value = language || "";
  }

  function syncLanguageButtons(language) {
    qsa(SELECTORS.languageOption).forEach(function (button) {
      const isSelected = button.getAttribute("data-ai-language") === language;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
  }

  function syncLanguageUi(language) {
    syncLanguageSelect(language);
    syncLanguageButtons(language);
  }

  function showLanguagePicker(show) {
    const picker = getLanguagePicker();
    if (!picker) return;
    picker.style.display = show ? "" : "none";
  }

  function getSavedPreferredVoice() {
    return localStorage.getItem(STORAGE_KEYS.preferredVoice) || "";
  }

  function getPreferredVoice(language) {
    const saved = getSavedPreferredVoice();
    if (saved) return saved;
    return getLanguagePack(language).preferredVoice || "marin";
  }

function setVoiceOverlayCopy(language) {
  const title = getVoiceOverlayTitle();
  const subtitle = getVoiceOverlaySubtitle();

  if (title) title.textContent = "ZYVERION AI";
  if (subtitle) subtitle.textContent = "";
}

  function showVoiceOverlay() {
    if (!voiceOverlay) return;
    voiceOverlay.classList.add("show");
    voiceOverlay.setAttribute("aria-hidden", "false");
  }

  function hideVoiceOverlay() {
    if (!voiceOverlay) return;
    voiceOverlay.classList.remove("show");
    voiceOverlay.setAttribute("aria-hidden", "true");
  }

  function updateMuteButton() {
    const btn = getMuteBtn();
    if (!btn) return;
    btn.textContent = isMuted ? "Unmute" : "Mute";
    btn.classList.toggle("is-active", isMuted);
    btn.setAttribute("aria-pressed", isMuted ? "true" : "false");
  }

  function updateReplayButton() {
    const btn = getReplayBtn();
    if (!btn) return;
    const enabled = !!(lastSpokenText && lastSpokenLanguage);
    btn.disabled = !enabled;
    btn.classList.toggle("is-disabled", !enabled);
  }

  function setOrbTexts(stateKey, language) {
    const pack = getLanguagePack(language || getSavedLanguage() || "en");
    const stateText = getOrbStateText();
    const hintText = getOrbHintText();

    if (stateText) {
      if (stateKey === "listening") stateText.textContent = getStatusText("listening", language);
      else if (stateKey === "thinking") stateText.textContent = getStatusText("thinking", language);
      else if (stateKey === "speaking") stateText.textContent = getStatusText("speaking", language);
      else if (stateKey === "muted") stateText.textContent = getStatusText("muted", language);
      else stateText.textContent = "ZYVERION AI";
    }

    if (hintText) {
      if (stateKey === "listening") hintText.textContent = pack.orbHintListening;
      else if (stateKey === "speaking") hintText.textContent = pack.orbHintSpeaking;
      else hintText.textContent = pack.orbHintIdle;
    }
  }

  function updateOrbState(language) {
    const orbZone = getOrbZone();
    const orbButton = getOrbButton();
    if (!orbZone || !orbButton) return;

    orbZone.classList.remove(
      "is-idle",
      "is-listening",
      "is-thinking",
      "is-speaking",
      "is-muted"
    );

    let stateKey = "idle";

    if (isMuted) {
      stateKey = "muted";
      orbZone.classList.add("is-muted");
    } else if (isListening) {
      stateKey = "listening";
      orbZone.classList.add("is-listening");
    } else if (isProcessing) {
      stateKey = "thinking";
      orbZone.classList.add("is-thinking");
    } else if (isSpeaking) {
      stateKey = "speaking";
      orbZone.classList.add("is-speaking");
    } else {
      orbZone.classList.add("is-idle");
    }

    orbButton.setAttribute("data-state", stateKey);
    setOrbTexts(stateKey, language || getSavedLanguage() || "en");
  }

  function createSolutionCard(solution) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "zyverion-ai-solution-card";
    card.setAttribute("data-solution-id", solution.id || "");

    const category = document.createElement("span");
    category.className = "zyverion-ai-solution-category";
    category.textContent = solution.category || "solution";

    const title = document.createElement("strong");
    title.className = "zyverion-ai-solution-title";
    title.textContent = solution.name || "Recommended Solution";

    const purpose = document.createElement("span");
    purpose.className = "zyverion-ai-solution-purpose";
    purpose.textContent = solution.purpose || "";

    card.appendChild(category);
    card.appendChild(title);
    card.appendChild(purpose);

    card.addEventListener("click", function () {
      const message =
        solution.name && solution.purpose
          ? solution.name + " — " + solution.purpose
          : solution.name || "";

      if (!message) return;
      setCurrentAnswer(message);
    });

    return card;
  }

  function renderRecommendationRail(solutions) {
    const rail = getRecommendationRail();
    if (!rail) return;

    rail.innerHTML = "";

    if (!Array.isArray(solutions) || !solutions.length) {
      rail.hidden = true;
      return;
    }

    const label = document.createElement("div");
    label.className = "zyverion-ai-section-label";
    label.textContent = "Recommended Direction";

    const list = document.createElement("div");
    list.className = "zyverion-ai-solution-list";

    solutions.slice(0, 3).forEach(function (solution) {
      list.appendChild(createSolutionCard(solution));
    });

    rail.appendChild(label);
    rail.appendChild(list);
    rail.hidden = false;
  }

  function createFollowUpChip(question) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "zyverion-ai-followup-chip";
    chip.textContent = question;

    chip.addEventListener("click", function () {
      processUserMessage(question);
    });

    return chip;
  }

  function renderFollowUpRail(questions) {
    const rail = getFollowUpRail();
    if (!rail) return;

    rail.innerHTML = "";

    if (!Array.isArray(questions) || !questions.length) {
      rail.hidden = true;
      return;
    }

    const label = document.createElement("div");
    label.className = "zyverion-ai-section-label";
    label.textContent = "Next Questions";

    const list = document.createElement("div");
    list.className = "zyverion-ai-followup-list";

    questions.slice(0, 3).forEach(function (question) {
      list.appendChild(createFollowUpChip(question));
    });

    rail.appendChild(label);
    rail.appendChild(list);
    rail.hidden = false;
  }

  function clearSuggestedActionState() {
    [getEstimatorLink(), getContactLink(), getWorkLink()].forEach(function (link) {
      if (!link) return;
      link.classList.remove("is-suggested");
    });
  }

  function updateSuggestedAction(type) {
    clearSuggestedActionState();

    let target = null;

    if (type === "estimator") target = getEstimatorLink();
    else if (type === "contact") target = getContactLink();
    else if (type === "work") target = getWorkLink();

    if (target) {
      target.classList.add("is-suggested");
    }
  }

  function normalizeSuggestedAction(action) {
    if (!action || typeof action !== "object") {
      return {
        type: "none",
        label: "",
        href: "",
      };
    }

    const type = safeText(action.type);

    if (type === "estimator") {
      return {
        type: "estimator",
        label: safeText(action.label) || "Estimator",
        href: safeText(action.href) || "estimator.html",
      };
    }

    if (type === "contact") {
      return {
        type: "contact",
        label: safeText(action.label) || "Contact",
        href: safeText(action.href) || "contact.html",
      };
    }

    if (type === "work") {
      return {
        type: "work",
        label: safeText(action.label) || "Work",
        href: safeText(action.href) || "projects.html",
      };
    }

    return {
      type: "none",
      label: "",
      href: "",
    };
  }

  function applySuggestedAction(action) {
    const normalized = normalizeSuggestedAction(action);
    updateSuggestedAction(normalized.type);
    sessionState.lastSuggestedAction = normalized;
    persistSessionState();
  }

  function buildSessionContextPayload() {
    return {
      businessSummary: sessionState.businessSummary,
      userGoal: sessionState.userGoal,
      knownBusinessTypeId: sessionState.knownBusinessTypeId,
      knownStage: sessionState.knownStage,
      notes: sessionState.notes,
    };
  }

  function mergeSessionStateFromAi(result) {
    if (!result || typeof result !== "object") return;

    if (safeText(result.situationSummary)) {
      sessionState.lastSituationSummary = safeText(result.situationSummary);
    }

    if (Array.isArray(result.followUpQuestions)) {
      sessionState.lastFollowUpQuestions = result.followUpQuestions
        .filter((item) => typeof item === "string" && item.trim())
        .slice(0, 3);
    }

    if (Array.isArray(result.recommendedSolutions)) {
      sessionState.lastRecommendedSolutions = result.recommendedSolutions
        .filter((item) => item && typeof item === "object")
        .slice(0, 3);
    }

    if (safeText(result.answerMode)) {
      sessionState.answerMode = safeText(result.answerMode);
    }

    if (result.situation && typeof result.situation === "object") {
      if (safeText(result.situation.businessTypeId)) {
        sessionState.knownBusinessTypeId = safeText(result.situation.businessTypeId);
      }
      if (safeText(result.situation.stage)) {
        sessionState.knownStage = safeText(result.situation.stage);
      }
      if (Array.isArray(result.situation.goals) && result.situation.goals.length) {
        sessionState.userGoal = result.situation.goals.join(", ");
      }
    }

    persistSessionState();
  }

  function learnFromUserMessage(text) {
    const value = normalizeText(text);
    if (!value) return;

    sessionState.latestUserText = safeText(text);

    if (!sessionState.businessSummary && value.length < 180) {
      if (
        value.includes("business") ||
        value.includes("company") ||
        value.includes("gym") ||
        value.includes("salon") ||
        value.includes("restaurant") ||
        value.includes("shop") ||
        value.includes("clinic") ||
        value.includes("agency") ||
        value.includes("brand") ||
        value.includes("institute")
      ) {
        sessionState.businessSummary = safeText(text);
      }
    }

    if (!sessionState.userGoal) {
      if (
        value.includes("more customers") ||
        value.includes("leads") ||
        value.includes("sales") ||
        value.includes("bookings") ||
        value.includes("trust") ||
        value.includes("website") ||
        value.includes("system") ||
        value.includes("guidance")
      ) {
        sessionState.userGoal = safeText(text);
      }
    }

    if (value.length < 240) {
      sessionState.notes = uniqueArray(
        [sessionState.notes, safeText(text)].filter(Boolean)
      ).join(" | ");

      if (sessionState.notes.length > 420) {
        sessionState.notes = sessionState.notes.slice(-420);
      }
    }

    persistSessionState();
  }

  function refreshSmartUiFromSession() {
    setContextSummary(sessionState.lastSituationSummary || "");
    renderRecommendationRail(sessionState.lastRecommendedSolutions || []);
    renderFollowUpRail(sessionState.lastFollowUpQuestions || []);
    applySuggestedAction(sessionState.lastSuggestedAction || { type: "none" });
    updateReplayButton();
    updateMuteButton();
    updateOrbState(getSavedLanguage() || "en");

    if (sessionState.latestAssistantText) {
      setCurrentAnswer(sessionState.latestAssistantText);
    }
  }

  function clearSmartUi() {
    setHeaderIntro("");
    setContextSummary("");
    renderRecommendationRail([]);
    renderFollowUpRail([]);
    clearSuggestedActionState();
  }

  function clearPendingNavigationTimer() {
    if (!pendingNavigationTimer) return;
    clearTimeout(pendingNavigationTimer);
    pendingNavigationTimer = null;
  }

  function shouldBypassLinkIntercept(event) {
    return (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button === 1
    );
  }
  function revokeActiveAudioUrl() {
    if (activeAudioUrl) {
      URL.revokeObjectURL(activeAudioUrl);
      activeAudioUrl = "";
    }
  }

  function cleanupActiveAudio() {
    if (activeAudio) {
      try {
        activeAudio.pause();
      } catch (error) {}
      activeAudio.src = "";
      activeAudio = null;
    }

    revokeActiveAudioUrl();
  }

  function stopBackendTtsRequest() {
    if (activeTtsController) {
      try {
        activeTtsController.abort();
      } catch (error) {}
      activeTtsController = null;
    }
  }

  function chooseVoice(language) {
    if (!synth) return null;

    const voices = synth.getVoices();
    if (!voices || !voices.length) return null;

    const targets =
      language === "si"
        ? ["si-lk", "si"]
        : language === "ta"
        ? ["ta-in", "ta"]
        : ["en-gb", "en-us", "en"];

    for (let i = 0; i < targets.length; i += 1) {
      const found = voices.find(function (voice) {
        return voice.lang && voice.lang.toLowerCase().indexOf(targets[i]) === 0;
      });
      if (found) return found;
    }

    return null;
  }

  function stopSpeech() {
    stopBackendTtsRequest();

    if (synth) {
      try {
        synth.cancel();
      } catch (error) {}
    }

    cleanupActiveAudio();
    hideVoiceOverlay();
    launcher.classList.remove("is-speaking");
    isSpeaking = false;
    updateOrbState(getSavedLanguage() || "en");
  }

  async function speakWithBackendTts(text, language) {
    if (!text || isMuted) return false;

    const controller = new AbortController();
    activeTtsController = controller;

    try {
      setStatus("backendVoice", language);
      updateOrbState(language);

      const response = await fetch("/api/zyverion-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          language: language,
          voice: getPreferredVoice(language),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("audio")) {
        throw new Error("TTS response was not audio");
      }

      const audioBlob = await response.blob();
      if (!audioBlob || !audioBlob.size) {
        throw new Error("Empty audio response");
      }

      if (activeTtsController !== controller) {
        return false;
      }

      cleanupActiveAudio();

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      activeAudio = audio;
      activeAudioUrl = audioUrl;
      activeTtsController = null;

      setVoiceOverlayCopy(language);

      return await new Promise(function (resolve) {
        let finished = false;

        function finalize(success) {
          if (finished) return;
          finished = true;

          audio.onplay = null;
          audio.onended = null;
          audio.onerror = null;

          if (!success) {
            cleanupActiveAudio();
          }

          resolve(success);
        }

        audio.onplay = function () {
          isSpeaking = true;
          showVoiceOverlay();
          launcher.classList.add("is-speaking");
          setStatus("speaking", language);
          updateOrbState(language);
        };

        audio.onended = function () {
          cleanupActiveAudio();
          hideVoiceOverlay();
          launcher.classList.remove("is-speaking");
          isSpeaking = false;
          if (!isListening) setStatus("idle", language);
          updateOrbState(language);
          finalize(true);
        };

        audio.onerror = function () {
          cleanupActiveAudio();
          hideVoiceOverlay();
          launcher.classList.remove("is-speaking");
          isSpeaking = false;
          if (!isListening) setStatus("ttsFallback", language);
          updateOrbState(language);
          finalize(false);
        };

        audio.play().catch(function () {
          cleanupActiveAudio();
          hideVoiceOverlay();
          launcher.classList.remove("is-speaking");
          isSpeaking = false;
          updateOrbState(language);
          finalize(false);
        });
      });
    } catch (error) {
      if (controller.signal.aborted) {
        return false;
      }

      if (activeTtsController === controller) {
        activeTtsController = null;
      }

      cleanupActiveAudio();
      updateOrbState(language);
      return false;
    }
  }

  function speakWithBrowserFallback(text, language) {
    if (!text) return;

    if (isMuted || !synth) {
      setStatus("muted", language);
      updateOrbState(language);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = chooseVoice(language);
    const pack = getLanguagePack(language);

    utterance.lang = pack.speech;
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = function () {
      isSpeaking = true;
      setVoiceOverlayCopy(language);
      showVoiceOverlay();
      launcher.classList.add("is-speaking");
      setStatus("speaking", language);
      updateOrbState(language);
    };

    utterance.onend = function () {
      hideVoiceOverlay();
      launcher.classList.remove("is-speaking");
      isSpeaking = false;
      if (!isListening) setStatus("idle", language);
      updateOrbState(language);
    };

    utterance.onerror = function () {
      hideVoiceOverlay();
      launcher.classList.remove("is-speaking");
      isSpeaking = false;
      if (!isListening) setStatus("ttsFallback", language);
      updateOrbState(language);
    };

    synth.speak(utterance);
  }

  async function speakText(text, language) {
    if (!text) return;

    lastSpokenText = text;
    lastSpokenLanguage = language;
    updateReplayButton();

    if (isMuted) {
      setStatus("muted", language);
      updateOrbState(language);
      return;
    }

    stopSpeech();

    const backendWorked = await speakWithBackendTts(text, language);
    if (backendWorked) return;

    if (!synth) {
      setStatus("ttsFallback", language);
      updateOrbState(language);
      return;
    }

    speakWithBrowserFallback(text, language);
  }

  function resetListeningUi() {
    isListening = false;
    launcher.classList.remove("is-listening");
    updateOrbState(getSavedLanguage() || "en");
  }

  function stopRecognition(discardTranscript) {
    shouldAutoSendOnEnd = !discardTranscript;

    if (!recognition) {
      resetListeningUi();
      if (discardTranscript) setTranscript("");
      return;
    }

    try {
      if (discardTranscript) {
        shouldAutoSendOnEnd = false;
        recognition.abort();
      } else {
        recognition.stop();
      }
    } catch (error) {
      resetListeningUi();
    }
  }

  function hideLegacyControls() {
    const legacyControls = qs(SELECTORS.legacyControls);
    const startBtn = qs(SELECTORS.legacyStartBtn);
    const stopBtn = qs(SELECTORS.legacyStopBtn);

    if (legacyControls) legacyControls.style.display = "none";
    if (startBtn) startBtn.style.display = "none";
    if (stopBtn) stopBtn.style.display = "none";
  }

  function getLanguageSwitchMessage(language) {
    return getLanguagePack(language).switchMessage;
  }

  async function handleGreeting(language) {
    const pack = getLanguagePack(language);

    if (hasWelcomedThisOpen) {
      const switchMessage = getLanguageSwitchMessage(language);
      setCurrentAnswer(switchMessage);
      await speakText(switchMessage, language);
      return;
    }

    setCurrentAnswer(pack.welcome);
    await speakText(pack.welcome, language);
    hasWelcomedThisOpen = true;
  }

  function showHintOncePerSession() {
    const hint = getHint();
    if (!hint) return;

    if (sessionStorage.getItem(STORAGE_KEYS.hintShown) === "true") {
      hint.classList.remove("show");
      return;
    }

    setTimeout(function () {
      hint.classList.add("show");
      sessionStorage.setItem(STORAGE_KEYS.hintShown, "true");

      setTimeout(function () {
        hint.classList.remove("show");
      }, 4500);
    }, 17000);
  }

  function isProjectsPage() {
    const path = (window.location.pathname || "").toLowerCase();
    return path.endsWith("/projects.html") || path.endsWith("projects.html");
  }

  function getWorkPopup() {
    return document.getElementById("zyverionWorkPopup");
  }

  function hideWorkPopup() {
    const popup = getWorkPopup();
    if (!popup) return;
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
  }

  function ensureWorkPopupExists() {
    if (!isProjectsPage()) return null;

    let popup = getWorkPopup();
    if (popup) return popup;

    popup = document.createElement("div");
    popup.id = "zyverionWorkPopup";
    popup.className = "zyverion-work-popup";
    popup.setAttribute("aria-hidden", "true");

    popup.innerHTML = `
      <button
        type="button"
        class="zyverion-work-popup-close"
        aria-label="Close estimator popup"
      >
        <span></span>
        <span></span>
      </button>
      <div class="zyverion-work-popup-copy">
        <strong>Like what you see?</strong>
        <p>Visit the Estimator to get a price direction for your project.</p>
      </div>
      <a class="zyverion-work-popup-btn" href="estimator.html">Open Estimator</a>
    `;

    document.body.appendChild(popup);

    const closeBtn = popup.querySelector(".zyverion-work-popup-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", hideWorkPopup);
    }

    return popup;
  }

  function showWorkPopupIfNeeded() {
    if (!isProjectsPage()) return;
    if (sessionStorage.getItem(STORAGE_KEYS.workPopupShown) === "true") return;

    const popup = ensureWorkPopupExists();
    if (!popup) return;

    setTimeout(function () {
      popup.classList.add("show");
      popup.setAttribute("aria-hidden", "false");
      sessionStorage.setItem(STORAGE_KEYS.workPopupShown, "true");

      setTimeout(function () {
        hideWorkPopup();
      }, 5200);
    }, 1800);
  }

  function setSavedLanguage(language) {
    if (!language) return;

    localStorage.setItem(STORAGE_KEYS.language, language);
    syncLanguageUi(language);
    showLanguagePicker(false);
    setHeaderIntro("");
    setStatus("idle", language);
    updateOrbState(language);
  }
  function normalizeAiResult(data) {
    if (!data || typeof data !== "object") {
      return {
        textReply: "",
        spokenReply: "",
        answerMode: "support",
        followUpQuestions: [],
        situationSummary: "",
        recommendedSolutions: [],
        suggestedAction: {
          type: "none",
          label: "",
          href: "",
        },
        situation: {
          businessTypeId: "",
          stage: "",
          goals: [],
          capabilities: [],
        },
      };
    }

    return {
      textReply: safeText(data.textReply),
      spokenReply: safeText(data.spokenReply || data.textReply),
      answerMode: safeText(data.answerMode || "support"),
      followUpQuestions: Array.isArray(data.followUpQuestions)
        ? data.followUpQuestions
            .filter((item) => typeof item === "string" && item.trim())
            .map((item) => item.trim())
            .slice(0, 3)
        : [],
      situationSummary: safeText(data.situationSummary),
      recommendedSolutions: Array.isArray(data.recommendedSolutions)
        ? data.recommendedSolutions
            .filter((item) => item && typeof item === "object")
            .slice(0, 3)
        : [],
      suggestedAction: normalizeSuggestedAction(data.suggestedAction),
      situation:
        data.situation && typeof data.situation === "object"
          ? {
              businessTypeId: safeText(data.situation.businessTypeId),
              stage: safeText(data.situation.stage),
              goals: Array.isArray(data.situation.goals)
                ? data.situation.goals
                    .filter((item) => typeof item === "string" && item.trim())
                    .slice(0, 6)
                : [],
              capabilities: Array.isArray(data.situation.capabilities)
                ? data.situation.capabilities
                    .filter((item) => typeof item === "string" && item.trim())
                    .slice(0, 6)
                : [],
            }
          : {
              businessTypeId: "",
              stage: "",
              goals: [],
              capabilities: [],
            },
    };
  }

  async function fetchAiReply(text, language) {
    try {
      const response = await fetch("/api/zyverion-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          language: language,
          sessionContext: buildSessionContextPayload(),
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = await response.json();
      return normalizeAiResult(data);
    } catch (error) {
      const fallbackQuestions =
        language === "si"
          ? [
              "ඔයාගේ main goal එක වැඩි members ගන්න එකද, members manage කරන එකද, නැත්නම් දෙකමද?",
              "ඔයාට website එක විතරක් ඕනද, නැත්නම් admin හෝ member features එකත් ඕනද?",
            ]
          : language === "ta"
          ? [
              "உங்கள் main goal அதிக members வாங்குவதா, members manage செய்வதா, அல்லது இரண்டுமா?",
              "உங்களுக்கு website மட்டும் வேண்டுமா, அல்லது admin அல்லது member features கூட வேண்டுமா?",
            ]
          : [
              "Is your main goal getting more customers, managing current users, or both?",
              "Do you need only a website, or do you also need admin or member features?",
            ];

      return normalizeAiResult({
        textReply:
          language === "si"
            ? "දැනට smart reply service එක fallback mode එකෙන් යනවා. ඒත් මට ඔයාගේ situation එක narrow කරන්න පුළුවන්."
            : language === "ta"
            ? "இப்போது smart reply service fallback mode இல் உள்ளது. ஆனாலும் உங்கள் situation ஐ narrow செய்ய நான் உதவ முடியும்."
            : "The smart reply service is in fallback mode right now, but I can still help narrow down your situation.",
        spokenReply:
          language === "si"
            ? "දැනට fallback mode එකෙන් යනවා. ඒත් මට ඔයාගේ situation එක narrow කරන්න පුළුවන්."
            : language === "ta"
            ? "இப்போது fallback mode இல் உள்ளது. ஆனாலும் உங்கள் situation ஐ narrow செய்ய உதவ முடியும்."
            : "I am in fallback mode right now, but I can still help narrow down your situation.",
        answerMode: "discovery",
        followUpQuestions: fallbackQuestions,
        situationSummary: "",
        recommendedSolutions: [],
        suggestedAction: {
          type: "none",
          label: "",
          href: "",
        },
        situation: {
          businessTypeId: "",
          stage: "",
          goals: [],
          capabilities: [],
        },
      });
    }
  }

  function applyAiResultToUi(result) {
    mergeSessionStateFromAi(result);

    setContextSummary(result.situationSummary || sessionState.lastSituationSummary || "");
    renderRecommendationRail(
      result.recommendedSolutions.length
        ? result.recommendedSolutions
        : sessionState.lastRecommendedSolutions || []
    );
    renderFollowUpRail(
      result.followUpQuestions.length
        ? result.followUpQuestions
        : sessionState.lastFollowUpQuestions || []
    );
    applySuggestedAction(result.suggestedAction);
  }

  async function processUserMessage(text) {
    const language = getSavedLanguage();
    const cleanText = safeText(text);

    if (!language) {
      setStatus("chooseLanguage");
      showLanguagePicker(true);
      return;
    }

    if (!cleanText || isProcessing) return;

    currentTranscriptText = "";
    setTranscript("");
    learnFromUserMessage(cleanText);

    sessionState.latestUserText = cleanText;
    persistSessionState();

    isProcessing = true;
    setStatus("thinking", language);
    updateOrbState(language);

    try {
      const result = await fetchAiReply(cleanText, language);

      applyAiResultToUi(result);

      if (result.textReply) {
        setCurrentAnswer(result.textReply);
      }

      if (result.spokenReply || result.textReply) {
        await speakText(result.spokenReply || result.textReply, language);
      }
    } finally {
      isProcessing = false;

      if (!isListening && !isSpeaking) {
        setStatus("idle", language);
      }

      updateOrbState(language);
      refreshSmartUiFromSession();
      syncPopupHeight();
    }
  }

  function startListening() {
    const language = getSavedLanguage();

    if (!language) {
      setStatus("chooseLanguage");
      showLanguagePicker(true);
      return;
    }

    if (!SpeechRecognitionCtor) {
      setStatus("unsupported", language);
      updateOrbState(language);
      return;
    }

    if (isListening || isProcessing) return;

    stopSpeech();
    currentTranscriptText = "";
    setTranscript("");
    shouldAutoSendOnEnd = true;

    recognition = new SpeechRecognitionCtor();
    recognition.lang = getLanguagePack(language).recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
      isListening = true;
      launcher.classList.add("is-listening");
      setStatus("listening", language);
      updateOrbState(language);
      syncPopupHeight();
    };

    recognition.onresult = function (event) {
      let combined = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        combined += event.results[i][0].transcript + " ";
      }

      currentTranscriptText = combined.trim();
      setTranscript(currentTranscriptText);
      syncPopupHeight();
    };

    recognition.onerror = function (event) {
      resetListeningUi();

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setStatus("micBlocked", language);
      } else {
        setStatus("notHeard", language);
      }

      recognition = null;
      updateOrbState(language);
      syncPopupHeight();
    };

    recognition.onend = function () {
      const spokenText = currentTranscriptText.trim();

      resetListeningUi();
      recognition = null;

      if (shouldAutoSendOnEnd && spokenText) {
        shouldAutoSendOnEnd = false;
        processUserMessage(spokenText);
        return;
      }

      if (!spokenText) {
        setStatus("notHeard", language);
        setTimeout(function () {
          if (!isListening && !isSpeaking) {
            setStatus("idle", language);
            updateOrbState(language);
          }
        }, 1200);
      } else {
        setStatus("idle", language);
        updateOrbState(language);
      }

      syncPopupHeight();
    };

    try {
      recognition.start();
    } catch (error) {
      resetListeningUi();
      setStatus("unsupported", language);
      recognition = null;
      updateOrbState(language);
      syncPopupHeight();
    }
  }

  function handleOrbTap() {
    const language = getSavedLanguage() || "en";

    if (isListening) {
      stopRecognition(false);
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      setStatus("idle", language);
      updateOrbState(language);
      syncPopupHeight();
      return;
    }

    if (isProcessing) {
      return;
    }

    startListening();
  }

  function getActionMessage(actionType, language) {
    if (actionType === "estimator") {
      return language === "si"
        ? "හරි. දැන් Estimator එක බලමු."
        : language === "ta"
        ? "சரி. இப்போது Estimator ஐ பார்க்கலாம்."
        : "Alright. Let's open the Estimator.";
    }

    if (actionType === "contact") {
      return language === "si"
        ? "හරි. දැන් Contact page එකට යමු."
        : language === "ta"
        ? "சரி. இப்போது Contact page க்கு போகலாம்."
        : "Alright. Let's open the Contact page.";
    }

    if (actionType === "work") {
      return language === "si"
        ? "හරි. දැන් Work page එක බලමු."
        : language === "ta"
        ? "சரி. இப்போது Work page பார்க்கலாம்."
        : "Alright. Let's open the Work page.";
    }

    return language === "si"
      ? "හරි. ඉදිරියට යමු."
      : language === "ta"
      ? "சரி. தொடர்ந்து போகலாம்."
      : "Alright. Let's continue.";
  }

  async function navigateWithAssistantFeedback(actionType, href) {
    const language = getSavedLanguage() || "en";
    const message = getActionMessage(actionType, language);

    clearPendingNavigationTimer();
    currentTranscriptText = "";
    setTranscript("");
    stopRecognition(true);
    stopSpeech();

    setCurrentAnswer(message);
    await speakText(message, language);

    pendingNavigationTimer = window.setTimeout(function () {
      pendingNavigationTimer = null;
      window.location.href = href;
    }, isMuted ? 150 : 380);
  }

  function syncPopupHeight() {
    const shell = getPanelShell();
    if (!shell) return;

    requestAnimationFrame(function () {
      const hasExtraContent =
        !!sessionState.lastSituationSummary ||
        !!(sessionState.lastRecommendedSolutions || []).length ||
        !!(sessionState.lastFollowUpQuestions || []).length ||
        !!currentTranscriptText ||
        isListening ||
        isProcessing;

      shell.style.maxHeight = hasExtraContent
        ? "min(72vh, 560px)"
        : "min(46vh, 390px)";
    });
  }
  async function openAssistantPanel() {
    const panel = getPanel();
    const backdrop = getBackdrop();

    if (!panel || !backdrop) return;

    panel.classList.add("is-open");
    backdrop.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("zyverion-ai-open");
    launcher.classList.add("is-active");

    isPanelOpen = true;
    hasWelcomedThisOpen = false;
    currentTranscriptText = "";
    setTranscript("");
    hideWorkPopup();
    clearPendingNavigationTimer();
    hideLegacyControls();

    const savedLanguage = getSavedLanguage();
    syncLanguageUi(savedLanguage);
    showLanguagePicker(!savedLanguage);

    if (sessionState.latestAssistantText) {
      setCurrentAnswer(sessionState.latestAssistantText);
    } else {
      setCurrentAnswer(
        "Welcome to Zyverion AI. Tell me what kind of business you have."
      );
    }

    setContextSummary(sessionState.lastSituationSummary || "");
    renderRecommendationRail(sessionState.lastRecommendedSolutions || []);
    renderFollowUpRail(sessionState.lastFollowUpQuestions || []);
    applySuggestedAction(sessionState.lastSuggestedAction || { type: "none" });

    if (savedLanguage) {
      setStatus("idle", savedLanguage);
      updateOrbState(savedLanguage);

      setTimeout(function () {
        Promise.resolve(handleGreeting(savedLanguage)).catch(function () {});
      }, 160);
    } else {
      setStatus("chooseLanguage", "en");
      updateOrbState("en");
    }

    syncPopupHeight();
  }

  function closeAssistantPanel() {
    const panel = getPanel();
    const backdrop = getBackdrop();

    if (!panel || !backdrop) return;

    clearPendingNavigationTimer();
    stopRecognition(true);
    stopSpeech();

    panel.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("zyverion-ai-open");
    launcher.classList.remove("is-active");
    launcher.classList.remove("is-listening");

    isPanelOpen = false;
    isProcessing = false;
    hasWelcomedThisOpen = false;
    currentTranscriptText = "";
    setTranscript("");
  }

  function toggleAssistantPanel() {
    if (isPanelOpen) {
      closeAssistantPanel();
    } else {
      openAssistantPanel();
    }
  }

  function bindPanelControls() {
    const backdrop = getBackdrop();
    const panel = getPanel();
    const languageSelect = getLanguageSelect();
    const orbButton = getOrbButton();
    const muteBtn = getMuteBtn();
    const replayBtn = getReplayBtn();
    const estimatorLink = getEstimatorLink();
    const contactLink = getContactLink();
    const workLink = getWorkLink();

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        closeAssistantPanel();
      });
    }

    if (panel) {
      panel.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    }

    document.addEventListener("click", function (event) {
      const option = event.target.closest(SELECTORS.languageOption);
      if (!option) return;

      const language = option.getAttribute("data-ai-language");
      if (!language) return;

      setSavedLanguage(language);
      Promise.resolve(handleGreeting(language)).catch(function () {});
      syncPopupHeight();
    });

    if (languageSelect) {
      languageSelect.addEventListener("change", function (event) {
        const language = event.target.value;
        if (!language) return;

        setSavedLanguage(language);
        Promise.resolve(handleGreeting(language)).catch(function () {});
        syncPopupHeight();
      });
    }

    if (orbButton) {
      orbButton.addEventListener("click", function (event) {
        event.preventDefault();
        handleOrbTap();
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener("click", function () {
        const language = getSavedLanguage() || "en";
        isMuted = !isMuted;

        if (isMuted) {
          stopSpeech();
          setStatus("muted", language);
        } else if (!isListening && !isSpeaking && !isProcessing) {
          setStatus("idle", language);
        }

        updateMuteButton();
        updateOrbState(language);
      });
    }

    if (replayBtn) {
      replayBtn.addEventListener("click", function () {
        if (!lastSpokenText || !lastSpokenLanguage) return;
        Promise.resolve(
          speakText(lastSpokenText, lastSpokenLanguage)
        ).catch(function () {});
      });
    }

    if (estimatorLink) {
      estimatorLink.addEventListener("click", function (event) {
        if (shouldBypassLinkIntercept(event)) return;
        event.preventDefault();
        navigateWithAssistantFeedback(
          "estimator",
          estimatorLink.getAttribute("href") || "estimator.html"
        );
      });
    }

    if (contactLink) {
      contactLink.addEventListener("click", function (event) {
        if (shouldBypassLinkIntercept(event)) return;
        event.preventDefault();
        navigateWithAssistantFeedback(
          "contact",
          contactLink.getAttribute("href") || "contact.html"
        );
      });
    }

    if (workLink) {
      workLink.addEventListener("click", function (event) {
        if (shouldBypassLinkIntercept(event)) return;
        event.preventDefault();
        navigateWithAssistantFeedback(
          "work",
          workLink.getAttribute("href") || "projects.html"
        );
      });
    }
  }

  function bindLauncher() {
    window.addEventListener("load", function () {
      localStorage.setItem(STORAGE_KEYS.language, DEFAULT_LANGUAGE);
      hideLegacyControls();
      showHintOncePerSession();
      ensureWorkPopupExists();
      showWorkPopupIfNeeded();

      const savedLanguage = getSavedLanguage();
      syncLanguageUi(savedLanguage);
      showLanguagePicker(!savedLanguage);

      if (sessionState.latestAssistantText) {
        setCurrentAnswer(sessionState.latestAssistantText);
      } else {
        setCurrentAnswer(
          "Welcome to Zyverion AI. Tell me what kind of business you have."
        );
      }

      setContextSummary(sessionState.lastSituationSummary || "");
      renderRecommendationRail(sessionState.lastRecommendedSolutions || []);
      renderFollowUpRail(sessionState.lastFollowUpQuestions || []);
      applySuggestedAction(sessionState.lastSuggestedAction || { type: "none" });

      setStatus(savedLanguage ? "idle" : "chooseLanguage", savedLanguage || "en");
      updateMuteButton();
      updateReplayButton();
      updateOrbState(savedLanguage || "en");
      syncPopupHeight();
    });

    if (synth) {
      synth.onvoiceschanged = function () {
        try {
          synth.getVoices();
        } catch (error) {}
      };
    }

    launcher.addEventListener("click", function (event) {
      event.preventDefault();
      toggleAssistantPanel();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isPanelOpen) {
        closeAssistantPanel();
      }
    });
  }

  function exposeApi() {
    window.ZyverionAI = {
      open: openAssistantPanel,
      close: closeAssistantPanel,
      toggle: toggleAssistantPanel,
      resetSession: function () {
        resetSessionState();
        clearSmartUi();
        setCurrentAnswer(
          "Welcome to Zyverion AI. Tell me what kind of business you have."
        );
        syncPopupHeight();
      },
      getLanguage: getSavedLanguage,
      setLanguage: function (language) {
        setSavedLanguage(language);
      },
      getSessionState: function () {
        return JSON.parse(JSON.stringify(sessionState));
      },
      speak: function (text, language) {
        return speakText(text, language || getSavedLanguage() || "en");
      },
      stopSpeech: stopSpeech,
      startListening: startListening,
      stopListening: function () {
        stopRecognition(false);
      },
      processMessage: processUserMessage,
      isOpen: function () {
        return isPanelOpen;
      },
    };
  }

  bindPanelControls();
  bindLauncher();
  exposeApi();
})();
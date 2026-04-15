(function () {
  const launcher = document.getElementById("aiLauncher");
  const voiceOverlay = document.getElementById("aiVoiceOverlay");

  if (!launcher) return;

  const DEFAULT_LANGUAGE = "en";
  const DEFAULT_ANSWER =
    "Welcome to Zyverion AI. Tell me what kind of business you have.";

  const STORAGE_KEYS = {
    language: "zyverion-ai-language",
    preferredVoice: "zyverion-ai-voice-v3",
    hintShown: "zyverion-ai-hint-shown-v4",
    workPopupShown: "zyverion-work-popup-shown-v4",
    sessionState: "zyverion-ai-session-state-v3",
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
    answerText: ".zyverion-ai-answer-text",

    orbZone: "#zyverionAiOrbZone",
    orbButton: "#zyverionAiOrbButton",
    orbStateText: "#zyverionAiOrbStateText",
    orbHintText: "#zyverionAiOrbHintText",

    recommendationRail: "#zyverionAiRecommendationRail",
    followUpRail: "#zyverionAiFollowUpRail",

    estimatorLink: "#zyverionAiEstimatorLink",
    contactLink: "#zyverionAiContactLink",
    workLink: "#zyverionAiWorkLink",

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
        "Hello. I'm Zyverion AI. Tell me what kind of business you have, and I’ll guide you step by step toward the right website or system direction.",
      switchMessage: "Language switched to English.",
      orbHintIdle: "Tap to speak",
      orbHintListening: "Tap to stop",
      orbHintSpeaking: "Tap to stop voice",
      preferredVoice: "marin",
    },
    si: {
      recognition: "si-LK",
      speech: "si-LK",
      welcome:
        "ආයුබෝවන්. මම Zyverion AI. ඔයාගේ business එක මොන type එකක්ද කියන්න, මම step by step right website හෝ system direction එකට guide කරන්නම්.",
      switchMessage: "සිංහල භාෂාවට මාරු වුණා.",
      orbHintIdle: "කතා කරන්න තට්ටු කරන්න",
      orbHintListening: "නවත්වන්න ආයෙත් තට්ටු කරන්න",
      orbHintSpeaking: "හඬ නවත්වන්න තට්ටු කරන්න",
      preferredVoice: "marin",
    },
    ta: {
      recognition: "ta-IN",
      speech: "ta-IN",
      welcome:
        "வணக்கம். நான் Zyverion AI. உங்கள் business type என்ன என்று சொல்லுங்கள், சரியான website அல்லது system direction க்கு நான் step by step guide செய்கிறேன்.",
      switchMessage: "தமிழ் மொழிக்கு மாற்றப்பட்டது.",
      orbHintIdle: "பேச தட்டவும்",
      orbHintListening: "நிறுத்த மீண்டும் தட்டவும்",
      orbHintSpeaking: "குரலை நிறுத்த தட்டவும்",
      preferredVoice: "marin",
    },
  };

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
  let currentAnswerText = DEFAULT_ANSWER;
  let shouldAutoSendOnEnd = false;
  let lastSpokenText = "";
  let lastSpokenLanguage = "";
  let hasWelcomedThisOpen = false;
  let pendingNavigationTimer = null;

  const conversationState = loadConversationState();
  let liveUiState = createEmptyLiveUiState();

  function createEmptyConversationState() {
    return {
      businessSummary: "",
      userGoal: "",
      knownBusinessTypeId: "",
      knownStage: "",
      notes: "",
      latestUserText: "",
    };
  }

  function createEmptyLiveUiState() {
    return {
      headerIntro: "",
      contextSummary: "",
      followUpQuestions: [],
      recommendedSolutions: [],
      suggestedAction: {
        type: "none",
        label: "",
        href: "",
      },
      answerMode: "",
    };
  }

  function normalizeConversationState(value) {
    const base = createEmptyConversationState();

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return base;
    }

    return {
      businessSummary:
        typeof value.businessSummary === "string"
          ? value.businessSummary.trim()
          : "",
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
      latestUserText:
        typeof value.latestUserText === "string"
          ? value.latestUserText.trim()
          : "",
    };
  }

  function loadConversationState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.sessionState);
      if (!raw) return createEmptyConversationState();
      return normalizeConversationState(JSON.parse(raw));
    } catch (error) {
      return createEmptyConversationState();
    }
  }

  function persistConversationState() {
    try {
      sessionStorage.setItem(
        STORAGE_KEYS.sessionState,
        JSON.stringify(conversationState)
      );
    } catch (error) {}
  }

  function resetConversationState() {
    const base = createEmptyConversationState();
    Object.keys(base).forEach(function (key) {
      conversationState[key] = base[key];
    });
    persistConversationState();
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

  function getEstimatorLink() {
    return qs(SELECTORS.estimatorLink);
  }

  function getContactLink() {
    return qs(SELECTORS.contactLink);
  }

  function getWorkLink() {
    return qs(SELECTORS.workLink);
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
    return value === "si" || value === "ta" || value === "en"
      ? value
      : DEFAULT_LANGUAGE;
  }

  function setSavedLanguage(language) {
    if (!language) return;
    localStorage.setItem(STORAGE_KEYS.language, language);
  }

  function getSavedPreferredVoice() {
    return localStorage.getItem(STORAGE_KEYS.preferredVoice) || "";
  }

  function getPreferredVoice(language) {
    const saved = getSavedPreferredVoice();
    if (saved) return saved;
    return getLanguagePack(language).preferredVoice || "marin";
  }

  function getLanguagePack(language) {
    return LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.en;
  }

  function getStatusText(key, language) {
    const lang = language || getSavedLanguage();
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

    const finalText = safeText(text);
    transcript.hidden = !finalText;
    transcript.textContent = finalText;
  }

  function setHeaderIntro(text) {
    const el = getHeaderIntro();
    if (!el) return;

    const finalText = safeText(text);
    el.hidden = !finalText;
    el.textContent = finalText;
  }

  function setContextSummary(text) {
    const el = getContextSummary();
    if (!el) return;

    const finalText = safeText(text);
    el.hidden = !finalText;
    el.textContent = finalText;
  }

  function setCurrentAnswer(text) {
    const answerText = getAnswerText();
    const messages = getMessages();
    if (!answerText || !messages) return;

    currentAnswerText = safeText(text) || DEFAULT_ANSWER;
    answerText.textContent = currentAnswerText;
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

  function setVoiceOverlayCopy() {
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
    const pack = getLanguagePack(language || getSavedLanguage());
    const stateText = getOrbStateText();
    const hintText = getOrbHintText();

    if (stateText) {
      if (stateKey === "listening") {
        stateText.textContent = getStatusText("listening", language);
      } else if (stateKey === "thinking") {
        stateText.textContent = getStatusText("thinking", language);
      } else if (stateKey === "speaking") {
        stateText.textContent = getStatusText("speaking", language);
      } else if (stateKey === "muted") {
        stateText.textContent = getStatusText("muted", language);
      } else {
        stateText.textContent = "ZYVERION AI";
      }
    }

    if (hintText) {
      if (stateKey === "listening") {
        hintText.textContent = pack.orbHintListening;
      } else if (stateKey === "speaking") {
        hintText.textContent = pack.orbHintSpeaking;
      } else {
        hintText.textContent = pack.orbHintIdle;
      }
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
    setOrbTexts(stateKey, language || getSavedLanguage());
  }

  function clearSuggestedActionState() {
    [getEstimatorLink(), getContactLink(), getWorkLink()].forEach(function (link) {
      if (!link) return;
      link.classList.remove("is-suggested");
    });
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
    clearSuggestedActionState();

    let target = null;
    if (normalized.type === "estimator") target = getEstimatorLink();
    if (normalized.type === "contact") target = getContactLink();
    if (normalized.type === "work") target = getWorkLink();

    if (target) {
      target.classList.add("is-suggested");
    }

    liveUiState.suggestedAction = normalized;
  }

  function createSolutionCard(solution) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "zyverion-ai-solution-card";
    card.setAttribute("data-solution-id", safeText(solution.id));

    const category = document.createElement("span");
    category.className = "zyverion-ai-solution-category";
    category.textContent = safeText(solution.category) || "solution";

    const title = document.createElement("strong");
    title.className = "zyverion-ai-solution-title";
    title.textContent = safeText(solution.name) || "Recommended Solution";

    const purpose = document.createElement("span");
    purpose.className = "zyverion-ai-solution-purpose";
    purpose.textContent = safeText(solution.purpose);

    card.appendChild(category);
    card.appendChild(title);
    card.appendChild(purpose);

    card.addEventListener("click", function () {
      const summary = [safeText(solution.name), safeText(solution.purpose)]
        .filter(Boolean)
        .join(" — ");

      if (summary) {
        setCurrentAnswer(summary);
        syncPopupHeight();
      }
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
      if (!solution || typeof solution !== "object") return;
      list.appendChild(createSolutionCard(solution));
    });

    if (!list.children.length) {
      rail.hidden = true;
      return;
    }

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

    questions.slice(0, 4).forEach(function (question) {
      const cleanQuestion = safeText(question);
      if (!cleanQuestion) return;
      list.appendChild(createFollowUpChip(cleanQuestion));
    });

    if (!list.children.length) {
      rail.hidden = true;
      return;
    }

    rail.appendChild(label);
    rail.appendChild(list);
    rail.hidden = false;
  }

  function clearLiveUiState() {
    liveUiState = createEmptyLiveUiState();
    setHeaderIntro("");
    setContextSummary("");
    renderRecommendationRail([]);
    renderFollowUpRail([]);
    clearSuggestedActionState();
  }

  function applyLiveUiState() {
    setHeaderIntro(liveUiState.headerIntro || "");
    setContextSummary(liveUiState.contextSummary || "");
    renderRecommendationRail(liveUiState.recommendedSolutions || []);
    renderFollowUpRail(liveUiState.followUpQuestions || []);
    applySuggestedAction(liveUiState.suggestedAction || { type: "none" });
    updateMuteButton();
    updateReplayButton();
    updateOrbState(getSavedLanguage());
  }

  function setFreshResultUi(result) {
    liveUiState.headerIntro = safeText(result.headerIntro);
    liveUiState.contextSummary = safeText(result.situationSummary);
    liveUiState.followUpQuestions = Array.isArray(result.followUpQuestions)
      ? result.followUpQuestions
          .filter((item) => typeof item === "string" && item.trim())
          .slice(0, 4)
      : [];
    liveUiState.recommendedSolutions = Array.isArray(result.recommendedSolutions)
      ? result.recommendedSolutions
          .filter((item) => item && typeof item === "object")
          .slice(0, 3)
      : [];
    liveUiState.suggestedAction = normalizeSuggestedAction(result.suggestedAction);
    liveUiState.answerMode = safeText(result.answerMode);

    applyLiveUiState();
  }

  function buildSessionContextPayload() {
    return {
      businessSummary: conversationState.businessSummary,
      userGoal: conversationState.userGoal,
      knownBusinessTypeId: conversationState.knownBusinessTypeId,
      knownStage: conversationState.knownStage,
      notes: conversationState.notes,
    };
  }

  function learnFromUserMessage(text) {
    const cleanText = safeText(text);
    const value = normalizeText(cleanText);
    if (!value) return;

    conversationState.latestUserText = cleanText;

    if (!conversationState.businessSummary) {
      if (
        value.includes("my business is") ||
        value.includes("i run a") ||
        value.includes("i have a") ||
        value.includes("for my gym") ||
        value.includes("for my salon") ||
        value.includes("for my restaurant") ||
        value.includes("for my clinic") ||
        value.includes("for my shop") ||
        value.includes("for my company")
      ) {
        conversationState.businessSummary = cleanText.slice(0, 180);
      }
    }

    if (!conversationState.userGoal) {
      if (
        value.includes("more customers") ||
        value.includes("more leads") ||
        value.includes("more sales") ||
        value.includes("more bookings") ||
        value.includes("manage members") ||
        value.includes("member management") ||
        value.includes("website") ||
        value.includes("system")
      ) {
        conversationState.userGoal = cleanText.slice(0, 180);
      }
    }

    if (cleanText.length <= 160) {
      const notes = uniqueArray(
        [conversationState.notes, cleanText]
          .filter(Boolean)
          .join(" | ")
          .split(" | ")
          .map((item) => item.trim())
      );

      conversationState.notes = notes.slice(-4).join(" | ");
    }

    persistConversationState();
  }

  function mergeConversationStateFromAi(result) {
    if (!result || typeof result !== "object") return;

    if (result.situation && typeof result.situation === "object") {
      const businessTypeId = safeText(result.situation.businessTypeId);
      const stage = safeText(result.situation.stage);

      if (businessTypeId) {
        conversationState.knownBusinessTypeId = businessTypeId;
      }

      if (stage) {
        conversationState.knownStage = stage;
      }

      if (Array.isArray(result.situation.goals) && result.situation.goals.length) {
        conversationState.userGoal = result.situation.goals
          .filter((item) => typeof item === "string" && item.trim())
          .slice(0, 4)
          .join(", ");
      }
    }

    persistConversationState();
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
    updateOrbState(getSavedLanguage());
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

      setVoiceOverlayCopy();

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

          if (!isListening) {
            setStatus("idle", language);
          }

          updateOrbState(language);
          finalize(true);
        };

        audio.onerror = function () {
          cleanupActiveAudio();
          hideVoiceOverlay();
          launcher.classList.remove("is-speaking");
          isSpeaking = false;

          if (!isListening) {
            setStatus("ttsFallback", language);
          }

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
      setVoiceOverlayCopy();
      showVoiceOverlay();
      launcher.classList.add("is-speaking");
      setStatus("speaking", language);
      updateOrbState(language);
    };

    utterance.onend = function () {
      hideVoiceOverlay();
      launcher.classList.remove("is-speaking");
      isSpeaking = false;

      if (!isListening) {
        setStatus("idle", language);
      }

      updateOrbState(language);
    };

    utterance.onerror = function () {
      hideVoiceOverlay();
      launcher.classList.remove("is-speaking");
      isSpeaking = false;

      if (!isListening) {
        setStatus("ttsFallback", language);
      }

      updateOrbState(language);
    };

    synth.speak(utterance);
  }

  async function speakText(text, language) {
    const cleanText = safeText(text);
    if (!cleanText) return;

    lastSpokenText = cleanText;
    lastSpokenLanguage = language;
    updateReplayButton();

    if (isMuted) {
      setStatus("muted", language);
      updateOrbState(language);
      return;
    }

    stopSpeech();

    const backendWorked = await speakWithBackendTts(cleanText, language);
    if (backendWorked) return;

    if (!synth) {
      setStatus("ttsFallback", language);
      updateOrbState(language);
      return;
    }

    speakWithBrowserFallback(cleanText, language);
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
            .slice(0, 4)
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
      return normalizeAiResult({
        textReply:
          language === "si"
            ? "Live assistant service එකට පොඩි connection issue එකක් තියෙනවා. ඒත් ඔයාගේ business type එක හෝ goal එක කියන්න, මම next step එක narrow කරන්න help කරන්නම්."
            : language === "ta"
            ? "Live assistant service இல் சிறிய connection issue உள்ளது. ஆனாலும் உங்கள் business type அல்லது goal ஐ சொல்லுங்கள், அடுத்த step ஐ narrow செய்ய நான் உதவுகிறேன்."
            : "There is a small connection issue with the live assistant service right now. Tell me your business type or goal, and I’ll still help narrow the next step.",
        spokenReply:
          language === "si"
            ? "Connection issue එකක් තියෙනවා. ඒත් business type එක හෝ goal එක කියන්න, මම next step එක guide කරන්නම්."
            : language === "ta"
            ? "Connection issue உள்ளது. ஆனாலும் உங்கள் business type அல்லது goal ஐ சொல்லுங்கள், அடுத்த step ஐ guide செய்கிறேன்."
            : "There is a connection issue right now, but tell me your business type or goal and I will still guide the next step.",
        answerMode: "support",
        followUpQuestions:
          language === "si"
            ? ["My business is a gym", "I need more leads", "I need a website", "I need a system"]
            : language === "ta"
            ? ["My business is a gym", "I need more leads", "I need a website", "I need a system"]
            : ["My business is a gym", "I need more leads", "I need a website", "I need a system"],
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
  function resetListeningUi() {
    isListening = false;
    launcher.classList.remove("is-listening");
    updateOrbState(getSavedLanguage());
  }

  function stopRecognition(discardTranscript) {
    shouldAutoSendOnEnd = !discardTranscript;

    if (!recognition) {
      resetListeningUi();
      if (discardTranscript) {
        currentTranscriptText = "";
        setTranscript("");
      }
      return;
    }

    try {
      if (discardTranscript) {
        shouldAutoSendOnEnd = false;
        recognition.abort();
        currentTranscriptText = "";
        setTranscript("");
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
      clearLiveUiState();
      syncPopupHeight();
      await speakText(switchMessage, language);
      return;
    }

    clearLiveUiState();
    setCurrentAnswer(pack.welcome);
    syncPopupHeight();
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

  async function processUserMessage(text) {
    const language = getSavedLanguage();
    const cleanText = safeText(text);

    if (!cleanText || isProcessing) return;

    stopSpeech();
    currentTranscriptText = "";
    setTranscript("");
    learnFromUserMessage(cleanText);

    isProcessing = true;
    setStatus("thinking", language);
    updateOrbState(language);

    try {
      const result = await fetchAiReply(cleanText, language);

      mergeConversationStateFromAi(result);
      setFreshResultUi(result);

      const finalAnswer = safeText(result.textReply) || DEFAULT_ANSWER;
      const spokenAnswer = safeText(result.spokenReply) || finalAnswer;

      setCurrentAnswer(finalAnswer);
      syncPopupHeight();

      await speakText(spokenAnswer, language);
    } finally {
      isProcessing = false;

      if (!isListening && !isSpeaking) {
        setStatus("idle", language);
      }

      updateReplayButton();
      updateMuteButton();
      updateOrbState(language);
      syncPopupHeight();
    }
  }

  function startListening() {
    const language = getSavedLanguage();

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
      recognition = null;
      setStatus("unsupported", language);
      updateOrbState(language);
      syncPopupHeight();
    }
  }

  function handleOrbTap() {
    const language = getSavedLanguage();

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
    const language = getSavedLanguage();
    const message = getActionMessage(actionType, language);

    clearPendingNavigationTimer();
    currentTranscriptText = "";
    setTranscript("");
    stopRecognition(true);
    stopSpeech();

    setCurrentAnswer(message);
    clearLiveUiState();
    syncPopupHeight();
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
        !!safeText(liveUiState.contextSummary) ||
        !!(liveUiState.recommendedSolutions || []).length ||
        !!(liveUiState.followUpQuestions || []).length ||
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
    showLanguagePicker(false);

    setCurrentAnswer(currentAnswerText || DEFAULT_ANSWER);
    applyLiveUiState();

    setStatus("idle", savedLanguage);
    updateOrbState(savedLanguage);
    syncPopupHeight();

    setTimeout(function () {
      Promise.resolve(handleGreeting(savedLanguage)).catch(function () {});
    }, 140);
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
      syncLanguageUi(language);
      showLanguagePicker(false);
      setStatus("idle", language);
      updateOrbState(language);

      if (isPanelOpen) {
        Promise.resolve(handleGreeting(language)).catch(function () {});
      }
    });

    if (languageSelect) {
      languageSelect.addEventListener("change", function (event) {
        const language = safeText(event.target.value);
        if (!language) return;

        setSavedLanguage(language);
        syncLanguageUi(language);
        showLanguagePicker(false);
        setStatus("idle", language);
        updateOrbState(language);

        if (isPanelOpen) {
          Promise.resolve(handleGreeting(language)).catch(function () {});
        }
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
        const language = getSavedLanguage();
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
      if (!localStorage.getItem(STORAGE_KEYS.language)) {
        setSavedLanguage(DEFAULT_LANGUAGE);
      }

      hideLegacyControls();
      showHintOncePerSession();
      ensureWorkPopupExists();
      showWorkPopupIfNeeded();

      const savedLanguage = getSavedLanguage();
      syncLanguageUi(savedLanguage);
      showLanguagePicker(false);

      clearLiveUiState();
      setCurrentAnswer(DEFAULT_ANSWER);
      setStatus("idle", savedLanguage);
      updateMuteButton();
      updateReplayButton();
      updateOrbState(savedLanguage);
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
        resetConversationState();
        clearLiveUiState();
        currentAnswerText = DEFAULT_ANSWER;
        setCurrentAnswer(DEFAULT_ANSWER);
        syncPopupHeight();
      },
      getLanguage: getSavedLanguage,
      setLanguage: function (language) {
        const cleanLanguage = safeText(language);
        if (!cleanLanguage) return;
        setSavedLanguage(cleanLanguage);
        syncLanguageUi(cleanLanguage);
        updateOrbState(cleanLanguage);
      },
      getConversationState: function () {
        return JSON.parse(JSON.stringify(conversationState));
      },
      speak: function (text, language) {
        return speakText(text, language || getSavedLanguage());
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
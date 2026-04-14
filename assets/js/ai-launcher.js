(function () {
  const launcher = document.getElementById("aiLauncher");
  const welcomeOverlay = document.getElementById("aiWelcomeOverlay");
  const voiceOverlay = document.getElementById("aiVoiceOverlay");

  if (!launcher) return;

  const STORAGE_KEYS = {
    language: "zyverion-ai-language",
    preferredVoice: "zyverion-ai-voice",
    hintShown: "zyverion-ai-hint-shown-v2",
    workPopupShown: "zyverion-work-popup-shown-v2",
    sessionState: "zyverion-ai-session-state-v1",
  };

  const SELECTORS = {
    panel: "#zyverionAiPanel",
    panelShell: "#zyverionAiPanel .zyverion-ai-panel-shell",
    panelClose: "#zyverionAiPanelClose",
    panelBackdrop: "#zyverionAiPanelBackdrop",
    hint: "#zyverionAiHint",

    languageSelect: "#zyverionAiLanguageSelect",
    languagePicker: "#zyverionAiLanguagePicker",
    languageOption: "[data-ai-language]",

    headerIntro: "#zyverionAiHeaderIntro",
    status: "#zyverionAiStatus",
    transcript: "#zyverionAiTranscript",
    messages: "#zyverionAiMessages",

    orbZone: "#zyverionAiOrbZone",
    orbButton: "#zyverionAiOrbButton",
    orbStateText: "#zyverionAiOrbStateText",
    orbHintText: "#zyverionAiOrbHintText",

    contextSummary: "#zyverionAiContextSummary",
    recommendationRail: "#zyverionAiRecommendationRail",
    followUpRail: "#zyverionAiFollowUpRail",

    utilityDock: "#zyverionAiUtilityDock",
    muteBtn: "#zyverionAiMuteBtn",
    replayBtn: "#zyverionAiReplayBtn",

    actionDock: "#zyverionAiActionDock",
    estimatorLink: "#zyverionAiEstimatorLink",
    contactLink: "#zyverionAiContactLink",
    workLink: "#zyverionAiWorkLink",

    legacyStartBtn: "#zyverionAiStartBtn",
    legacyStopBtn: "#zyverionAiStopBtn",
    legacyControls: ".zyverion-ai-controls",
  };

  const STATUS_TEXT = {
    idle: {
      en: "Tell me about your business, goal, or project idea.",
      si: "ඔයාගේ business එක, goal එක, හෝ project idea එක ගැන කියන්න.",
      ta: "உங்கள் business, goal, அல்லது project idea பற்றி சொல்லுங்கள்.",
    },
    chooseLanguage: {
      en: "Choose a language to begin.",
      si: "ආරම්භ කරන්න භාෂාවක් තෝරන්න.",
      ta: "தொடங்க ஒரு மொழியைத் தேர்ந்தெடுக்கவும்.",
    },
    listening: {
      en: "Listening...",
      si: "සවන් දෙමින් සිටියි...",
      ta: "கேட்டு கொண்டிருக்கிறது...",
    },
    thinking: {
      en: "Thinking through your situation...",
      si: "ඔයාගේ situation එක analyse කරමින් සිටියි...",
      ta: "உங்கள் situation ஐ analyse செய்கிறது...",
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
      en: "I couldn't hear that clearly. Try again.",
      si: "පැහැදිලිව අහන්න ලැබුණේ නැහැ. ආයෙත් උත්සාහ කරන්න.",
      ta: "தெளிவாக கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.",
    },
    micBlocked: {
      en: "Microphone access is blocked on this browser.",
      si: "මේ browser එකේ microphone access block කරලා තියෙන්නේ.",
      ta: "இந்த browser இல் microphone access block செய்யப்பட்டுள்ளது.",
    },
    unsupported: {
      en: "Voice recognition is not supported on this browser.",
      si: "මේ browser එකේ voice recognition support නැහැ.",
      ta: "இந்த browser இல் voice recognition support இல்லை.",
    },
    backendVoice: {
      en: "Preparing voice...",
      si: "හඬ සකස් කරමින් සිටියි...",
      ta: "குரல் தயாராகிறது...",
    },
    ttsFallback: {
      en: "Using fallback voice playback.",
      si: "Fallback voice playback භාවිතා කරයි.",
      ta: "Fallback voice playback பயன்படுத்துகிறது.",
    },
  };

  const LANGUAGE_CONFIG = {
    en: {
      recognition: "en-GB",
      speech: "en-GB",
      welcome:
        "Hello. I'm Zyverion AI. Tell me about your business or project, and I’ll help you figure out the right website or system direction.",
      languageSelected:
        "English selected. We can continue in English now.",
      languageSwitched:
        "Language switched to English. We can continue in English now.",
      orbHintIdle: "Tap the AI core",
      orbHintListening: "Tap again to stop",
      orbHintSpeaking: "Tap to stop voice",
      overlaySpeaking: "Speaking...",
      preferredVoice: "marin",
    },
    si: {
      recognition: "si-LK",
      speech: "si-LK",
      welcome:
        "ආයුබෝවන්. මම Zyverion AI. ඔයාගේ business එක හෝ project idea එක ගැන කියන්න. ඒකට fit වෙන website හෝ system direction එක මම help කරන්නම්.",
      languageSelected:
        "සිංහල තෝරාගෙන තියෙනවා. දැන් අපි සිංහලෙන් ඉදිරියට යමු.",
      languageSwitched:
        "සිංහල භාෂාවට මාරු වුණා. දැන් අපි සිංහලෙන් ඉදිරියට යමු.",
      orbHintIdle: "AI core එක තට්ටු කරන්න",
      orbHintListening: "නවත්වන්න ආයෙත් තට්ටු කරන්න",
      orbHintSpeaking: "හඬ නවත්වන්න තට්ටු කරන්න",
      overlaySpeaking: "කතා කරමින් සිටියි...",
      preferredVoice: "marin",
    },
    ta: {
      recognition: "ta-IN",
      speech: "ta-IN",
      welcome:
        "வணக்கம். நான் Zyverion AI. உங்கள் business அல்லது project idea பற்றி சொல்லுங்கள். அதற்கு பொருத்தமான website அல்லது system direction ஐ நான் help செய்கிறேன்.",
      languageSelected:
        "தமிழ் தேர்வு செய்யப்பட்டுள்ளது. இப்போது தமிழில் தொடரலாம்.",
      languageSwitched:
        "தமிழ் மொழிக்கு மாற்றப்பட்டது. இப்போது தமிழில் தொடரலாம்.",
      orbHintIdle: "AI core ஐ தட்டவும்",
      orbHintListening: "நிறுத்த மீண்டும் தட்டவும்",
      orbHintSpeaking: "குரலை நிறுத்த தட்டவும்",
      overlaySpeaking: "பேசுகிறது...",
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

  let isDragging = false;
  let moved = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let startLeft = 0;
  let startTop = 0;
  let currentLeft = 0;
  let currentTop = 0;
  let rafId = null;

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

  function loadSessionState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.sessionState);
      if (!raw) return createEmptySessionState();

      const parsed = JSON.parse(raw);
      return normalizeSessionState(parsed);
    } catch (error) {
      return createEmptySessionState();
    }
  }

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
      answerMode: "",
      history: [],
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
      answerMode:
        typeof value.answerMode === "string" ? value.answerMode.trim() : "",
      history: Array.isArray(value.history)
        ? value.history
            .filter(
              (item) =>
                item &&
                typeof item === "object" &&
                typeof item.role === "string" &&
                typeof item.text === "string"
            )
            .slice(-10)
        : [],
    };
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

  const isMobile = () => window.innerWidth <= 768;
  const getMargin = () => (isMobile() ? 14 : 22);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function uniqueArray(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
  }

  function safeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function getPanel() {
    return qs(SELECTORS.panel);
  }

  function getPanelShell() {
    return qs(SELECTORS.panelShell);
  }

  function getPanelClose() {
    return qs(SELECTORS.panelClose);
  }

  function getPanelBackdrop() {
    return qs(SELECTORS.panelBackdrop);
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

  function getHeaderIntro() {
    return qs(SELECTORS.headerIntro);
  }

  function getStatus() {
    return qs(SELECTORS.status);
  }

  function getTranscript() {
    return qs(SELECTORS.transcript);
  }

  function getMessages() {
    return qs(SELECTORS.messages);
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

  function getContextSummary() {
    return qs(SELECTORS.contextSummary);
  }

  function getRecommendationRail() {
    return qs(SELECTORS.recommendationRail);
  }

  function getFollowUpRail() {
    return qs(SELECTORS.followUpRail);
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

  function getVoiceOverlayTitle() {
    return voiceOverlay ? voiceOverlay.querySelector("strong") : null;
  }

  function getVoiceOverlaySubtitle() {
    return voiceOverlay ? voiceOverlay.querySelector("span") : null;
  }

  function getSavedLanguage() {
    const value = localStorage.getItem(STORAGE_KEYS.language);
    return value === "si" || value === "en" || value === "ta" ? value : "";
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

  function setHeaderIntro(text) {
    const intro = getHeaderIntro();
    if (!intro) return;
    intro.textContent = text;
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

  function appendMessage(role, text, replaceAll) {
    const messages = getMessages();
    if (!messages || !text) return;

    if (replaceAll) {
      messages.innerHTML = "";
    }

    const row = document.createElement("div");
    row.className = "zyverion-ai-message " + role;

    const bubble = document.createElement("div");
    bubble.className = "zyverion-ai-message-bubble";
    bubble.textContent = text;

    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function pushHistory(role, text) {
    if (!text) return;
    sessionState.history.push({
      role: role,
      text: text,
      ts: Date.now(),
    });
    sessionState.history = sessionState.history.slice(-10);
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

  function setVoiceOverlayCopy(language) {
    const title = getVoiceOverlayTitle();
    const subtitle = getVoiceOverlaySubtitle();
    const pack = getLanguagePack(language);

    if (title) {
      title.textContent = "ZYVERION AI";
    }

    if (subtitle) {
      subtitle.textContent = pack.overlaySpeaking;
    }
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

  function getSavedPreferredVoice() {
    return localStorage.getItem(STORAGE_KEYS.preferredVoice) || "";
  }

  function getPreferredVoice(language) {
    const saved = getSavedPreferredVoice();
    if (saved) return saved;
    return getLanguagePack(language).preferredVoice || "marin";
  }

  function updateMuteButton() {
    const muteBtn = getMuteBtn();
    if (!muteBtn) return;
    muteBtn.textContent = isMuted ? "Unmute" : "Mute";
    muteBtn.classList.toggle("is-active", isMuted);
    muteBtn.setAttribute("aria-pressed", isMuted ? "true" : "false");
  }

  function updateReplayButton() {
    const replayBtn = getReplayBtn();
    if (!replayBtn) return;
    const enabled = !!(lastSpokenText && lastSpokenLanguage);
    replayBtn.disabled = !enabled;
    replayBtn.classList.toggle("is-disabled", !enabled);
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
    setOrbTexts(stateKey, language || getSavedLanguage() || "en");
  }

  function setContextSummary(text) {
    const summary = getContextSummary();
    if (!summary) return;

    if (!text) {
      summary.hidden = true;
      summary.textContent = "";
      return;
    }

    summary.hidden = false;
    summary.textContent = text;
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
      const messages = getMessages();
      if (!messages) return;

      const text =
        solution.name && solution.purpose
          ? solution.name + " — " + solution.purpose
          : solution.name || "";
      if (!text) return;

      appendMessage("assistant", text, false);
      messages.scrollTop = messages.scrollHeight;
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
    label.textContent = "Helpful Follow-ups";

    const list = document.createElement("div");
    list.className = "zyverion-ai-followup-list";

    questions.slice(0, 2).forEach(function (question) {
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

  function updateSuggestedAction(source) {
    clearSuggestedActionState();

    if (!source || source === "none") return;

    let target = null;

    if (source === "estimator" || source === "pricing") {
      target = getEstimatorLink();
    } else if (source === "contact" || source === "start" || source === "consultation") {
      target = getContactLink();
    } else if (source === "work") {
      target = getWorkLink();
    }

    if (target) {
      target.classList.add("is-suggested");
    }
  }

  function applySuggestedAction(action) {
    if (!action || typeof action !== "object") {
      clearSuggestedActionState();
      return;
    }

    updateSuggestedAction(action.type);
  }

  function normalizeSuggestedAction(action) {
    if (!action || typeof action !== "object") {
      return {
        type: "none",
        label: "",
        href: "",
      };
    }

    const type =
      typeof action.type === "string" ? action.type.trim() : "none";

    if (type === "estimator") {
      return {
        type: "estimator",
        label: action.label || "Open Estimator",
        href: action.href || "estimator.html",
      };
    }

    if (type === "contact") {
      return {
        type: "contact",
        label: action.label || "Contact Zyverion",
        href: action.href || "contact.html",
      };
    }

    if (type === "work") {
      return {
        type: "work",
        label: action.label || "View Our Work",
        href: action.href || "projects.html",
      };
    }

    return {
      type: "none",
      label: "",
      href: "",
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

  function buildSessionContextPayload() {
    return {
      businessSummary: sessionState.businessSummary,
      userGoal: sessionState.userGoal,
      knownBusinessTypeId: sessionState.knownBusinessTypeId,
      knownStage: sessionState.knownStage,
      notes: sessionState.notes,
    };
  }

  function learnFromUserMessage(text) {
    const value = normalizeText(text);
    if (!value) return;

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
        sessionState.businessSummary = text.trim();
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
        sessionState.userGoal = text.trim();
      }
    }

    if (value.length < 240) {
      sessionState.notes = uniqueArray(
        [sessionState.notes, text.trim()].filter(Boolean)
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
    updateReplayButton();
    updateMuteButton();
    updateOrbState(getSavedLanguage() || "en");
  }

  function clearSmartUi() {
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
      }, 6000);
    }, 1800);
  }

  function setSavedLanguage(language) {
    if (!language) return;

    localStorage.setItem(STORAGE_KEYS.language, language);
    syncLanguageUi(language);
    showLanguagePicker(false);
    setHeaderIntro(getStatusText("idle", language));
    setStatus("idle", language);
    updateOrbState(language);
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
        return (
          voice.lang &&
          voice.lang.toLowerCase().indexOf(targets[i]) === 0
        );
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
          audio.onpause = null;

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

        audio.onpause = function () {
          if (audio.ended) return;
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

  function hideLegacyControls() {
    const legacyControls = qs(SELECTORS.legacyControls);
    const startBtn = qs(SELECTORS.legacyStartBtn);
    const stopBtn = qs(SELECTORS.legacyStopBtn);

    if (legacyControls) legacyControls.style.display = "none";
    if (startBtn) startBtn.style.display = "none";
    if (stopBtn) stopBtn.style.display = "none";
  }

  function getLanguageSwitchMessage(language) {
    return getLanguagePack(language).languageSwitched;
  }

  async function handleGreeting(language, replaceConversation) {
    const pack = getLanguagePack(language);

    if (hasWelcomedThisOpen) {
      const switchMessage = getLanguageSwitchMessage(language);
      appendMessage("assistant", switchMessage, false);
      pushHistory("assistant", switchMessage);
      await speakText(switchMessage, language);
      return;
    }

    appendMessage("assistant", pack.welcome, replaceConversation);
    pushHistory("assistant", pack.welcome);
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
      }, 5000);
    }, 2000);
  }

  function openFallbackWelcome() {
    if (!welcomeOverlay) return;

    welcomeOverlay.style.display = "flex";
    welcomeOverlay.classList.remove("is-closing");

    requestAnimationFrame(function () {
      welcomeOverlay.classList.add("show");
      welcomeOverlay.setAttribute("aria-hidden", "false");
    });
  }

  async function openAssistantPanel() {
    const panel = getPanel();
    const backdrop = getPanelBackdrop();

    if (!panel) {
      openFallbackWelcome();
      return;
    }

    panel.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("zyverion-ai-open");
    launcher.classList.add("is-active");
    hideWorkPopup();

    isPanelOpen = true;
    hasWelcomedThisOpen = false;
    isProcessing = false;
    clearPendingNavigationTimer();
    resetListeningUi();
    setTranscript("");
    clearSuggestedActionState();
    hideLegacyControls();

    const savedLanguage = getSavedLanguage();
    syncLanguageUi(savedLanguage);
    showLanguagePicker(!savedLanguage);
    refreshSmartUiFromSession();

    if (savedLanguage) {
      setHeaderIntro(getStatusText("idle", savedLanguage));
      setStatus("idle", savedLanguage);
      updateOrbState(savedLanguage);

      setTimeout(function () {
        handleGreeting(savedLanguage, true);
      }, 180);
    } else {
      setStatus("chooseLanguage");
      updateOrbState("en");
    }
  }

  function closeAssistantPanel() {
    const panel = getPanel();
    const backdrop = getPanelBackdrop();

    if (!panel) return;

    clearPendingNavigationTimer();
    stopRecognition(true);
    stopSpeech();

    panel.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("zyverion-ai-open");
    launcher.classList.remove("is-active");
    launcher.classList.remove("is-listening");

    isPanelOpen = false;
    hasWelcomedThisOpen = false;
    isProcessing = false;
    currentTranscriptText = "";

    setTranscript("");
    setStatus("idle");
    updateOrbState(getSavedLanguage() || "en");
  }

  function toggleAssistantPanel() {
    if (isPanelOpen) {
      closeAssistantPanel();
    } else {
      openAssistantPanel();
    }
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
            .slice(0, 2)
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
            ? "දැනට smart reply service එක fallback mode එකෙන් යනවා. තව ටිකක් specific විදිහට business එක ගැන කියන්න."
            : language === "ta"
            ? "இப்போது smart reply service fallback mode இல் உள்ளது. உங்கள் business பற்றி இன்னும் கொஞ்சம் specific ஆக சொல்லுங்கள்."
            : "The smart reply service is currently in fallback mode. Tell me a little more specifically about your business.",
        spokenReply:
          language === "si"
            ? "දැනට fallback mode එකෙන් යනවා. ඔයාගේ business එක ගැන තව ටිකක් specific විදිහට කියන්න."
            : language === "ta"
            ? "இப்போது fallback mode இல் உள்ளது. உங்கள் business பற்றி இன்னும் கொஞ்சம் specific ஆக சொல்லுங்கள்."
            : "I am in fallback mode right now. Tell me a little more specifically about your business.",
        answerMode: "support",
        followUpQuestions:
          language === "si"
            ? [
                "මේක කුමන business type එකකටද?",
                "ඔයාට website එකක්ද, system එකක්ද, නැත්නම් දෙකමද ඕනේ?",
              ]
            : language === "ta"
            ? [
                "இது எந்த business type க்காக?",
                "உங்களுக்கு website வேண்டுமா, system வேண்டுமா, அல்லது இரண்டுமா?",
              ]
            : [
                "What type of business is this for?",
                "Do you need a website, a system, or both?",
              ],
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

    appendMessage("user", cleanText, false);
    pushHistory("user", cleanText);

    isProcessing = true;
    setStatus("thinking", language);
    updateOrbState(language);

    try {
      const result = await fetchAiReply(cleanText, language);

      applyAiResultToUi(result);

      if (result.textReply) {
        appendMessage("assistant", result.textReply, false);
        pushHistory("assistant", result.textReply);
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
    };

    recognition.onresult = function (event) {
      let combined = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        combined += event.results[i][0].transcript + " ";
      }

      currentTranscriptText = combined.trim();
      setTranscript(currentTranscriptText);
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
    };

    try {
      recognition.start();
    } catch (error) {
      resetListeningUi();
      setStatus("unsupported", language);
      recognition = null;
      updateOrbState(language);
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
        ? "හරි. දැන් Estimator එකට යමු."
        : language === "ta"
        ? "சரி. இப்போது Estimator க்கு போகலாம்."
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

    appendMessage("assistant", message, false);
    pushHistory("assistant", message);

    await speakText(message, language);

    pendingNavigationTimer = window.setTimeout(function () {
      pendingNavigationTimer = null;
      window.location.href = href;
    }, isMuted ? 160 : 420);
  }
  function bindPanelControls() {
    const panelClose = getPanelClose();
    const panelBackdrop = getPanelBackdrop();
    const languageSelect = getLanguageSelect();
    const muteBtn = getMuteBtn();
    const replayBtn = getReplayBtn();
    const orbButton = getOrbButton();

    const estimatorLink = getEstimatorLink();
    const contactLink = getContactLink();
    const workLink = getWorkLink();

    if (panelClose) {
      panelClose.addEventListener("click", closeAssistantPanel);
    }

    if (panelBackdrop) {
      panelBackdrop.addEventListener("click", closeAssistantPanel);
    }

    if (languageSelect) {
      languageSelect.addEventListener("change", function (event) {
        const language = event.target.value;
        if (!language) return;

        setSavedLanguage(language);
        Promise.resolve(handleGreeting(language, false)).catch(function () {});
      });
    }

    document.addEventListener("click", function (event) {
      const option = event.target.closest(SELECTORS.languageOption);
      if (!option) return;

      const language = option.getAttribute("data-ai-language");
      if (!language) return;

      setSavedLanguage(language);
      Promise.resolve(handleGreeting(language, true)).catch(function () {});
    });

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

    if (orbButton) {
      orbButton.addEventListener("click", function () {
        handleOrbTap();
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

  function renderPosition() {
    const margin = getMargin();
    const maxLeft = Math.max(
      margin,
      window.innerWidth - launcher.offsetWidth - margin
    );
    const maxTop = Math.max(
      margin,
      window.innerHeight - launcher.offsetHeight - margin
    );

    currentLeft = clamp(currentLeft, margin, maxLeft);
    currentTop = clamp(currentTop, margin, maxTop);

    launcher.style.transform =
      "translate3d(" + currentLeft + "px, " + currentTop + "px, 0)";
    rafId = null;
  }

  function queueRender() {
    if (!rafId) {
      rafId = requestAnimationFrame(renderPosition);
    }
  }

  function setDefaultPosition() {
    const margin = getMargin();
    currentLeft = window.innerWidth - launcher.offsetWidth - margin;
    currentTop = window.innerHeight - launcher.offsetHeight - margin;
    queueRender();
  }

  function startDrag(clientX, clientY) {
    isDragging = true;
    moved = false;
    pointerStartX = clientX;
    pointerStartY = clientY;
    startLeft = currentLeft;
    startTop = currentTop;
    launcher.classList.add("dragging");
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;

    const dx = clientX - pointerStartX;
    const dy = clientY - pointerStartY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      moved = true;
    }

    currentLeft = startLeft + dx;
    currentTop = startTop + dy;
    queueRender();
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    launcher.classList.remove("dragging");
  }

  function bindLauncher() {
    window.addEventListener("load", function () {
      hideLegacyControls();
      setDefaultPosition();
      showHintOncePerSession();
      ensureWorkPopupExists();
      showWorkPopupIfNeeded();

      const savedLanguage = getSavedLanguage() || "en";
      syncLanguageUi(getSavedLanguage());
      setHeaderIntro(getStatusText("idle", savedLanguage));
      setStatus(getSavedLanguage() ? "idle" : "chooseLanguage", savedLanguage);

      updateMuteButton();
      updateReplayButton();
      refreshSmartUiFromSession();
      updateOrbState(savedLanguage);

      const actionDock = getActionDock();
      const utilityDock = getUtilityDock();
      const panelShell = getPanelShell();

      if (actionDock) actionDock.classList.add("is-smart-dock");
      if (utilityDock) utilityDock.classList.add("is-smart-utility");
      if (panelShell) panelShell.classList.add("is-orb-upgraded");
    });

    if (synth) {
      synth.onvoiceschanged = function () {
        try {
          synth.getVoices();
        } catch (error) {}
      };
    }

    window.addEventListener("resize", setDefaultPosition);

    launcher.addEventListener("mousedown", function (event) {
      startDrag(event.clientX, event.clientY);
    });

    window.addEventListener("mousemove", function (event) {
      moveDrag(event.clientX, event.clientY);
    });

    window.addEventListener("mouseup", endDrag);

    launcher.addEventListener(
      "touchstart",
      function (event) {
        const touch = event.touches[0];
        startDrag(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      function (event) {
        if (!isDragging) return;
        const touch = event.touches[0];
        moveDrag(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    window.addEventListener("touchend", endDrag);

    launcher.addEventListener("click", function (event) {
      if (moved) {
        event.preventDefault();
        moved = false;
        return;
      }

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
        refreshSmartUiFromSession();
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
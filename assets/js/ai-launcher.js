(function () {
  const launcher = document.getElementById("aiLauncher");
  const welcomeOverlay = document.getElementById("aiWelcomeOverlay");
  const voiceOverlay = document.getElementById("aiVoiceOverlay");

  if (!launcher) return;

  const STORAGE_KEYS = {
    language: "zyverion-ai-language",
    hintShown: "zyverion-ai-hint-shown-v1",
    workPopupShown: "zyverion-work-popup-shown-v1",
    preferredVoice: "zyverion-ai-voice",
  };

  const SELECTORS = {
    panel: "#zyverionAiPanel",
    panelClose: "#zyverionAiPanelClose",
    panelBackdrop: "#zyverionAiPanelBackdrop",
    hint: "#zyverionAiHint",
    languageOption: "[data-ai-language]",
    languageSelect: "#zyverionAiLanguageSelect",
    languagePicker: "#zyverionAiLanguagePicker",
    status: "#zyverionAiStatus",
    transcript: "#zyverionAiTranscript",
    messages: "#zyverionAiMessages",
    startBtn: "#zyverionAiStartBtn",
    stopBtn: "#zyverionAiStopBtn",
    muteBtn: "#zyverionAiMuteBtn",
    replayBtn: "#zyverionAiReplayBtn",
  };

  const STATUS_TEXT = {
    idle: {
      si: "මයික් බොත්තම තට්ටු කරලා සේවා, මිල ගණන්, නැත්නම් ඔයාගේ ප්‍රොජෙක්ට් එක ගැන අහන්න.",
      en: "Tap the mic and ask about Zyverion services, pricing, or your project.",
      ta: "மைக்கை தட்டி எங்கள் சேவைகள், விலை, அல்லது உங்கள் திட்டம் பற்றி கேளுங்கள்.",
    },
    chooseLanguage: {
      si: "ආරම්භ කරන්න භාෂාවක් තෝරන්න.",
      en: "Choose a language to begin.",
      ta: "தொடங்க ஒரு மொழியைத் தேர்ந்தெடுக்கவும்.",
    },
    listening: {
      si: "සවන් දෙමින් සිටියි...",
      en: "Listening...",
      ta: "கேட்டு கொண்டிருக்கிறது...",
    },
    thinking: {
      si: "සිතමින් සිටියි...",
      en: "Thinking...",
      ta: "யோசித்து கொண்டிருக்கிறது...",
    },
    speaking: {
      si: "Zyverion AI කතා කරමින් සිටියි.",
      en: "Zyverion AI is speaking.",
      ta: "Zyverion AI பேசுகிறது.",
    },
    muted: {
      si: "හඬ නිශ්ශබ්ද කරලා තියෙන්නේ.",
      en: "Voice is muted.",
      ta: "குரல் மௌனமாக்கப்பட்டுள்ளது.",
    },
    unsupported: {
      si: "මෙම බ්‍රව්සරයේ හඬ හඳුනාගැනීම සඳහා සහාය නැහැ.",
      en: "Voice recognition is not supported on this browser.",
      ta: "இந்த உலாவியில் குரல் அடையாளம் ஆதரிக்கப்படவில்லை.",
    },
    notHeard: {
      si: "පැහැදිලිව අහන්න ලැබුණේ නැහැ. ආයෙත් උත්සාහ කරන්න.",
      en: "I couldn't hear that clearly. Please try again.",
      ta: "தெளிவாக கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.",
    },
    micBlocked: {
      si: "මෙම බ්‍රව්සරයේ මයික් ප්‍රවේශය අවහිර කරලා තියෙන්නේ.",
      en: "Microphone access is blocked on this browser.",
      ta: "இந்த உலாவியில் மைக்ரோஃபோன் அணுகல் தடுக்கப்பட்டுள்ளது.",
    },
    ttsFallback: {
      si: "මේ උපාංගයේ හඬ ප්ලේබැක් සීමිත වෙන්න පුළුවන්.",
      en: "Voice playback is limited on this device.",
      ta: "இந்த சாதனத்தில் குரல் ஒலிபரப்பு வரம்பாக இருக்கலாம்.",
    },
    backendVoice: {
      si: "හඬ සකස් කරමින් සිටියි...",
      en: "Preparing voice...",
      ta: "குரல் தயாராகிறது...",
    },
  };

  const LANGUAGE_CONFIG = {
    si: {
      recognition: "si-LK",
      speech: "si-LK",
      welcome:
        "ආයුබෝවන්. මම Zyverion AI. අපගේ සේවා, වෙබ් අඩවි විසඳුම්, මිල ගණන් ගැන මාර්ගදර්ශනය, සහ ඔබගේ ප්‍රොජෙක්ට් එක ගැන අහන්න පුළුවන්.",
      languageSelected:
        "සිංහල තෝරාගෙන තියෙනවා. දැන් අපි සිංහලෙන් ඉදිරියට යමු.",
      languageSwitched:
        "සිංහල භාෂාවට මාරු වුණා. දැන් අපි සිංහලෙන් ඉදිරියට යමු.",
      pricing:
        "නිවැරදි මිල ගණන් බලන්න එස්ටිමේටර් පිටුව භාවිතා කරන්න. ඔයාගේ ප්‍රොජෙක්ට් එකට ගැලපෙන මාර්ගදර්ශනය එතැනින් ලැබෙනවා.",
      services:
        "Zyverion විසින් ව්‍යාපාරික වෙබ් අඩවි, මෘදුකාංග පද්ධති, ස්වයංක්‍රීය ක්‍රියාප්‍රවාහ, සහ ව්‍යාපාර ක්‍රියාකාරිත්වයට උපකාරී ඩිජිටල් විසඳුම් නිර්මාණය කරනවා.",
      contact:
        "ප්‍රොජෙක්ට් එකක් ආරම්භ කරන්න සම්බන්ධතා පිටුව භාවිතා කරන්න. WhatsApp, විද්‍යුත් තැපැල්, සහ inquiry ක්‍රමය available.",
      work:
        "අපි කරපු වැඩ සහ ප්‍රධාන ප්‍රොජෙක්ට් බලන්න වැඩ පිටුව විවෘත කරන්න.",
      start:
        "ප්‍රොජෙක්ට් එකක් ආරම්භ කරන්න සම්බන්ධතා පිටුව හෝ එස්ටිමේටර් පිටුව භාවිතා කරන්න. වැඩේ ආරම්භ වෙන්නේ scope clarification සහ agreement process එකෙන්.",
      verification:
        "නිල කණ්ඩායම් සාමාජිකයෙක් verify කරන්න verification page එක භාවිතා කරන්න.",
      support:
        "Zyverion කියන්නේ වෙබ් අඩවි, මෘදුකාංග පද්ධති, ස්වයංක්‍රීය ක්‍රියාප්‍රවාහ, සහ ව්‍යාපාරික ඩිජිටල් සහාය සඳහා focused digital agency එකක්.",
      refusal:
        "මම Zyverion AI. මට උදව් කරන්න පුළුවන් Zyverion සේවා, වෙබ් අඩවි විසඳුම්, ප්‍රොජෙක්ට් මාර්ගදර්ශනය, සහ මිල ගණන් ගැන විතරයි.",
      navPricing: "හරි. දැන් එස්ටිමේටර් පිටුවට යමු.",
      navContact: "හරි. දැන් සම්බන්ධතා පිටුවට යමු.",
      navWork: "හරි. දැන් වැඩ පිටුවට යමු.",
      navDefault: "හරි. ඉදිරියට යමු.",
      overlaySpeaking: "කතා කරමින් සිටියි...",
      backendVoiceName: "marin",
    },
    en: {
      recognition: "en-GB",
      speech: "en-GB",
      welcome:
        "Hello. I'm Zyverion AI. You can ask me about our services, website solutions, pricing guidance, and your project.",
      languageSelected:
        "English selected. We can continue in English now.",
      languageSwitched:
        "Language switched to English. We can continue in English now.",
      pricing:
        "For accurate pricing, please use the Estimator page. That will give the best direction for your project.",
      services:
        "Zyverion builds business websites, software systems, automation workflows, and digital solutions for business operations.",
      contact:
        "To start a project, please use the Contact page. WhatsApp, email, and the inquiry flow are available.",
      work:
        "To see completed work and flagship projects, please open the Work page.",
      start:
        "You can start through the Contact page or the Estimator page. Serious projects begin with scope clarification and agreement handling.",
      verification:
        "To verify an official team member, please use the verification page.",
      support:
        "Zyverion is a digital agency focused on websites, software systems, automation workflows, and business operation support.",
      refusal:
        "I'm Zyverion AI. I can help only with Zyverion services, website solutions, project guidance, and pricing direction.",
      navPricing: "Alright. Let's open the Estimator page.",
      navContact: "Alright. Let's open the Contact page.",
      navWork: "Alright. Let's open the Work page.",
      navDefault: "Alright. Let's continue.",
      overlaySpeaking: "Speaking...",
      backendVoiceName: "marin",
    },
    ta: {
      recognition: "ta-IN",
      speech: "ta-IN",
      welcome:
        "வணக்கம். நான் Zyverion AI. எங்கள் சேவைகள், இணையதள தீர்வுகள், விலை வழிகாட்டல், மற்றும் உங்கள் திட்டம் பற்றி கேட்கலாம்.",
      languageSelected:
        "தமிழ் தேர்வு செய்யப்பட்டுள்ளது. இனிமேல் நாம் தமிழில் தொடரலாம்.",
      languageSwitched:
        "தமிழ் மொழிக்கு மாற்றப்பட்டது. இனிமேல் நாம் தமிழில் தொடரலாம்.",
      pricing:
        "சரியான விலை தெரிந்துகொள்ள எஸ்டிமேட்டர் பக்கத்தை பயன்படுத்துங்கள். அது உங்கள் திட்டத்துக்கு சரியான வழிகாட்டலை தரும்.",
      services:
        "Zyverion வணிக இணையதளங்கள், மென்பொருள் அமைப்புகள், தானியக்க செயல்முறைகள், மற்றும் வணிக செயற்பாடுகளுக்கான டிஜிட்டல் தீர்வுகளை உருவாக்குகிறது.",
      contact:
        "ஒரு திட்டத்தை ஆரம்பிக்க Contact page பயன்படுத்துங்கள். WhatsApp, email, மற்றும் inquiry வசதி available.",
      work:
        "முடிக்கப்பட்ட வேலைகள் மற்றும் முக்கியமான projects பார்க்க Work page திறக்கவும்.",
      start:
        "ஒரு திட்டத்தை ஆரம்பிக்க Contact page அல்லது Estimator page பயன்படுத்தலாம். வேலை scope clarification மற்றும் agreement process மூலம் தொடங்கும்.",
      verification:
        "அதிகாரப்பூர்வ குழு உறுப்பினரை verify செய்ய verification page பயன்படுத்தவும்.",
      support:
        "Zyverion என்பது இணையதளங்கள், மென்பொருள் அமைப்புகள், தானியக்க செயல்முறைகள், மற்றும் வணிக செயற்பாடுகளுக்கான digital agency ஆகும்.",
      refusal:
        "நான் Zyverion AI. Zyverion சேவைகள், இணையதள தீர்வுகள், திட்ட வழிகாட்டல், மற்றும் விலை தொடர்பான விஷயங்களில் மட்டுமே உதவ முடியும்.",
      navPricing: "சரி. இப்போது எஸ்டிமேட்டர் பக்கத்துக்கு போவோம்.",
      navContact: "சரி. இப்போது Contact page க்கு போவோம்.",
      navWork: "சரி. இப்போது Work page க்கு போவோம்.",
      navDefault: "சரி. தொடர்ந்து போகலாம்.",
      overlaySpeaking: "பேசுகிறது...",
      backendVoiceName: "marin",
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

  const isMobile = () => window.innerWidth <= 768;
  const getMargin = () => (isMobile() ? 14 : 22);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function getPanel() {
    return qs(SELECTORS.panel);
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

  function getStatus() {
    return qs(SELECTORS.status);
  }

  function getTranscript() {
    return qs(SELECTORS.transcript);
  }

  function getMessages() {
    return qs(SELECTORS.messages);
  }

  function getStartBtn() {
    return qs(SELECTORS.startBtn);
  }

  function getStopBtn() {
    return qs(SELECTORS.stopBtn);
  }

  function getMuteBtn() {
    return qs(SELECTORS.muteBtn);
  }

  function getReplayBtn() {
    return qs(SELECTORS.replayBtn);
  }

  function getEstimatorLink() {
    return document.getElementById("zyverionAiEstimatorLink");
  }

  function getContactLink() {
    return document.getElementById("zyverionAiContactLink");
  }

  function getWorkLink() {
    return document.getElementById("zyverionAiWorkLink");
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

  function getSavedPreferredVoice() {
    return localStorage.getItem(STORAGE_KEYS.preferredVoice) || "";
  }

  function getPreferredVoice(language) {
    const saved = getSavedPreferredVoice();
    if (saved) return saved;

    const pack = getLanguagePack(language);
    return pack.backendVoiceName || "marin";
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

  function syncLanguageSelect(language) {
    const select = getLanguageSelect();
    if (select) select.value = language || "";
  }

  function syncLanguageButtons(language) {
    const buttons = document.querySelectorAll(SELECTORS.languageOption);
    buttons.forEach(function (button) {
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

  function clearSuggestedActionState() {
    const links = [getEstimatorLink(), getContactLink(), getWorkLink()];

    links.forEach(function (link) {
      if (!link) return;
      link.classList.remove("is-suggested");
    });
  }

  function updateSuggestedAction(source) {
    clearSuggestedActionState();

    let key = source;

    if (key === "estimator") key = "pricing";
    if (key === "none" || key === "general" || !key) return;

    let target = null;

    if (key === "pricing") {
      target = getEstimatorLink();
    } else if (key === "contact" || key === "start" || key === "verification") {
      target = getContactLink();
    } else if (key === "work") {
      target = getWorkLink();
    }

    if (target) {
      target.classList.add("is-suggested");
    }
  }

  function applySuggestedAction(suggestedAction, fallbackIntent) {
    if (
      suggestedAction &&
      typeof suggestedAction === "object" &&
      typeof suggestedAction.type === "string"
    ) {
      updateSuggestedAction(suggestedAction.type);
      return;
    }

    updateSuggestedAction(fallbackIntent);
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
        <p>Visit the Estimator to get a price for your project.</p>
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

  async function speakWithBackendTts(text, language) {
    if (!text || isMuted) return false;

    const controller = new AbortController();
    activeTtsController = controller;

    try {
      setStatus("backendVoice", language);

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
        };

        audio.onended = function () {
          cleanupActiveAudio();
          hideVoiceOverlay();
          launcher.classList.remove("is-speaking");
          isSpeaking = false;
          if (!isListening) setStatus("idle", language);
          finalize(true);
        };

        audio.onerror = function () {
          cleanupActiveAudio();
          hideVoiceOverlay();
          launcher.classList.remove("is-speaking");
          isSpeaking = false;
          if (!isListening) setStatus("ttsFallback", language);
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
      return false;
    }
  }

  function speakWithBrowserFallback(text, language) {
    if (!text) return;

    if (isMuted || !synth) {
      setStatus("muted", language);
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
    };

    utterance.onend = function () {
      hideVoiceOverlay();
      launcher.classList.remove("is-speaking");
      isSpeaking = false;
      if (!isListening) setStatus("idle", language);
    };

    utterance.onerror = function () {
      hideVoiceOverlay();
      launcher.classList.remove("is-speaking");
      isSpeaking = false;
      if (!isListening) setStatus("ttsFallback", language);
    };

    synth.speak(utterance);
  }

  async function speakText(text, language) {
    if (!text) return;

    lastSpokenText = text;
    lastSpokenLanguage = language;

    if (isMuted) {
      setStatus("muted", language);
      return;
    }

    stopSpeech();

    const backendWorked = await speakWithBackendTts(text, language);
    if (backendWorked) return;

    if (!synth) {
      setStatus("ttsFallback", language);
      return;
    }

    speakWithBrowserFallback(text, language);
  }

  function updateMuteButton() {
    const muteBtn = getMuteBtn();
    if (!muteBtn) return;
    muteBtn.textContent = isMuted ? "Unmute" : "Mute";
  }

  function updateStartButton() {
    const startBtn = getStartBtn();
    const stopBtn = getStopBtn();

    if (startBtn) {
      if (isProcessing) {
        startBtn.textContent = "Working...";
      } else if (isListening) {
        startBtn.textContent = "Listening...";
      } else {
        startBtn.textContent = "Start Listening";
      }

      startBtn.classList.toggle("is-live", isListening);
      startBtn.classList.toggle("is-busy", isProcessing);
      startBtn.disabled = isProcessing;
    }

    if (stopBtn) {
      stopBtn.disabled = isProcessing && !isListening;
    }
  }

  function resetListeningUi() {
    isListening = false;
    launcher.classList.remove("is-listening");
    updateStartButton();
  }

  function setSavedLanguage(language) {
    if (!language) return;

    stopSpeech();

    if (isListening) {
      stopRecognition(true);
    }

    currentTranscriptText = "";
    setTranscript("");

    localStorage.setItem(STORAGE_KEYS.language, language);
    syncLanguageUi(language);
    showLanguagePicker(false);

    if (isPanelOpen) {
      setStatus("idle", language);
    }
  }

  function getLanguageSwitchMessage(language) {
    const pack = getLanguagePack(language);
    return pack.languageSwitched;
  }

  function handleGreeting(language, replaceConversation) {
    const pack = getLanguagePack(language);

    if (hasWelcomedThisOpen) {
      const switchMessage = getLanguageSwitchMessage(language);
      appendMessage("assistant", switchMessage, false);
      speakText(switchMessage, language);
      return;
    }

    appendMessage("assistant", pack.welcome, replaceConversation);
    speakText(pack.welcome, language);
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

  function openAssistantPanel() {
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
    updateStartButton();

    const savedLanguage = getSavedLanguage();
    syncLanguageUi(savedLanguage);
    showLanguagePicker(!savedLanguage);

    if (savedLanguage) {
      setStatus("idle", savedLanguage);
      setTimeout(function () {
        handleGreeting(savedLanguage, true);
      }, 180);
    } else {
      setStatus("chooseLanguage");
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

    clearSuggestedActionState();
    setTranscript("");
    setStatus("idle");
    updateStartButton();
  }

  function toggleAssistantPanel() {
    if (isPanelOpen) {
      closeAssistantPanel();
    } else {
      openAssistantPanel();
    }
  }

  function normalizeText(text) {
    return (text || "").toLowerCase().trim();
  }

  function includesAny(text, words) {
    return words.some(function (word) {
      return text.indexOf(word) !== -1;
    });
  }

  function detectIntent(text) {
    const value = normalizeText(text);

    const priceWords = [
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
      "වටිනාකම",
      "விலை",
      "காசு",
      "எஸ்டிமேட்",
      "கட்டணம்",
    ];

    const serviceWords = [
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
    ];

    const contactWords = [
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
      "வாட்ஸ்அப்",
    ];

    const workWords = [
      "work",
      "project",
      "projects",
      "portfolio",
      "example",
      "examples",
      "sample",
      "samples",
      "වැඩ",
      "ප්‍රොජෙක්ට්",
      "வேலை",
      "திட்டம்",
      "போர்ட்ஃபோலியோ",
    ];

    const startWords = [
      "start",
      "begin",
      "get started",
      "how do i start",
      "how to start",
      "kickoff",
      "start project",
      "පටන්",
      "ආරම්භ",
      "ஆரம்பிக்க",
      "தொடங்கு",
    ];

    const verifyWords = [
      "verify",
      "verification",
      "employee verification",
      "verify employee",
      "verify team",
      "verification page",
      "verify official",
      "verify member",
      "සත්‍යාපනය",
      "verify",
      "உறுதிப்படுத்து",
      "சரிபார்",
      "verification",
    ];

    const offTopicWords = [
      "weather",
      "movie",
      "movies",
      "song",
      "songs",
      "cricket score",
      "football",
      "politics",
      "president",
      "game",
      "games",
      "homework",
      "code bug",
      "medical",
      "doctor",
      "law",
      "news",
      "වර්ෂාව",
      "ගේම්",
      "දේශපාලන",
      "காலநிலை",
      "சினிமா",
      "அரசியல்",
      "விளையாட்டு",
    ];

    if (includesAny(value, offTopicWords)) return "offtopic";
    if (includesAny(value, verifyWords)) return "verification";
    if (includesAny(value, priceWords)) return "pricing";
    if (includesAny(value, contactWords)) return "contact";
    if (includesAny(value, workWords)) return "work";
    if (includesAny(value, startWords)) return "start";
    if (includesAny(value, serviceWords)) return "services";

    return "general";
  }

  function generateBusinessReply(text, language) {
    const intent = detectIntent(text);
    const pack = getLanguagePack(language);

    if (intent === "offtopic") return pack.refusal;
    if (intent === "verification") return pack.verification;
    if (intent === "pricing") return pack.pricing;
    if (intent === "contact") return pack.contact;
    if (intent === "work") return pack.work;
    if (intent === "start") return pack.start;
    if (intent === "services") return pack.services;

    return pack.support;
  }

  async function fetchAiReply(text, language) {
    const intent = detectIntent(text);

    if (intent === "offtopic") {
      const refusal = getLanguagePack(language).refusal;
      return {
        intent: intent,
        textReply: refusal,
        spokenReply: refusal,
        suggestedAction: { type: "none" },
      };
    }

    try {
      const response = await fetch("/api/zyverion-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = await response.json();
      const fallbackReply = generateBusinessReply(text, language);

      return {
        intent: intent,
        textReply:
          data && typeof data.textReply === "string" && data.textReply.trim()
            ? data.textReply.trim()
            : fallbackReply,
        spokenReply:
          data && typeof data.spokenReply === "string" && data.spokenReply.trim()
            ? data.spokenReply.trim()
            : data && typeof data.textReply === "string" && data.textReply.trim()
            ? data.textReply.trim()
            : fallbackReply,
        suggestedAction:
          data && typeof data === "object" ? data.suggestedAction || null : null,
      };
    } catch (error) {
      const fallbackReply = generateBusinessReply(text, language);

      return {
        intent: intent,
        textReply: fallbackReply,
        spokenReply: fallbackReply,
        suggestedAction: null,
      };
    }
  }

  async function processUserMessage(text) {
    const language = getSavedLanguage();
    const cleanText = (text || "").trim();

    if (!language || !cleanText || isProcessing) return;

    currentTranscriptText = "";
    setTranscript("");
    appendMessage("user", cleanText, false);

    isProcessing = true;
    updateStartButton();
    setStatus("thinking", language);
    clearSuggestedActionState();

    try {
      const result = await fetchAiReply(cleanText, language);

      applySuggestedAction(result.suggestedAction, result.intent);
      appendMessage("assistant", result.textReply, false);
      await speakText(result.spokenReply || result.textReply, language);
    } finally {
      isProcessing = false;
      updateStartButton();
      if (!isListening && !isSpeaking) {
        setStatus("idle", language);
      }
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
      updateStartButton();
      setStatus("listening", language);
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
      } else if (event.error === "no-speech") {
        setStatus("notHeard", language);
      } else {
        setStatus("notHeard", language);
      }

      recognition = null;
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
          if (!isListening && !isSpeaking) setStatus("idle", language);
        }, 1200);
      } else {
        setStatus("idle", language);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      resetListeningUi();
      setStatus("unsupported", language);
      recognition = null;
    }
  }
  function getActionMessage(actionType, language) {
    const pack = getLanguagePack(language);

    if (actionType === "pricing") return pack.navPricing;
    if (actionType === "contact") return pack.navContact;
    if (actionType === "work") return pack.navWork;

    return pack.navDefault;
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
    const replayBtn = getReplayBtn();
    const muteBtn = getMuteBtn();
    const startBtn = getStartBtn();
    const stopBtn = getStopBtn();
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
        handleGreeting(language, false);
      });
    }

    document.addEventListener("click", function (event) {
      const option = event.target.closest(SELECTORS.languageOption);
      if (!option) return;

      const language = option.getAttribute("data-ai-language");
      if (!language) return;

      setSavedLanguage(language);
      handleGreeting(language, true);
      setStatus("idle", language);
    });

    if (replayBtn) {
      replayBtn.addEventListener("click", async function () {
        if (lastSpokenText && lastSpokenLanguage) {
          await speakText(lastSpokenText, lastSpokenLanguage);
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener("click", function () {
        isMuted = !isMuted;
        updateMuteButton();

        if (isMuted) {
          const language = getSavedLanguage() || "en";
          stopSpeech();
          setStatus("muted", language);
        } else if (!isListening && !isSpeaking) {
          const language = getSavedLanguage() || "en";
          setStatus("idle", language);
        }
      });
    }

    if (startBtn) {
      startBtn.addEventListener("click", function () {
        startListening();
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener("click", function () {
        stopRecognition(false);
        stopSpeech();
        const language = getSavedLanguage() || "en";
        setTranscript("");
        setStatus("idle", language);
      });
    }

    if (estimatorLink) {
      estimatorLink.addEventListener("click", function (event) {
        if (shouldBypassLinkIntercept(event)) return;
        event.preventDefault();
        navigateWithAssistantFeedback(
          "pricing",
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
    if (!rafId) rafId = requestAnimationFrame(renderPosition);
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
      setDefaultPosition();
      showHintOncePerSession();
      ensureWorkPopupExists();
      showWorkPopupIfNeeded();
      updateMuteButton();
      updateStartButton();
    });

    if (synth) {
      synth.onvoiceschanged = function () {
        synth.getVoices();
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
      getLanguage: getSavedLanguage,
      setLanguage: setSavedLanguage,
      speak: speakText,
      stopSpeech: stopSpeech,
      startListening: startListening,
      stopListening: function () {
        stopRecognition(false);
      },
      isOpen: function () {
        return isPanelOpen;
      },
    };
  }

  bindPanelControls();
  bindLauncher();
  exposeApi();
})();
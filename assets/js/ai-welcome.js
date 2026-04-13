(function () {
  const SESSION_KEY = "zyverion_welcome_seen_v10";

  const overlay = document.getElementById("aiWelcomeOverlay");
  const closeBtn = document.getElementById("aiWelcomeClose");
  const audio = document.getElementById("zyverionWelcomeAudio");
  const voiceOverlay = document.getElementById("aiVoiceOverlay");

  if (!overlay || !closeBtn || !audio || !voiceOverlay) return;

  if (sessionStorage.getItem(SESSION_KEY) === "true") {
    overlay.style.display = "none";
    return;
  }

  function showWelcome() {
    requestAnimationFrame(() => {
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
    });
  }

  function showVoiceOverlay() {
    voiceOverlay.classList.add("show");
    voiceOverlay.setAttribute("aria-hidden", "false");
  }

  function hideVoiceOverlay() {
    voiceOverlay.classList.remove("show");
    voiceOverlay.setAttribute("aria-hidden", "true");
  }

  function playWelcomeAudio() {
    audio.currentTime = 0;
    showVoiceOverlay();

    audio.play().catch((error) => {
      console.log("Welcome audio play blocked:", error);
      hideVoiceOverlay();
    });
  }

  function closeWelcome() {
    sessionStorage.setItem(SESSION_KEY, "true");

    overlay.classList.add("is-closing");
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      overlay.style.display = "none";
      playWelcomeAudio();
    }, 480);
  }

  closeBtn.addEventListener("click", closeWelcome);

  audio.addEventListener("ended", hideVoiceOverlay);
  audio.addEventListener("pause", hideVoiceOverlay);
  audio.addEventListener("error", hideVoiceOverlay);

  window.addEventListener("load", function () {
    setTimeout(showWelcome, 280);
  });
})();
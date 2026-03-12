const launcher = document.getElementById("aiLauncher");
const overlay = document.getElementById("aiWelcomeOverlay");

if (launcher) {
  let isDragging = false;
  let moved = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let startLeft = 0;
  let startTop = 0;
  let currentLeft = 0;
  let currentTop = 0;
  let rafId = null;

  const isMobile = () => window.innerWidth <= 768;
  const getMargin = () => (isMobile() ? 14 : 22);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function renderPosition() {
    const margin = getMargin();
    const maxLeft = Math.max(margin, window.innerWidth - launcher.offsetWidth - margin);
    const maxTop = Math.max(margin, window.innerHeight - launcher.offsetHeight - margin);

    currentLeft = clamp(currentLeft, margin, maxLeft);
    currentTop = clamp(currentTop, margin, maxTop);

    launcher.style.transform = `translate3d(${currentLeft}px, ${currentTop}px, 0)`;
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

  function openEstimator() {
    if (overlay) {
      overlay.classList.add("active");
      setTimeout(() => {
        window.location.href = "estimator.html";
      }, 850);
    } else {
      window.location.href = "estimator.html";
    }
  }

  window.addEventListener("load", setDefaultPosition);
  window.addEventListener("resize", setDefaultPosition);

  launcher.addEventListener("mousedown", (e) => {
    startDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    moveDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", endDrag);

  launcher.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    },
    { passive: true }
  );

  window.addEventListener("touchend", endDrag);

  launcher.addEventListener("click", (e) => {
    if (moved) {
      e.preventDefault();
      moved = false;
      return;
    }
    openEstimator();
  });
}
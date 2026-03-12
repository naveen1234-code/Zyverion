const launcher = document.getElementById("aiLauncher");
const overlay = document.getElementById("aiWelcomeOverlay");

if (launcher) {
  let isDragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const setLauncherPosition = (left, top) => {
    const maxLeft = window.innerWidth - launcher.offsetWidth;
    const maxTop = window.innerHeight - launcher.offsetHeight;

    launcher.style.left = `${clamp(left, 0, maxLeft)}px`;
    launcher.style.top = `${clamp(top, 0, maxTop)}px`;
    launcher.style.right = "auto";
    launcher.style.bottom = "auto";
  };

  const startDrag = (clientX, clientY) => {
    const rect = launcher.getBoundingClientRect();
    isDragging = true;
    moved = false;
    startX = clientX;
    startY = clientY;
    originLeft = rect.left;
    originTop = rect.top;
    launcher.classList.add("dragging");
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging) return;

    const dx = clientX - startX;
    const dy = clientY - startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      moved = true;
    }

    setLauncherPosition(originLeft + dx, originTop + dy);
  };

  const endDrag = () => {
    isDragging = false;
    launcher.classList.remove("dragging");
  };

  const openEstimator = () => {
    if (!overlay) {
      window.location.href = "estimator.html";
      return;
    }

    overlay.classList.add("active");

    setTimeout(() => {
      window.location.href = "estimator.html";
    }, 1200);
  };

  launcher.addEventListener("mousedown", (e) => {
    startDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    moveDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", () => {
    endDrag();
  });

  launcher.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchend", () => {
    endDrag();
  });

  launcher.addEventListener("click", (e) => {
    if (moved) {
      e.preventDefault();
      moved = false;
      return;
    }

    openEstimator();
  });

  window.addEventListener("resize", () => {
    const rect = launcher.getBoundingClientRect();
    setLauncherPosition(rect.left, rect.top);
  });
}
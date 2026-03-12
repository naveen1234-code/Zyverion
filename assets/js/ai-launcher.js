const launcher = document.getElementById("aiLauncher");
const overlay = document.getElementById("aiWelcomeOverlay");

if (!launcher) return;

let isDragging = false;
let moved = false;

let startX = 0;
let startY = 0;

let currentX = 0;
let currentY = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function setPosition(x, y) {
  const maxX = window.innerWidth - launcher.offsetWidth;
  const maxY = window.innerHeight - launcher.offsetHeight;

  currentX = clamp(x, 0, maxX);
  currentY = clamp(y, 0, maxY);

  launcher.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
}

function startDrag(x, y) {
  isDragging = true;
  moved = false;

  startX = x - currentX;
  startY = y - currentY;

  launcher.classList.add("dragging");
}

function drag(x, y) {
  if (!isDragging) return;

  const newX = x - startX;
  const newY = y - startY;

  if (Math.abs(newX - currentX) > 3 || Math.abs(newY - currentY) > 3) {
    moved = true;
  }

  requestAnimationFrame(() => {
    setPosition(newX, newY);
  });
}

function endDrag() {
  isDragging = false;
  launcher.classList.remove("dragging");
}

function openEstimator() {
  if (!overlay) {
    window.location.href = "estimator.html";
    return;
  }

  overlay.classList.add("active");

  setTimeout(() => {
    window.location.href = "estimator.html";
  }, 1200);
}

/* Mouse */
launcher.addEventListener("mousedown", e => {
  startDrag(e.clientX, e.clientY);
});

window.addEventListener("mousemove", e => {
  drag(e.clientX, e.clientY);
});

window.addEventListener("mouseup", endDrag);

/* Touch */
launcher.addEventListener("touchstart", e => {
  const t = e.touches[0];
  startDrag(t.clientX, t.clientY);
}, { passive: true });

window.addEventListener("touchmove", e => {
  const t = e.touches[0];
  drag(t.clientX, t.clientY);
}, { passive: true });

window.addEventListener("touchend", endDrag);

/* Click */
launcher.addEventListener("click", e => {
  if (moved) {
    moved = false;
    e.preventDefault();
    return;
  }

  openEstimator();
});

/* Resize fix */
window.addEventListener("resize", () => {
  setPosition(currentX, currentY);
});
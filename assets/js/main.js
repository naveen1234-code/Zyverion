// =========================
// ZYVERION MAIN JS
// Clean full version
// =========================

// Active nav
(function () {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach((a) => {
    if (a.getAttribute("href") === path) {
      a.classList.add("active");
    }
  });
})();

// Intro FX remove
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll("#introFX").forEach((el) => el.remove());
  }, 1200);
});

// Cursor glow - desktop only
(function () {
  const glow = document.getElementById("cursorGlow");
  const canUseGlow =
    glow &&
    window.matchMedia("(pointer: fine)").matches &&
    window.innerWidth > 900 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canUseGlow) {
    if (glow) glow.style.display = "none";
    return;
  }

  let rafId = null;
  let x = 0;
  let y = 0;

  function render() {
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
    rafId = null;
  }

  window.addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  });
})();

// Hero tilt - desktop only
(function () {
  const hero = document.querySelector(".hero-card");
  const canTilt =
    hero &&
    window.matchMedia("(pointer: fine)").matches &&
    window.innerWidth > 960 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canTilt) return;

  let rafId = null;
  let lastEvent = null;

  function render() {
    if (!lastEvent) {
      rafId = null;
      return;
    }

    const rect = hero.getBoundingClientRect();
    const x = lastEvent.clientX - rect.left;
    const y = lastEvent.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = (y - cy) / 30;
    const ry = (cx - x) / 30;

    hero.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    rafId = null;
  }

  hero.addEventListener("mousemove", (e) => {
    lastEvent = e;
    if (!rafId) rafId = requestAnimationFrame(render);
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
})();

// Reveal sections on scroll
(function () {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
})();

// Button ripple
(function () {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("pointerdown", function (e) {
      const circle = document.createElement("span");
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;
      const rect = this.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add("ripple");

      const oldRipple = this.getElementsByClassName("ripple")[0];
      if (oldRipple) oldRipple.remove();

      this.appendChild(circle);
    });
  });
})();

// Metric counters
(function () {
  const counters = document.querySelectorAll(".metric-number");
  if (!counters.length) return;

  function animateCounter(el) {
    const target = Number(el.dataset.counter || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      el.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }

  const seen = new WeakSet();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (seen.has(entry.target)) return;

        seen.add(entry.target);
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => observer.observe(counter));
})();


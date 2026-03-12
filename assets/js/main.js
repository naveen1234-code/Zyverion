// =========================
// ZYVERION FX - optimized
// =========================

// Active nav
(() => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();

// Intro remove faster
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll("#introFX").forEach((el) => el.remove());
  }, 1200);
});

// Cursor glow only on desktop / fine pointer
(() => {
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
  let targetX = 0;
  let targetY = 0;

  const render = () => {
    glow.style.left = `${targetX}px`;
    glow.style.top = `${targetY}px`;
    rafId = null;
  };

  window.addEventListener("pointermove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  });
})();

// Parallax tilt on hero card - desktop only
(() => {
  const hero = document.querySelector(".hero-card");
  const canTilt =
    hero &&
    window.matchMedia("(pointer: fine)").matches &&
    window.innerWidth > 960 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canTilt) return;

  let rafId = null;
  let lastEvent = null;

  const renderTilt = () => {
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
  };

  hero.addEventListener("mousemove", (e) => {
    lastEvent = e;
    if (!rafId) rafId = requestAnimationFrame(renderTilt);
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
})();

// Section reveal
(() => {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) ent.target.classList.add("visible");
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  sections.forEach((s) => obs.observe(s));
})();

// Button ripple effect
(() => {
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

      const old = this.getElementsByClassName("ripple")[0];
      if (old) old.remove();

      this.appendChild(circle);
    });
  });
})();

// Particle system - optimized
(() => {
  const canvas = document.getElementById("energyCanvas");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth <= 768;

  if (reduceMotion) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let animationId = null;
  let running = true;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.25);

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener("resize", resize);

  const baseCount = isMobile ? 32 : 58;
  const particles = Array.from({ length: baseCount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * (isMobile ? 0.18 : 0.24),
    vy: (Math.random() - 0.5) * (isMobile ? 0.18 : 0.24),
    r: Math.random() * 1.6 + 0.8,
  }));

  function loop() {
    if (!running) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,247,255,0.50)";
      ctx.fill();
    }

    const maxDist = isMobile ? 95 : 125;
    const maxDistSq = maxDist * maxDist;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < maxDistSq) {
          const t = 1 - d2 / maxDistSq;
          ctx.globalAlpha = 0.09 * t;
          ctx.strokeStyle = "rgba(183,0,255,1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    animationId = requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      running = true;
      loop();
    }
  });

  loop();
})();
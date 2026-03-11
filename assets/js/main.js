// Active nav
(() => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();

// Intro remove faster
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll("#introFX").forEach(el => el.remove());
  }, 1400);
});

// Cursor glow follow
(() => {
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;

  const move = (x, y) => {
    glow.style.left = x + "px";
    glow.style.top = y + "px";
  };

  window.addEventListener("pointermove", (e) => move(e.clientX, e.clientY));
  window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
})();

// Hero tilt
(() => {
  const hero = document.querySelector(".hero-card");
  if (!hero) return;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = (y - cy) / 28;
    const ry = (cx - x) / 28;

    hero.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
})();

// Section reveal
(() => {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) ent.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  sections.forEach(s => obs.observe(s));
})();

// Button ripple effect
(() => {
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const circle = document.createElement("span");
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius}px`;
      circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius}px`;
      circle.classList.add("ripple");

      const old = this.getElementsByClassName("ripple")[0];
      if (old) old.remove();
      this.appendChild(circle);
    });
  });
})();

// Animated counters
(() => {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = Number(el.dataset.counter || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);

      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const seen = new WeakSet();

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !seen.has(entry.target)) {
        seen.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => obs.observe(counter));
})();

// Sticky mobile CTA visibility
(() => {
  const sticky = document.querySelector(".mobile-sticky-cta");
  if (!sticky) return;

  const toggleSticky = () => {
    if (window.scrollY > 280) sticky.classList.add("show");
    else sticky.classList.remove("show");
  };

  toggleSticky();
  window.addEventListener("scroll", toggleSticky, { passive: true });
})();

// Particle system
(() => {
  const canvas = document.getElementById("energyCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const count = Math.min(130, Math.floor((window.innerWidth * window.innerHeight) / 15000));
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.32,
    vy: (Math.random() - 0.5) * 0.32,
    r: Math.random() * 2 + 0.6,
  }));

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,247,255,.52)";
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        const max = 140 * 140;

        if (d2 < max) {
          const t = 1 - d2 / max;
          ctx.globalAlpha = 0.11 * t;
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

    requestAnimationFrame(loop);
  }

  loop();
})();
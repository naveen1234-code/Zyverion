// =========================
// ZYVERION MAIN JS
// Lightweight + Hamburger Version
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Active nav
  // =========================
  (function () {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".menu a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }
    });
  })();

// Intro FX remove - safer version
window.addEventListener("load", () => {
  const intro = document.getElementById("introFX");
  if (!intro) return;

  setTimeout(() => {
    intro.style.pointerEvents = "none";
  }, 1200);

  setTimeout(() => {
    intro.remove();
  }, 1500);
});

  // =========================
  // Disable cursor glow completely on lighter version
  // =========================
  (function () {
    const glow = document.getElementById("cursorGlow");
    if (glow) {
      glow.remove();
    }
  })();

  // =========================
  // Remove hero tilt for smoother phones
  // =========================
  (function () {
    const hero = document.querySelector(".hero-card");
    if (hero) {
      hero.style.transform = "none";
    }
  })();

  // =========================
  // Lightweight reveal sections on scroll
  // =========================
  (function () {
    const sections = document.querySelectorAll(".section");
    if (!sections.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      sections.forEach((section) => section.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
  })();

  // =========================
  // Button ripple - desktop / touch-safe lighter version
  // =========================
  (function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "touch" && window.innerWidth < 768) return;

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

        setTimeout(() => {
          circle.remove();
        }, 500);
      });
    });
  })();

  // =========================
  // Metric counters
  // =========================
  (function () {
    const counters = document.querySelectorAll(".metric-number");
    if (!counters.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animateCounter(el) {
      const target = Number(el.dataset.counter || 0);
      const suffix = el.dataset.suffix || "";

      if (reduceMotion) {
        el.textContent = `${target}${suffix}`;
        return;
      }

      const duration = 900;
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
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (seen.has(entry.target)) return;

          seen.add(entry.target);
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((counter) => observer.observe(counter));
  })();

  // =========================
  // Hamburger menu
  // =========================
  (function () {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!hamburgerBtn || !mobileMenu) return;

    function openMenu() {
      hamburgerBtn.classList.add("is-open");
      mobileMenu.classList.add("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
    }

    function closeMenu() {
      hamburgerBtn.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }

    function toggleMenu() {
      if (mobileMenu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    hamburgerBtn.addEventListener("click", toggleMenu);

    document.addEventListener("click", (e) => {
      const clickedButton = hamburgerBtn.contains(e.target);
      const clickedMenu = mobileMenu.contains(e.target);

      if (!clickedButton && !clickedMenu) {
        closeMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });
  })();
});
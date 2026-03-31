(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -------------------------
  // Page transition overlay
  // -------------------------
  const overlay = document.createElement("div");
  overlay.className = "page-transition-layer";
  document.body.appendChild(overlay);

  const isInternalLink = (anchor) => {
    if (!anchor || !anchor.href) return false;

    const href = anchor.getAttribute("href") || "";
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) return false;

    if (anchor.hasAttribute("download")) return false;
    if (anchor.target && anchor.target !== "_self") return false;

    try {
      const url = new URL(anchor.href, window.location.href);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  };

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (!anchor) return;

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) return;

    if (!isInternalLink(anchor)) return;

    const currentUrl = new URL(window.location.href);
    const nextUrl = new URL(anchor.href, window.location.href);

    // same page anchor only
    if (
      currentUrl.pathname === nextUrl.pathname &&
      currentUrl.search === nextUrl.search &&
      nextUrl.hash
    ) {
      return;
    }

    event.preventDefault();

    document.body.classList.add("is-transitioning");
    overlay.classList.add("is-active");

    const delay = prefersReducedMotion ? 0 : 230;
    window.setTimeout(() => {
      window.location.href = nextUrl.href;
    }, delay);
  });

  // -------------------------
  // Nav scroll polish
  // -------------------------
  const updateNavScroll = () => {
    document.body.classList.toggle("nav-scrolled", window.scrollY > 18);
  };

  updateNavScroll();
  window.addEventListener("scroll", updateNavScroll, { passive: true });

  // -------------------------
  // Mobile sticky CTA show/hide
  // -------------------------
  const stickyCta = document.querySelector(".mobile-sticky-cta");
  if (stickyCta) {
    const updateSticky = () => {
      stickyCta.classList.toggle("show", window.scrollY > 420);
    };

    updateSticky();
    window.addEventListener("scroll", updateSticky, { passive: true });
  }

  // -------------------------
  // Reveal motion
  // -------------------------
  const sectionSelector = ".section";
  const revealSelector = [
    ".section-head",
    ".hero-copy",
    ".hero-visual",
    ".panel",
    ".service-panel",
    ".process-card",
    ".pricing-card",
    ".faq-item",
    ".stat-box",
    ".mini-point",
    ".hero-feature-card",
    ".work-gallery-card",
    ".industry-pill",
    ".footer-badge",
    ".work-tag",
    ".case-media img",
    ".grid img.card",
    ".btnrow .btn"
  ].join(",");

  const sections = document.querySelectorAll(sectionSelector);

  sections.forEach((section) => {
    let delay = 0;
    const items = Array.from(section.querySelectorAll(revealSelector));

    items.forEach((item) => {
      // skip nested duplicates when a parent panel already animates
      const parentPanel = item.closest(".panel");
      if (parentPanel && parentPanel !== item && item.matches(".btn, img, .mini-point, .work-tag, .footer-badge")) {
        return;
      }

      if (item.classList.contains("motion-reveal")) return;

      item.classList.add("motion-reveal");
      item.style.setProperty("--motion-delay", `${Math.min(delay, 260)}ms`);
      delay += 42;
    });
  });

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll(".motion-reveal").forEach((item) => io.observe(item));
  } else {
    document.querySelectorAll(".motion-reveal").forEach((item) => {
      item.classList.add("in-view");
    });
  }

  // -------------------------
  // FAQ: only one open at a time per list
  // -------------------------
  document.querySelectorAll(".faq-list").forEach((faqList) => {
    const items = faqList.querySelectorAll(".faq-item");

    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  });
})();
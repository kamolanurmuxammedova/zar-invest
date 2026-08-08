/**
 * ZarAnim — shared GSAP/ScrollTrigger motion layer.
 * Declarative via data-attributes so pages stay plain HTML:
 *   data-animate="fade-up|fade-in|scale-in|slide-left|slide-right" [data-delay] [data-duration]
 *   data-stagger="0.08" wrapping [data-animate-item] children
 *   data-parallax="0.2" for a subtle scroll-linked drift
 *   data-count-to="3450" [data-count-duration] for number count-ups
 * Degrades gracefully to a static (fully visible, unanimated) page if GSAP
 * fails to load or the visitor prefers reduced motion.
 */
(function () {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  const VARIANTS = {
    "fade-up": { from: { y: 28, opacity: 0 }, to: { y: 0, opacity: 1 } },
    "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
    "scale-in": { from: { opacity: 0, scale: 0.94 }, to: { opacity: 1, scale: 1 } },
    "slide-left": { from: { x: 40, opacity: 0 }, to: { x: 0, opacity: 1 } },
    "slide-right": { from: { x: -40, opacity: 0 }, to: { x: 0, opacity: 1 } },
  };

  function initReveal(scope) {
    if (!hasGSAP || prefersReduced) return;

    scope.querySelectorAll("[data-animate]:not([data-animated])").forEach((el) => {
      el.setAttribute("data-animated", "1");
      const variant = VARIANTS[el.dataset.animate] || VARIANTS["fade-up"];
      const delay = parseFloat(el.dataset.delay || "0");
      const duration = parseFloat(el.dataset.duration || "0.7");
      gsap.set(el, variant.from);
      gsap.to(el, {
        ...variant.to,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
    });

    scope.querySelectorAll("[data-stagger]:not([data-animated])").forEach((container) => {
      container.setAttribute("data-animated", "1");
      const items = container.querySelectorAll("[data-animate-item]");
      if (!items.length) return;
      const amount = parseFloat(container.dataset.stagger || "0.08");
      gsap.set(items, { y: 24, opacity: 0 });
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: amount,
        scrollTrigger: { trigger: container, start: "top 85%", toggleActions: "play none none none" },
      });
    });

    scope.querySelectorAll("[data-parallax]:not([data-animated])").forEach((el) => {
      el.setAttribute("data-animated", "1");
      const amount = parseFloat(el.dataset.parallax || "0.2");
      gsap.to(el, {
        yPercent: amount * 100,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    scope.querySelectorAll("[data-count-to]:not([data-counted])").forEach((el) => {
      el.setAttribute("data-counted", "1");
      const to = parseFloat(el.dataset.countTo);
      const duration = parseFloat(el.dataset.countDuration || "1.4");
      const prefix = el.dataset.countPrefix || "";
      const suffix = el.dataset.countSuffix || "";
      const decimals = el.dataset.countDecimals ? parseInt(el.dataset.countDecimals, 10) : 0;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: to,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        onUpdate: () => {
          el.textContent = prefix + counter.val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        },
      });
    });
  }

  function initHeaderShrink() {
    const header = document.querySelector("site-header header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("shadow-xl", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Cursor-following radial glow inside any [data-spotlight] section — a
     cheap "premium" touch that degrades to a static glow on touch devices. */
  function initSpotlight() {
    const zones = document.querySelectorAll("[data-spotlight]");
    if (!zones.length || window.matchMedia("(pointer: coarse)").matches) return;
    zones.forEach((zone) => {
      zone.addEventListener("pointermove", (e) => {
        const rect = zone.getBoundingClientRect();
        zone.style.setProperty("--x", `${e.clientX - rect.left}px`);
        zone.style.setProperty("--y", `${e.clientY - rect.top}px`);
      });
    });
  }

  function refresh() {
    initReveal(document);
    if (hasGSAP) ScrollTrigger.refresh();
  }

  function hideLoader() {
    const wrapper = document.querySelector("site-loader");
    const loader = document.getElementById("site-loader");
    if (!wrapper || !loader) return;
    const finish = () => wrapper.remove();
    if (prefersReduced || !hasGSAP) {
      loader.style.transition = "opacity .2s ease";
      loader.style.opacity = "0";
      setTimeout(finish, 200);
      return;
    }
    gsap.to(loader, { opacity: 0, duration: 0.5, delay: 0.15, onComplete: finish });
  }

  function setLoading(button, isLoading, loadingText) {
    if (!button) return;
    if (isLoading) {
      if (!button.dataset.originalLabel) button.dataset.originalLabel = button.innerHTML;
      button.disabled = true;
      button.classList.add("opacity-80", "cursor-wait");
      button.innerHTML = `<span class="inline-flex items-center gap-2 justify-center w-full"><span class="w-[14px] h-[14px] rounded-full border-2 border-current border-t-transparent animate-spin"></span>${loadingText || "Yuklanmoqda..."}</span>`;
    } else {
      button.disabled = false;
      button.classList.remove("opacity-80", "cursor-wait");
      if (button.dataset.originalLabel) button.innerHTML = button.dataset.originalLabel;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReveal(document);
    initHeaderShrink();
    initSpotlight();
  });
  window.addEventListener("load", hideLoader);
  // Safety net: never let the loader block the page if "load" fires late/never.
  setTimeout(hideLoader, 3000);

  window.ZarAnim = { refresh, setLoading, hideLoader };
})();

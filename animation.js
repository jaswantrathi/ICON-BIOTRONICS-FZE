/* =========================================================
   ICON BIOTRONICS — SCROLL ANIMATIONS
   File: js/animations.js
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const animationSelectors = [
    ".section-title",
    ".trust-card",
    ".service-card",
    ".why-grid > div",
    ".equipment-grid > div",
    ".process-grid > div",
    ".testimonial-card",
    ".emergency-grid > div",
    ".cta .container",
    ".footer-grid > div"
  ];

  const elements = document.querySelectorAll(
    animationSelectors.join(",")
  );

  elements.forEach((element, index) => {
    if (
      element.classList.contains("reveal") ||
      element.classList.contains("reveal-left") ||
      element.classList.contains("reveal-right") ||
      element.classList.contains("reveal-scale")
    ) {
      return;
    }

    element.classList.add("reveal");

    const staggerIndex = (index % 4) + 1;
    element.classList.add(`delay-${staggerIndex}`);
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("active");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("active");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -45px 0px"
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });

  initializeCounters();
});

function initializeCounters() {
  const counters = document.querySelectorAll(".hero-stats h2");

  if (!counters.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const animateCounter = (counter) => {
    const originalText = counter.textContent.trim();
    const numericMatch = originalText.match(/\d+/);

    if (!numericMatch) return;

    const target = Number(numericMatch[0]);
    const prefix = originalText.slice(0, numericMatch.index);
    const suffix = originalText.slice(
      numericMatch.index + numericMatch[0].length
    );

    if (reducedMotion) {
      counter.textContent = `${prefix}${target}${suffix}`;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(target * easedProgress);

      counter.textContent = `${prefix}${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.65
    }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
}

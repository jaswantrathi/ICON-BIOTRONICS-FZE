/* =========================================================
   ICON BIOTRONICS — MAIN JAVASCRIPT
   File: js/script.js
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const menuButton = document.getElementById("menu-btn");
  const navigation = document.querySelector("header nav");
  const navigationLinks = document.querySelectorAll("header nav a");
  const contactForms = document.querySelectorAll("form");
  const yearElements = document.querySelectorAll("[data-current-year]");

  /* -----------------------------
     STICKY HEADER
  ----------------------------- */

  const handleHeaderScroll = () => {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  /* -----------------------------
     MOBILE NAVIGATION
  ----------------------------- */

  const closeMobileNavigation = () => {
    if (!navigation || !menuButton) return;

    navigation.classList.remove("open");
    menuButton.classList.remove("active");
    document.body.classList.remove("menu-open");

    const icon = menuButton.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }

    menuButton.setAttribute("aria-expanded", "false");
  };

  const openMobileNavigation = () => {
    if (!navigation || !menuButton) return;

    navigation.classList.add("open");
    menuButton.classList.add("active");
    document.body.classList.add("menu-open");

    const icon = menuButton.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    }

    menuButton.setAttribute("aria-expanded", "true");
  };

  if (menuButton && navigation) {
    menuButton.setAttribute("role", "button");
    menuButton.setAttribute("tabindex", "0");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.contains("open");

      if (isOpen) {
        closeMobileNavigation();
      } else {
        openMobileNavigation();
      }
    });

    menuButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        menuButton.click();
      }

      if (event.key === "Escape") {
        closeMobileNavigation();
      }
    });
  }

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
  });

  document.addEventListener("click", (event) => {
    if (!navigation || !menuButton) return;

    const clickedInsideNavigation = navigation.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (
      navigation.classList.contains("open") &&
      !clickedInsideNavigation &&
      !clickedMenuButton
    ) {
      closeMobileNavigation();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      closeMobileNavigation();
    }
  });

  /* -----------------------------
     ACTIVE NAVIGATION LINK
  ----------------------------- */

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  navigationLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    link.classList.remove("active");

    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  /* -----------------------------
     SMOOTH INTERNAL LINKS
  ----------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  /* -----------------------------
     CONTACT FORM VALIDATION
  ----------------------------- */

  contactForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      const requiredFields = form.querySelectorAll("[required]");
      let isValid = true;

      requiredFields.forEach((field) => {
        removeFieldError(field);

        const value = field.value.trim();

        if (!value) {
          showFieldError(field, "This field is required.");
          isValid = false;
          return;
        }

        if (field.type === "email" && !isValidEmail(value)) {
          showFieldError(field, "Please enter a valid email address.");
          isValid = false;
        }

        if (field.type === "tel" && value.length < 7) {
          showFieldError(field, "Please enter a valid phone number.");
          isValid = false;
        }
      });

      if (!isValid) {
        event.preventDefault();

        const firstError = form.querySelector(".field-error");

        if (firstError) {
          firstError.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }

        return;
      }

      const submitButton = form.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText =
          submitButton.textContent || submitButton.value;

        if (submitButton.tagName === "INPUT") {
          submitButton.value = "Sending...";
        } else {
          submitButton.textContent = "Sending...";
        }
      }
    });
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(field, message) {
    field.classList.add("field-error");

    const error = document.createElement("small");
    error.className = "form-error-message";
    error.textContent = message;
    error.setAttribute("role", "alert");

    field.insertAdjacentElement("afterend", error);
  }

  function removeFieldError(field) {
    field.classList.remove("field-error");

    const nextElement = field.nextElementSibling;

    if (
      nextElement &&
      nextElement.classList.contains("form-error-message")
    ) {
      nextElement.remove();
    }
  }

  /* -----------------------------
     PHONE NUMBER CLEANUP
  ----------------------------- */

  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^\d+\-\s()]/g, "");
    });
  });

  /* -----------------------------
     CURRENT YEAR
  ----------------------------- */

  const currentYear = new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent = currentYear;
  });

  /* -----------------------------
     FLOATING ACTION VISIBILITY
  ----------------------------- */

  const floatingActions = document.querySelectorAll(
    ".floating-call, .floating-whatsapp"
  );

  const updateFloatingActions = () => {
    floatingActions.forEach((action) => {
      if (window.scrollY > 260) {
        action.classList.add("visible");
      } else {
        action.classList.remove("visible");
      }
    });
  };

  updateFloatingActions();
  window.addEventListener("scroll", updateFloatingActions, {
    passive: true
  });

  /* -----------------------------
     EXTERNAL LINK SECURITY
  ----------------------------- */

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const existingRel = link.getAttribute("rel") || "";
    const relValues = new Set(existingRel.split(" ").filter(Boolean));

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.setAttribute("rel", Array.from(relValues).join(" "));
  });
});

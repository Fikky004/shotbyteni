(() => {
  "use strict";

  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const navLinks = document.querySelectorAll("[data-nav]");
  const yearEl = document.getElementById("year");
  const gallery = document.getElementById("gallery");
  const viewfinder = document.getElementById("viewfinder");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header background on scroll ---------- */
  const setHeaderState = () => {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* ---------- Mobile nav ---------- */
  const closeMobileNav = () => {
    mobileNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  document.querySelectorAll("[data-mobile]").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`;
          const matchingLinks = document.querySelectorAll(`[data-nav][href="${id}"]`);
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            matchingLinks.forEach((l) => l.classList.add("is-active"));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Viewfinder cursor accent (hover-capable pointers only) ---------- */
  const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (gallery && viewfinder && hasHover) {
    const items = gallery.querySelectorAll(".gallery-item");

    gallery.addEventListener("mousemove", (e) => {
      viewfinder.style.left = `${e.clientX - gallery.getBoundingClientRect().left + gallery.scrollLeft}px`;
      viewfinder.style.top = `${e.clientY - gallery.getBoundingClientRect().top}px`;
    });

    items.forEach((item) => {
      item.addEventListener("mouseenter", () => viewfinder.classList.add("is-active"));
      item.addEventListener("mouseleave", () => viewfinder.classList.remove("is-active"));
    });

    gallery.style.position = "relative";
  } else if (viewfinder) {
    viewfinder.remove();
  }
})();
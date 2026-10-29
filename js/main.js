/* ---------------------------------------------------------------------------
   Trim Shady · landing page script
   1. Hero video: the intro film from Vimeo, muted, looping, in the background.
   2. (The "Watch the introduction video" button links to YouTube straight from
      index.html since 2026-10-29; this script no longer sets it.)
   3. Scroll reveal: elements with data-reveal slide in when they come into view.
   4. Menu on smaller screens: the hamburger opens and closes the section links.
   --------------------------------------------------------------------------- */

// ---- Settings ---------------------------------------------------------------
// The Vimeo video ID: the number at the end of the link, e.g. 123456789 for
// https://vimeo.com/123456789. Empty = the hero shows its poster image. (A private "unlisted" link has a second part,
// e.g. https://vimeo.com/123456789/abcdef1234: put that part in VIMEO_HASH.)
const VIMEO_ID = "1233022742";   // "Trim Shady" intro film (public, Vimeo Plus: background mode allowed)
const VIMEO_HASH = "";

document.documentElement.classList.add("js");

// ---- 1. Vimeo -----------------------------------------------------------------
(function setUpFilm() {
  const media = document.getElementById("hero-media");
  if (!VIMEO_ID) { return; }
  // background=1: Vimeo's background mode (autoplay, muted, looped, no controls).
  const hash = VIMEO_HASH ? "&h=" + VIMEO_HASH : "";
  const iframe = document.createElement("iframe");
  iframe.src = "https://player.vimeo.com/video/" + VIMEO_ID + "?background=1&autoplay=1&muted=1&loop=1&dnt=1" + hash;
  iframe.allow = "autoplay; fullscreen; picture-in-picture";
  iframe.title = "Trim Shady intro film";
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;
  // Fade the poster out once the player has loaded (the poster stays as fallback).
  iframe.addEventListener("load", () => setTimeout(() => media.classList.add("playing"), 800));
  media.appendChild(iframe);
})();

// ---- 3. Scroll reveal ---------------------------------------------------------
(function setUpReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);   // play once, do not hide again
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  items.forEach((el) => observer.observe(el));
})();

// ---- 4. Menu on smaller screens (hamburger) -------------------------------------
// The button only shows below 1100 px (css "Smaller screens"). It opens the menu
// under the top bar; a link, Escape or a tap outside closes it again.
(function setUpMenu() {
  const bar = document.querySelector(".topbar");
  const toggle = bar && bar.querySelector(".menu-toggle");
  const nav = bar && bar.querySelector(".links");
  if (!toggle || !nav) return;

  function setOpen(open) {
    bar.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
  }

  toggle.addEventListener("click", () => setOpen(!bar.classList.contains("is-open")));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);   // the page then scrolls to the section
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bar.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (bar.classList.contains("is-open") && !bar.contains(event.target)) setOpen(false);
  });
  // Back to a wide screen: make sure the menu is not left in the "open" state
  window.matchMedia("(min-width: 1101px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
})();

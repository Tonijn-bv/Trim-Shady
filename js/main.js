/* ---------------------------------------------------------------------------
   Trim Shady · landing page script
   1. Hero video: the intro film from Vimeo, muted, looping, in the background.
   2. "Watch the 60-second film": opens the same film on Vimeo, with sound.
   3. Scroll reveal: elements with data-reveal slide in when they come into view.
   --------------------------------------------------------------------------- */

// ---- Settings ---------------------------------------------------------------
// The Vimeo video ID: the number at the end of the link, e.g. 123456789 for
// https://vimeo.com/123456789. Empty = the hero shows its poster image and the
// film button stays inactive. (A private "unlisted" link has a second part,
// e.g. https://vimeo.com/123456789/abcdef1234: put that part in VIMEO_HASH.)
const VIMEO_ID = "";       // TODO: the real intro film
const VIMEO_HASH = "";

document.documentElement.classList.add("js");

// ---- 1 + 2. Vimeo -------------------------------------------------------------
(function setUpFilm() {
  const media = document.getElementById("hero-media");
  const link = document.getElementById("film-link");
  if (!VIMEO_ID) {
    link.setAttribute("aria-disabled", "true");
    link.title = "The film is coming soon";
    link.addEventListener("click", (e) => e.preventDefault());
    return;
  }
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

  link.href = "https://vimeo.com/" + VIMEO_ID + (VIMEO_HASH ? "/" + VIMEO_HASH : "");
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

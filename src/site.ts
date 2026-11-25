import "./styles.css";
import { isMediaSlot, videos } from "./media";
import { setupScrollEffects } from "./scroll";
import { setupHeroMotion } from "./hero";
import { setupProjectGallery } from "./gallery";
import { setupCursor } from "./cursor";

const root = document.documentElement;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 40rem)");
const motionButton = document.querySelector<HTMLButtonElement>(".motion-button");
const motionLabel = motionButton?.querySelector(".motion-label");
const refreshScroll = setupScrollEffects();
const setHeroMotion = setupHeroMotion();
const refreshGallery = setupProjectGallery();
setupCursor();
let motionOverride: boolean | undefined;
let motionPaused = reducedMotion.matches;

const media = new Map<Element, { video: HTMLVideoElement; visible: boolean; src: string }>();

for (const panel of document.querySelectorAll<HTMLElement>("[data-media]")) {
  const key = panel.dataset.media;
  if (!isMediaSlot(key)) continue;
  const source = videos[key];
  if (!source) continue;

  const video = document.createElement("video");
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = "none";
  video.tabIndex = -1;
  video.className = "media-video";
  if (source.poster) video.poster = source.poster;
  if (source.position) video.style.objectPosition = source.position;

  video.addEventListener("playing", () => panel.classList.add("has-frame"));
  video.addEventListener("error", () => panel.classList.remove("has-frame"));
  panel.append(video);
  media.set(panel, { video, visible: false, src: source.src });
}

function syncVideo() {
  for (const { video, visible, src } of media.values()) {
    if (motionPaused || document.hidden || !visible) {
      if (!video.paused) video.pause();
      continue;
    }

    if (!video.hasAttribute("src")) video.src = src;
    if (video.paused && !video.error) {
      void video.play().catch(() => {
        // The panel's artwork stays visible when autoplay is unavailable.
      });
    }
  }
}

function syncMotion() {
  motionPaused = motionOverride ?? reducedMotion.matches;
  root.classList.toggle("motion-paused", motionPaused);
  if (motionLabel) motionLabel.textContent = motionPaused ? "Play motion" : "Pause motion";
  setHeroMotion(!motionPaused);
  refreshGallery();
  refreshScroll();
  syncVideo();
}

if (motionButton) {
  motionButton.hidden = false;
  motionButton.addEventListener("click", () => {
    motionOverride = !motionPaused;
    syncMotion();
  });
}

reducedMotion.addEventListener("change", () => {
  motionOverride = undefined;
  syncMotion();
});
document.addEventListener("visibilitychange", syncVideo);
syncMotion();

const themeButton = document.querySelector<HTMLButtonElement>(".theme-button");
const themeColor = document.querySelector<HTMLMetaElement>("meta[name='theme-color']");
if (themeButton) {
  const themeKey = "shlok-portfolio-theme";
  const setTheme = (dark: boolean) => {
    root.dataset.theme = dark ? "dark" : "light";
    themeButton.setAttribute("aria-pressed", String(dark));
    if (themeColor) themeColor.content = dark ? "#151515" : "#ffffff";
  };

  try {
    setTheme(localStorage.getItem(themeKey) === "dark");
  } catch {
    setTheme(false);
  }
  themeButton.hidden = false;
  themeButton.addEventListener("click", () => {
    const dark = root.dataset.theme !== "dark";
    setTheme(dark);
    try {
      localStorage.setItem(themeKey, dark ? "dark" : "light");
    } catch {
      // The theme still changes for this visit when storage is unavailable.
    }
  });
}

const nav = document.querySelector<HTMLElement>("#nav");
const menu = document.querySelector<HTMLButtonElement>(".menu");

if (nav && menu) {
  const updateMenu = (open: boolean) => {
    menu.hidden = !mobile.matches;
    menu.setAttribute("aria-expanded", String(open));
    nav.hidden = mobile.matches && !open;
  };

  updateMenu(false);
  mobile.addEventListener("change", () => updateMenu(false));
  menu.addEventListener("click", () => updateMenu(menu.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) updateMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      updateMenu(false);
      menu.focus();
    }
  });
}

root.classList.add("enhanced");
if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      const item = media.get(target);
      if (item) item.visible = isIntersecting;
    }
    syncVideo();
  }, { threshold: .15 });
  for (const panel of media.keys()) videoObserver.observe(panel);
} else {
  for (const item of media.values()) item.visible = true;
  syncVideo();
}

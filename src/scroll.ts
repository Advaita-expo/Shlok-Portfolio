const clamp = (value: number) => Math.min(1, Math.max(0, value));
const mix = (start: number, end: number, progress: number) => start + (end - start) * progress;

export function setupScrollEffects() {
  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>(".site-header");
  const frame = document.querySelector<HTMLElement>(".hero-frame");
  const film = frame?.querySelector<HTMLElement>(".hero-media");
  const title = frame?.querySelector<HTMLElement>(".hero-content");
  const slot = document.querySelector<HTMLElement>(".film-slot");
  const footerStart = document.querySelector<HTMLElement>(".footer-reel-start");
  const footerSlot = document.querySelector<HTMLElement>(".footer-film-slot");
  const footerFilm = footerSlot?.querySelector<HTMLElement>(".footer-film");
  const footerWords = document.querySelector<HTMLElement>(".footer-words");
  const lines = [...document.querySelectorAll<HTMLElement>("[data-scroll-line]")].map((line) => ({
    line,
    parts: [...line.querySelectorAll<HTMLElement>(".line-content")],
  }));
  if (!header || !frame || !film || !title || !slot) return () => undefined;

  let scheduled = false;

  const update = () => {
    scheduled = false;
    const hero = frame.getBoundingClientRect();
    const distance = Math.max(0, -hero.top);
    const active = !root.classList.contains("motion-paused");
    const headerBoundary = active ? hero.height * .06 : hero.height - header.offsetHeight;
    header.classList.toggle("on-paper", distance >= Math.max(1, headerBoundary));
    film.classList.toggle("is-reframing", active);
    slot.classList.toggle("is-covered", active);

    if (!active) {
      frame.style.removeProperty("--hero-copy");
      frame.style.removeProperty("--hero-lift");
      title.classList.remove("is-out");
      return;
    }

    // The video stays in the viewport until it meets its inline slot.
    const target = slot.getBoundingClientRect();
    const travel = hero.height * .7;
    const progress = clamp(distance / travel);
    const left = (target.left - hero.left) * progress;
    const dockTop = target.top - hero.top;
    const top = Math.min(distance, travel) + (dockTop - travel) * progress;
    const exit = clamp(distance / (hero.height * .14));
    const viewport = innerHeight;
    const remainingScroll = root.scrollHeight - (scrollY + viewport);
    const atPageEnd = remainingScroll <= 2;
    const reveals = lines.map(({ line, parts }) => {
      const position = line.getBoundingClientRect().top;
      const progress = atPageEnd ? 1 : clamp((viewport * .96 - position) / (viewport * .28));
      return { parts, progress };
    });

    if (footerStart && footerSlot && footerFilm && footerWords) {
      const start = footerStart.getBoundingClientRect();
      const target = footerSlot.getBoundingClientRect();
      const words = footerWords.getBoundingClientRect();
      const entry = viewport * .72;
      // Short footers can reach the bottom of the page before the inline slot reaches mid-screen.
      const travelToSlot = target.top - start.top;
      const finish = Math.max(start.top - remainingScroll, Math.min(viewport * .1, viewport * .5 - travelToSlot));
      const progress = atPageEnd ? 1 : clamp((entry - start.top) / Math.max(1, entry - finish));
      const sizeProgress = progress ** 1.25;
      // Lift the large clip into the viewport before it settles next to the heading.
      const lift = Math.sin(Math.PI * progress) * Math.min(viewport * .26, start.height * .48);

      footerFilm.style.setProperty("--footer-film-x", `${mix(start.left - target.left, 0, sizeProgress)}px`);
      footerFilm.style.setProperty("--footer-film-y", `${mix(start.top - target.top, 0, progress) - lift}px`);
      footerFilm.style.setProperty("--footer-film-width", `${mix(start.width, target.width, sizeProgress)}px`);
      footerFilm.style.setProperty("--footer-film-height", `${mix(start.height, target.height, sizeProgress)}px`);
      footerWords.classList.toggle("is-in-view", words.bottom > 0 && words.top < viewport * .94);
    }

    film.style.setProperty("--film-x", `${left}px`);
    film.style.setProperty("--film-y", `${top}px`);
    film.style.setProperty("--film-width", `${mix(hero.width, target.width, progress)}px`);
    film.style.setProperty("--film-height", `${mix(hero.height, target.height, progress)}px`);
    frame.style.setProperty("--hero-copy", String((1 - exit) ** 1.8));
    frame.style.setProperty("--hero-lift", `${exit * -28}px`);
    title.classList.toggle("is-out", exit === 1);

    for (const { parts, progress } of reveals) {
      parts.forEach((part, index) => {
        const delay = index * .16;
        const amount = clamp((progress - delay) / (1 - delay));
        part.style.setProperty("--line-cut", `calc(${100 * (1 - amount)}% - .3em)`);
        part.style.setProperty("--line-offset", `${.58 * (1 - amount)}em`);
      });
    }
  };

  const refresh = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  addEventListener("scroll", refresh, { passive: true });
  addEventListener("resize", refresh);
  addEventListener("pageshow", refresh);
  void document.fonts.ready.then(refresh);
  if ("ResizeObserver" in window) {
    const layout = new ResizeObserver(refresh);
    layout.observe(frame);
    layout.observe(slot);
    if (footerStart) layout.observe(footerStart);
    if (footerSlot) layout.observe(footerSlot);
  }
  return refresh;
}

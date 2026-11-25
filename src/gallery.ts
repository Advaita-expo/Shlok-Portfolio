const clamp = (value: number, limit: number) => Math.max(0, Math.min(value, limit));

export function setupProjectGallery() {
  const motionPaused = () => document.documentElement.classList.contains("motion-paused");
  const header = document.querySelector<HTMLElement>(".site-header");
  const runway = document.querySelector<HTMLElement>("#work");
  const stage = runway?.querySelector<HTMLElement>(".work-stage");
  const strip = stage?.querySelector<HTMLElement>(".projects");
  const navigation = stage?.querySelector<HTMLElement>(".project-nav");
  const previous = navigation?.querySelector<HTMLButtonElement>("[data-project-step='-1']");
  const next = navigation?.querySelector<HTMLButtonElement>("[data-project-step='1']");
  const featuredLink = document.querySelector<HTMLAnchorElement>(".hero-index");
  if (!header || !runway || !stage || !strip || !navigation || !previous || !next) {
    return () => undefined;
  }

  let travel = 0;
  let inset = 0;
  let frame = 0;
  let layoutFrame = 0;

  const maxLeft = () => Math.max(0, strip.scrollWidth - strip.clientWidth);
  const galleryTop = () => scrollY + runway.getBoundingClientRect().top - (travel ? inset : header.offsetHeight);

  const updateButtons = () => {
    const distance = maxLeft();
    previous.disabled = strip.scrollLeft < 2;
    next.disabled = distance - strip.scrollLeft < 2;
    stage.style.setProperty("--gallery-progress", String(distance > 0 ? strip.scrollLeft / distance : 0));
  };

  const render = () => {
    frame = 0;
    if (travel) {
      const progress = clamp((scrollY - galleryTop()) / travel, 1);
      strip.scrollLeft = progress * maxLeft();
    }
    updateButtons();
  };

  const refresh = () => {
    const previousTravel = travel;
    const previousInset = inset;
    const distance = maxLeft();
    const elapsed = scrollY - galleryTop();
    const left = strip.scrollLeft;
    travel = !motionPaused() && distance > 2 ? Math.round(distance * .82) : 0;
    inset = Math.min(header.offsetHeight, innerHeight - stage.offsetHeight - 4);
    runway.classList.toggle("is-pinned", travel > 0);
    runway.style.setProperty("--gallery-travel", `${travel}px`);
    runway.style.setProperty("--gallery-inset", `${inset}px`);

    if (previousTravel !== travel || previousInset !== inset) {
      const top = galleryTop();
      if (previousTravel && elapsed > 0 && elapsed < previousTravel) {
        window.scrollTo({ top: top + (elapsed / previousTravel) * travel, behavior: "instant" });
        if (!travel) strip.scrollLeft = left;
      } else if (!previousTravel && travel && left > 2 && elapsed >= 0 && elapsed < stage.offsetHeight) {
        window.scrollTo({ top: top + (left / distance) * travel, behavior: "instant" });
      }
    }
    render();
  };

  const scheduleRefresh = () => {
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      refresh();
    });
  };

  const positionOf = (card: Element) => {
    const first = strip.firstElementChild;
    return first ? card.getBoundingClientRect().left - first.getBoundingClientRect().left : 0;
  };

  const goTo = (left: number, behavior: ScrollBehavior) => {
    const distance = maxLeft();
    const target = clamp(left, distance);
    if (travel && distance > 0) {
      window.scrollTo({ top: galleryTop() + (target / distance) * travel, behavior });
    } else {
      strip.scrollTo({ left: target, behavior });
    }
  };

  const move = (direction: -1 | 1) => {
    const left = strip.scrollLeft;
    const stops = [...strip.children].map(positionOf);
    const target = direction === 1
      ? stops.find((stop) => stop > left + 3) ?? maxLeft()
      : stops.reverse().find((stop) => stop < left - 3) ?? 0;
    goTo(target, motionPaused() ? "instant" : "smooth");
  };

  const showProject = (hash: string, focus = false) => {
    const card = document.getElementById(hash.slice(1));
    if (!card || card.parentElement !== strip) return;
    const behavior = motionPaused() ? "instant" : "smooth";
    if (focus) card.focus({ preventScroll: true });
    if (!travel) runway.scrollIntoView({ behavior });
    goTo(positionOf(card), behavior);
  };

  navigation.hidden = false;
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  strip.addEventListener("scroll", updateButtons, { passive: true });
  strip.addEventListener("keydown", (event) => {
    if (event.target !== strip || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  });
  strip.addEventListener("focusin", (event) => {
    if (!travel || !(event.target instanceof Element) || !event.target.matches(":focus-visible")) return;
    const card = event.target.closest(".project");
    if (!card || card.parentElement !== strip) return;

    const target = clamp(positionOf(card), maxLeft());
    const position = clamp((scrollY - galleryTop()) / travel, 1) * maxLeft();
    if (Math.abs(position - target) > 3) goTo(target, "instant");
  });

  featuredLink?.addEventListener("click", (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const hash = featuredLink.hash;
    if (location.hash !== hash) history.pushState(null, "", hash);
    showProject(hash, true);
  });

  window.addEventListener("hashchange", () => showProject(location.hash));
  window.addEventListener("load", () => showProject(location.hash), { once: true });
  window.addEventListener("scroll", () => {
    if (!frame && travel) frame = requestAnimationFrame(render);
  }, { passive: true });
  window.addEventListener("resize", scheduleRefresh);
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleRefresh);
    observer.observe(stage);
    observer.observe(header);
  }
  return refresh;
}

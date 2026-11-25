export function setupHeroMotion() {
  const frame = document.querySelector<HTMLElement>(".hero-frame");
  const title = frame?.querySelector<HTMLElement>(".hero-project-title");
  const link = frame?.querySelector<HTMLAnchorElement>(".hero-index");
  const label = link?.querySelector(".hero-project-link");
  const projects = [...document.querySelectorAll<HTMLElement>("[data-feature-title]")].map((project) => ({
    id: project.id,
    title: project.dataset.featureTitle ?? "",
    headline: project.dataset.featureHeadline ?? "",
  }));
  if (!frame || !title || !link || !label || projects.length < 2) return () => undefined;

  let selected = 0;
  let visible = !("IntersectionObserver" in window);
  let enabled = false;
  let timer: number | undefined;
  let animations: Animation[] = [];
  let run = 0;

  const render = () => {
    const project = projects[selected];
    const words = `${project.headline || project.title}.`.split(" ");
    const text = document.createDocumentFragment();
    for (const [index, word] of words.entries()) {
      if (index > 0) text.append(" ");
      const group = document.createElement("span");
      group.className = "project-title-word";
      for (const character of word) {
        const letter = document.createElement("span");
        letter.className = "project-title-letter";
        letter.textContent = character;
        group.append(letter);
      }
      text.append(group);
    }
    title.replaceChildren(text);
    link.href = `#${project.id}`;
    label.textContent = `View ${project.title}`;
  };

  const animate = (entering: boolean) => [...title.querySelectorAll(".project-title-letter")].map(
    (letter, index) => letter.animate(
      entering
        ? [{ transform: "translateY(115%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }]
        : [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-105%)", opacity: 0 }],
      {
        duration: entering ? 490 : 245,
        delay: index * (entering ? 24 : 13),
        easing: entering ? "cubic-bezier(.22, 1, .36, 1)" : "cubic-bezier(.5, 0, .8, .4)",
        fill: entering ? "backwards" : "both",
      },
    ),
  );

  const canRotate = () => enabled && visible && !document.hidden && !link.matches(":hover, :focus");
  const cancelAnimations = () => {
    for (const animation of animations) animation.cancel();
    animations = [];
  };

  const advance = async () => {
    if (!canRotate()) return;
    const currentRun = ++run;
    cancelAnimations();
    animations = animate(false);
    await Promise.allSettled(animations.map((animation) => animation.finished));
    if (currentRun !== run) return;
    cancelAnimations();
    if (!canRotate()) return;

    selected = (selected + 1) % projects.length;
    render();
    animations = animate(true);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= .84;
    }, { threshold: .84 });
    observer.observe(frame);
  }

  let lightFrame = 0;
  frame.addEventListener("pointermove", (event) => {
    if (!enabled || event.pointerType !== "mouse") return;
    cancelAnimationFrame(lightFrame);
    lightFrame = requestAnimationFrame(() => {
      const bounds = frame.getBoundingClientRect();
      frame.style.setProperty("--light-x", `${100 * (event.clientX - bounds.left) / bounds.width}%`);
      frame.style.setProperty("--light-y", `${100 * (event.clientY - bounds.top) / bounds.height}%`);
    });
  });

  frame.addEventListener("pointerleave", () => {
    cancelAnimationFrame(lightFrame);
    frame.style.removeProperty("--light-x");
    frame.style.removeProperty("--light-y");
  });

  render();
  return (active: boolean) => {
    if (enabled === active) return;
    enabled = active;
    if (active) {
      if (!Element.prototype.animate) return;
      animations = animate(true);
      timer = window.setInterval(() => void advance(), 4500);
    } else {
      window.clearInterval(timer);
      cancelAnimationFrame(lightFrame);
      run++;
      cancelAnimations();
    }
  };
}

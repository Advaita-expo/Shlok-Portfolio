export function setupCursor() {
  const root = document.documentElement;
  const cursor = document.createElement("span");
  cursor.className = "cursor-halo";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);

  let frame = 0;
  let pointer: PointerEvent;

  const hide = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    cursor.classList.remove("is-visible");
  };

  addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || root.classList.contains("motion-paused")) {
      hide();
      return;
    }

    pointer = event;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const { clientX, clientY, target } = pointer;
      const control = target instanceof Element && target.closest("a[href], button:enabled, summary");
      cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      cursor.classList.toggle("over-control", Boolean(control));
      cursor.classList.add("is-visible");
    });
  }, { passive: true });

  root.addEventListener("pointerleave", hide);
  addEventListener("blur", hide);
  addEventListener("keydown", hide);
}

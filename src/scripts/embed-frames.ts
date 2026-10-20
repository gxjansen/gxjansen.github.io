// Clears the grey placeholder behind lazily loaded embed iframes once they
// load. Replaces inline onload="" handlers, which a hash-based CSP blocks.
const PLACEHOLDER = ["bg-base-200", "dark:bg-base-800"];

function bind(frame: HTMLIFrameElement) {
  const clear = () => frame.parentElement?.classList.remove(...PLACEHOLDER);
  frame.addEventListener("load", clear, { once: true });
}

document
  .querySelectorAll<HTMLIFrameElement>("iframe[data-embed-frame]")
  .forEach(bind);

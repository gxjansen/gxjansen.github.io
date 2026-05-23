import { animate, createTimeline, stagger, utils } from "animejs";

interface Window {
  [key: string]: any;
}

declare const window: Window;

export function initLogoAnimation() {
  utils.remove(".site-logo-text, .site-logo-icon");

  createTimeline({ defaults: { ease: "outExpo" } })
    .add(
      ".site-logo-text",
      {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(100),
        duration: 1200,
      },
    )
    .add(
      ".site-logo-icon",
      {
        opacity: [0, 1],
        scale: [0.5, 1],
        rotate: [-20, 0],
        duration: 800,
      },
      "-=800",
    );

  const logo = document.querySelector(".site-logo");
  if (!logo) return;

  const oldEnterListener = logo.getAttribute("data-enter-listener");
  const oldLeaveListener = logo.getAttribute("data-leave-listener");
  if (oldEnterListener && window[oldEnterListener]) {
    logo.removeEventListener("mouseenter", window[oldEnterListener]);
  }
  if (oldLeaveListener && window[oldLeaveListener]) {
    logo.removeEventListener("mouseleave", window[oldLeaveListener]);
  }

  const enterHandler = () => {
    animate(".site-logo-text", {
      scale: 1.1,
      duration: 800,
      ease: "outElastic(1, .5)",
    });
    animate(".site-logo-icon", {
      rotate: 360,
      duration: 800,
      ease: "inOutQuad",
    });
  };

  const leaveHandler = () => {
    animate(".site-logo-text", {
      scale: 1,
      duration: 600,
      ease: "outElastic(1, .5)",
    });
    animate(".site-logo-icon", {
      rotate: 0,
      duration: 600,
      ease: "inOutQuad",
    });
  };

  const enterListenerId = `enter_${Math.random().toString(36).substring(7)}`;
  const leaveListenerId = `leave_${Math.random().toString(36).substring(7)}`;
  window[enterListenerId] = enterHandler;
  window[leaveListenerId] = leaveHandler;
  logo.setAttribute("data-enter-listener", enterListenerId);
  logo.setAttribute("data-leave-listener", leaveListenerId);

  logo.addEventListener("mouseenter", enterHandler);
  logo.addEventListener("mouseleave", leaveHandler);
}

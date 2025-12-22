/**
 * *******************************************************
 * * AOS (Animate on scroll) - but using AnimeJS for animations
 * * made to animate elements on scroll in both directions
 * *******************************************************
 */

import throttle from "lodash.throttle";
import debounce from "lodash.debounce";

import observer from "./libs/observer";
import detect from "./helpers/detector";
import handleScroll from "./helpers/handleScroll";
import prepare from "./helpers/prepare";
import elements from "./helpers/elements";
import { type AOSElement, type AOSDefaultOptions, type DisableOption } from "./helpers/aosTypes";
import { getPositionIn, getPositionOut } from "./helpers/offsetCalculator";

/**
 * Private variables
 */
let aosElements = [] as AOSElement[];
let initialized = false;

/**
 * Default options
 */
let options: AOSDefaultOptions = {
  offset: 100,
  delay: 0,
  duration: 0.8,
  distance: 20,
  once: false,
  mirror: false,
  easing: "easeOutCubic",
  disable: false,
  anchorPlacement: "top-bottom",
  startEvent: "DOMContentLoaded",
  animatedClassName: "aos-animate",
  initClassName: "aos-init",
  disableMutationObserver: true,
  throttleDelay: 99,
  debounceDelay: 50,
};

const initializeScroll = function initializeScroll() {
  aosElements = prepare(aosElements, options);
  handleScroll(aosElements);

  window.addEventListener(
    "scroll",
    throttle(() => handleScroll(aosElements), options.throttleDelay),
    { passive: true }
  );

  return aosElements;
};

/**
 * Refresh AOS
 */
const refresh = function refresh(initialize = false) {
  if (initialize) initialized = true;
  if (initialized) initializeScroll();
};

/**
 * Recalculate element positions
 */
const recalculatePositions = function recalculate() {
  if (initialized) {
    aosElements.forEach((el) => {
      el.position = {
        in: getPositionIn(el.node, options.offset, options.anchorPlacement),
        out: options.mirror && getPositionOut(el.node, options.offset),
      };
    });
    handleScroll(aosElements);
  }
};

/**
 * Hard refresh
 */
const refreshHard = function refreshHard() {
  aosElements = elements();

  if (isDisabled(options.disable)) {
    return disable();
  }

  refresh();
};

/**
 * Disable AOS
 */
const disable = function () {
  aosElements.forEach((el) => {
    el.node.removeAttribute("data-aos");
    el.node.removeAttribute("data-aos-delay");
    el.node.removeAttribute("data-aos-distance");
    el.node.removeAttribute("data-aos-duration");

    if (options.initClassName) {
      el.node.classList.remove(options.initClassName);
    }

    if (options.animatedClassName) {
      el.node.classList.remove(options.animatedClassName);
    }
  });
};

/**
 * Check if AOS should be disabled
 */
const isDisabled = function (optionDisable: DisableOption): boolean {
  return (
    optionDisable === true ||
    (optionDisable === "mobile" && detect.mobile()) ||
    (optionDisable === "phone" && detect.phone()) ||
    (optionDisable === "tablet" && detect.tablet()) ||
    (typeof optionDisable === "function" && optionDisable() === true)
  );
};

/**
 * Initialize AOS
 */
const init = function init(settings?: Partial<AOSDefaultOptions>) {
  options = Object.assign(options, settings);
  aosElements = elements();

  if (!options.disableMutationObserver && !observer.isSupported()) {
    console.info(
      'aos: MutationObserver is not supported on this browser, code mutations observing has been disabled. You may have to call "refreshHard()" by yourself.'
    );
    options.disableMutationObserver = true;
  }

  if (!options.disableMutationObserver) {
    observer.ready("[data-aos]", refreshHard);
  }

  if (isDisabled(options.disable)) {
    return disable();
  }

  // Initialize on start event
  if (["DOMContentLoaded", "load"].indexOf(options.startEvent) === -1) {
    document.addEventListener(options.startEvent, () => refresh(true));
  } else {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => refresh(true));
    } else {
      if (typeof document !== 'undefined') {
        document.addEventListener("DOMContentLoaded", () => refresh(true));
      }
    }
  }

  // Handle window resize and orientation change
  if (typeof window !== 'undefined') {
    window.addEventListener(
      "resize",
      debounce(() => recalculatePositions(), options.debounceDelay),
      { passive: true }
    );

    window.addEventListener(
      "orientationchange",
      debounce(() => recalculatePositions(), options.debounceDelay),
      { passive: true }
    );
  }

  return aosElements;
};

export default {
  init,
  refresh,
  refreshHard,
};

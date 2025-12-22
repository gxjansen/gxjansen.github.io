import { type AOSElement } from "./aosTypes";

/**
 * Adds multiple classes on node
 * @param node - DOM element
 * @param classes - array of class names to add
 */
const addClasses = (node: HTMLElement, classes: string[] | undefined): void => {
  classes && classes.forEach((className) => node.classList.add(className));
};

/**
 * Removes multiple classes from node
 * @param node - DOM element
 * @param classes - array of class names to remove
 */
const removeClasses = (node: HTMLElement, classes: string[] | undefined): void => {
  classes && classes.forEach((className) => node.classList.remove(className));
};

/**
 * Fires a custom event
 * @param eventName - name of the event
 * @param data - data to pass with the event
 */
const fireEvent = (eventName: string, data: HTMLElement): boolean => {
  const customEvent = new CustomEvent(eventName, {
    detail: data,
  });

  return document.dispatchEvent(customEvent);
};

/**
 * Set or remove aos-animate class
 * @param el - AOS element
 * @param top - scrolled distance
 */
const applyClasses = (el: AOSElement, top: number): void => {
  const { options, position, node } = el;

  const hide = () => {
    if (!el.animated) return;

    removeClasses(node, options.animatedClassNames);

    // reverse animation for hiding
    el.animation.reverse();

    // if animation is not already playing, play it
    if (!el.animation.completed) {
      el.animation.play();
    }

    fireEvent("aos:out", node);

    if (el.options?.trigger) {
      fireEvent(`aos:in:${el.options.trigger}`, node);
      // console.log(`aos:in:${el.options.trigger}`, node);
    }

    el.animated = false;
  };

  const show = () => {
    if (el.animated) return;

    addClasses(node, options.animatedClassNames);

    // if animation is reversed (from hiding), reverse it back
    if (el.animation.reversed) {
      el.animation.reverse();
    }
    el.animation.play();

    fireEvent("aos:in", node);
    // console.log(`aos:in:${el.options.trigger}`, node);
    if (el.options?.trigger) {
      fireEvent(`aos:in:${el.options.trigger}`, node);
    }

    el.animated = true;
  };

  if (options.mirror && top >= position.out && !options.once) {
    hide();
  } else if (top >= position.in) {
    show();
  } else if (el.animated && !options.once) {
    hide();
  }
};

/**
 * Scroll logic - add or remove 'aos-animate' class on scroll
 *
 * @param $elements - array of AOS elements
 */
const handleScroll = ($elements: AOSElement[]): void => {
  $elements.forEach((el) => applyClasses(el, window.scrollY));
};

export default handleScroll;

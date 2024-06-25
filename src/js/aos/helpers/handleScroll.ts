import { type AOSElement } from "./aosTypes";

/**
 * Adds multiple classes on node
 * @param {DOMNode} node
 * @param {array}  classes
 */
const addClasses = (node, classes) =>
  classes && classes.forEach((className) => node.classList.add(className));

/**
 * Removes multiple classes from node
 * @param {DOMNode} node
 * @param {array}  classes
 */
const removeClasses = (node, classes) =>
  classes && classes.forEach((className) => node.classList.remove(className));

const fireEvent = (eventName, data) => {
  let customEvent;

  customEvent = new CustomEvent(eventName, {
    detail: data,
  });

  return document.dispatchEvent(customEvent);
};

/**
 * Set or remove aos-animate class
 * @param {node} el         element
 * @param {int}  top        scrolled distance
 */
const applyClasses = (el: any, top: number) => {
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
 * @param  {array} $elements         array of elements nodes
 * @return {void}
 */
const handleScroll = ($elements) =>
  $elements.forEach((el, i) => applyClasses(el, window.scrollY));

export default handleScroll;

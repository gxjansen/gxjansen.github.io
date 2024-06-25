import { forwardRef } from 'react';

// export type PropsWithElementType<P = unknown> = P & { elementType?: HTMLTag };

// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes

/**
 * This is a hack for sure. The thing is, getting a component to intelligently
 * infer props based on a component or JSX string passed into an `elementType` prop is
 * kind of a huge pain. Getting it to work and satisfy the constraints of
 * `forwardRef` seems dang near impossible. To avoid needing to do this awkward
 * type song-and-dance every time we want to forward a ref into a component
 * that accepts an `elementType` prop, we abstract all of that mess to this function for
 * the time time being.
 */
function forwardRefWithAs(render) {
  return /*#__PURE__*/forwardRef(render);
}

export { forwardRefWithAs };

'use client';
import { filterDOMProps } from '@react-aria/utils';
import { warning } from 'emery';
import { AspectRatio } from '@keystar/ui/layout';
import { useSlotProps } from '@keystar/ui/slots';
import { useStyleProps, classNames, css } from '@keystar/ui/style';
import { jsxs, jsx } from 'react/jsx-runtime';

const supportedProps = new Set(['loading', 'onError', 'onLoad', 'src']);
/**
 * A wrapper around the native image tag with support for common behaviour.
 */
function Image(props) {
  props = useSlotProps(props, 'image');
  const {
    alt,
    aspectRatio,
    children,
    fit = 'cover',
    ...otherProps
  } = props;
  const styleProps = useStyleProps(otherProps);
  warning(alt != null, 'The `alt` prop was not provided to an image. ' + 'Add `alt` text for screen readers, or set `alt=""` prop to indicate that the image ' + 'is decorative or redundant with displayed text and should not be announced by screen readers.');
  return /*#__PURE__*/jsxs(AspectRatio, {
    value: aspectRatio,
    UNSAFE_className: styleProps.className,
    UNSAFE_style: styleProps.style,
    children: [/*#__PURE__*/jsx("img", {
      ...filterDOMProps(otherProps, {
        propNames: supportedProps
      }),
      alt: alt,
      role: alt === '' ? 'presentation' : undefined,
      className: classNames(css({
        objectFit: fit
      }))
    }), children]
  });
}

export { Image };

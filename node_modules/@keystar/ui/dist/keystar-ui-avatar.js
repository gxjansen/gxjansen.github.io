'use client';
import { filterDOMProps } from '@react-aria/utils';
import { forwardRef } from 'react';
import { useStyleProps, classNames, css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { jsx } from 'react/jsx-runtime';

/**
 * An avatar is a thumbnail representation of an entity, such as a user or an
 * organization.
 */
const Avatar = /*#__PURE__*/forwardRef(function Avatar(props, forwardedRef) {
  const {
    alt,
    size = 'regular',
    ...otherProps
  } = props;
  const styleProps = useStyleProps(otherProps);
  return /*#__PURE__*/jsx("div", {
    ref: forwardedRef,
    role: "img",
    "aria-label": alt,
    "data-size": size === 'regular' ? undefined : size,
    ...styleProps,
    ...filterDOMProps(otherProps),
    className: classNames(styleProps.className, css({
      alignItems: 'center',
      backgroundColor: tokenSchema.color.background.surfaceTertiary,
      borderRadius: '50%',
      display: 'inline-flex',
      flexShrink: 0,
      fontSize: 'var(--avatar-text-size)',
      height: 'var(--avatar-size)',
      justifyContent: 'center',
      overflow: 'hidden',
      width: 'var(--avatar-size)',
      userSelect: 'none',
      // sizes
      '--avatar-size': tokenSchema.size.element.regular,
      '--avatar-text-size': tokenSchema.typography.text.regular.size,
      '&[data-size=xsmall]': {
        '--avatar-size': tokenSchema.size.element.xsmall,
        '--avatar-text-size': tokenSchema.typography.text.small.size
      },
      '&[data-size=small]': {
        '--avatar-size': tokenSchema.size.element.small,
        '--avatar-text-size': tokenSchema.typography.text.small.size
      },
      '&[data-size=medium]': {
        '--avatar-size': tokenSchema.size.element.medium,
        '--avatar-text-size': tokenSchema.typography.text.medium.size
      },
      '&[data-size=large]': {
        '--avatar-size': tokenSchema.size.element.large,
        '--avatar-text-size': tokenSchema.typography.text.large.size
      },
      '&[data-size=xlarge]': {
        '--avatar-size': tokenSchema.size.element.xlarge,
        '--avatar-text-size': tokenSchema.typography.text.large.size
      }
    })),
    children: 'src' in props ? /*#__PURE__*/jsx("div", {
      className: css({
        height: '100%',
        width: '100%'
      }),
      style: {
        backgroundImage: `url(${props.src})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }
    }) : /*#__PURE__*/jsx(Text, {
      "aria-hidden": true,
      color: "neutralSecondary",
      weight: "medium",
      UNSAFE_className: css({
        fontSize: 'inherit'
      }),
      children: getInitials(props.name, size)
    })
  });
});
function getInitials(name, size) {
  const words = name.split(' ');
  const first = words[0].charAt(0);
  const last = words[words.length - 1].charAt(0);
  if (size === 'xsmall') {
    return `${first}`.toUpperCase();
  }
  return `${first}${last}`.toUpperCase();
}

export { Avatar };

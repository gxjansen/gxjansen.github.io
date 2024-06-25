'use client';
import { useLink } from '@react-aria/link';
export { useLink } from '@react-aria/link';
import { Fragment, forwardRef } from 'react';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { tokenSchema, toDataAttributes, classNames, css } from '@keystar/ui/style';
import { useHeadingContext, useTextContext, Text } from '@keystar/ui/typography';
import { jsx } from 'react/jsx-runtime';
import { useButton } from '@react-aria/button';

function useTextLink({
  autoFocus,
  prominence = 'default'
}) {
  const headingContext = useHeadingContext();
  const textContext = useTextContext();
  const {
    focusProps,
    isFocusVisible
  } = useFocusRing({
    autoFocus
  });
  const {
    hoverProps,
    isHovered
  } = useHover({});
  const fontWeight = headingContext ? undefined : tokenSchema.typography.fontWeight.medium;
  const dataOptions = {
    prominence,
    hover: isHovered ? 'true' : undefined,
    focus: isFocusVisible ? 'visible' : undefined
  };
  return {
    ...mergeProps(hoverProps, focusProps),
    ...toDataAttributes(dataOptions),
    Wrapper: !textContext && !headingContext ? Text : Fragment,
    className: classNames(css({
      color: tokenSchema.color.foreground.neutral,
      cursor: 'pointer',
      fontWeight,
      outline: 0,
      textDecoration: 'underline',
      textDecorationColor: tokenSchema.color.border.emphasis,
      textDecorationThickness: tokenSchema.size.border.regular,
      textUnderlineOffset: tokenSchema.size.border.medium,
      '&[data-hover="true"], &[data-focus="visible"]': {
        color: tokenSchema.color.foreground.neutralEmphasis,
        textDecorationColor: tokenSchema.color.foreground.neutral
      },
      '&[data-focus="visible"]': {
        textDecorationStyle: 'double'
      },
      '&[data-prominence="high"]': {
        color: tokenSchema.color.foreground.accent,
        textDecorationColor: tokenSchema.color.border.accent,
        '&[data-hover="true"], &[data-focus="visible"]': {
          textDecorationColor: tokenSchema.color.foreground.accent
        }
      }
    }))
  };
}

/** @private Forked variant where an "href" is provided. */
const TextLinkAnchor = /*#__PURE__*/forwardRef(function TextLink(props, forwardedRef) {
  const {
    children,
    download,
    href,
    hrefLang,
    ping,
    referrerPolicy,
    rel,
    target,
    ...otherProps
  } = props;
  const domRef = useObjectRef(forwardedRef);
  const {
    Wrapper,
    ...styleProps
  } = useTextLink(props);
  const {
    linkProps
  } = useLink(otherProps, domRef);
  return /*#__PURE__*/jsx(Wrapper, {
    children: /*#__PURE__*/jsx("a", {
      ref: domRef,
      download: download,
      href: href,
      hrefLang: hrefLang,
      ping: ping,
      referrerPolicy: referrerPolicy,
      rel: rel,
      target: target,
      ...mergeProps(linkProps, styleProps),
      children: children
    })
  });
});

const TextLinkButton = /*#__PURE__*/forwardRef(function TextLink(props, forwardedRef) {
  const {
    children,
    ...otherProps
  } = props;
  const domRef = useObjectRef(forwardedRef);
  const {
    Wrapper,
    ...styleProps
  } = useTextLink(otherProps);
  const {
    buttonProps
  } = useButton({
    elementType: 'span',
    ...otherProps
  }, domRef);
  return /*#__PURE__*/jsx(Wrapper, {
    children: /*#__PURE__*/jsx("span", {
      ref: domRef,
      ...mergeProps(buttonProps, styleProps),
      children: children
    })
  });
});

/**
 * Text links take users to another place in the application, and usually appear
 * within or directly following a sentence. Styled to resemble a hyperlink.
 */
const TextLink = /*#__PURE__*/forwardRef(function TextLink(props, forwardedRef) {
  if ('href' in props) {
    return /*#__PURE__*/jsx(TextLinkAnchor, {
      ...props,
      ref: forwardedRef
    });
  }
  return /*#__PURE__*/jsx(TextLinkButton, {
    ...props,
    ref: forwardedRef
  });
});

export { TextLink };

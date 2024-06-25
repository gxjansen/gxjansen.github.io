'use client';
import { filterDOMProps } from '@react-aria/utils';
import { forwardRef } from 'react';
import { useStyleProps, classNames, css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';
import { jsx } from 'react/jsx-runtime';

/** Status lights describe the state or condition of an entity. */
const StatusLight = /*#__PURE__*/forwardRef(function StatusLight(props, forwardedRef) {
  let {
    children,
    role,
    tone = 'neutral'
  } = props;
  const styleProps = useStyleProps(props);
  if (!children && !props['aria-label']) {
    console.warn('If no children are provided, an aria-label must be specified');
  }
  if (!role && (props['aria-label'] || props['aria-labelledby'])) {
    console.warn('A labelled StatusLight must have a role.');
  }
  return /*#__PURE__*/jsx("div", {
    ...filterDOMProps(props, {
      labelable: true
    }),
    ...styleProps,
    ref: forwardedRef,
    "data-tone": tone,
    className: classNames(css({
      alignItems: 'center',
      color: tokenSchema.color.foreground.neutral,
      display: 'flex',
      gap: tokenSchema.size.space.regular,
      height: tokenSchema.size.element.small,
      // indicator
      '&::before': {
        content: '""',
        backgroundColor: tokenSchema.color.foreground.neutralTertiary,
        borderRadius: tokenSchema.size.radius.full,
        height: tokenSchema.size.scale[100],
        width: tokenSchema.size.scale[100]
      },
      // special case for neutral
      '&[data-tone=neutral]': {
        color: tokenSchema.color.foreground.neutralSecondary
      },
      '&[data-tone=accent]::before': {
        backgroundColor: tokenSchema.color.background.accentEmphasis
      },
      '&[data-tone=caution]::before': {
        backgroundColor: tokenSchema.color.background.cautionEmphasis
      },
      '&[data-tone=critical]::before': {
        backgroundColor: tokenSchema.color.background.criticalEmphasis
      },
      '&[data-tone=pending]::before': {
        backgroundColor: tokenSchema.color.background.pendingEmphasis
      },
      '&[data-tone=positive]::before': {
        backgroundColor: tokenSchema.color.background.positiveEmphasis
      }
    }), styleProps.className),
    children: isReactText(children) ? /*#__PURE__*/jsx(Text, {
      color: "inherit",
      children: children
    }) : children
  });
});

export { StatusLight };

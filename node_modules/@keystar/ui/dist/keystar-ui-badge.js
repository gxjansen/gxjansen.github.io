'use client';
import { filterDOMProps } from '@react-aria/utils';
import { forwardRef, useMemo } from 'react';
import { Flex } from '@keystar/ui/layout';
import { SlotProvider } from '@keystar/ui/slots';
import { useStyleProps } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';
import { jsx } from 'react/jsx-runtime';

/**
 * A badge is a decorative indicator used to either call attention to an item or
 * for communicating non-actionable, supplemental information.
 */
const Badge = /*#__PURE__*/forwardRef(function Badge(props, forwardedRef) {
  const {
    children,
    tone = 'neutral',
    ...otherProps
  } = props;
  const styleProps = useStyleProps(otherProps);
  const bg = tone === 'neutral' ? 'surfaceSecondary' : tone;
  const fg = tone === 'neutral' ? undefined : tone;
  const slots = useMemo(() => ({
    icon: {
      color: fg
    },
    text: {
      trim: false,
      color: fg,
      weight: 'medium'
    }
  }), [fg]);
  return /*#__PURE__*/jsx(Flex, {
    UNSAFE_className: styleProps.className,
    UNSAFE_style: styleProps.style,
    ref: forwardedRef,
    ...filterDOMProps(otherProps, {
      labelable: true
    }),
    // appearance
    backgroundColor: bg,
    borderRadius: "full",
    height: "element.small",
    minWidth: 0,
    paddingX: "regular"
    // layout
    ,
    alignItems: "center",
    flexShrink: 0,
    gap: "small",
    inline: true,
    children: /*#__PURE__*/jsx(SlotProvider, {
      slots: slots,
      children: isReactText(children) ? /*#__PURE__*/jsx(Text, {
        children: children
      }) : children
    })
  });
});

export { Badge };

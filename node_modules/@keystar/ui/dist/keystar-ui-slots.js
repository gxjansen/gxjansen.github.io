'use client';
import { mergeProps, filterDOMProps } from '@react-aria/utils';
import React, { useContext, useMemo } from 'react';
import { jsx } from 'react/jsx-runtime';
import { useStyleProps } from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

let SlotContext = /*#__PURE__*/React.createContext({});

/**
 * Merge component props with ancestral slot props. With the exception of "id",
 * consumer props are overriden by slot props, while event handlers will be
 * chained so all are called.
 */
function useSlotProps(props, defaultSlot) {
  let slot = props.slot || defaultSlot;
  let {
    [slot]: slotProps = {}
  } = useContext(SlotContext);
  return mergeProps(props, mergeProps(slotProps, {
    id: props.id
  }));
}

/**
 * Not really "slots" like web components, more like "prop portalling" or
 * something. Default and override the props of descendent components.
 *
 * @example
 * <SlotProvider slots={{ text: { size: 'small' } }}>
 *   {children}
 * </SlotProvider>
 */
const SlotProvider = props => {
  let {
    children,
    slots
  } = props;
  let parentSlots = useContext(SlotContext);

  // Merge props for each slot from parent context and props
  let value = useMemo(() => Object.keys(parentSlots).concat(Object.keys(slots)).reduce((obj, key) => ({
    ...obj,
    [key]: mergeProps(parentSlots[key], slots[key])
  }), {}), [parentSlots, slots]);
  return /*#__PURE__*/jsx(SlotContext.Provider, {
    value: value,
    children: children
  });
};

// MAYBE: "preserve" some props?
// e.g. <ClearSlots preserve={{ slotName: true }} />
const ClearSlots = ({
  children
}) => {
  return /*#__PURE__*/jsx(SlotContext.Provider, {
    value: {},
    children: children
  });
};

/** A block of content within a container. */
const Content = forwardRefWithAs((props, ref) => {
  props = useSlotProps(props, 'content');
  let {
    elementType: Element = 'section',
    children,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(otherProps);
  return /*#__PURE__*/jsx(Element, {
    ...filterDOMProps(otherProps),
    ...styleProps,
    ref: ref,
    children: children
  });
});

/** A footer within a container. */
const Footer = forwardRefWithAs((props, ref) => {
  props = useSlotProps(props, 'footer');
  let {
    elementType: Element = 'footer',
    children,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(otherProps);
  return /*#__PURE__*/jsx(Element, {
    ...filterDOMProps(otherProps),
    ...styleProps,
    ref: ref,
    children: children
  });
});

/** A header within a container. */
const Header = forwardRefWithAs((props, ref) => {
  props = useSlotProps(props, 'header');
  let {
    elementType: Element = 'header',
    children,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(otherProps);
  return /*#__PURE__*/jsx(Element, {
    ...filterDOMProps(otherProps),
    ...styleProps,
    ref: ref,
    children: children
  });
});

export { ClearSlots, Content, Footer, Header, SlotProvider, useSlotProps };

'use client';
import { useTooltip, useTooltipTrigger } from '@react-aria/tooltip';
import { mergeProps, useObjectRef, mergeRefs, filterDOMProps } from '@react-aria/utils';
import React, { forwardRef, useContext, useRef, useMemo } from 'react';
import { DirectionIndicator, Overlay } from '@keystar/ui/overlays';
import { SlotProvider } from '@keystar/ui/slots';
import { tokenSchema, useStyleProps, toDataAttributes, classNames, css, transition } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';
import { useOverlayPosition } from '@react-aria/overlays';
import { jsxs, jsx } from 'react/jsx-runtime';
import { FocusableProvider } from '@react-aria/focus';
import { useTooltipTriggerState } from '@react-stately/tooltip';

const TooltipContext = /*#__PURE__*/React.createContext({});

const Tooltip = /*#__PURE__*/forwardRef(function Tooltip(props, forwardedRef) {
  let {
    state,
    targetRef: triggerRef,
    overlayRef: tooltipRef,
    crossOffset,
    offset,
    ...contextualProps
  } = useContext(TooltipContext);
  props = mergeProps(props, contextualProps);
  let {
    isOpen,
    tone,
    ...otherProps
  } = props;
  let targetGapToken = tokenSchema.size.space.regular;
  let {
    tooltipProps
  } = useTooltip(contextualProps, state);
  let styleProps = useStyleProps(otherProps);
  let ref = useRef(null);
  let overlayRef = useObjectRef(tooltipRef ? mergeRefs(tooltipRef, forwardedRef) : forwardedRef); // for testing etc. tooltips may be rendered w/o a trigger
  let targetRef = triggerRef !== null && triggerRef !== void 0 ? triggerRef : ref; // for testing etc. tooltips may be rendered w/o a trigger

  let slots = useMemo(() => ({
    icon: {
      size: 'small',
      color: 'inherit'
    },
    text: {
      size: 'small',
      color: 'inherit'
    },
    kbd: {
      size: 'small',
      color: 'inherit'
    }
  }), []);
  let preferredPlacement = contextualProps.placement || 'top';
  let {
    overlayProps,
    arrowProps,
    placement: resolvedPlacement
  } = useOverlayPosition({
    ...contextualProps,
    placement: preferredPlacement,
    isOpen: state === null || state === void 0 ? void 0 : state.isOpen,
    overlayRef,
    targetRef
  });
  let placement = (resolvedPlacement || preferredPlacement).split(' ')[0];
  return /*#__PURE__*/jsxs("div", {
    ...mergeProps(overlayProps, tooltipProps),
    ...filterDOMProps(otherProps),
    ...toDataAttributes({
      placement,
      tone,
      open: isOpen || undefined
    }),
    ref: overlayRef,
    className: classNames(css({
      backgroundColor: tokenSchema.color.background.inverse,
      color: tokenSchema.color.foreground.inverse,
      borderRadius: tokenSchema.size.radius.small,
      maxWidth: tokenSchema.size.alias.singleLineWidth,
      minHeight: tokenSchema.size.element.small,
      paddingBlock: tokenSchema.size.space.regular,
      paddingInline: tokenSchema.size.space.regular,
      opacity: 0,
      pointerEvents: 'none',
      transition: transition(['opacity', 'transform']),
      userSelect: 'none',
      '&[data-tone="accent"]': {
        backgroundColor: tokenSchema.color.background.accentEmphasis,
        color: tokenSchema.color.foreground.onEmphasis
      },
      '&[data-tone="critical"]': {
        backgroundColor: tokenSchema.color.background.criticalEmphasis,
        color: tokenSchema.color.foreground.onEmphasis
      },
      '&[data-tone="positive"]': {
        backgroundColor: tokenSchema.color.background.positiveEmphasis,
        color: tokenSchema.color.foreground.onEmphasis
      },
      // animate towards placement, away from the trigger
      '&[data-placement="top"]': {
        marginBottom: targetGapToken,
        transform: `translateY(calc(${targetGapToken} * 0.5))`
      },
      '&[data-placement="bottom"]': {
        marginTop: targetGapToken,
        transform: `translateY(calc(${targetGapToken} * -0.5))`
      },
      '&[data-placement="left"], [dir=ltr] &[data-placement="start"], [dir=rtl] &[data-placement="end"]': {
        marginRight: targetGapToken,
        transform: `translateX(calc(${targetGapToken} * 0.5))`
      },
      '&[data-placement="right"], [dir=ltr] &[data-placement="end"], [dir=rtl] &[data-placement="start"]': {
        marginLeft: targetGapToken,
        transform: `translateX(calc(${targetGapToken} * -0.5))`
      },
      '&[data-open="true"]': {
        opacity: 1,
        transform: `translate(0)`
      }
    }), styleProps.className),
    style: {
      ...overlayProps.style,
      ...tooltipProps.style,
      ...styleProps.style
    },
    children: [/*#__PURE__*/jsx("div", {
      className: css({
        alignItems: 'center',
        boxSizing: 'border-box',
        display: 'flex',
        gap: tokenSchema.size.space.small
      }),
      children: /*#__PURE__*/jsx(SlotProvider, {
        slots: slots,
        children: props.children && (isReactText(props.children) ? /*#__PURE__*/jsx(Text, {
          children: props.children
        }) : props.children)
      })
    }), /*#__PURE__*/jsx(DirectionIndicator, {
      ...arrowProps,
      fill: toneToFill[tone !== null && tone !== void 0 ? tone : 'neutral'],
      placement: placement,
      size: "xsmall"
    })]
  });
});
const toneToFill = {
  accent: 'accent',
  critical: 'critical',
  neutral: 'inverse',
  positive: 'positive'
};

const MOUSE_REST_TIMEOUT = 600;
function TooltipTrigger(props) {
  let {
    children,
    isDisabled,
    trigger: triggerMode,
    ...otherProps
  } = props;
  let targetRef = useRef(null);
  let overlayRef = useRef(null);
  let state = useTooltipTriggerState({
    isDisabled,
    delay: MOUSE_REST_TIMEOUT,
    trigger: triggerMode,
    ...props
  });
  let {
    triggerProps,
    tooltipProps
  } = useTooltipTrigger({
    isDisabled,
    trigger: triggerMode
  }, state, targetRef);
  let [triggerElement, tooltipElement] = React.Children.toArray(children);
  return /*#__PURE__*/jsxs(FocusableProvider, {
    ...triggerProps,
    ref: targetRef,
    children: [triggerElement, /*#__PURE__*/jsx(TooltipContext.Provider, {
      value: {
        overlayRef,
        targetRef,
        state,
        ...otherProps,
        ...tooltipProps
      },
      children: /*#__PURE__*/jsx(Overlay, {
        isOpen: state.isOpen,
        nodeRef: overlayRef,
        children: tooltipElement
      })
    })]
  });
}

// Support TooltipTrigger inside components using CollectionBuilder.
TooltipTrigger.getCollectionNode = function* (props) {
  // Children.toArray mutates the key prop, use Children.forEach instead.
  let childArray = [];
  React.Children.forEach(props.children, child => {
    if ( /*#__PURE__*/React.isValidElement(child)) {
      childArray.push(child);
    }
  });
  let [trigger, tooltip] = childArray;
  yield {
    element: trigger,
    wrapper: element => /*#__PURE__*/jsxs(TooltipTrigger, {
      ...props,
      children: [element, tooltip]
    }, element.key)
  };
};

/**
 * TooltipTrigger wraps around a trigger element and a Tooltip. It handles opening and closing
 * the Tooltip when the user hovers over or focuses the trigger, and positioning the Tooltip
 * relative to the trigger.
 */
// We don't want getCollectionNode to show up in the type definition
let _TooltipTrigger = TooltipTrigger;

export { Tooltip, _TooltipTrigger as TooltipTrigger };

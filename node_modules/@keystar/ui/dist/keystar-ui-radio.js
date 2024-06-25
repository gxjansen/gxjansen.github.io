'use client';
import { useRadio, useRadioGroup } from '@react-aria/radio';
import React, { useRef, useMemo, forwardRef } from 'react';
import { SlotProvider } from '@keystar/ui/slots';
import { ClassList, tokenSchema, useStyleProps, css, classNames, FocusRing, transition, resetClassName, toDataAttributes } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRadioGroupState } from '@react-stately/radio';
import { useProviderProps } from '@keystar/ui/core';
import { validateFieldProps, FieldPrimitive } from '@keystar/ui/field';

const RadioContext = /*#__PURE__*/React.createContext(null);
function useRadioProvider() {
  const context = React.useContext(RadioContext);
  if (!context) {
    throw new Error('useRadioProvider must be used within a RadioGroupProvider');
  }
  return context;
}

const radioClassList = new ClassList('Radio', ['indicator']);
function Radio(props) {
  let {
    children,
    autoFocus,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(otherProps);
  let inputRef = useRef(null);
  let radioGroupProps = useRadioProvider();
  let {
    state
  } = radioGroupProps;
  let {
    inputProps
  } = useRadio({
    ...props,
    ...radioGroupProps
  }, state, inputRef);
  const inputClassName = css({
    position: 'absolute',
    zIndex: 1,
    inset: 0,
    opacity: 0.0001
  });
  const labelClassName = css({
    alignItems: 'flex-start',
    display: 'inline-flex',
    gap: tokenSchema.size.space.regular,
    position: 'relative',
    userSelect: 'none'
  });
  const slots = useMemo(() => ({
    text: {
      color: 'inherit'
    },
    description: {
      color: 'neutralTertiary'
    }
  }), []);
  return /*#__PURE__*/jsxs("label", {
    className: classNames(styleProps.className, labelClassName),
    style: styleProps.style,
    children: [/*#__PURE__*/jsx(FocusRing, {
      autoFocus: autoFocus,
      children: /*#__PURE__*/jsx("input", {
        ...inputProps,
        ref: inputRef,
        className: classNames(inputClassName)
      })
    }), /*#__PURE__*/jsx(Indicator, {
      inputClassName: inputClassName
    }), /*#__PURE__*/jsx(SlotProvider, {
      slots: slots,
      children: children && /*#__PURE__*/jsx(Content, {
        children: isReactText(children) ? /*#__PURE__*/jsx(Text, {
          children: children
        }) : children
      })
    })]
  });
}

// Styled components
// -----------------------------------------------------------------------------

let sizeToken = tokenSchema.size.element.xsmall;
const Indicator = props => {
  let {
    inputClassName
  } = props;
  return /*#__PURE__*/jsx("span", {
    className: classNames(css({
      backgroundColor: tokenSchema.color.background.canvas,
      borderRadius: tokenSchema.size.radius.full,
      color: tokenSchema.color.foreground.onEmphasis,
      display: 'flex',
      flexShrink: 0,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      height: sizeToken,
      width: sizeToken,
      // indicator icons
      [radioClassList.selector('indicator')]: {
        opacity: 0,
        transform: `scale(0) translate3d(0, 0, 0)`,
        transition: transition(['opacity', 'transform']),
        willChange: 'opacity, transform'
      },
      // focus ring
      '::after': {
        borderRadius: tokenSchema.size.radius.full,
        content: '""',
        inset: 0,
        margin: 0,
        position: 'absolute',
        transition: transition(['box-shadow', 'margin'], {
          easing: 'easeOut'
        })
      },
      [`.${inputClassName}[data-focus=visible] + &::after`]: {
        boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
        margin: `calc(${tokenSchema.size.alias.focusRingGap} * -1)`
      },
      // border / background
      '&::before': {
        border: `${tokenSchema.size.border.medium} solid ${tokenSchema.color.alias.borderIdle}`,
        borderRadius: `inherit`,
        content: '""',
        inset: 0,
        margin: 0,
        position: 'absolute',
        transition: transition(['border-color', 'border-width'], {
          duration: 'regular'
        })
      },
      [`.${inputClassName}:disabled + &`]: {
        color: tokenSchema.color.alias.foregroundDisabled,
        '&::before': {
          borderColor: tokenSchema.color.alias.borderDisabled
        }
      },
      [`.${inputClassName}:enabled:hover + &::before`]: {
        borderColor: tokenSchema.color.alias.borderHovered
      },
      [`.${inputClassName}:enabled:active + &::before`]: {
        borderColor: tokenSchema.color.alias.borderPressed
      },
      // checked states
      [`.${inputClassName}:checked + &`]: {
        '&::before': {
          borderWidth: `calc(${sizeToken} / 2)`
        },
        [radioClassList.selector('indicator')]: {
          opacity: 1,
          transform: `scale(1)`
        }
      },
      [`.${inputClassName}:enabled:checked + &::before`]: {
        borderColor: tokenSchema.color.scale.indigo9
      },
      [`.${inputClassName}:enabled:checked:hover + &::before`]: {
        borderColor: tokenSchema.color.scale.indigo10
      },
      [`.${inputClassName}:enabled:checked:active + &::before`]: {
        borderColor: tokenSchema.color.scale.indigo11
      }
    })),
    children: /*#__PURE__*/jsx("span", {
      className: radioClassList.element('indicator'),
      children: /*#__PURE__*/jsx("svg", {
        className: resetClassName,
        fill: "currentColor",
        height: 12,
        viewBox: "0 0 24 24",
        width: 12,
        children: /*#__PURE__*/jsx("circle", {
          cx: "12",
          cy: "12",
          r: "6"
        })
      })
    })
  });
};
const Content = props => {
  return /*#__PURE__*/jsx("div", {
    className: classNames(css({
      color: tokenSchema.color.alias.foregroundIdle,
      display: 'grid',
      paddingTop: `calc((${sizeToken} - ${tokenSchema.typography.text.regular.capheight}) / 2)`,
      gap: tokenSchema.size.space.large,
      'input[type="radio"]:hover ~ &': {
        color: tokenSchema.color.alias.foregroundHovered
      },
      'input[type="radio"]:disabled ~ &': {
        color: tokenSchema.color.alias.foregroundDisabled
      }
    })),
    ...props
  });
};

/**
 * Radio groups allow users to select a single option from a list of mutually
 * exclusive options.
 */
const RadioGroup = /*#__PURE__*/forwardRef(function RadioGroup(props, forwardedRef) {
  props = useProviderProps(props);
  props = validateFieldProps(props);
  let {
    validationState,
    children,
    orientation = 'vertical'
  } = props;
  let state = useRadioGroupState(props);
  let {
    radioGroupProps,
    labelProps,
    descriptionProps,
    errorMessageProps
  } = useRadioGroup(props, state);
  return /*#__PURE__*/jsx(FieldPrimitive, {
    ...props,
    ref: forwardedRef,
    labelProps: labelProps,
    descriptionProps: descriptionProps,
    errorMessageProps: errorMessageProps,
    children: /*#__PURE__*/jsx("div", {
      ...radioGroupProps,
      ...toDataAttributes({
        orientation
      }),
      className: classNames(css({
        display: 'flex',
        gap: tokenSchema.size.space.large,
        '&[data-orientation="vertical"]': {
          flexDirection: 'column'
        }
      })),
      children: /*#__PURE__*/jsx(RadioContext.Provider, {
        value: {
          validationState,
          state
        },
        children: children
      })
    })
  });
});

export { Radio, RadioGroup };

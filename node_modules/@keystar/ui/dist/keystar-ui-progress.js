'use client';
import { useMeter } from '@react-aria/meter';
import { keyframes, useStyleProps, classNames, css, tokenSchema, toDataAttributes, transition } from '@keystar/ui/style';
import { forwardRef } from 'react';
import { clamp } from '@react-aria/utils';
import { warning } from 'emery';
import { Text } from '@keystar/ui/typography';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useProgressBar } from '@react-aria/progress';

/** @private Internal component shared between `Meter` and `ProgressBar`. */
const BarBase = /*#__PURE__*/forwardRef(function BarBase(props, forwardedRef) {
  let {
    value = 0,
    minValue = 0,
    maxValue = 100,
    label,
    barClassName,
    showValueLabel = !!label,
    isIndeterminate,
    barProps,
    labelProps,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(otherProps);
  value = clamp(value, minValue, maxValue);
  let barStyle = {};
  if (!isIndeterminate) {
    let percentage = (value - minValue) / (maxValue - minValue);
    barStyle.width = `${Math.round(percentage * 100)}%`;
  }
  warning(!!(label || ariaLabel || ariaLabelledby), 'If you do not provide a visible label via children, you must specify an aria-label or aria-labelledby attribute for accessibility.');
  return /*#__PURE__*/jsxs("div", {
    ...barProps,
    ...styleProps,
    ref: forwardedRef,
    className: classNames(css({
      '--bar-fill': tokenSchema.color.background.accentEmphasis,
      alignItems: 'flex-start',
      display: 'inline-flex',
      gap: tokenSchema.size.space.regular,
      flexFlow: 'wrap',
      isolation: 'isolate',
      justifyContent: 'space-between',
      minWidth: 0,
      position: 'relative',
      verticalAlign: 'top',
      width: tokenSchema.size.alias.singleLineWidth
    }), barClassName, styleProps.className),
    children: [label && /*#__PURE__*/jsx(Text, {
      ...labelProps,
      flex: true,
      children: label
    }), showValueLabel && barProps && /*#__PURE__*/jsx(Text, {
      flexShrink: 0,
      children: barProps['aria-valuetext']
    }), /*#__PURE__*/jsx("div", {
      className: css({
        backgroundColor: tokenSchema.color.border.muted,
        borderRadius: tokenSchema.size.radius.full,
        height: tokenSchema.size.space.regular,
        minWidth: 0,
        overflow: 'hidden',
        width: '100%',
        zIndex: '1'
      }),
      children: /*#__PURE__*/jsx("div", {
        ...toDataAttributes({
          indeterminate: isIndeterminate !== null && isIndeterminate !== void 0 ? isIndeterminate : undefined
        }),
        className: css({
          backgroundColor: 'var(--bar-fill)',
          height: tokenSchema.size.space.regular,
          transition: transition('width', {
            duration: 'regular'
          }),
          '&[data-indeterminate]': {
            animation: `${indeterminateLoopLtr} ${tokenSchema.animation.duration.long} ${tokenSchema.animation.easing.easeInOut} infinite`,
            willChange: 'transform',
            '[dir=rtl] &': {
              animationName: indeterminateLoopRtl
            }
          }
        }),
        style: barStyle
      })
    })]
  });
});
const indeterminateLoopLtr = keyframes({
  from: {
    transform: 'translate(-100%)'
  },
  to: {
    transform: 'translate(100%)'
  }
});
const indeterminateLoopRtl = keyframes({
  from: {
    transform: 'translate(100%)'
  },
  to: {
    transform: 'translate(-100%)'
  }
});

/**
 * Meters are visual representations of a quantity or an achievement. Their
 * progress is determined by user actions, rather than system actions.
 */
const Meter = /*#__PURE__*/forwardRef(function Meter(props, forwardedRef) {
  let {
    tone,
    ...otherProps
  } = props;
  const {
    meterProps,
    labelProps
  } = useMeter(props);
  return /*#__PURE__*/jsx(BarBase, {
    ...otherProps,
    ref: forwardedRef,
    barClassName: css({
      '&[data-tone="positive"]': {
        '--bar-fill': tokenSchema.color.background.positiveEmphasis
      },
      '&[data-tone="caution"]': {
        '--bar-fill': tokenSchema.color.background.cautionEmphasis
      },
      '&[data-tone="critical"]': {
        '--bar-fill': tokenSchema.color.background.criticalEmphasis
      }
    }),
    barProps: {
      ...meterProps,
      ...toDataAttributes({
        tone
      })
    },
    labelProps: labelProps
  });
});

/**
 * ProgressBars show the progression of a system operation: downloading, uploading, processing, etc., in a visual way.
 * They can represent either determinate or indeterminate progress.
 */
const ProgressBar = /*#__PURE__*/forwardRef(function ProgressBar(props, forwardedRef) {
  const {
    progressBarProps,
    labelProps
  } = useProgressBar(props);
  return /*#__PURE__*/jsx(BarBase, {
    ...props,
    ref: forwardedRef,
    barProps: progressBarProps,
    labelProps: labelProps
  });
});

/**
 * Progress circles show the progression of a system operation such as
 * downloading, uploading, processing, etc. in a visual way. They can represent
 * determinate or indeterminate progress.
 */
const ProgressCircle = /*#__PURE__*/forwardRef(function ProgressCircle(props, forwardRef) {
  let {
    value = 0,
    minValue = 0,
    maxValue = 100,
    size = 'medium',
    isIndeterminate,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...otherProps
  } = props;
  value = clamp(value, minValue, maxValue);
  let {
    progressBarProps
  } = useProgressBar({
    ...props,
    value
  });
  let styleProps = useStyleProps(otherProps);
  warning(!!(ariaLabel || ariaLabelledby), 'ProgressCircle requires an aria-label or aria-labelledby attribute for accessibility.');
  return /*#__PURE__*/jsx("div", {
    ...styleProps,
    ...progressBarProps,
    ref: forwardRef,
    ...toDataAttributes({
      indeterminate: isIndeterminate !== null && isIndeterminate !== void 0 ? isIndeterminate : undefined,
      size: size === 'medium' ? undefined : size
    }),
    className: classNames(css({
      height: 'var(--diameter)',
      width: 'var(--diameter)',
      '--PI': 3.14159,
      '--diameter': tokenSchema.size.element.regular,
      '--radius': 'calc(var(--diameter) / 2)',
      '--stroke-width': tokenSchema.size.scale[40],
      // TODO: component tokent
      '--offset-radius': 'calc(var(--radius) - var(--stroke-width) / 2)',
      '--circumference': `calc(var(--offset-radius) * var(--PI) * 2)`,
      ['&[data-size=small]']: {
        '--diameter': tokenSchema.size.element.xsmall,
        '--stroke-width': tokenSchema.size.border.medium
      },
      ['&[data-size=large]']: {
        '--diameter': tokenSchema.size.element.xlarge,
        '--stroke-width': tokenSchema.size.border.large
      }
    }), styleProps.className),
    style: {
      // @ts-ignore
      '--percent': (value - minValue) / (maxValue - minValue),
      ...styleProps.style
    },
    children: /*#__PURE__*/jsxs("svg", {
      ...toDataAttributes({
        indeterminate: isIndeterminate !== null && isIndeterminate !== void 0 ? isIndeterminate : undefined
      }),
      role: "presentation",
      tabIndex: -1,
      className: css({
        height: 'var(--diameter)',
        width: 'var(--diameter)',
        '&[data-indeterminate]': {
          animation: `${rotateAnimation} ${tokenSchema.animation.duration.xlong} linear infinite`
        }
      }),
      children: [/*#__PURE__*/jsx("circle", {
        className: circle({
          stroke: tokenSchema.color.border.muted
        })
      }), /*#__PURE__*/jsx("circle", {
        ...toDataAttributes({
          indeterminate: isIndeterminate !== null && isIndeterminate !== void 0 ? isIndeterminate : undefined
        }),
        className: circle({
          stroke: tokenSchema.color.background.accentEmphasis,
          strokeDasharray: 'var(--circumference)',
          strokeLinecap: 'round',
          '&:not([data-indeterminate])': {
            strokeDashoffset: `calc(var(--circumference) - var(--percent) * var(--circumference))`,
            transition: transition('stroke-dashoffset', {
              duration: 'regular'
            }),
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          },
          '&[data-indeterminate]': {
            animation: `${dashAnimation} ${tokenSchema.animation.duration.xlong} ${tokenSchema.animation.easing.easeInOut} infinite`
          }
        })
      })]
    })
  });
});

// Utils
// -----------------------------------------------------------------------------

function circle(styles) {
  return css([{
    cx: 'var(--radius)',
    cy: 'var(--radius)',
    r: 'var(--offset-radius)',
    fill: 'transparent',
    strokeWidth: 'var(--stroke-width)'
  }, styles]);
}
const rotateAnimation = keyframes({
  from: {
    transform: 'rotate(0deg)'
  },
  to: {
    transform: 'rotate(360deg)'
  }
});
const dashAnimation = keyframes({
  from: {
    strokeDashoffset: 'calc(var(--circumference) * 1.25)'
  },
  to: {
    strokeDashoffset: 'calc(var(--circumference) * -0.75)'
  }
});

export { Meter, ProgressBar, ProgressCircle };

'use client';
import { useSearchField } from '@react-aria/searchfield';
import { useObjectRef } from '@react-aria/utils';
import { useSearchFieldState } from '@react-stately/searchfield';
import { forwardRef } from 'react';
import { ClearButton } from '@keystar/ui/button';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { css } from '@keystar/ui/style';
import { TextFieldPrimitive } from '@keystar/ui/text-field';
import { jsx } from 'react/jsx-runtime';

/** Search fields are text fields, specifically designed for search behaviour. */
const SearchField = /*#__PURE__*/forwardRef(function SearchField(props, forwardedRef) {
  const {
    autoFocus,
    description,
    errorMessage,
    id,
    isDisabled,
    isReadOnly,
    isRequired,
    label,
    showIcon = true,
    ...styleProps
  } = props;
  let domRef = useObjectRef(forwardedRef);
  let state = useSearchFieldState(props);
  let {
    labelProps,
    inputProps,
    clearButtonProps,
    descriptionProps,
    errorMessageProps
  } = useSearchField(props, state, domRef);
  let clearButtonVisible = state.value !== '' && !props.isReadOnly;
  let clearButton = /*#__PURE__*/jsx(ClearButton, {
    ...clearButtonProps,
    preventFocus: true,
    isDisabled: isDisabled
  });
  let startElement = /*#__PURE__*/jsx(Flex, {
    alignItems: "center",
    flexShrink: 0,
    justifyContent: "center",
    pointerEvents: "none",
    width: "element.regular",
    children: /*#__PURE__*/jsx(Icon, {
      src: searchIcon,
      color: props.isDisabled ? 'color.alias.foregroundDisabled' : 'neutralSecondary'
    })
  });
  return /*#__PURE__*/jsx(TextFieldPrimitive, {
    ref: domRef,
    ...styleProps,
    isDisabled: isDisabled,
    isReadOnly: isReadOnly,
    isRequired: isRequired,
    label: label,
    labelProps: labelProps,
    inputProps: inputProps,
    inputWrapperProps: {
      className: css({
        input: {
          '&[data-adornment="start"]': {
            paddingInlineStart: 0
          },
          '&[data-adornment="end"]': {
            paddingInlineEnd: 0
          },
          '&[data-adornment="both"]': {
            paddingInline: 0
          }
        }
      })
    },
    description: description,
    descriptionProps: descriptionProps,
    errorMessage: errorMessage,
    errorMessageProps: errorMessageProps,
    startElement: showIcon && startElement,
    endElement: clearButtonVisible && clearButton
  });
});

export { SearchField };

import { DateValue } from '@react-types/datepicker';
import { ReactElement, Ref } from 'react';
import { DatePickerProps } from "./types.js";
/**
 * DatePickers combine a DateField and a Calendar popover to allow users to
 * enter or select a date and time value.
 */
declare const _DatePicker: <T extends DateValue>(props: DatePickerProps<T> & {
    ref?: Ref<HTMLDivElement>;
}) => ReactElement;
export { _DatePicker as DatePicker };
export declare function usePickerStyles(state: {
    isHovered: boolean;
    isFocused: boolean;
    isFocusVisible: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
}): {
    button: {
        UNSAFE_className: string;
    };
    input: {
        className: string;
    };
    root: {
        className: string;
    };
};

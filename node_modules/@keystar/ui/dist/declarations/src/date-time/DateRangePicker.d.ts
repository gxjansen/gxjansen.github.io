import { DateValue } from '@react-types/datepicker';
import { ReactElement, Ref } from 'react';
import { DateRangePickerProps } from "./types.js";
/**
 * DateRangePickers combine two DateFields and a RangeCalendar popover to allow users
 * to enter or select a date and time range.
 */
declare const _DateRangePicker: <T extends DateValue>(props: DateRangePickerProps<T> & {
    ref?: Ref<HTMLDivElement>;
}) => ReactElement;
export { _DateRangePicker as DateRangePicker };

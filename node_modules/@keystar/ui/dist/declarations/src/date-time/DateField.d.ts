import { DateValue } from '@react-types/datepicker';
import { ReactElement, Ref } from 'react';
import { DateFieldProps } from "./types.js";
/**
 * DateFields allow users to enter and edit date and time values using a keyboard.
 * Each part of a date value is displayed in an individually editable segment.
 */
declare const _DateField: <T extends DateValue>(props: DateFieldProps<T> & {
    ref?: Ref<HTMLDivElement>;
}) => ReactElement;
export { _DateField as DateField };

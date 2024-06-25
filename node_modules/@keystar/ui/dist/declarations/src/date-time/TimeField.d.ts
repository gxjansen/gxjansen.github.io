import { ReactElement, Ref } from 'react';
import { TimeValue } from '@react-types/datepicker';
import { TimeFieldProps } from "./types.js";
/**
 * TimeFields allow users to enter and edit time values using a keyboard.
 * Each part of the time is displayed in an individually editable segment.
 */
declare const _TimeField: <T extends TimeValue>(props: TimeFieldProps<T> & {
    ref?: Ref<HTMLDivElement>;
}) => ReactElement;
export { _TimeField as TimeField };

import { ReactElement, RefObject } from 'react';
import { PickerProps } from "./types.js";
/**
 * Pickers allow users to choose a single option from a collapsible list of options when space is limited.
 */
declare const _Picker: <T>(props: PickerProps<T> & {
    ref?: RefObject<HTMLDivElement>;
}) => ReactElement;
export { _Picker as Picker };

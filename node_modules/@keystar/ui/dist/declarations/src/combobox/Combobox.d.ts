import { ForwardedRef, ReactElement } from 'react';
import { ComboboxProps } from "./types.js";
/**
 * A combobox combines a text input with a listbox, and allows users to filter a
 * list of options.
 */
declare const _Combobox: <T>(props: ComboboxProps<T> & {
    ref?: ForwardedRef<HTMLDivElement>;
}) => ReactElement;
export { _Combobox as Combobox };

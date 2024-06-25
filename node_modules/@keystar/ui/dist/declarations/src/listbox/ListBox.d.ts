import { ReactElement, RefObject } from 'react';
import { ListBoxProps } from "./types.js";
/**
 * A list of options that can allow selection of one or more.
 */
declare const _ListBox: <T>(props: ListBoxProps<T> & {
    ref?: RefObject<HTMLDivElement>;
}) => ReactElement;
export { _ListBox as ListBox };

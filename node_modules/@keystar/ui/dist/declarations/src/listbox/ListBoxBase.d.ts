import { ListLayout } from '@react-stately/layout';
import { ListState } from '@react-stately/list';
import { RefObject, ReactElement } from 'react';
import { ListBoxBaseProps } from "./types.js";
/** @private */
export declare function useListBoxLayout<T>(state: ListState<T>): ListLayout<T>;
declare const _ListBoxBase: <T>(props: ListBoxBaseProps<T> & {
    ref?: RefObject<HTMLDivElement>;
}) => ReactElement;
export { _ListBoxBase as ListBoxBase };

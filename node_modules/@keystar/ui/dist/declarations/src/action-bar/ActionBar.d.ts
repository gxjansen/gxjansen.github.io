import { ForwardedRef, ReactElement } from 'react';
import { ActionBarProps } from "./types.js";
/**
 * Action bars are used for single and bulk selection patterns when a user needs
 * to perform actions on one or more items at the same time.
 */
declare const _ActionBar: <T>(props: ActionBarProps<T> & {
    ref?: ForwardedRef<HTMLDivElement>;
}) => ReactElement;
export { _ActionBar as ActionBar };

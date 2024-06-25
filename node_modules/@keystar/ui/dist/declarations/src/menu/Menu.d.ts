import { RefObject, ReactElement } from 'react';
import { MenuProps } from "./types.js";
/**
 * Menus display a list of actions or options that a user can choose.
 */
declare const _Menu: <T>(props: MenuProps<T> & {
    ref?: RefObject<HTMLDivElement>;
}) => ReactElement;
export { _Menu as Menu };

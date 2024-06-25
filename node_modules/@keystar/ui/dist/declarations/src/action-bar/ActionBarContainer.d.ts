import { ForwardRefExoticComponent, Ref } from 'react';
import { ActionBarContainerProps } from "./types.js";
/**
 * ActionBarContainer wraps around an ActionBar and a component that supports selection. It handles
 * the ActionBar's position with respect to its linked component.
 */
declare const _ActionBarContainer: ForwardRefExoticComponent<ActionBarContainerProps & {
    ref?: Ref<HTMLDivElement>;
}>;
export { _ActionBarContainer as ActionBarContainer };

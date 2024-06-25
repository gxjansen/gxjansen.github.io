import { ForwardRefExoticComponent, Ref } from 'react';
import { TooltipProps } from "./types.js";
/**
 * A floating text label that succinctly describes the function of an
 * interactive element, typically an icon-only button.
 *
 * Tooltips are invoked on hover and keyboard focus. They cannot include
 * interactive elements.
 */
export declare const Tooltip: ForwardRefExoticComponent<TooltipProps & {
    ref?: Ref<HTMLDivElement>;
}>;

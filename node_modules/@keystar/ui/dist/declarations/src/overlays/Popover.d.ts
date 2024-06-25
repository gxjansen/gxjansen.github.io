import { ForwardRefExoticComponent, Ref } from 'react';
import { PopoverProps } from "./types.js";
/**
 * A low-level utility component for implementing things like info dialogs,
 * menus and pickers.
 */
export declare const Popover: ForwardRefExoticComponent<PopoverProps & {
    ref?: Ref<HTMLDivElement>;
}>;

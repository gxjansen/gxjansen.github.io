import { ForwardRefExoticComponent, Ref } from 'react';
import { TrayProps } from "./types.js";
/**
 * A low-level utility component for implementing things like info dialogs,
 * menus and pickers. They should only ever be displayed on devices with small
 * screens, for interfaces where popovers wouldn't be appropriate.
 */
export declare const Tray: ForwardRefExoticComponent<TrayProps & {
    ref?: Ref<HTMLDivElement>;
}>;

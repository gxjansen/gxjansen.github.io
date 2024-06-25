import { ForwardRefExoticComponent, Ref } from 'react';
import { ModalProps } from "./types.js";
/**
 * A low-level utility component for implementing things like dialogs and
 * popovers, in a layer above the page.
 */
export declare const Modal: ForwardRefExoticComponent<ModalProps & {
    ref?: Ref<HTMLDivElement>;
}>;

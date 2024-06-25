import { ForwardRefExoticComponent, Ref } from 'react';
import { AlertDialogProps } from "./types.js";
/**
 * AlertDialogs are a specific type of Dialog. They display important
 * information that users need to acknowledge.
 */
export declare const AlertDialog: ForwardRefExoticComponent<AlertDialogProps & {
    ref?: Ref<HTMLDivElement>;
}>;

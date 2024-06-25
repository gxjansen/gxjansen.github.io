import { ForwardRefExoticComponent, Ref } from 'react';
import { DialogProps } from "./types.js";
/**
 * Dialogs are windows containing contextual information, tasks, or workflows
 * that appear over the user interface. Depending on the kind of dialog, further
 * interactions may be blocked until the dialog is closed.
 */
export declare const Dialog: ForwardRefExoticComponent<DialogProps & {
    ref?: Ref<HTMLDivElement>;
}>;

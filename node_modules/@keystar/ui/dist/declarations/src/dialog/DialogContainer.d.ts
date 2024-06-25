import React from 'react';
import { DialogContainerProps } from "./types.js";
/**
 * A DialogContainer accepts a single Dialog as a child, and manages showing and hiding
 * it in a modal. Useful in cases where there is no trigger element
 * or when the trigger unmounts while the dialog is open.
 */
export declare function DialogContainer(props: DialogContainerProps): React.JSX.Element;

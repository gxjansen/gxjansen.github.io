import React, { ReactNode } from 'react';
import { ToasterProps, ToastOptions } from "./types.js";
type CloseFunction = () => void;
/** @private For testing. */
export declare function clearToastQueue(): void;
/**
 * A Toaster renders the queued toasts in an application. It should be
 * placed at the root of the app.
 */
export declare function Toaster(props: ToasterProps): React.JSX.Element | null;
export declare const toastQueue: {
    /** Queues a neutral toast. */
    neutral(children: ReactNode, options?: ToastOptions): CloseFunction;
    /** Queues a positive toast. */
    positive(children: ReactNode, options?: ToastOptions): CloseFunction;
    /** Queues a critical toast. */
    critical(children: ReactNode, options?: ToastOptions): CloseFunction;
    /** Queues an informational toast. */
    info(children: ReactNode, options?: ToastOptions): CloseFunction;
};
export {};

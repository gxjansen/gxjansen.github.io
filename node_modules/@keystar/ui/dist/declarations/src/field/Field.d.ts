import { FieldProps, FieldRenderProp } from "./types.js";
type InternalFieldProps = {
    children: FieldRenderProp;
} & FieldProps;
/**
 * Provides the accessibility implementation for input fields. Fields accept
 * user input, gain context from their label, and may display a description or
 * error message.
 */
export declare const Field: (props: InternalFieldProps) => import("react").JSX.Element;
export {};

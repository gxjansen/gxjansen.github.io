import { ForwardRefExoticComponent, Ref } from 'react';
import { FieldPrimitiveProps } from "./types.js";
/**
 * Provides the accessibility implementation for input fields. Fields accept
 * user input, gain context from their label, and may display a description or
 * error message.
 */
export declare const FieldPrimitive: ForwardRefExoticComponent<FieldPrimitiveProps & {
    ref?: Ref<HTMLDivElement>;
}>;

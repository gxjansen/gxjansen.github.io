import { ForwardRefExoticComponent, Ref } from 'react';
import { TextFieldPrimitiveProps } from "./types.js";
type InputOrTextArea = HTMLInputElement | HTMLTextAreaElement;
/** Internal component for default appearance and behaviour. */
export declare const TextFieldPrimitive: ForwardRefExoticComponent<TextFieldPrimitiveProps & {
    ref?: Ref<InputOrTextArea>;
}>;
export {};

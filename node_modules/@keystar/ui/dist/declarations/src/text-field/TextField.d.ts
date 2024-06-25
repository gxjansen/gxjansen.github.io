import { ForwardRefExoticComponent, Ref } from 'react';
import { TextFieldProps } from "./types.js";
/** Text fields allow users to input text with a keyboard. */
export declare const TextField: ForwardRefExoticComponent<TextFieldProps & {
    ref?: Ref<HTMLInputElement>;
}>;

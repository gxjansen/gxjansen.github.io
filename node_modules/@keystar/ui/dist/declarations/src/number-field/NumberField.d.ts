import { ForwardRefExoticComponent, Ref } from 'react';
import { NumberFieldProps } from "./types.js";
/**
 * Number fields let users enter a numeric value and incrementally increase or
 * decrease the value with a step-button control.
 */
export declare const NumberField: ForwardRefExoticComponent<NumberFieldProps & {
    ref?: Ref<HTMLInputElement>;
}>;

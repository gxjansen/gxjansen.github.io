import { FieldProps } from "./types.js";
/**
 * Add `validationState` when `errorMessage` is provided. Used by
 * "@react-aria/*" hooks to determine aria attributes.
 */
export declare function validateFieldProps<T extends FieldProps>(props: T): T;

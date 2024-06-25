import { MaybeArray, ReactText } from "../../dist/keystar-ui-types.js";
/**
 * Checks if an unknown value is valid React text (string | number)?[]. This is
 * useful for conditionally wrapping some value when an element is required.
 */
export declare function isReactText(value: unknown): value is MaybeArray<ReactText>;

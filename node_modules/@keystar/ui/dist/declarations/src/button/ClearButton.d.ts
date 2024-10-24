import { ButtonProps } from "./types.js";
/**
 * A clear button is a button that is typically found on search fields and is
 * used to clear the current search query. This can be useful if the user has
 * entered a search query by mistake, or if they want to start over with a new
 * search.
 */
export declare const ClearButton: import("react").ForwardRefExoticComponent<Omit<ButtonProps, "children" | "prominence" | "tone"> & {
    excludeFromTabOrder?: boolean;
    preventFocus?: boolean;
    static?: "dark" | "light";
} & {
    elementType?: import("react").ElementType;
} & import("react").RefAttributes<HTMLButtonElement>>;

import { ButtonProps, CommonButtonProps } from "./types.js";
/**
 * Buttons are pressable elements that are used to trigger actions, their label
 * should express what action will occur when the user interacts with it.
 */
export declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLAnchorElement | HTMLButtonElement>>;
export declare const useButtonChildren: (props: CommonButtonProps) => import("react").JSX.Element;

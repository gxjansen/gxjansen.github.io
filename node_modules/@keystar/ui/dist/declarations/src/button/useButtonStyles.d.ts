import { ClassList } from "../../dist/keystar-ui-style.js";
import { ButtonProps } from "./types.js";
type ButtonState = {
    isHovered: boolean;
    isPressed: boolean;
    isPending?: boolean;
    isSelected?: boolean;
};
export declare const buttonClassList: ClassList<"text" | "icon">;
export declare function useButtonStyles(props: ButtonProps, state: ButtonState): {
    style: import("react").CSSProperties | undefined;
    className: string;
};
export {};

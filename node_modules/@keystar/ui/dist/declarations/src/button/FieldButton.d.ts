import { ForwardRefExoticComponent, Ref } from 'react';
import { FieldButtonProps } from "./types.js";
/** @private Internal component for composing complex field interactions. */
export declare const FieldButton: ForwardRefExoticComponent<FieldButtonProps & {
    ref?: Ref<HTMLButtonElement>;
}>;
type FieldButtonState = {
    isHovered: boolean;
    isPressed: boolean;
};
export declare function useFieldButton(props: FieldButtonProps, state: FieldButtonState): {
    children: import("react").JSX.Element;
    styleProps: {
        style: import("react").CSSProperties | undefined;
        className: string;
    };
};
export {};

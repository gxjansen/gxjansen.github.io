import { ClassList } from "../../../dist/keystar-ui-style.js";
import { PickRequired, TextProps } from "../../../dist/keystar-ui-types.js";
export declare const textClassList: ClassList<"root" | (string & {})>;
export declare function useTextStyles(props: PickRequired<TextProps, 'color' | 'size' | 'weight'>): Pick<import("react").HTMLAttributes<HTMLElement>, "style" | "className">;
export declare const textOptimizationStyles: {
    readonly MozOsxFontSmoothing: "auto";
    readonly WebkitFontSmoothing: "auto";
};

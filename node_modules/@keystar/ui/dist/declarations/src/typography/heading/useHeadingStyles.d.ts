import { ClassList } from "../../../dist/keystar-ui-style.js";
import { HeadingProps, PickRequired } from "../../../dist/keystar-ui-types.js";
export declare const headingClassList: ClassList<"root" | (string & {})>;
export declare function useHeadingStyles({ align, size, UNSAFE_className, ...otherProps }: PickRequired<HeadingProps, 'size'>): Pick<import("react").HTMLAttributes<HTMLElement>, "style" | "className">;

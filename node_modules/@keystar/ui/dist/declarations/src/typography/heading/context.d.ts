import { FontSizeHeading } from "../../../dist/keystar-ui-style.js";
type HeadingContextType = {
    size: FontSizeHeading;
};
export declare const HeadingContext: import("react").Context<HeadingContextType | undefined>;
export declare function useHeadingContext(): HeadingContextType | undefined;
export {};

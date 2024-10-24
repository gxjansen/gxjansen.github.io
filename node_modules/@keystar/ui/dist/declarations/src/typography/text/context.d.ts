import { TextProps } from "../../../dist/keystar-ui-types.js";
export type TextContextType = Pick<TextProps, 'color' | 'size' | 'weight'>;
export declare const TextContext: import("react").Context<TextContextType | undefined>;
export declare function useTextContext(): TextContextType | undefined;

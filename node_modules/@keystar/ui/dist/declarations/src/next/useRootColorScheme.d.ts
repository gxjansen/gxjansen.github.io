import { PropsWithChildren } from 'react';
import { ColorScheme } from "../../dist/keystar-ui-types.js";
export declare const ColorSchemeProvider: ({ children }: PropsWithChildren) => import("react").JSX.Element;
export declare function useRootColorScheme(): {
    colorScheme: ColorScheme;
    setColorScheme: (colorScheme: ColorScheme) => void;
};

import { ForwardRefExoticComponent, Ref } from 'react';
import { SplitPanePrimaryProps, SplitPaneSecondaryProps, SplitViewProps } from "./types.js";
export declare function SplitView(props: SplitViewProps): import("react").JSX.Element;
export declare const SplitPanePrimary: ForwardRefExoticComponent<SplitPanePrimaryProps & {
    ref?: Ref<HTMLDivElement>;
}>;
export declare const SplitPaneSecondary: ForwardRefExoticComponent<SplitPaneSecondaryProps & {
    ref?: Ref<HTMLDivElement>;
}>;

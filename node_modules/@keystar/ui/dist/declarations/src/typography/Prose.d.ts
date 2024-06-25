import { ReactNode } from 'react';
import { BaseStyleProps, FontSizeText } from "../../dist/keystar-ui-style.js";
export type ProseProps = {
    /** The content to render. */
    children?: ReactNode;
    /**
     * The size of body text.
     * @default 'medium'
     */
    size?: FontSizeText;
} & BaseStyleProps;
/** A typographic component that adds styles for rendering remote HTML content. */
export declare const Prose: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<ProseProps, "div">;
export declare function useProseStyleProps(props: ProseProps): {
    className: string;
    style?: import("react").CSSProperties | undefined;
};

import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';
import { BaseStyleProps, Responsive } from "../../dist/keystar-ui-style.js";
type RatioType = `${number}` | `${number}/${number}`;
export type AspectRatioProps = {
    /**
     * Content to be displayed at the specified aspect-ratio.
     */
    children: ReactNode;
    /**
     * The preferred aspect ratio for the box, which will be used in the
     * calculation of auto sizes and some other layout functions. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio).
     */
    value: Responsive<RatioType>;
} & BaseStyleProps & DOMProps;
/**
 * Present responsive media, such as images and videos or anything within an
 * iFrame, at a specific aspect ratio.
 */
export declare function AspectRatio(props: AspectRatioProps): import("react").JSX.Element;
export {};

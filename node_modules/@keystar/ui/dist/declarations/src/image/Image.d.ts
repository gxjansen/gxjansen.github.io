import { DOMProps } from '@react-types/shared';
import { ReactEventHandler, ReactNode } from 'react';
import { AspectRatioProps } from "../../dist/keystar-ui-layout.js";
import { BoxStyleProps } from "../../dist/keystar-ui-style.js";
export type ImageProps = {
    /**
     * Text description of the image.
     */
    alt: string;
    /**
     * Overlay content to be displayed on top of the image.
     */
    children?: ReactNode;
    /**
     * The preferred aspect ratio for the box, which will be used in the
     * calculation of auto sizes and some other layout functions. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio).
     */
    aspectRatio: AspectRatioProps['value'];
    /**
     * The URL of the image.
     */
    src: string;
    /**
     * Callback that is called when the image fails to load because of an error.
     */
    onError?: ReactEventHandler<HTMLImageElement>;
    /**
     * Callback that is called when the image loads successfully.
     */
    onLoad?: ReactEventHandler<HTMLImageElement>;
    /**
     * How the image should be resized to fit its container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).
     *
     * @default 'cover'
     */
    fit?: 'contain' | 'cover';
    /**
     * How to handle loading of the image. When `"lazy"`, loading is deferred
     * until the image reaches a distance threshold from the viewport. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading).
     *
     * @default 'eager'
     */
    loading?: 'eager' | 'lazy';
} & BoxStyleProps & DOMProps;
/**
 * A wrapper around the native image tag with support for common behaviour.
 */
export declare function Image(props: ImageProps): import("react").JSX.Element;

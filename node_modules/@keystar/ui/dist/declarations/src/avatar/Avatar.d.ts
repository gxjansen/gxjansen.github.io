import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import { ForwardRefExoticComponent, Ref } from 'react';
import { BaseStyleProps, SizeElement } from "../../dist/keystar-ui-style.js";
export type AvatarProps = {
    /**
     * Text description of the avatar. When no `alt` is provided the avatar is
     * treated as a decorative element.
     */
    alt?: string;
    /**
     * The size of the avatar.
     * @default 'regular'
     */
    size?: SizeElement;
} & ({
    /** The name used for the initials. */
    name: string;
} | {
    /** The `src` attribute of the image. */
    src: string;
}) & Omit<BaseStyleProps, 'height' | 'width'> & DOMProps & AriaLabelingProps;
/**
 * An avatar is a thumbnail representation of an entity, such as a user or an
 * organization.
 */
export declare const Avatar: ForwardRefExoticComponent<AvatarProps & {
    ref?: Ref<HTMLDivElement>;
}>;

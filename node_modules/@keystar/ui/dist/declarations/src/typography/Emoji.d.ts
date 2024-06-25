import { DOMProps } from '@react-types/shared';
import { ForwardRefExoticComponent, Ref } from 'react';
import { BaseStyleProps } from "../../dist/keystar-ui-style.js";
export type EmojiProps = {
    /** Label used to describe the symbol that will be announced to screen readers. */
    label?: string;
    /** Emoji symbol. */
    symbol: string;
} & BaseStyleProps & DOMProps;
/**
 * A utility component for displaying emoji characters accessibly. Emojis can
 * add playfulness to your interface, but require formatting to ensure that they
 * are accessible for all users.
 */
export declare const Emoji: ForwardRefExoticComponent<EmojiProps & {
    ref?: Ref<HTMLSpanElement>;
}>;

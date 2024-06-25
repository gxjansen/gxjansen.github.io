import { ForwardRefExoticComponent, ReactNode, Ref } from 'react';
import { DOMProps } from '@react-types/shared';
import { BaseStyleProps } from "../../dist/keystar-ui-style.js";
export type KbdProps = {
    /** Keyboard shortcut text. */
    children: ReactNode;
    /**
     * Prefix with OS-specific "alt" key.
     * @MacOS `⎇`
     * @Windows `Alt`
     */
    alt?: boolean;
    /**
     * Prefix with OS-specific "meta" key.
     * @MacOS `⌘`
     * @Windows `Ctrl`
     */
    meta?: boolean;
    /**
     * Prefix with OS-specific "shift" key.
     * @MacOS `⇧`
     * @Windows `Shift`
     */
    shift?: boolean;
    /**
     * A slot to place the shortcut text.
     * @default 'kbd'
     */
    slot?: string;
} & DOMProps & BaseStyleProps;
/** Represents text that specifies a keyboard command. */
export declare const Kbd: ForwardRefExoticComponent<KbdProps & {
    ref?: Ref<HTMLElement>;
}>;

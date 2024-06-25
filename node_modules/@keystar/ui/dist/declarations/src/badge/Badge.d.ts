import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import { ReactNode, ForwardRefExoticComponent, Ref } from 'react';
import { BaseStyleProps } from "../../dist/keystar-ui-style.js";
type BadgeTones = 'accent' | 'caution' | 'critical' | 'highlight' | 'neutral' | 'pending' | 'positive';
export type BadgeProps = {
    /** The content to display within the badge. */
    children: ReactNode;
    /**
     * The tone of the badge.
     * @default 'neutral'
     */
    tone?: BadgeTones;
} & BaseStyleProps & DOMProps & AriaLabelingProps;
/**
 * A badge is a decorative indicator used to either call attention to an item or
 * for communicating non-actionable, supplemental information.
 */
export declare const Badge: ForwardRefExoticComponent<BadgeProps & {
    ref?: Ref<HTMLDivElement>;
}>;
export {};

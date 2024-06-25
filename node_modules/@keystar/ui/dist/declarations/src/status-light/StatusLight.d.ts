import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import { ReactNode, ForwardRefExoticComponent, Ref } from 'react';
import { BaseStyleProps } from "../../dist/keystar-ui-style.js";
type StatusLightTones = 'accent' | 'caution' | 'critical' | 'neutral' | 'pending' | 'positive';
export type StatusLightProps = {
    /** The content to display as the label. */
    children?: ReactNode;
    /**
     * An accessibility role for the status light. Should be set when the status
     * can change at runtime, and no more than one status light will update simultaneously.
     */
    role?: 'status';
    /**
     * The tone of the status light, which indicates semantic meaning.
     * @default 'neutral'
     */
    tone?: StatusLightTones;
} & BaseStyleProps & DOMProps & AriaLabelingProps;
/** Status lights describe the state or condition of an entity. */
export declare const StatusLight: ForwardRefExoticComponent<StatusLightProps & {
    ref?: Ref<HTMLDivElement>;
}>;
export {};

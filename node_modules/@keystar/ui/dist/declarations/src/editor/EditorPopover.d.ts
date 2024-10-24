import { HTMLProps, ReactNode } from 'react';
import { Boundary, ContextData, Middleware, Placement, ReferenceElement } from '@floating-ui/react';
import { BaseStyleProps } from "../../dist/keystar-ui-style.js";
export type EditorPopoverProps = {
    /**
     * How the popover should adapt when constrained by available space.
     * @default 'flip'
     */
    adaptToBoundary?: 'flip' | 'stick' | 'stretch';
    /**
     * The clipping boundary area of the floating element.
     * @default 'clippingAncestors'
     */
    boundary?: Boundary;
    /** The contents of the floating element. */
    children: ReactNode;
    /** The placement of the floating element relative to the reference element. */
    placement?: Placement;
    /**
     * Whether to portal the floating element outside the DOM hierarchy of the parent component.
     * @default true
     */
    portal?: boolean;
    /** The reference element that the floating element should be positioned relative to. */
    reference: ReferenceElement;
} & Pick<BaseStyleProps, 'height' | 'width' | 'maxHeight' | 'maxWidth' | 'minHeight' | 'minWidth' | 'UNSAFE_className' | 'UNSAFE_style'>;
export type EditorPopoverRef = {
    context: ContextData;
    update: () => void;
};
export declare const EditorPopover: import("react").ForwardRefExoticComponent<{
    /**
     * How the popover should adapt when constrained by available space.
     * @default 'flip'
     */
    adaptToBoundary?: "flip" | "stick" | "stretch";
    /**
     * The clipping boundary area of the floating element.
     * @default 'clippingAncestors'
     */
    boundary?: Boundary;
    /** The contents of the floating element. */
    children: ReactNode;
    /** The placement of the floating element relative to the reference element. */
    placement?: Placement;
    /**
     * Whether to portal the floating element outside the DOM hierarchy of the parent component.
     * @default true
     */
    portal?: boolean;
    /** The reference element that the floating element should be positioned relative to. */
    reference: ReferenceElement;
} & Pick<BaseStyleProps, "height" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "width" | "UNSAFE_className" | "UNSAFE_style"> & import("react").RefAttributes<EditorPopoverRef>>;
export declare const DEFAULT_OFFSET = 8;
export declare function getMiddleware(props: EditorPopoverProps): Array<Middleware | null | undefined | false>;
export declare const DialogElement: import("react").ForwardRefExoticComponent<Omit<HTMLProps<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;

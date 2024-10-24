import { ReactElement, ReactNode } from 'react';
import { Element, Editor } from 'slate';
import { PopoverProps } from '@keystar/ui/overlays';
type RenderFn = (close: () => void) => ReactElement;
type BlockPopoverTriggerProps = {
    element: Element;
    children: [ReactElement, ReactElement<BlockPopoverProps>];
};
type BlockPopoverProps = Pick<PopoverProps, 'hideArrow' | 'placement'> & {
    children: ReactElement | RenderFn;
};
export declare function useActiveBlockPopover(): (({
    type: "layout";
    layout: number[];
} | {
    type: "blockquote" | "layout-area" | "divider" | "list-item" | "list-item-content" | "ordered-list" | "unordered-list" | "table" | "table-body" | "table-head" | "table-row";
} | {
    type: "heading";
    level: 1 | 2 | 3 | 4 | 5 | 6;
    textAlign?: "center" | "end" | undefined;
} | {
    type: "component-block";
    component: string;
    props: Record<string, any>;
} | {
    type: "component-inline-prop" | "component-block-prop";
    propPath?: import("../component-blocks/utils.js").ReadonlyPropPath | undefined;
} | {
    type: "paragraph";
    textAlign?: "center" | "end" | undefined;
} | {
    type: "link";
    href: string;
} | {
    type: "code";
    language?: string;
} | {
    type: "image";
    src: {
        filename: string;
        content: Uint8Array;
    };
    alt: string;
    title: string;
} | {
    type: "table-cell";
    header?: true;
    rowSpan?: number;
    colSpan?: number;
}) & import("slate").BaseElement) | undefined;
export declare function ActiveBlockPopoverProvider(props: {
    children: ReactNode;
    editor: Editor;
}): import("react").JSX.Element;
export declare const BlockPopoverTrigger: ({ children, element, }: BlockPopoverTriggerProps) => import("react").JSX.Element;
export declare function BlockPopover(props: BlockPopoverProps): import("react").JSX.Element;
export {};

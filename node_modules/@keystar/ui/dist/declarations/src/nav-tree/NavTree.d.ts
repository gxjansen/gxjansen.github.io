import { TreeState } from '@react-stately/tree';
import { DOMAttributes, FocusableElement, Node } from '@react-types/shared';
import React, { RefObject } from 'react';
import { NavTreeProps } from "./types.js";
export declare function NavTree<T extends object>(props: NavTreeProps<T>): React.JSX.Element;
type TreeItemOptions<T> = {
    /** An object representing the tree item. */
    node: Node<T>;
    /** Whether the tree item is contained in a virtual scroller. */
    isVirtualized?: boolean;
};
/**
 * Provides the behavior and accessibility implementation for an item within a tree.
 * @param props - Props for the tree item.
 * @param state - State of the parent list, as returned by `useTreeState`.
 * @param ref - The ref attached to the tree element.
 */
export declare function useTreeItem<T>(props: TreeItemOptions<T>, state: TreeState<T>, ref: RefObject<FocusableElement>): {
    isExpanded: boolean;
    isSelectedAncestor: boolean;
    isHovered: boolean;
    isPressed: boolean;
    isSelected: boolean;
    isFocused: boolean;
    isDisabled: boolean;
    allowsSelection: boolean;
    hasAction: boolean;
    itemProps: DOMAttributes<FocusableElement>;
};
export {};

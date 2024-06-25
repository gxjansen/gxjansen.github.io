import { HTMLAttributes, ReactNode } from 'react';
type ListItemProps = {
    children: ReactNode;
    descriptionProps?: HTMLAttributes<HTMLElement>;
    labelProps?: HTMLAttributes<HTMLElement>;
    keyboardShortcutProps?: HTMLAttributes<HTMLElement>;
    isFocused?: boolean;
    isHovered?: boolean;
    isPressed?: boolean;
    isSelected?: boolean;
};
/** Common list item component for menus and pickers. */
export declare const ListItem: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<ListItemProps, "div">;
export {};

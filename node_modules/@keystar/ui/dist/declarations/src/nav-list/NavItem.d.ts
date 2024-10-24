import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';
export type NavItemProps = {
    /**
     * Indicate which item represents the current item. Typically "page" will be
     * the appropriate value. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current).
     */
    'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
    /** The content of the nav item. */
    children: ReactNode;
    /** The URL that the hyperlink points to. */
    href: string;
} & DOMProps;
/** An item within a `NavList`. */
export declare const NavItem: import("react").ForwardRefExoticComponent<{
    /**
     * Indicate which item represents the current item. Typically "page" will be
     * the appropriate value. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current).
     */
    'aria-current'?: boolean | "page" | "step" | "location" | "date" | "time";
    /** The content of the nav item. */
    children: ReactNode;
    /** The URL that the hyperlink points to. */
    href: string;
} & DOMProps & import("react").RefAttributes<HTMLAnchorElement>>;

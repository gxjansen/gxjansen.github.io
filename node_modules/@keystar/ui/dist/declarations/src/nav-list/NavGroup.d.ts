import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';
export type NavGroupProps = {
    children: ReactNode;
    title: string;
} & DOMProps;
/** Render a group of navigation links. */
export declare function NavGroup(props: NavGroupProps): import("react").JSX.Element;

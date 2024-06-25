import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';
import { BaseStyleProps } from "../../dist/keystar-ui-style.js";
type HeaderProps = {
    /**
     * The header element(s).
     */
    children: ReactNode;
} & BaseStyleProps & DOMProps;
/** A header within a container. */
export declare const Header: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<HeaderProps, "header">;
export {};

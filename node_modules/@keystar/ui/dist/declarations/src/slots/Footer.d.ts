import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';
import { BaseStyleProps } from "../../dist/keystar-ui-style.js";
type FooterProps = {
    /**
     * The footer element(s).
     */
    children: ReactNode;
} & BaseStyleProps & DOMProps;
/** A footer within a container. */
export declare const Footer: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<FooterProps, "footer">;
export {};

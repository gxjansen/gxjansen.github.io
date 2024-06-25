import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';
import { BaseStyleProps } from "../../dist/keystar-ui-style.js";
type ContentProps = {
    /**
     * The content element(s).
     */
    children: ReactNode;
} & BaseStyleProps & DOMProps;
/** A block of content within a container. */
export declare const Content: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<ContentProps, "section">;
export {};

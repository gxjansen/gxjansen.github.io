import { ReactNode } from 'react';
import { DOMProps } from '@react-types/shared';
import { BoxStyleProps } from "../../dist/keystar-ui-style.js";
export type BoxProps = {
    children?: ReactNode;
} & DOMProps & BoxStyleProps;
/** Exposes a prop-based API for adding styles to a view, within the constraints of the theme. */
export declare const Box: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<BoxProps, "div">;

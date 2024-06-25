import { ReactNode } from 'react';
import { GridStyleProps } from "../../dist/keystar-ui-style.js";
export type GridProps = {
    children?: ReactNode;
} & GridStyleProps;
/**
 * A layout container using CSS grid. Keystar UI dimension values provide
 * consistent sizing and spacing.
 */
export declare const Grid: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<GridProps, "div">;

import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';
import { BoxStyleProps } from "../../dist/keystar-ui-style.js";
export type SurfaceProps = {
    /** Provide contents of the surface. */
    children?: ReactNode;
    /** Override the hierarchical level. */
    level?: 0 | 1 | 2;
} & DOMProps & Omit<BoxStyleProps, 'backgroundColor'>;
export declare const SurfaceContext: import("react").Context<number>;
/**
 * Get information about the current surface. Use to
 * pull from the `level` for the surface of the invoking component.
 */
export declare function useSurface(): {
    level: number;
};
/**
 * A surface contains UI in an isolated container, a bit like CSS stacking
 * contexts. Use surfaces to create interfaces that are related to but distinct
 * from those around them.
 */
export declare const Surface: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<SurfaceProps, "div">;

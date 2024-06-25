import { ReactNode } from 'react';
import { FlexStyleProps } from "../../dist/keystar-ui-style.js";
export type StackProps = {
    children?: ReactNode;
} & Omit<FlexStyleProps, 'direction' | 'inline' | 'wrap'>;
/** A thin wrapper around `Flex`, for stacking elements vertically. */
export declare const VStack: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<StackProps, "div">;
/** A thin wrapper around `Flex`, for stacking elements horizontally. */
export declare const HStack: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<StackProps, "div">;

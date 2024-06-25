import { ReactNode } from 'react';
import { FlexStyleProps } from "../../dist/keystar-ui-style.js";
export type FlexProps = {
    children?: ReactNode;
} & FlexStyleProps;
/**
 * A layout container CSS flex. Keystar UI dimension values provide
 * consistent spacing between items.
 */
export declare const Flex: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<FlexProps, "div">;

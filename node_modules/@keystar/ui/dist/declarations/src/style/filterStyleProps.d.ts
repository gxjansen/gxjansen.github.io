import { HTMLAttributes } from 'react';
import { BaseStyleProps } from "./index.js";
/**
 * Filters out style props.
 * @param props - The component props to be filtered.
 * @param otherPropNames - An array of other style property names that should be omitted.
 */
export declare function filterStyleProps<Props extends {}>(props: Props, otherPropNames?: string[]): HTMLAttributes<HTMLElement>;
/**
 * Filters out non-style props.
 * @param props - The component props to be filtered.
 */
export declare function onlyStyleProps<Props extends {}>(props: Props): BaseStyleProps;

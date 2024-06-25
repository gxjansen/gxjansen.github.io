import { CSSProperties, HTMLAttributes } from 'react';
import { BaseStyleProps, BoxStyleProps, StyleResolverMap } from "./types.js";
export declare function convertStyleProps<T extends BaseStyleProps>(props: T, propResolvers: StyleResolverMap): CSSProperties;
export declare function useStyleProps<T extends BoxStyleProps>(props: T, customResolvers?: StyleResolverMap): Pick<HTMLAttributes<HTMLElement>, 'className' | 'style'>;

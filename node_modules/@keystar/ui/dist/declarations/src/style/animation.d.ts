import { CSSProperties } from 'react';
import { AnimationDuration, AnimationEasing } from "./types.js";
type Kebab<T extends string, A extends string = ''> = T extends `${infer F}${infer R}` ? Kebab<R, `${A}${F extends Lowercase<F> ? '' : '-'}${Lowercase<F>}`> : A;
type KebabKeys<T> = {
    [K in keyof T as K extends string ? Kebab<K> : K]: T[K];
};
type CSSProp = keyof KebabKeys<CSSProperties>;
type Easing = AnimationEasing | 'linear';
type Duration = AnimationDuration | number;
type Options = {
    /**
     * The transition delay.
     */
    delay?: Duration;
    /**
     * The transition duration.
     * @default 'short'
     */
    duration?: Duration;
    /**
     * The transition easing.
     * @default 'easeInOut'
     */
    easing?: Easing;
};
/** Helper function for resolving animation tokens.  */
export declare function transition(prop: CSSProp | CSSProp[], options?: Options): string;
export {};

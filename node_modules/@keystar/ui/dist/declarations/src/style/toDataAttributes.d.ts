/** Converts an object to a set of data attributes. */
export declare function toDataAttributes<T extends {
    [key: string]: string | number | boolean | null | undefined;
}>(data: T, options?: {
    /** Omit props with values of `false` or `""`. */
    omitFalsyValues?: boolean;
    /** Removes the `is*` prefix from keys.  */
    trimBooleanKeys?: boolean;
}): Record<string, T[keyof T] | undefined>;

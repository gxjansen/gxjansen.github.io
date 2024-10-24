type Format = 'currency' | 'decimal' | 'percent' | 'unit';
export type NumeralProps = {
    /**
     * How the value should be abbreviated, if at all.
     */
    abbreviate?: boolean | 'short' | 'long';
    /**
     * The currency to use when formatting "currency" values. [Possible
     * values](https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes)
     * are the ISO 4217 currency codes, such as "USD" for the US dollar, "EUR" for
     * the euro, etc.
     */
    currency?: string;
    /**
     * The formatting style to use.
     *
     * @default 'decimal'
     */
    format?: Format;
    /** Override the default precision. Supports a tuple for min/max. */
    precision?: number | [number, number];
    /**
     * The unit to use when formatting "unit" values. [Possible
     * values](https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier)
     * may be concatenated with "-per-" to make a compound unit.
     */
    unit?: string;
    /** The numeric value to format. */
    value: number;
};
export declare const Numeral: import("react").ForwardRefExoticComponent<NumeralProps & import("react").RefAttributes<HTMLElement>>;
export {};

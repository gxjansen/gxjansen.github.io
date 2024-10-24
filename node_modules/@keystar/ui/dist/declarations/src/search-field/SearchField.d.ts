/** Search fields are text fields, specifically designed for search behaviour. */
export declare const SearchField: import("react").ForwardRefExoticComponent<{
    onSubmit?: (value: string) => void;
    onClear?: () => void;
    showIcon?: boolean;
} & Omit<import("../../dist/keystar-ui-text-field.js").TextFieldProps, "pattern" | "type"> & import("react").RefAttributes<HTMLInputElement>>;

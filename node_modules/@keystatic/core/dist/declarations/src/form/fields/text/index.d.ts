import { SlugFormField } from "../../api.js";
export declare function text({ label, defaultValue, validation: { length: { max, min }, pattern, isRequired, }, description, multiline, }: {
    label: string;
    defaultValue?: string | (() => string);
    description?: string;
    validation?: {
        isRequired?: boolean;
        length?: {
            min?: number;
            max?: number;
        };
        pattern?: {
            regex: RegExp;
            message?: string;
        };
    };
    multiline?: boolean;
}): SlugFormField<string, string, string, null>;

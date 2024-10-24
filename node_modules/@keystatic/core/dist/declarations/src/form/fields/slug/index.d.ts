import { SlugFormField } from "../../api.js";
export declare function slug(_args: {
    name: {
        label: string;
        defaultValue?: string;
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
    };
    slug?: {
        label?: string;
        generate?: (name: string) => string;
        description?: string;
        validation?: {
            length?: {
                min?: number;
                max?: number;
            };
            pattern?: {
                regex: RegExp;
                message?: string;
            };
        };
    };
}): SlugFormField<{
    name: string;
    slug: string;
}, {
    name: string;
    slug: string;
}, {
    name: string;
    slug: string;
}, string>;

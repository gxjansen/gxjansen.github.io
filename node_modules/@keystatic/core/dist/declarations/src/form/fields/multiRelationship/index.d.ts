import { BasicFormField } from "../../api.js";
export declare function multiRelationship({ label, collection, validation, description, }: {
    label: string;
    collection: string;
    validation?: {
        length?: {
            min?: number;
            max?: number;
        };
    };
    description?: string;
}): BasicFormField<string[]>;

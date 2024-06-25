import { BasicFormField } from "../../api.js";
import { RequiredValidation } from "../utils.js";
export declare function number<IsRequired extends boolean | undefined>({ label, defaultValue, step, validation, description, }: {
    label: string;
    defaultValue?: number;
    step?: number;
    validation?: {
        isRequired?: IsRequired;
        min?: number;
        max?: number;
        step?: boolean;
    };
    description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<number | null, number | (IsRequired extends true ? never : null)>;

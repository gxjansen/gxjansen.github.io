import { AllHTMLAttributes } from 'react';
export type A11yLabelProps = {
    /**
     * For controls that DO NOT include a semantic element for user input. In
     * these cases the "required" state would not otherwise be announced to users
     * of assistive technology.
     */
    supplementRequiredState?: boolean;
};
type FieldLabelProps = {
    isRequired?: boolean;
} & A11yLabelProps & AllHTMLAttributes<HTMLElement>;
export declare const FieldLabel: import("../../dist/keystar-ui-utils-ts.js").CompWithAsProp<FieldLabelProps, "label">;
export {};

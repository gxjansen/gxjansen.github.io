import { ForwardRefExoticComponent, Ref } from 'react';
import { ActionButtonProps } from "../../dist/keystar-ui-button.js";
import { PasswordFieldProps } from "./types.js";
/**
 * Password fields are text fields for entering secure text.
 */
export declare const PasswordField: ForwardRefExoticComponent<PasswordFieldProps & {
    ref?: Ref<HTMLInputElement>;
}>;
/**
 * @private the reveal button is used to show and hide input text.
 */
export declare function RevealButton(props: ActionButtonProps & {
    secureTextEntry: boolean;
}): import("react").JSX.Element;

import { SlotContextType } from "../../dist/keystar-ui-slots.js";
import { ActionButtonProps, CommonActionButtonProps } from "./types.js";
/**
 * Action buttons allow users to perform an action. They’re used for similar,
 * task-based options within a workflow, and are ideal for interfaces where
 * buttons aren’t meant to draw a lot of attention.
 */
export declare const ActionButton: import("react").ForwardRefExoticComponent<ActionButtonProps & import("react").RefAttributes<HTMLAnchorElement | HTMLButtonElement>>;
export declare const useActionButtonChildren: (props: CommonActionButtonProps, alternateSlots?: SlotContextType) => import("react").JSX.Element;

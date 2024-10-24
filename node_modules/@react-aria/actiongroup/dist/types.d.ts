import { AriaActionGroupProps } from "@react-types/actiongroup";
import { DOMAttributes, FocusableElement, RefObject, Key } from "@react-types/shared";
import { ListState } from "@react-stately/list";
import { PressProps } from "@react-aria/interactions";
export interface ActionGroupAria {
    actionGroupProps: DOMAttributes;
}
export function useActionGroup<T>(props: AriaActionGroupProps<T>, state: ListState<T>, ref: RefObject<FocusableElement | null>): ActionGroupAria;
export interface AriaActionGroupItemProps {
    key: Key;
}
export interface ActionGroupItemAria {
    buttonProps: DOMAttributes & PressProps;
}
export function useActionGroupItem<T>(props: AriaActionGroupItemProps, state: ListState<T>, ref?: RefObject<FocusableElement | null>): ActionGroupItemAria;
export type { AriaActionGroupProps } from '@react-types/actiongroup';

//# sourceMappingURL=types.d.ts.map

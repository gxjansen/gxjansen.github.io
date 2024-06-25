import { ReactElement, Ref } from 'react';
import { ActionMenuProps } from "./types.js";
/**
 * ActionMenu combines an ActionButton with a Menu for simple "more actions" use cases.
 */
declare const _ActionMenu: <T>(props: ActionMenuProps<T> & {
    ref?: Ref<HTMLButtonElement>;
}) => ReactElement;
export { _ActionMenu as ActionMenu };

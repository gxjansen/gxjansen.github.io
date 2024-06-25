import { ReactElement, Ref } from 'react';
import { BreadcrumbsProps } from "./types.js";
/**
 * Breadcrumbs show hierarchy and navigational context for a user's location
 * within an application.
 */
declare const _Breadcrumbs: <T>(props: BreadcrumbsProps<T> & {
    ref?: Ref<HTMLDivElement>;
}) => ReactElement;
export { _Breadcrumbs as Breadcrumbs };

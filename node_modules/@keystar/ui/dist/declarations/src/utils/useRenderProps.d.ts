import { WithRenderProps } from "../../dist/keystar-ui-types.js";
/**
 * Render the children of a component, either as a function or a ReactNode.
 *
 * @param props The props of the component.
 * @param values A **memoized** object, which is passed as the argument to your `props.children` render fn.
 */
export declare function useRenderProps<T extends Record<string, any>>(props: WithRenderProps<T>, values: T): import("react").ReactNode;

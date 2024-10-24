import { KeystarProviderContext } from "./types.js";
export declare const Context: import("react").Context<KeystarProviderContext | null>;
/**
 * Returns the settings and styles applied by the nearest parent
 * Provider. Properties explicitly set by the nearest parent Provider override
 * those provided by preceeding Providers.
 */
export declare function useProvider(): KeystarProviderContext;
export declare function useProviderProps<T>(props: T): T;

import React from 'react';
import { ProviderProps, SlotProviderProps } from "./types.js";
/**
 * Merge component props with ancestral slot props. With the exception of "id",
 * consumer props are overriden by slot props, while event handlers will be
 * chained so all are called.
 */
export declare function useSlotProps<P extends {
    id?: string;
}>(props: P, defaultSlot: string): P;
/**
 * Not really "slots" like web components, more like "prop portalling" or
 * something. Default and override the props of descendent components.
 *
 * @example
 * <SlotProvider slots={{ text: { size: 'small' } }}>
 *   {children}
 * </SlotProvider>
 */
export declare const SlotProvider: (props: SlotProviderProps) => React.JSX.Element;
export declare const ClearSlots: ({ children }: ProviderProps) => React.JSX.Element;

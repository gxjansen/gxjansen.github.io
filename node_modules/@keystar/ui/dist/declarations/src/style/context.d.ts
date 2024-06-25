import React, { ProviderProps } from 'react';
import { Breakpoint, BreakpointRange, Responsive } from "./types.js";
type BreakpointContextValue = Breakpoint[];
export declare function BreakpointProvider(props: ProviderProps<BreakpointContextValue>): React.JSX.Element;
export declare function useBreakpoint(): BreakpointContextValue;
/**
 * The function returned from this hook will resolve values in a mobile-first
 * manner based on the breakpoint the browser viewport currently falls within
 * (mobile, tablet, desktop or wide).
 *
 * @caution The returned function returns `value.mobile` when rendering
 * server-side or statically, so you should avoid this hook where possible.
 * Responsive props and media queries are preferable in most cases.
 */
export declare function useResponsiveValue(): <T>(value: Responsive<T>) => T;
export declare function useMatchedBreakpoints(): BreakpointContextValue;
export declare function useResponsiveRange(): (range: BreakpointRange) => boolean;
export {};

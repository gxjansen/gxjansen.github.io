import facepaint from 'facepaint';
import { Breakpoint, BreakpointRange, Responsive, StyleResolver } from "./types.js";
export declare const breakpoints: Record<Breakpoint, number>;
export declare const breakpointQueries: {
    above: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
    below: {
        tablet: string;
        desktop: string;
        wide: string;
    };
};
export declare const containerQueries: {
    above: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
    below: {
        tablet: string;
        desktop: string;
        wide: string;
    };
};
export declare const mapToMediaQueries: facepaint.DynamicStyleFunction;
export declare function mapResponsiveValue<Value>(propResolver: StyleResolver, value?: Responsive<Value>): unknown;
export declare function getResponsiveProp<T>(prop: Responsive<T>, matchedBreakpoints: Breakpoint[]): T;
export declare function getResponsiveRange(range: BreakpointRange, matchedBreakpoints: Breakpoint[]): boolean;

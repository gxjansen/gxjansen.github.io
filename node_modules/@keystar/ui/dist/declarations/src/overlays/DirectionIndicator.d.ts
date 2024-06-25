import { HTMLAttributes } from 'react';
type DirectionIndicatorProps = {
    /** The SVG fill color. */
    fill: string;
    /** The simulated stroke color. */
    stroke?: string;
    /** The size of the indicator. */
    size: 'xsmall' | 'small' | 'regular';
    /**
     * The placement of the overlay element, relative to its target.
     * @default 'bottom'
     */
    placement?: 'start' | 'end' | 'right' | 'left' | 'top' | 'bottom';
} & HTMLAttributes<HTMLElement>;
export declare function DirectionIndicator({ fill, placement, size, stroke, ...props }: DirectionIndicatorProps): import("react").JSX.Element;
export {};

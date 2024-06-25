import React from 'react';
/**
 * The MenuTrigger serves as a wrapper around a Menu and its associated trigger,
 * linking the Menu's open state with the trigger's press state.
 */
export declare const MenuTrigger: React.ForwardRefExoticComponent<{
    children: React.ReactElement<any, string | React.JSXElementConstructor<any>>[];
    align?: import("@react-types/shared").Alignment | undefined;
    direction?: "start" | "end" | "left" | "right" | "bottom" | "top" | undefined;
    shouldFlip?: boolean | undefined;
    closeOnSelect?: boolean | undefined;
} & import("@react-types/menu").MenuTriggerProps & React.RefAttributes<HTMLElement>>;

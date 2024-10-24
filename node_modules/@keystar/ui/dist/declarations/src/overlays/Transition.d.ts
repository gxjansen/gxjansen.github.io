import { TransitionProps } from "./types.js";
/**
 * A low-level utility component for implementing transitions, which
 * safely unmount children _after_ their animation has completed.
 */
export declare const Transition: (props: TransitionProps) => import("react").ReactNode;
export declare function useTransition(props: TransitionProps): {
    isOpen: boolean | "mounting";
    setIsOpen: import("react").Dispatch<import("react").SetStateAction<boolean | "mounting">>;
};

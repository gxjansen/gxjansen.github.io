export interface AnimeOptions {
  delay: number;
  duration: number;
  distance: number;
  easing: string; // one of the supported animeJS easings: https://animejs.com/documentation/#pennerFunctions
}

export type TriggerPlacement =
  | "top-bottom"
  | "center-bottom"
  | "bottom-bottom"
  | "top-center"
  | "center-center"
  | "bottom-center"
  | "top-top"
  | "bottom-top"
  | "center-top";

/**
 * Disable option - can be boolean, device type string, or function
 */
export type DisableOption = boolean | "mobile" | "phone" | "tablet" | (() => boolean);

export interface AOSDefaultOptions extends AnimeOptions {
  offset: number;
  once: boolean;
  mirror: boolean;
  disable: DisableOption;
  anchorPlacement: TriggerPlacement;
  startEvent: string;
  animatedClassName: string;
  initClassName: string;
  disableMutationObserver: boolean;
  throttleDelay: number;
  debounceDelay: number;
}

/**
 * AnimeJS animation instance interface
 */
export interface AnimeInstance {
  play: () => void;
  pause: () => void;
  reverse: () => void;
  seek: (time: number) => void;
  reversed: boolean;
  completed: boolean;
  duration: number;
  progress: number;
}

export interface AOSElement {
  node: HTMLElement;
  animation?: AnimeInstance;
  animated?: boolean;
  position?: {
    in?: number;
    out?: number | false;
  };
  options?: {
    once?: boolean;
    mirror?: boolean;
    animatedClassNames?: string[];
    trigger?: string;
  };
}

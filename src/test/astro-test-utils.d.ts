import type { HTMLElement } from 'node-html-parser';

// Basic type for Astro components
export type AstroComponent = {
  default: (props: Record<string, unknown>) => Promise<{
    toString: () => string;
  }>;
};

/**
 * Parse HTML string into a DOM-like structure for testing
 */
export function parseHTML(html: string): HTMLElement;

/**
 * Get an element from parsed HTML by selector
 */
export function getElement(html: string, selector: string): HTMLElement | null;

/**
 * Render an Astro component to HTML string
 */
export function renderComponent(
  Component: AstroComponent,
  props?: Record<string, unknown>
): Promise<string>;

/**
 * Type helper for Astro component props
 */
export type AstroComponentProps<T> = T extends { default: (props: infer P) => any } ? P : never;

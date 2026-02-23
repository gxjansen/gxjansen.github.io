import { parse } from "node-html-parser";

/**
 * Parse HTML string into a DOM-like structure for testing
 */
export function parseHTML(html: string) {
  return parse(html);
}

/**
 * Get an element from parsed HTML by selector
 */
export function getElement(html: string, selector: string) {
  const root = parseHTML(html);
  return root.querySelector(selector);
}

/**
 * Mock Astro's Image component
 */
export function createMockImage(props: Record<string, unknown>) {
  const { src, alt, width, height, class: className } = props;
  return `<img src="${src}" alt="${alt}" width="${width}" height="${height}" class="${className || ""}" />`;
}

/**
 * Create test data for a presentation
 */
export function createTestPresentation(
  overrides: Record<string, unknown> = {},
) {
  return {
    slug: "test-presentation",
    data: {
      title: "Test Presentation",
      duration: "45 minutes",
      isWorkshop: false,
      intendedAudience: "Developers",
      image: undefined,
      ...overrides,
    },
  };
}

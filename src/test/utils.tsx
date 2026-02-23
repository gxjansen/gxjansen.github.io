import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

/**
 * Custom render function that includes common providers if needed
 * Wraps RTL's render with any necessary global providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    // Add any global providers here if needed
    // wrapper: ({ children }) => (
    //   <ThemeProvider>{children}</ThemeProvider>
    // ),
    ...options,
  });
}

/**
 * Helper to create mock Astro props
 * Adds common Astro client directives as undefined to match runtime behavior
 */
export function createAstroProps(props: Record<string, unknown> = {}) {
  return {
    ...props,
    "client:load": undefined,
    "client:idle": undefined,
    "client:visible": undefined,
    "client:media": undefined,
    "client:only": undefined,
  };
}

/**
 * Helper to mock Astro's Image component props
 */
export function createAstroImageProps(props: Record<string, unknown> = {}) {
  return {
    src: "/placeholder.jpg",
    alt: "Test image",
    width: 100,
    height: 100,
    format: "webp",
    ...props,
  };
}

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

interface NavDropdownItem {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href: string;
  hidden: boolean;
  dropdown?: NavDropdownItem[];
}

/**
 * Create mock navigation data for testing
 */
export function createMockNavData(
  overrides: Partial<NavItem>[] = [],
): NavItem[] {
  return [
    {
      title: "Home",
      href: "/",
      hidden: false,
    },
    {
      title: "About",
      href: "/about",
      hidden: false,
    },
    {
      title: "Presentations",
      href: "/presentations",
      hidden: false,
    },
    {
      title: "Hidden Item",
      href: "/hidden",
      hidden: true,
    },
    {
      title: "Services",
      href: "/services",
      dropdown: [
        { title: "Consulting", href: "/services/consulting" },
        { title: "Training", href: "/services/training" },
      ],
      hidden: false,
    },
    ...(overrides as NavItem[]),
  ];
}

/**
 * Create mock podcast episode data for testing
 */
interface LayoutProps {
  type?: "blog" | "general";
  title: string;
  description: string;
  image?: ImageMetadata;
  authorsData?: any[];
  postFrontmatter?: any;
  noindex?: boolean;
}

/**
 * Create mock layout props for testing
 */
export function createMockLayoutProps(
  overrides: Partial<LayoutProps> = {},
): LayoutProps {
  return {
    title: "Test Page",
    description: "This is a test page description",
    type: "general",
    noindex: false,
    ...overrides,
  };
}

export function createMockPodcastEpisode(
  overrides: Record<string, unknown> = {},
) {
  return {
    title: "Test Episode",
    description:
      "This is a test episode description that is long enough to test truncation functionality in the podcast card component.",
    link: "https://example.com/episode",
    pubDate: "2024-01-01T12:00:00Z",
    duration: "45 min",
    podcastName: "Test Podcast",
    imageUrl: "https://example.com/image.jpg",
    ...overrides,
  };
}

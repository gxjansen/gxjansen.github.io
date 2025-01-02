# Design Standards

## Layout & Spacing

### Container Structure
- Navigation has its own container and padding:
  ```astro
  <Nav>
    <div class="site-container flex h-14 w-full items-center px-4">
      <!-- Navigation content -->
    </div>
  </Nav>
  ```

- Main content and footer share a separate container:
  ```astro
  <BaseLayout>
    <Nav />
    <div class="site-container px-4">
      <main>
        <!-- Page content -->
      </main>
      <Footer />
    </div>
  </BaseLayout>
  ```

### Container Classes
- `site-container` provides:
  - `mx-auto max-w-7xl` for width constraints
  - Used for consistent layout width
  - Applied with `px-4` for horizontal padding

### Padding Application
- Each container handles its own padding with `px-4`
- Components should never include horizontal padding/margins
- Vertical spacing is managed by components

### Component Guidelines
- Components should:
  - Focus only on their internal layout
  - Handle their own vertical spacing
  - Fill their container width
  - Use relative units for internal spacing

### Vertical Spacing
- Section spacing: `py-24 md:py-28`
  - Applied at the component level
  - Provides consistent vertical rhythm between sections

### Grid System
- Standard two-column layout: `grid gap-16 sm:grid-cols-2`
- Three-column layout: `grid gap-8 md:grid-cols-3`
- Consistent gap sizes:
  - Small gaps: `gap-4`
  - Medium gaps: `gap-8`
  - Large gaps: `gap-16`

### Responsive Behavior
- Mobile-first approach
- Standard breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## Stylesheet Organization

### File Structure
```
src/styles/
├── global.scss          # Main entry point
├── _prose.scss         # Rich text content styles
├── base/
│   └── _typography.scss # Base typography styles
├── components/
│   ├── _alerts.scss    # Alert component styles
│   ├── _cards.scss     # Card component styles
│   └── _links.scss     # Link styles
└── utilities/
    └── _utilities.scss  # Shared utility classes
```

### Global Styles Structure
```scss
/* Import Component Styles */
@use './utilities/utilities';
@use './components/alerts';
@use './components/cards';
@use './components/links';
@use './base/typography';
@use './prose';

/* Base Styles */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Z-Index Management

### Z-Index Layers
Use these standardized z-index classes to maintain consistent layering:
```scss
.z-background  // -z-10: Background elements
.z-base       // z-0: Base content level
.z-nav        // z-10: Navigation elements
.z-overlay    // z-20: Overlays, backdrops
.z-modal      // z-30: Modal content
.z-toast      // z-40: Toast notifications
.z-tooltip    // z-50: Tooltips, popovers
```

## Link Styling

### Link Colors
```scss
:root {
  --link-color-1: rgb(14, 165, 233);  /* Sky blue */
  --link-color-2: rgb(168, 85, 247);  /* Purple */
  --link-color-3: rgb(234, 88, 12);   /* Orange */
  --link-color-4: rgb(185, 16, 154);  /* Emerald */
  --link-color-5: rgb(245, 158, 11);  /* Amber */
}
```

### Base Link Styling
Default link styling (excluding special cases):
```scss
a {
  @apply text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-500 transition-all duration-200;
  text-decoration: underline;
  text-decoration-thickness: 0.2em;
  text-underline-offset: 0.1em;
}
```

### Link Exceptions
The following elements do not receive underline styling:
- Navigation links (`nav a`)
- Header and footer links (`header a`, `footer a`)
- Buttons (`.btn`, `[class*="button"]`)
- Social cards (`.social-card`)
- Site content links (`.site-content a`)
- Service icons (`.services-icon a`)
- Card headings (`.card h2 a`)
- Article cards (`.article-card h3 a`)
- Event cards (`.event-card a`)
- Badges (`.badge a`)
- Primary color links (`[class*="hover:text-primary"]`)

### Heading Links
```scss
h1, h2, h3, h4, h5, h6 {
  a {
    @apply text-base-900 dark:text-base-100;
  }
}
```

### Prose Content Links
```scss
.prose a {
  text-decoration-thickness: 0.2em;
  text-underline-offset: 0.1em;
}
```

## Utility Classes

### Focus Management
```scss
.primary-focus {
  @apply focus:outline-none focus-visible:rounded-sm focus-visible:outline-primary-500;
}
```

### Typography Utilities
```scss
// Text Sizes with Dark Mode Support
.text-small    // text-sm
.text-regular  // text-base
.text-large    // text-lg

// Font Weights with Dark Mode Support
.weight-normal    // font-normal
.weight-medium    // font-medium
.weight-semibold  // font-semibold
.weight-bold      // font-bold

// Special Text Styles
.description {
  @apply font-normal text-base-500 dark:text-base-400;
  letter-spacing: -0.01em;
  line-height: 1.6;
}

.code-block {
  @apply text-sm bg-base-100/20 px-2 py-1 rounded 
         text-base-900 dark:bg-base-800 dark:text-base-100;
}
```

### Animation Controls
```scss
.pause {
  animation-play-state: paused !important;
}
```

### Mask Effects
```scss
.mask-gradient {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
  mask-size: 100%;
  mask-repeat: no-repeat;
}
```

## Typography
Base font sizes:
- Mobile: 16px (1rem)
- Desktop/larger screens (md breakpoint and up): 22.4px (1.4rem)

Refer to styleguide.astro#typography for:
- Heading hierarchy
- Text sizes and weights
- Link styles
- Body text styles

## Performance Optimizations
Performance-critical styles and optimizations:
- GPU acceleration patterns
- Animation performance
- Responsive image handling
- Layout optimization

## Maintaining Standards
1. Always reference styleguide.astro for current component implementations
2. Update component examples in styleguide.astro when patterns change
3. Document any deviations or special cases
4. Keep configuration files as the single source of truth for design tokens

## To Be Implemented
- [ ] Remove individual padding from components that should inherit from container
- [ ] Standardize section spacing across all pages
- [ ] Create reusable layout components for common patterns
- [ ] Document any exceptions to these standards and their rationale

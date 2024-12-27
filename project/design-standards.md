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
  - `mx-auto max-w-[90rem]` for width constraints
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

### Component Guidelines
- Components should:
  - Use site-container with px-4 for horizontal constraints
  - Handle their own vertical spacing
  - Use relative units for internal spacing
  - Never use negative margins to counteract padding

### Common Patterns
```astro
<!-- Correct usage -->
<div class="site-container px-4">
  <div class="grid gap-16 sm:grid-cols-2">
    <!-- Component content -->
  </div>
</div>

<!-- Avoid this -->
<div class="site-container">
  <div class="-mx-4"> <!-- No negative margins -->
    <!-- Component content -->
  </div>
</div>
```

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

## Button Standards

### Button Variants
- Primary: 
  - Light/Dark: Primary brand color with white text
  - Hover: Slightly darker shade
  ```astro
  @apply bg-primary-500 text-white hover:bg-primary-600
  ```

- Secondary:
  - Light: Medium gray background (base-200) with dark text
  - Dark: Dark gray background (base-700) with light text
  - Hover: Slightly darker/lighter respectively
  ```astro
  @apply bg-base-200 text-base-900 hover:bg-base-300 dark:bg-base-700 dark:text-base-50 dark:hover:bg-base-600
  ```

- Outline:
  - Light: Dark border and text, white background
  - Dark: Light border and text, transparent background
  - Hover: Inverted colors
  ```astro
  @apply border-2 border-base-900 bg-transparent text-base-900 hover:bg-base-900 hover:text-base-50 dark:border-base-50 dark:text-base-50 dark:hover:bg-base-50 dark:hover:text-base-900
  ```

- Ghost:
  - Light: Dark text with semi-transparent hover background
  - Dark: Light text with semi-transparent hover background
  ```astro
  @apply bg-transparent text-base-900 hover:bg-base-200/50 dark:text-base-50 dark:hover:bg-base-700/50
  ```

### Button States
- Default: Full opacity, clickable
- Disabled: 50% opacity, not clickable
- Focus: Primary color ring with offset
- Hover: Color variations as specified per variant

### Accessibility
- Minimum contrast ratio of 4.5:1 for all text/background combinations
- Focus states clearly visible
- Disabled states visually distinct
- Interactive states (hover, active) provide clear feedback

## Z-Index Management

### Z-Index Layers
Use these standardized classes to maintain consistent layering across components:
```scss
.z-base      // z-0: Base content level
.z-dropdown  // z-10: Dropdowns, tooltips
.z-overlay   // z-20: Overlays, backdrops
.z-modal     // z-30: Modal content
.z-modal-overlay // z-40: Modal backdrops
.z-toast     // z-50: Toasts, notifications
.z-nav       // z-50: Navigation elements
.z-background // -z-10: Background elements
```

## Background Patterns

### Standard Patterns
```scss
.bg-pattern   // Regular pattern background
.bg-pattern-big // Larger pattern background
```

### Grid Pattern Container
```scss
.grid-pattern-container // Container with faded edges
```

### Background Effects
```scss
.noise-background  // Noise texture overlay
.gradient-top-left // Top-left gradient effect
.gradient-bottom-right // Bottom-right gradient effect
```

### Gradient Overlays
```scss
.gradient-fade-left  // Left-side fade effect
.gradient-fade-right // Right-side fade effect
```

## Component Standards Reference

All component styling standards are maintained in:
1. `src/pages/styleguide.astro` - Live component examples and implementation patterns
2. `tailwind.config.cjs` - Theme configuration, colors, spacing, breakpoints
3. `src/styles/global.scss` - Global styles and Tailwind component classes

### Typography
Refer to styleguide.astro#typography for:
- Heading hierarchy
- Text sizes and weights
- Link styles
- Body text styles

### Components
The following components have standardized implementations:
- Buttons (styleguide.astro#buttons)
- Alerts (styleguide.astro#alerts)
- Badges (styleguide.astro#badges)
- Cards (styleguide.astro#cards)
- Navigation (styleguide.astro#navigation)

### Theme Configuration
Core design tokens are defined in tailwind.config.cjs:
- Color palette
- Typography scale
- Spacing scale
- Breakpoints
- Component base styles

### Global Styles
Reusable patterns and utilities are defined in global.scss:
- Component class definitions
- Dark mode variants
- Utility patterns
- Animation classes

## Performance Optimizations
Performance-critical styles and optimizations are documented in:
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

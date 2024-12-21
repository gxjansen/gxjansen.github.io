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

## To Be Implemented
- [ ] Remove individual padding from components that should inherit from container
- [ ] Standardize section spacing across all pages
- [ ] Create reusable layout components for common patterns
- [ ] Document any exceptions to these standards and their rationale

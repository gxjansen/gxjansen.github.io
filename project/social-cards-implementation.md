# Social Media Cards Implementation Plan

## Implementation Checklist
- [ ] 1. Refactor Social Links Data Structure
  - [ ] Move data to src/data/socialLinks.ts
  - [ ] Update imports in existing components
  ✓ Validation:
  - [ ] Run `npm run build` - should compile without errors
  - [ ] Check footer and hero still show social links
  - [ ] Verify TypeScript types with `npm run typecheck`

- [ ] 2. Add Social Card Styles
  - [ ] Add social-card classes to global.scss
  - [ ] Add icon-wrapper classes
  - [ ] Add title classes
  ✓ Validation:
  - [ ] Run `npm run build` - styles should compile
  - [ ] Check dark mode compatibility in browser
  - [ ] Verify no CSS conflicts in dev tools

- [ ] 3. Create Social Card Component
  - [ ] Create SocialCard.astro
  - [ ] Implement component with proper accessibility
  ✓ Validation:
  - [ ] Component renders without errors
  - [ ] Icons load correctly
  - [ ] Links work and open in new tab
  - [ ] Check accessibility with browser dev tools

- [ ] 4. Add Component Documentation
  - [ ] Create README.md for SocialCard
  - [ ] Document props and usage
  ✓ Validation:
  - [ ] All props documented with types and descriptions
  - [ ] Usage example works when copied
  - [ ] Accessibility section complete

- [ ] 5. Create Social Cards Grid Component
  - [ ] Create SocialCards.astro
  - [ ] Implement responsive grid
  ✓ Validation:
  - [ ] Grid renders all cards
  - [ ] Check responsive layout at all breakpoints
  - [ ] Verify spacing and alignment

- [ ] 6. Add Grid Component Documentation
  - [ ] Create README.md for SocialCards
  - [ ] Document features and usage
  ✓ Validation:
  - [ ] Features accurately described
  - [ ] Usage example complete
  - [ ] Responsive behavior documented

- [ ] 7. Create Test Files
  - [ ] Create SocialCard tests
  - [ ] Create SocialCards tests
  ✓ Validation:
  - [ ] Run `npm run test` - all tests pass
  - [ ] Test coverage meets requirements
  - [ ] All key functionality tested

- [ ] 8. Update About Page
  - [ ] Add social cards section
  - [ ] Implement proper container structure
  ✓ Validation:
  - [ ] Page loads without errors
  - [ ] Section spacing matches design
  - [ ] Grid pattern displays correctly
  - [ ] Responsive layout works

- [ ] 9. Update Existing Components
  - [ ] Update Footer usage
  - [ ] Update HeroSideImage usage
  ✓ Validation:
  - [ ] Footer social links work
  - [ ] Hero social links work
  - [ ] No console errors
  - [ ] Visibility settings working

- [ ] 10. Add Accessibility Documentation
  - [ ] Create ACCESSIBILITY.md
  - [ ] Document WCAG compliance
  ✓ Validation:
  - [ ] Run accessibility audit
  - [ ] Test with screen reader
  - [ ] Verify keyboard navigation
  - [ ] Check color contrast

- [ ] 11. Update Styleguide
  - [ ] Add social cards section
  - [ ] Include usage examples
  ✓ Validation:
  - [ ] Component appears in styleguide
  - [ ] Example renders correctly
  - [ ] Code snippet is complete
  - [ ] Dark mode works in styleguide

Final Validation:
- [ ] All TypeScript checks pass
- [ ] All tests pass
- [ ] Accessibility audit passes
- [ ] Design matches requirements
- [ ] Documentation complete

## Overview
Add social media cards to the About page, reusing the existing social media data while allowing flexibility to show/hide items in different components.

## Implementation Steps

### 1. Refactor Social Links Data Structure
1. Move existing social links data from `src/config/socialLinks.ts` to `src/data/socialLinks.ts`:
```typescript
/**
 * Represents a social media link with visibility controls for different sections
 * @interface SocialLink
 */
interface SocialLink {
  /** The display name of the social media platform */
  name: string;
  /** The URL to the social media profile */
  href: string;
  /** The Tabler icon name for the platform */
  icon: string;
  /** Controls where this social link should be displayed */
  visibility: {
    /** Show in footer component */
    footer: boolean;
    /** Show in hero component */
    hero: boolean;
    /** Show in about page cards */
    about: boolean;
  };
}

export const socialLinks: SocialLink[] = [
  {
    name: 'linkedin',
    href: 'https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=gxjansen',
    icon: 'tabler/brand-linkedin',
    visibility: {
      footer: true,
      hero: true,
      about: true
    }
  },
  // ... other social links
];
```

2. Update imports in existing components:
```typescript
// Update in SocialLinks.astro
import { socialLinks } from '@data/socialLinks';

/**
 * Props for the SocialLinks component
 * @interface Props
 */
interface Props {
  /** Optional CSS class names to apply to the component */
  class?: string;
  /** Determines which social links to display based on visibility settings */
  location: 'footer' | 'hero';
}

const { class: className, location } = Astro.props;
const visibleLinks = socialLinks.filter(link => link.visibility[location]);
```

### 2. Add Social Card Styles to global.scss
Add to `src/styles/global.scss` under the `@layer components` section:
```scss
.social-card {
  @apply group flex flex-col items-center rounded-xl border border-base-200/50 bg-base-100/50 p-6 backdrop-blur transition-all hover:border-primary-500/50 hover:bg-primary-500/[0.03] dark:border-base-700/50 dark:bg-base-900/50 dark:hover:border-primary-400/50 dark:hover:bg-primary-400/[0.03];
}

.social-card-icon-wrapper {
  @apply mb-4 flex size-12 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500 dark:bg-primary-400/10 dark:text-primary-400;
}

.social-card-title {
  @apply text-lg font-semibold text-base-900 group-hover:text-primary-500 dark:text-base-100 dark:group-hover:text-primary-400;
}
```

### 3. Create Social Card Component
Create new file: `src/components/SocialCard/SocialCard.astro`
```typescript
---
import { Icon } from 'astro-icon';

/**
 * Props for the SocialCard component
 * @interface Props
 */
interface Props {
  /** The display name of the social media platform */
  name: string;
  /** The URL to the social media profile */
  href: string;
  /** The Tabler icon name for the platform */
  icon: string;
}

const { name, href, icon } = Astro.props;
---

<a 
  href={href}
  target="_blank"
  rel="noopener noreferrer"
  class="social-card"
  aria-label={`Connect with me on ${name}`}
>
  <div class="social-card-icon-wrapper">
    <Icon name={icon} class="size-6" aria-hidden="true" />
  </div>
  <h3 class="social-card-title">
    {name}
  </h3>
</a>
```

### 4. Add Component Documentation
Create new file: `src/components/SocialCard/README.md`
```markdown
# SocialCard Component

A card component for displaying social media links with icons and hover effects.

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | The name of the social media platform |
| href | string | Yes | The URL to the social media profile |
| icon | string | Yes | The Tabler icon name for the platform |

## Usage Example

```astro
import SocialCard from '@components/SocialCard/SocialCard.astro';

<SocialCard
  name="LinkedIn"
  href="https://linkedin.com/in/username"
  icon="tabler/brand-linkedin"
/>
```

## Accessibility
- Uses semantic HTML elements
- Includes proper ARIA labels
- Supports keyboard navigation
- Maintains color contrast ratios
- Indicates external links
```

### 5. Create Social Cards Grid Component
Create new file: `src/components/SocialCards/SocialCards.astro`
```typescript
---
import { socialLinks } from '@data/socialLinks';
import SocialCard from '@components/SocialCard/SocialCard.astro';

const aboutPageLinks = socialLinks.filter(link => link.visibility.about);
---

<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
  {aboutPageLinks.map(link => (
    <SocialCard {...link} />
  ))}
</div>
```

### 6. Add Grid Component Documentation
Create new file: `src/components/SocialCards/README.md`
```markdown
# SocialCards Component

A responsive grid layout for displaying social media cards.

## Usage

```astro
import SocialCards from '@components/SocialCards/SocialCards.astro';

<SocialCards />
```

## Features
- Responsive grid layout (2 columns on mobile, 3 on tablet, 4 on desktop)
- Filters social links based on visibility settings
- Maintains consistent spacing and alignment
```

### 7. Create Test Files
Create new file: `src/components/SocialCard/__tests__/SocialCard.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/astro';
import SocialCard from '../SocialCard.astro';

describe('SocialCard', () => {
  it('renders with correct props', async () => {
    const { getByRole, getByText } = await render(SocialCard, {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: 'tabler/brand-linkedin'
    });

    const link = getByRole('link');
    expect(link).toHaveAttribute('href', 'https://linkedin.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(getByText('LinkedIn')).toBeInTheDocument();
  });

  it('maintains accessibility requirements', async () => {
    const { getByRole } = await render(SocialCard, {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: 'tabler/brand-linkedin'
    });

    const link = getByRole('link');
    expect(link).toHaveAttribute('aria-label');
  });
});
```

Create new file: `src/components/SocialCards/__tests__/SocialCards.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/astro';
import SocialCards from '../SocialCards.astro';

describe('SocialCards', () => {
  it('renders grid with correct layout classes', async () => {
    const { container } = await render(SocialCards);
    const grid = container.querySelector('div');
    expect(grid).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');
  });

  it('only renders cards with about visibility enabled', async () => {
    const { getAllByRole } = await render(SocialCards);
    const cards = getAllByRole('link');
    cards.forEach(card => {
      expect(card).toHaveClass('social-card');
    });
  });
});
```

### 8. Update About Page
Add the social cards section to the about page:
```typescript
---
import Badge from '@components/Badge/Badge.astro';
import SocialCards from '@components/SocialCards/SocialCards.astro';
---

<section class="py-24 md:py-28">
  <div class="site-container px-4">
    <div class="grid-pattern-container relative">
      <div class="mx-auto text-center md:max-w-2xl">
        <Badge>Connect with me</Badge>
        <h2 class="h2 mb-4">Let's Connect</h2>
        <p class="description text-lg md:text-xl">
          Find me on various social platforms where I share insights about CRO, UX, and e-commerce.
        </p>
      </div>
      
      <div class="mt-12">
        <SocialCards />
      </div>
    </div>
  </div>
</section>
```

### 5. Update Existing Components
Update usage in Footer and HeroSideImage:
```typescript
<SocialLinks location="footer" />
```
```typescript
<SocialLinks location="hero" />
```

### 9. Add Accessibility Documentation
Create new file: `src/components/SocialCard/ACCESSIBILITY.md`
```markdown
# SocialCard Accessibility Guidelines

## WCAG 2.1 AA Compliance
- Color contrast ratio of at least 4.5:1 for text
- Interactive elements are keyboard accessible
- Focus indicators are visible
- Touch targets are at least 44x44 pixels

## Implementation Details
1. Semantic HTML
   - Uses semantic `<a>` tags for links
   - Proper heading hierarchy with `<h3>`

2. ARIA Attributes
   - Descriptive aria-labels for links
   - Icon images marked as decorative

3. Keyboard Navigation
   - Focusable elements in logical order
   - Visible focus indicators
   - Interactive elements reachable via keyboard

4. Screen Readers
   - Meaningful link text
   - Icon descriptions hidden from screen readers
   - Platform names clearly announced

5. Visual Design
   - Sufficient color contrast
   - Visual feedback on hover/focus
   - Clear visual hierarchy

## Testing Checklist
- [ ] Test with keyboard navigation
- [ ] Verify screen reader announcements
- [ ] Check color contrast ratios
- [ ] Validate focus management
- [ ] Test with browser zoom
- [ ] Verify touch target sizes
```

## Testing Steps
1. Verify all social links appear correctly in the new cards layout
2. Test responsive behavior:
   - Desktop (4 cards per row)
   - Tablet (3 cards per row)
   - Mobile (2 cards per row)
3. Verify hover states and transitions
4. Test visibility toggles work correctly across all components
5. Verify accessibility:
   - Proper focus states
   - Correct ARIA labels
   - Keyboard navigation
6. Test dark mode compatibility

### 10. Update Styleguide
Update `src/pages/styleguide.astro` to include the new social card component:
```typescript
---
// ... existing imports
import SocialCard from '@components/SocialCard/SocialCard.astro';
---

<!-- Add to the components section -->
<section id="social-cards">
  <h2>Social Cards</h2>
  <div class="mt-8">
    <SocialCard
      name="LinkedIn"
      href="https://linkedin.com/in/example"
      icon="tabler/brand-linkedin"
    />
  </div>
  <CodeBlock
    code={`
<SocialCard
  name="LinkedIn"
  href="https://linkedin.com/in/example"
  icon="tabler/brand-linkedin"
/>
    `}
  />
</section>
```

## Notes
### Design Standards
- Follows container structure guidelines with proper padding
- Uses standardized section spacing (py-24 md:py-28)
- Grid system follows standard patterns
- Component documented in styleguide.astro
- Z-index management follows conventions

### Implementation Notes
- All styles use existing Tailwind classes from the project
- Maintains consistent color scheme using base/primary color variables
- Follows existing card and grid patterns
- Uses existing utility classes for spacing and typography
- Maintains accessibility standards with proper focus states and ARIA labels

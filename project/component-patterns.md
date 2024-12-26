# Component Patterns

## Component Architecture

### Base Component Structure
```astro
---
// Imports
import type { HTMLAttributes } from 'astro/types';
import { Image } from 'astro:assets';

// Props Interface
interface Props extends HTMLAttributes<'div'> {
  title: string;
  description?: string;
  className?: string;
}

// Props Destructuring
const { 
  title, 
  description, 
  className = '',
  ...attrs 
} = Astro.props;
---

<!-- Component Template -->
<div class:list={["base-component", className]} {...attrs}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  <slot />
</div>
```

## Common Patterns

### Layout Components
```astro
<!-- Container Layout -->
<div class="site-container px-4">
  <div class="grid gap-16 sm:grid-cols-2">
    <slot />
  </div>
</div>

<!-- Section Layout -->
<section class="py-24 md:py-28">
  <div class="site-container px-4">
    <slot />
  </div>
</section>
```

### Card Components
```astro
<!-- Feature Card -->
<article class="flex flex-col gap-4">
  <div class="aspect-video relative overflow-hidden rounded-lg">
    <Image src={image} alt={alt} class="object-cover" />
  </div>
  <div class="flex flex-col gap-2">
    <h3 class="text-xl font-bold">{title}</h3>
    <p class="text-base-600 dark:text-base-400">{description}</p>
  </div>
</article>

<!-- Service Card -->
<div class="flex flex-col items-start gap-4 rounded-xl bg-base-100 p-6 dark:bg-base-800">
  <div class="rounded-lg bg-primary-100 p-3 dark:bg-primary-900/30">
    <Icon name={icon} class="h-6 w-6 text-primary-600 dark:text-primary-400" />
  </div>
  <h3 class="text-lg font-semibold">{title}</h3>
  <p class="text-base-600 dark:text-base-400">{description}</p>
</div>
```

### Hero Components
```astro
<!-- Centered Hero -->
<section class="py-24 md:py-32">
  <div class="site-container px-4">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-4xl font-bold md:text-5xl lg:text-6xl">{title}</h1>
      <p class="mt-6 text-xl text-base-600 dark:text-base-400">{description}</p>
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <slot name="cta" />
      </div>
    </div>
  </div>
</section>
```

### Content Components
```astro
<!-- Content Section -->
<div class="prose prose-lg dark:prose-invert">
  <slot />
</div>

<!-- Content Grid -->
<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  {items.map(item => (
    <ContentCard {...item} />
  ))}
</div>
```

## Interactive Patterns

### Button Components
```astro
<!-- Primary Button -->
<button 
  class="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-base-900"
  {...attrs}
>
  <slot />
</button>

<!-- Ghost Button -->
<button 
  class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-base-900 transition hover:bg-base-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-base-50 dark:hover:bg-base-700/50 dark:focus:ring-offset-base-900"
  {...attrs}
>
  <slot />
</button>
```

### Form Components
```astro
<!-- Input Field -->
<div class="flex flex-col gap-1.5">
  <label for={id} class="text-sm font-medium text-base-700 dark:text-base-300">
    {label}
  </label>
  <input
    type="text"
    id={id}
    class="rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 placeholder-base-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-base-700 dark:bg-base-800 dark:text-base-50 dark:placeholder-base-400"
    {...attrs}
  />
</div>
```

## State Management

### Loading States
```astro
<!-- Loading Skeleton -->
<div class="animate-pulse">
  <div class="h-4 w-3/4 rounded bg-base-200 dark:bg-base-700"></div>
  <div class="mt-4 h-4 w-1/2 rounded bg-base-200 dark:bg-base-700"></div>
</div>

<!-- Loading Spinner -->
<div class="flex items-center justify-center">
  <div class="h-6 w-6 animate-spin rounded-full border-2 border-base-200 border-t-primary-500"></div>
</div>
```

### Error States
```astro
<!-- Error Message -->
<div class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
  <div class="flex items-start gap-3">
    <Icon name="alert-circle" class="h-5 w-5 text-red-600 dark:text-red-400" />
    <div class="text-sm text-red-600 dark:text-red-400">
      <slot />
    </div>
  </div>
</div>
```

## Accessibility Patterns

### Focus Management
```astro
<!-- Focus Trap Container -->
<div 
  class="focus-trap"
  tabindex="-1"
  role="dialog"
  aria-modal="true"
>
  <slot />
</div>

<!-- Skip Link -->
<a 
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-primary-600 focus:shadow-lg"
>
  Skip to main content
</a>
```

### ARIA Patterns
```astro
<!-- Expandable Section -->
<div>
  <button
    aria-expanded={isExpanded}
    aria-controls={contentId}
    class="flex w-full items-center justify-between"
  >
    <span>{title}</span>
    <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} />
  </button>
  <div
    id={contentId}
    role="region"
    aria-labelledby={buttonId}
    hidden={!isExpanded}
  >
    <slot />
  </div>
</div>
```

## Best Practices

1. **Component Organization**
   - One component per file
   - Clear, descriptive filenames
   - Grouped by feature/domain
   - Shared components in common directory

2. **Props Management**
   - TypeScript interfaces for all props
   - Default values where appropriate
   - Props spreading for HTML attributes
   - Clear prop documentation

3. **Styling Guidelines**
   - Use Tailwind utility classes
   - Consistent spacing patterns
   - Dark mode support
   - Responsive design patterns

4. **Performance Considerations**
   - Lazy loading where appropriate
   - Image optimization
   - Transition animations
   - Loading states

5. **Accessibility**
   - Semantic HTML
   - ARIA attributes
   - Keyboard navigation
   - Screen reader support

# Feed Implementation Plan

This document outlines the implementation plan for the new Feed feature, which aggregates latest content from various sources in chronological order.

## Overview
The Feed feature consists of two main components:
1. A full page showing all latest items
2. A homepage widget showing the 5 most recent items

## Implementation Sections

### 1. Data Layer Setup & Content Collection

**Available Documentation:**
- Use `bluesky-docs` MCP tool for BlueSky API reference
- Use `github-docs` MCP tool for GitHub API reference
- See `project/bluesky-feed-implementation.md` for detailed BlueSky integration plan

- [ ] Create types for feed items in `src/types/feed.ts`:
  ```typescript
  interface BaseFeedItem {
    id: string;
    title: string;
    description?: string;
    date: Date;
    url: string;
    source: 'blog' | 'event' | 'podcast' | 'github' | 'bluesky';
    icon?: string;
    lang?: string; // For internationalization
    draft?: boolean; // For draft status
  }
  ```
- [ ] Create feed data utilities in `src/utils/feedUtils.ts`:
  - [ ] Function to fetch and parse blog posts
  - [ ] Function to fetch and parse events
  - [ ] Function to fetch and parse podcast episodes
  - [ ] Function to fetch GitHub activity
  - [ ] Function to fetch BlueSky posts
  - [ ] Function to merge and sort all items chronologically

**Validation:**
1. Write unit tests in `src/utils/__tests__/feedUtils.test.ts`
2. Verify each source's data is correctly fetched and parsed
3. Ensure proper error handling for failed fetches
4. Validate chronological sorting works correctly

### 2. Feed Components
- [ ] Update stylesheet imports in `src/styles/global.scss`:
  ```scss
  /* Import Feed Component Styles */
  @use './components/feed';
  ```

- [ ] Create feed styles in `src/styles/components/_feed.scss`:
  ```scss
  @use '../utilities/utilities';
  
  // Feed-specific link exceptions
  .feed-card {
    a {
      text-decoration: none;
      @apply text-base-900 hover:text-primary-500 dark:text-base-100 dark:hover:text-primary-400;
    }
  }
  
  // Feed title styling following heading standards
  .feed-title {
    @apply text-base-900 dark:text-base-100;
  }

  // Gradient mask for feed transitions
  .feed-transition {
    @apply mask-gradient;
  }
  ```

- [ ] Create base feed item component in `src/components/Feed/FeedItem.astro`:
  ```typescript
  interface Props {
    item: BaseFeedItem;
    isCompact?: boolean;
  }
  ```
  ```astro
  <article class="card">
    <div class="card-container">
      <!-- Icon or image based on source -->
      <div class="card-image">
        {item.icon && <Icon name={item.icon} />}
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{item.title}</h3>
      {item.description && <p class="card-description">{item.description}</p>}
      <div class="card-meta">
        <time datetime={item.date.toISOString()}>
          {formatDate(item.date)}
        </time>
        <span class="source-badge">{item.source}</span>
      </div>
    </div>
  </article>
  ```

- [ ] Create feed list component in `src/components/Feed/FeedList.astro`:
  ```typescript
  interface Props {
    items: BaseFeedItem[];
    limit?: number;
  }
  ```
  ```astro
  <div class="cards-grid">
    {items.slice(0, limit).map(item => (
      <FeedItem item={item} isCompact={isCompact} />
    ))}
  </div>
  ```

- [ ] Style components using existing card system:
  - Utilize existing `_cards.scss` classes:
    - `card` for base card styling
    - `card-container` for media container
    - `card-content` for content structure
    - `card-title` for titles
    - `card-description` for descriptions
    - `card-meta` for dates and metadata
  - Add feed-specific styles to `src/styles/components/_cards.scss`:
    ```scss
    .source-badge {
      @apply text-sm font-medium px-2 py-1 rounded-full bg-primary-500/10 text-primary-500 dark:bg-primary-400/10 dark:text-primary-400;
    }

    .feed-card {
      @extend .card;
      /* Any feed-specific modifications */
    }
    ```

**Validation:**
1. Components render correctly in all viewports
2. Dark/light mode transitions work smoothly
3. Verify accessibility standards:
   - Proper heading hierarchy
   - ARIA labels
   - Keyboard navigation
   - Color contrast

### 3. Navigation Integration
- [ ] Update `src/config/en/navData.json.ts`:
  ```typescript
  {
    text: "Feed",
    link: "/feed",
    icon: "tabler/outline/rss" // or similar
  }
  ```
- [ ] Add between "Creations" and "Events"
- [ ] Update mobile navigation

**Validation:**
1. Navigation item appears in correct position
2. Mobile navigation works correctly
3. Active state shows correctly when on feed page
4. Icon renders properly

### 4. Feed Page Implementation with View Transitions
- [ ] Create `src/pages/feed.astro`:
  ```astro
  ---
  import BaseLayout from "@layouts/BaseLayout.astro";
  import FeedList from "@components/Feed/FeedList.astro";
  import { getAllFeedItems } from "@utils/feedUtils";
  
  const feedItems = await getAllFeedItems();
  ---
  
  <BaseLayout 
    title="Feed" 
    description="Latest updates and activity"
    transition:name="feed"
    transition:animate="slide"
  >
    <div class="site-container px-4">
      <h1 
        class="text-regular md:text-large font-bold mb-8" 
        transition:name="feed-title"
      >
        Feed
      </h1>
      <div class="z-base">
        <FeedList items={feedItems} />
      </div>
    </div>
  </BaseLayout>
  ```
- [ ] Implement infinite scroll or pagination
- [ ] Add loading states
- [ ] Implement error handling

**Validation:**
1. Page loads and renders correctly
2. Performance testing (Lighthouse)
3. Error states display properly
4. Loading states work as expected

### 5. Homepage Widget Implementation
- [ ] Create `src/components/Feed/FeedWidget.astro`:
  ```astro
  ---
  import FeedList from "./FeedList.astro";
  import { getAllFeedItems } from "@utils/feedUtils";
  
  const feedItems = await getAllFeedItems();
  const recentItems = feedItems.slice(0, 5);
  ---
  
  <section class="py-24 md:py-28">
    <div class="site-container px-4">
      <h2 class="text-regular md:text-large font-bold mb-8">Latest Updates</h2>
      <div class="z-base">
        <FeedList items={recentItems} isCompact={true} />
      </div>
      <a 
        href="/feed" 
        class="btn btn-secondary primary-focus mt-8"
        aria-label="View all feed items"
      >
        View All
      </a>
    </div>
  </section>
  ```
- [ ] Add widget to homepage layout
- [ ] Style widget following design standards

**Validation:**
1. Widget renders correctly on homepage
2. Responsive behavior works as expected
3. "View All" link works correctly
4. Performance impact is minimal

### 6. API Integration & Error Handling

**External API Documentation:**
- Use `bluesky-docs` MCP tool for BlueSky API reference and examples
- Use `github-docs` MCP tool for GitHub API reference and examples

**Implementation Details:**
- [ ] Create GitHub API integration (see [github-feed-implementation.md](./github-feed-implementation.md)):
  - [ ] Set up authentication with Github token
  - [ ] Implement Events API integration
  - [ ] Handle rate limits and caching efficiently
- [ ] Create BlueSky API integration (see [bluesky-feed-implementation.md](./bluesky-feed-implementation.md)):
  - [ ] Follow authentication setup guide
  - [ ] Implement rate limiting strategy
  - [ ] Use caching layer as specified
- [ ] Add error handling and fallbacks

**Validation:**
1. API calls work correctly
2. Rate limiting prevents API exhaustion
3. Caching improves performance
4. Error states handle gracefully

### 7. Testing, Documentation & Standards Compliance
- [ ] Write end-to-end tests:
  - [ ] Feed page functionality
  - [ ] Widget functionality
  - [ ] Navigation
- [ ] Update documentation:
  - [ ] Add API integration details
  - [ ] Document caching strategy
  - [ ] Add component usage examples
- [ ] Create README for feed components

**Validation:**
1. All tests pass
2. Documentation is complete
3. Code coverage meets standards
4. PR review approval
5. Verify compliance with design standards:
   - Typography scales (16px mobile, 22.4px desktop)
   - Link styling exceptions
   - Z-index layering
   - Container widths
   - Stylesheet organization

### 8. Performance & Animation Optimization
- [ ] Implement proper caching strategy
- [ ] Optimize image loading
- [ ] Add proper loading states
- [ ] Implement error boundaries

**Validation:**
1. Lighthouse performance score > 90
2. Core Web Vitals meet standards
3. Load time < 3s on 3G
4. Memory usage within bounds
5. Smooth animations and transitions:
   - GPU-accelerated properties
   - Reduced motion support
   - No layout shifts during transitions
6. Proper mask effects for gradients

### 9. Error Prevention & Edge Cases
- [ ] Implement proper error boundaries
- [ ] Add fallback UI components
- [ ] Handle network failures gracefully
- [ ] Implement retry logic for API calls
- [ ] Add proper TypeScript validation
- [ ] Handle empty states appropriately

**Validation:**
1. Error states render correctly
2. Fallback UI works as expected
3. Network failures handled gracefully
4. Type safety is maintained

## Final Validation Checklist
Before marking the feature as complete:

- [ ] All sections implemented and validated
- [ ] Accessibility audit passed
- [ ] Performance metrics met
- [ ] Documentation complete
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Browser testing complete:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Mobile testing complete:
  - [ ] iOS Safari
  - [ ] Android Chrome
- [ ] Dark mode working
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Internationalization complete
- [ ] View transitions working
- [ ] Error boundaries tested
- [ ] Network failure states verified
- [ ] Empty states handled properly

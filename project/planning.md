# Website Implementation

## Subprojects Done

### Overview Page (`/presentations`)
- [x] Create presentations overview page with Featured and More sections
- [x] Implement responsive grid layout
- [x] Add proper styling using website's color scheme:
  - [x] White background for cards
  - [x] Base colors for borders and text
  - [x] Primary colors for interactive elements
- [x] Add hover effects on cards and images
- [x] Ensure proper contrast in both light and dark modes

### Detail Page (`/presentations/[slug]`)
- [x] Create dynamic presentation detail pages
- [x] Add proper styling:
  - [x] White titles for better contrast
  - [x] Duration badge using base colors
  - [x] Workshop badge using primary colors
  - [x] Navigation between presentations
- [x] Add support for slides and video embeds
- [x] Add metadata for SEO
- [x] Add proper image handling with preloading

### Components
- [x] Create PresentationCard component
- [x] Create PresentationNav component
- [x] Create SlideEmbed component
- [x] Create VideoEmbed component
- [x] Ensure consistent styling across all components
- [x] Implement proper color contrast throughout

### Data Management
- [x] Remove duplicate presentations
- [x] Add proper filtering for required fields
- [x] Add sorting by title
- [x] Add featured presentation support
- [x] Implement TypeScript interfaces for data

### Navigation
- [x] Add "Presentations" link to main navigation menu between Events and Press
- [x] Update `/src/config/en/navData.json.ts`
- [x] Ensure proper active state for navigation items

### Event Integration
- [x] Implement bi-directional relationship between presentations and events
- [x] Update event data to include presentation references
- [x] Add presentation links to event detail pages
- [x] Add event links to presentation detail pages
- [x] Update TypeScript interfaces for event-presentation relationship

### Accessibility
- [x] Go through /projects/accessibility-checklist.md
  
### Design
- [x] fix the "Meet Guido" pill in the homepage hero section: it's too wide. After fixing this, make sure this isn't happening in other places as well.
- [x] View past events button in Future Events section on homapage has text that is too grey.
- [x] the sides of the flag section (FeatureFlagsMarquee) and gallery section (FeatureGalleryMarquee) needs to be truly transparent, not a fade to grey.
- [x] There is a weird "dot" between name and date on /post/ overview page that is showing up too high. The same dot is also shown on the post detail page, but there it's properly aligned with the text.
- [x] Should we implement the gray background behind all content cards/blocks? Some have it, some don't. What should be the guiding principle here?
      - [x] Visually align podcast cards with the other content cards on press and blog overview pages
- [x] Fix black dots / light mode for the "In need of a keynote speaker or in-house workshop?" CTA block
- [x] event images: dark/light mode (e.g. can't see spryker logo in white mode) 

### Other / functional details that need fixing
- [x] Podcast bottom CTA
- [x] Events bottom CTA
- [x] /about: remove form, add social media contact buttons
- [ ] Below a blog post, there is a "Back to article overview" back to previous article button and a next article button. The UI could improve here.
- [x] Remove the "updated" line from article detail pages
- [x] on /press/, the podcasts often only seem to load after a refresh
- [x] Why is there bot a src/pages/post/[...slug].astro and a src/pages/post/[slug].astro? Is one of them redundant?

### Performance
- [x] Implement lazy loading for images
- [x] Add image preloading for critical content
- [x] Optimize image sizes and formats
- [x] Implement lazy loading for embedded content
- [x] Add proper caching headers
- [x] Implement view transitions
- [x] Add error boundaries for embedded content

## Subprojects Todo

### Checks
- [ ] Redirects
- [x] Check site on mobile

### Testing
#### Test Infrastructure Setup
- [x] Configure Vitest with TypeScript support
- [x] Set up testing utilities and common test helpers
- [x] Configure testing environment variables
- [x] Add test scripts to package.json
- [ ] Set up GitHub Actions for automated testing

#### Unit Tests
- [ ] Add component tests:
  - [x] PresentationCard component (using snapshot testing)
  - [x] PresentationNav component (using DOM testing)
  - [x] SlideEmbed component (using DOM testing)
  - [x] VideoEmbed component (using DOM testing)
  - [x] PodcastCard component (using DOM testing)
  - [x] PodcastFeed component (using DOM testing)
  - [x] Navigation components (Nav, MobileNav, NavDropdown)
  - [x] Layout components (BaseLayout, BaseHead)
- [x] Add utility function tests:
  - [x] Data transformation functions (eventUtils, blogUtils)
  - [x] URL handling functions (linkHelpers)
  - [x] Date formatting utilities (pressUtils)
  - [x] Type guards and validators (typeGuards)

#### Integration Tests
- [ ] Test data fetching and processing:
  - [ ] Keystatic content retrieval
  - [ ] Event-presentation relationships
  - [ ] RSS feed generation
  - [ ] Podcast feed integration
- [ ] Test routing and navigation flows
- [ ] Test dark/light mode transitions
- [ ] Test Astro view transitions

#### End-to-End Tests
- [ ] Set up Playwright for E2E testing
- [ ] Test critical user journeys:
  - [ ] Navigation through presentation pages
  - [ ] Blog post reading and navigation
  - [ ] Event browsing and filtering
  - [ ] Search functionality
  - [ ] Contact form submission
- [ ] Test responsive layouts across devices:
  - [ ] Mobile (320px - 480px)
  - [ ] Tablet (481px - 768px)
  - [ ] Laptop (769px - 1024px)
  - [ ] Desktop (1025px+)

#### Accessibility Testing
- [ ] Implement automated accessibility tests:
  - [ ] ARIA attributes validation
  - [ ] Color contrast checking
  - [ ] Keyboard navigation testing
  - [ ] Screen reader compatibility
- [ ] Test with various assistive technologies:
  - [ ] VoiceOver (macOS)
  - [ ] NVDA (Windows)
  - [ ] Screen reader announcements

#### Performance Testing
- [ ] Set up Lighthouse CI
- [ ] Test and optimize:
  - [ ] Page load times
  - [ ] Time to Interactive
  - [ ] First Contentful Paint
  - [ ] Largest Contentful Paint
  - [ ] Cumulative Layout Shift
- [ ] Image optimization verification
- [ ] Resource loading optimization

#### Error Handling
- [ ] Test error boundaries
- [ ] Test fallback content
- [ ] Test 404 handling
- [ ] Test network error states
- [ ] Test embedded content failures

#### Content Validation
- [ ] Add a "dead link checker" for both internal and external 404 links > see project/dead-links-checker-implementation.md
- [ ] Validate Markdown/MDX content structure
- [ ] Test image references
- [ ] Verify metadata consistency

#### Continuous Integration
- [ ] Set up automated test runs on PR
- [ ] Configure test coverage reporting
- [ ] Set up test result visualization
- [ ] Implement test failure notifications

## After go-live

### Design
- [x] use better (full) social media icons
- [x] Odd podcast iframe loading on /press
- [x] Random link colors
- [ ] re-implement Astro page transitions, for articles (works for presentations)

### New Content
- [x] Add a section for Github projects
- [ ] Blog on AI tools I use?

### New features
- [ ] Podcast subscription links
- [ ] OpenGraph implementation for all pages
- [ ] Events: Year index
- [ ] Add Bluesky comments
- [ ] Activity feed
      - [ ] Add Latest BlueSky posts feed
      - [ ] Integrate with Github to get live updates
- [ ] Blog tags/categories (fix /categories/experimentation)
- [ ] For cards on /presentations and /post/ overview pages, make the whole card clickable, not just the image
- [x] Posts RSS

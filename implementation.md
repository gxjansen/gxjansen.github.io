# Presentations Section Implementation

## Overview Page (`/presentations`)
- [x] Create presentations overview page with Featured and More sections
- [x] Implement responsive grid layout
- [x] Add proper styling using website's color scheme:
  - [x] White background for cards
  - [x] Base colors for borders and text
  - [x] Primary colors for interactive elements
- [x] Add hover effects on cards and images
- [x] Ensure proper contrast in both light and dark modes

## Detail Page (`/presentations/[slug]`)
- [x] Create dynamic presentation detail pages
- [x] Add proper styling:
  - [x] White titles for better contrast
  - [x] Duration badge using base colors
  - [x] Workshop badge using primary colors
  - [x] Navigation between presentations
- [x] Add support for slides and video embeds
- [x] Add metadata for SEO
- [x] Add proper image handling with preloading

## Components
- [x] Create PresentationCard component
- [x] Create PresentationNav component
- [x] Create SlideEmbed component
- [x] Create VideoEmbed component
- [x] Ensure consistent styling across all components
- [x] Implement proper color contrast throughout

## Data Management
- [x] Remove duplicate presentations
- [x] Add proper filtering for required fields
- [x] Add sorting by title
- [x] Add featured presentation support
- [x] Implement TypeScript interfaces for data

## Navigation
- [x] Add "Presentations" link to main navigation menu between Events and Press
- [x] Update `/src/config/en/navData.json.ts`
- [x] Ensure proper active state for navigation items

## Event Integration
- [x] Implement bi-directional relationship between presentations and events
- [x] Update event data to include presentation references
- [x] Add presentation links to event detail pages
- [x] Add event links to presentation detail pages
- [x] Update TypeScript interfaces for event-presentation relationship

## Accessibility
- [x] Add proper ARIA labels to interactive elements
- [x] Ensure keyboard navigation works correctly
- [x] Add proper alt text to all images
- [x] Maintain semantic HTML structure
- [x] Ensure sufficient color contrast ratios
- [ ] Add skip links for embedded content
- [ ] Add transcripts for video content

## Performance
- [x] Implement lazy loading for images
- [x] Add image preloading for critical content
- [x] Optimize image sizes and formats
- [x] Implement lazy loading for embedded content
- [x] Add proper caching headers
- [ ] Add loading states for dynamic content
- [ ] Implement view transitions
- [ ] Add error boundaries for embedded content

## Testing
- [ ] Add unit tests for components
- [ ] Add integration tests for data fetching
- [ ] Add end-to-end tests for user flows
- [ ] Test responsive layouts across devices
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test embedded content fallbacks
- [ ] Test error states and boundaries

## Technical Reference

### File Structure
- `src/content/presentations/` - Presentations content
- `src/components/Presentations/` - Components
- `src/pages/presentations/` - Pages

### Data Schema
```typescript
interface Presentation {
  title: string;
  duration?: string;
  intendedAudience?: string;
  isWorkshop: boolean;
  isFeatured: boolean;
  image?: string;
  slideshareKey?: string;
  youtubeId?: string;
  relatedEventSlugs: string[];
}
```

### Color Scheme
Using website's base color scale for consistency:

Light mode:
- Background: bg-background
- Borders: border-base-200
- Text: text-base-900

Dark mode:
- Background: bg-base-900
- Borders: border-base-800
- Text: text-white

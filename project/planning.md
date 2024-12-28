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

## Subprojects Todo

### Design
- [ ] Should we implement the gray background behind all content cards/blocks? Some have it, some don't. What should be the guiding principle here?
      - [ ] Visually align podcast cards with the other content cards on press and blog overview pages
- [x] fix the "Meet Guido" pill in the homepage hero section: it's too wide. After fixing this, make sure this isn't happening in other places as well.
- [x] View past events button in Future Events section on homapage has text that is too grey.
- [x] the sides of the flag section (FeatureFlagsMarquee) and gallery section (FeatureGalleryMarquee) needs to be truly transparent, not a fade to grey.
- [x] There is a weird "dot" between name and date on /post/ overview page that is showing up too high. The same dot is also shown on the post detail page, but there it's properly aligned with the text.
- [ ] Fix black dots / light mode for the "In need of a keynote speaker or in-house workshop?" CTA block
- [ ] event images: dark/light mode (e.g. can't see spryker logo in white mode) 

### Other / functional details that need fixing
- [ ] Podcast subscription links
- [x] Podcast bottom CTA
- [x] Events bottom CTA
- [x] /about: remove form, add social media contact buttons
- [ ] Below a blog post, there is a "Back to article overview" back to previous article button and a next article button. The UI could improve here.
- [x] Remove the "updated" line from article detail pages
- [ ] on /press/, the podcasts often only seem to load after a refresh
- [x] Why is there bot a src/pages/post/[...slug].astro and a src/pages/post/[slug].astro? Is one of them redundant?

### Checks
- [ ] Dead links checker
- [ ] Redirects
- [ ] Check site on mobile

### Performance
- [x] Implement lazy loading for images
- [x] Add image preloading for critical content
- [x] Optimize image sizes and formats
- [x] Implement lazy loading for embedded content
- [x] Add proper caching headers
- [ ] Add loading states for dynamic content
- [x] Implement view transitions
- [ ] Add error boundaries for embedded content

### Testing
- [ ] Add unit tests for components
- [ ] Add integration tests for data fetching
- [ ] Add end-to-end tests for user flows
- [ ] Test responsive layouts across devices
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test embedded content fallbacks
- [ ] Test error states and boundaries
- [ ] Add a "dead link checker" for both internal and external 404 links

## After go-live

### New Content
- [ ] Add a section for Github projects
- [ ] Integrate with Github to get live updates
- [ ] Blog on AI tools I use?

### New features
- [ ] Add Bluesky comments
- [ ] Add Latest BlueSky posts feed
- [ ] For cards on /presentations and /post/ overview pages, make the whole card clickable, not just the image

### Motion
- [ ] Implement tailwindcss-motion (npm i -D tailwindcss-motion) or auto-animate (npm install @formkit/auto-animate)

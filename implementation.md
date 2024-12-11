# Presentations Section Implementation Plan

> Note: See questions.md for all implementation decisions.

## File Size Requirements

- [ ] All files must remain under 200 lines of code
- [ ] Split components into smaller sub-components when approaching limit
- [ ] Move utility functions to dedicated files
- [ ] Create separate files for type definitions
- [ ] Break down large pages into smaller components

## 1. Data Structure

### 1.1 Create Content Schema (src/content/config.ts)
- [ ] Define presentation collection schema:
  ```typescript
  const presentations = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      duration: z.string(),
      intendedAudience: z.string().optional(),
      isWorkshop: z.boolean(),
      isFeatured: z.boolean(),
      image: z.string(),
      slideshareKey: z.string().optional(),
      youtubeId: z.string().optional(),
      relatedEventSlugs: z.array(z.string())
    })
  });
  ```
- [ ] Export collections config
- [ ] Add type safety checks
- [ ] Keep each type file focused and under 200 lines

### 1.2 Create Content Structure
- [ ] Create src/content/presentations/ directory
- [ ] Convert presentations to MDX format with frontmatter
- [ ] Add rich content descriptions
- [ ] Add relationship to events
- [ ] Validate MDX content structure

### 1.3 Update Events Data
- [ ] Update events.json to include roles
- [ ] Set "Presenter" role for events with presentations
- [ ] Maintain existing roles for events without presentations
- [ ] Add presentation relationships
- [ ] Validate data integrity

## 2. Components

### 2.1 Create Base Components (src/components/Presentations/)
Each component should be split if approaching 200 lines:

#### PresentationCard/
- [ ] index.astro (main component)
- [ ] Use Astro's Image component for optimized images
- [ ] Display duration and workshop label as badges
- [ ] Show intended audience when available
- [ ] Render MDX content

#### FeaturedPresentations/
- [ ] index.astro (main component)
- [ ] Grid layout for featured presentations
- [ ] No pagination needed (max 9 items)

#### SlideEmbed/
- [ ] index.astro (main component)
- [ ] LoadingPlaceholder.astro
- [ ] Hide on error
- [ ] Fallback to external link button

#### VideoEmbed/
- [ ] index.astro (main component)
- [ ] LoadingPlaceholder.astro
- [ ] Hide on error
- [ ] Fallback to external link button

### 2.2 Create Role Components (src/components/Events/)
- [ ] Create RoleDisplay component:
  ```typescript
  // RoleDisplay.astro
  interface Props {
    role: EventRole;
  }
  ```
- [ ] Add role icons using Tabler icons
- [ ] Hide "Presenter" role
- [ ] Ensure consistent text styling
- [ ] Add role filtering functionality

### 2.3 Update Event Components
- [ ] Update EventCard to use RoleDisplay component
- [ ] Add role filter controls to event lists
- [ ] Ensure responsive layout with role information

### 2.4 Component Features
- [ ] Implement lazy loading for slides/videos
- [ ] Add workshop/keynote filtering
- [ ] Add sorting by date
- [ ] Add search functionality
- [ ] Implement responsive grid layout
- [ ] Add transitions between views

## 3. Pages

### 3.1 Overview Page (src/pages/presentations/index.astro)
- [ ] Create index.astro (main page)
- [ ] Use getCollection to fetch presentations
- [ ] Filter featured presentations
- [ ] Split into smaller components:
  - [ ] Header.astro
  - [ ] FeaturedPresentations.astro
- [ ] Match press.astro structure

### 3.2 Detail Page (src/pages/presentations/[...slug].astro)
- [ ] Create [...slug].astro for dynamic routes
- [ ] Use getEntry to fetch presentation
- [ ] Split into smaller components:
  - [ ] PresentationHeader.astro (title, metadata, image)
  - [ ] PresentationContent.astro (MDX content)
  - [ ] RelatedEvents.astro (linked events)
- [ ] Match press detail page structure

### 3.3 Update Events Pages
- [ ] Add RoleDisplay component to event detail pages
- [ ] Add role filtering to event lists
- [ ] Ensure consistent layout and styling

## 4. Bi-directional Relationship with Events

### 4.1 One-time Web Crawler
- [ ] Create simple crawler script to process www.gui.do/presentation
- [ ] Extract presentation-event relationships
- [ ] Extract roles from events
- [ ] Generate JSON output for manual verification

### 4.2 Event Matching
- [ ] Implement fuzzy name matching with exact date
- [ ] Extract and match roles
- [ ] Generate list of certain and uncertain matches
- [ ] Allow manual review of uncertain matches
- [ ] Create final relationship mapping

### 4.3 Data Integration
- [ ] Update events.json with:
  - [ ] Presentation relationships
  - [ ] Roles (Presenter or specific role)
- [ ] Create MDX files with event relationships
- [ ] Add build-time validation for relationship integrity
- [ ] Validate role consistency

### 4.4 UI Implementation
- [ ] Create RelatedEvents component for presentations
- [ ] Update existing events component to:
  - [ ] Show related presentations
  - [ ] Display roles appropriately
  - [ ] Style role information
- [ ] Add presentation links to event detail pages
- [ ] Ensure consistent styling

## 5. Styling

### 5.1 Create Presentation-specific Styles
- [ ] Split styles into separate files by component
- [ ] Create shared style utilities
- [ ] Keep style files organized and focused

### 5.2 Create Role-specific Styles
- [ ] Create role icon styles
- [ ] Style role text consistently
- [ ] Create role filter UI styles
- [ ] Ensure responsive design for role displays

### 5.3 Component-specific Styles
- [ ] Create separate style files for each component
- [ ] Keep style definitions modular

## 6. Testing

### 6.1 Functionality Testing
- [ ] Test presentation rendering
- [ ] Test event relationships
- [ ] Test embed fallbacks
- [ ] Test role filtering
- [ ] Verify build-time validation
- [ ] Test responsive layouts

### 6.2 Visual Testing
- [ ] Test responsive layouts
- [ ] Verify image optimization
- [ ] Check embed loading states
- [ ] Verify error states
- [ ] Test role display consistency

## 7. Documentation

### 7.1 Code Documentation
- [ ] Document component props
- [ ] Document utility functions
- [ ] Document type definitions
- [ ] Document role system

### 7.2 Usage Documentation
- [ ] Document how to add new presentations
- [ ] Document relationship management
- [ ] Document role management
- [ ] Add examples

## Implementation Order

1. [ ] Set up content collections
2. [ ] Create initial MDX files
3. [ ] Create role icons
4. [ ] Update events data with roles
5. [ ] Run crawler to establish relationships
6. [ ] Create core components
7. [ ] Create role components
8. [ ] Update event components with role support
9. [ ] Implement pages
10. [ ] Add styling
11. [ ] Test and refine
12. [ ] Add documentation

## Notes

- Follow existing project patterns from press section
- Maintain consistent styling with rest of site
- Ensure proper type safety throughout
- Consider future maintainability
- Keep performance in mind from the start
- Document all major decisions
- Review and update bi-directional relationships periodically
- IMPORTANT: Keep all files under 200 lines of code
- Split functionality into separate files when approaching line limit
- Use clear, descriptive file names for split components
- Use consistent icon style across all roles
- Keep role display simple and unobtrusive
- Ensure role filters are easily accessible
- Hide "Presenter" role throughout the UI
- Use Astro's content collections for presentations
- Leverage MDX for rich content
- Maintain content/code separation
- Prepare for potential Keystatic integration

# Technical Overview

## Project Architecture

### Core Technologies
- **Framework**: Astro v5.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS with SCSS
- **CMS**: Keystatic
- **Deployment**: Netlify (Static Mode)

### Key Integrations
- React (for interactive components)
- MDX (for content)
- Auto Import
- View Transitions
- Image Optimization (Sharp)
- Sitemap Generation
- Content Compression

## Build Configuration

### Astro Settings
- **Output Mode**: Static
- **Base URL**: gxjansen.github.io
- **i18n**: English default, no prefix
- **View Transitions**: Enabled with fallback
- **Image Processing**: Sharp with SVG support
- **Markdown**: Dracula theme with wrap

### Performance Optimizations
- Automatic asset compression
- Image CDN disabled (handled by Sharp)
- View transition fallbacks
- Optimized robots.txt generation

## Project Structure

### Source Organization
```
src/
├── components/    # UI components
├── content/       # MDX content
├── layouts/       # Page layouts
├── pages/         # Route definitions
├── styles/        # Global styles
├── utils/        # Shared utilities
└── config/       # Site configuration
```

### Component Categories
1. **Layout Components**
   - Base layouts
   - Navigation
   - Footer
   - Container structures

2. **UI Components**
   - Hero sections
   - Feature cards
   - CTAs
   - Service cards
   - Badges
   - Categories

3. **Content Components**
   - PodcastFeed
   - RelatedPresentations
   - ContentTypeSelector

4. **Interactive Elements**
   - LinkedInCTA
   - Service interactions
   - Content selectors

## Development Standards

### Component Guidelines
1. **Container Usage**
   - Use `site-container` with `px-4` for horizontal constraints
   - Components handle their own vertical spacing
   - No individual horizontal padding in components

2. **Spacing Standards**
   - Section spacing: `py-24 md:py-28`
   - Grid gaps: 4/8/16 based on context
   - Responsive breakpoints follow Tailwind defaults

3. **Button System**
   - Primary (brand color)
   - Secondary (contextual)
   - Outline
   - Ghost
   - All with dark mode support

### Performance Guidelines
1. **Image Optimization**
   - Use Astro's `<Image />` component
   - SVG optimization enabled
   - Responsive images with proper sizing

2. **CSS Management**
   - Tailwind classes in components
   - Global styles in SCSS using @apply
   - Dark mode support throughout
   - GPU acceleration for animations

### Accessibility Standards
1. **Core Requirements**
   - WCAG 2.1 AA compliance
   - Proper ARIA attributes
   - Keyboard navigation
   - Color contrast (4.5:1 minimum)

2. **Implementation**
   - Semantic HTML
   - Focus management
   - Screen reader support
   - Responsive design

## Content Management

### Keystatic Integration
- Content types defined in keystatic.config.tsx
- MDX support for rich content
- Asset management
- Preview capabilities

### Content Organization
1. **Blog Posts**
   - MDX format
   - Frontmatter metadata
   - Category system
   - Related content linking

2. **Presentations**
   - Structured data
   - Related content
   - Media integration

3. **Podcasts**
   - Feed integration
   - Dynamic content
   - Media embedding

## Deployment

### Netlify Configuration
- Static site generation
- Environment-specific robots.txt
- Sitemap generation
- Asset optimization

### Build Process
1. Content processing
2. Asset optimization
3. Static generation
4. Deployment validation

## Future Improvements
- [ ] Component documentation automation
- [ ] Performance monitoring integration
- [ ] Automated accessibility testing
- [ ] Enhanced content preview system
- [ ] Component test coverage expansion

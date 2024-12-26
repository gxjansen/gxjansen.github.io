# Content Management System

## Keystatic Overview

Keystatic is configured to work in two modes:
- Local mode for development
- Cloud mode for production (free up to 3 users per team)

Access the admin interface at `/admin` or `/keystatic`

### Configuration
```typescript
storage: import.meta.env.DEV ? { kind: "local" } : { kind: "cloud" }
cloud: { project: "gxjansen/gxjansen" }
ui: { brand: { name: "gui.do admin" } }
```

## Content Collections

### Blog Posts (`blogEN`)
Located in: `src/content/post/*/`

#### Schema
- **Title** (slug field)
  - Name: Post title
  - Slug: SEO-friendly URL path
- **Description** (required, 1-160 chars)
- **Draft** status
- **Authors** (min 1)
  - Relationship to authors collection
- **Dates**
  - Publication date
  - Updated date (required)
- **Hero Image** (required)
- **Categories** (min 1)
- **Content** (MDX)
  - Supports: headings (h2-h6), formatting, lists, tables, code blocks
  - Custom component: Admonition

### Authors
Located in: `src/content/authors/*/`

#### Schema
- **Name** (slug field, required)
- **Avatar** (required)
- **About** (required)
  - Short author bio
- **Email** (required)
- **Author Link** (required)
  - Website or social media
- **Full Bio** (MDX)
  - Limited formatting options
  - No tables or code blocks

### Events
Located in: `src/content/events/*/`

#### Schema
- **Title** (slug field)
  - Event name/Organizer
- **Location**
  - City
  - Countries (relationship, min 1)
- **Start Date**
- **Event Logo** (required)
- **Draft** status

### Countries
Located in: `src/content/countries/*/`

#### Schema
- **Title** (slug field)
- **Flag Image** (required)

### Services
Located in: `src/content/services/*/`

#### Schema
- **Title** (slug field)
- **Description** (required, 1-160 chars)
- **Main Image** (required)
- **Draft** status
- **Content** (MDX)
  - Limited formatting options
  - Supports tables
  - No code blocks

### Other Pages
Located in: `src/content/otherPages/*/`

#### Schema
- **Title** (slug field)
- **Description** (required, 1-160 chars)
- **Draft** status
- **Content** (MDX)
  - Full formatting support
  - Custom Admonition component

## Content Organization

### Directory Structure
```
src/content/
├── post/           # Blog posts
├── authors/        # Author profiles
├── events/         # Event listings
├── countries/      # Country data
├── services/       # Service pages
└── otherPages/     # Misc content
```

### Image Management
- Images are stored alongside content
- Public paths are configured relative to content
- Required for: avatars, hero images, event logos, country flags

### Relationships
1. **Blog Posts → Authors**
   - One-to-many relationship
   - Minimum one author per post
   - Authors must exist before assignment

2. **Events → Countries**
   - One-to-many relationship
   - Minimum one country per event
   - Countries must exist before assignment

## Content Workflow

### Draft System
Available for:
- Blog posts
- Services
- Other pages
- Events

### Content Validation
1. **Required Fields**
   - Descriptions (1-160 chars)
   - Images
   - Authors for posts
   - Countries for events
   - Email format for authors

2. **Slug Management**
   - Auto-generated from titles
   - Warning against changing published slugs

### MDX Features
1. **Common Options**
   - Basic formatting
   - Headings
   - Lists
   - Links
   - Images
   - Dividers

2. **Advanced Features**
   - Tables (where enabled)
   - Code blocks (where enabled)
   - Custom components

## Best Practices

### Content Creation
1. **Slugs**
   - Create meaningful, SEO-friendly slugs
   - Never change after publication
   - Use lowercase with hyphens

2. **Images**
   - Optimize before upload
   - Provide meaningful alt text
   - Follow directory conventions

3. **Metadata**
   - Write compelling descriptions
   - Use consistent categorization
   - Keep dates accurate

### Content Management
1. **Draft Usage**
   - Use for work in progress
   - Review before publishing
   - Regular draft cleanup

2. **Updates**
   - Update modified dates
   - Maintain author associations
   - Check related content

3. **Organization**
   - Follow directory structure
   - Maintain clean image directories
   - Regular content audits

## Integration Points

### Astro Content Collections
- Schemas must match Keystatic configuration
- Update both when making changes
- Content is statically generated

### Frontend Components
- Content rendered through MDX
- Custom components available
- Responsive image handling

### Development Workflow
1. Local content management
2. Preview in development
3. Cloud sync in production
4. Netlify deployment

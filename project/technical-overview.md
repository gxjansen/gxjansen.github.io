# Technical Overview

## Page Handling

### Dynamic Routes

The site uses two main dynamic route handlers for pages:

1. `/src/pages/[...page].astro`: Main catch-all route that redirects to `/other/[page]` for proper page handling
2. `/src/pages/other/[...page].astro`: Actual page renderer with full error handling

Key implementation details:

```typescript
// Type safety
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
const page = Astro.props as Props;

// Structure validation
if (!page || !page.data || typeof page.render !== 'function') {
  // Handle invalid page structure
}

// Safe rendering
try {
  if (!page.data) throw new Error('Page data is undefined');
  const rendered = await page.render();
  Content = rendered.Content;
} catch (error) {
  // Handle render errors
}
```

### Error Prevention

To prevent "page.render is not a function" errors:

1. Always use proper TypeScript types for collections and props
2. Validate page structure before attempting to render
3. Initialize variables outside try blocks
4. Use try/catch for render operations
5. Handle view transitions appropriately
6. Redirect non-404 paths to /other/[page]

### View Transitions

Both route handlers support view transitions through proper header handling:

```typescript
const isViewTransition = () => 
  Astro.request.headers.get('Accept')?.includes('text/html') && 
  Astro.request.headers.get('Sec-Fetch-Mode') === 'navigate';
```

Different responses are sent based on the transition state:

- Regular navigation: Uses `Astro.redirect()`
- View transitions: Returns `Response` with appropriate headers
- Error states: Returns proper status codes (301, 404, 500)

### Page Routing Flow

1. User requests a page (e.g., /events/)
2. [...page].astro catches the request
3. If not a 404 page:
   - Redirects to /other/[page]
   - Handles view transitions appropriately
4. /other/[...page].astro renders the content:
   - Validates page structure
   - Handles errors gracefully
   - Renders content with proper layout

### Common Issues & Solutions

1. "page.render is not a function" error:
   - Cause: Attempting to render pages at root path
   - Solution: Ensure redirection to /other/ path
   - Prevention: Validate page structure before render

2. JSON parsing errors:
   - Cause: Malformed JSON or truncated files
   - Solution: Validate JSON before saving
   - Prevention: Use proper JSON tools/linters

3. View transition issues:
   - Cause: Missing transition headers
   - Solution: Proper header handling
   - Prevention: Use isViewTransition helper

## Content Collections

### Other Pages Collection

Located in `src/content/otherPages/`, these pages:

1. Support draft status filtering
2. Include language handling
3. Require title and description metadata
4. Support markdown rendering with custom components

Example collection entry:
```typescript
interface OtherPageFrontmatter {
  title: string;
  description: string;
  draft?: boolean;
}

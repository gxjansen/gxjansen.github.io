# Blog Restructure Plan

## Goal
Change blog URL structure from `/post/[articlename]` to `/post/[articlename]`

## Steps

### 1. Content Collection Changes
- Move all articles from `src/content/post/` to `src/content/blog/`
  ```bash
  mv src/content/post/* src/content/blog/
  rmdir src/content/blog/en
  ```
- Rename blog directory to post
  ```bash
  mv src/content/blog src/content/post
  ```
- Update content collection config in `src/content/config.ts`
  - Change collection name from 'blog' to 'post'
  - Update schema if needed

### 2. Page Route Changes
- Create new post route:
  - Move `src/pages/blog/[...slug].astro` to `src/pages/post/[slug].astro`
  - Update getStaticPaths to handle new URL structure
  - Remove locale handling since it's no longer needed

### 3. Component Updates
- Update BlogNav component:
  - Remove locale filtering
  - Update URL generation
  - Consider renaming to PostNav for consistency
- Update any components that link to blog posts:
  - Check for hardcoded `/post/` paths
  - Update to use `/post/` instead
- Update imports:
  - Change `getCollection("blog")` to `getCollection("post")`
  - Update any type imports

### 4. Navigation/Menu Updates
- Update navigation data in `src/config/en/navData.json.ts`:
  - Change blog URLs to post URLs

### Files to Update
1. `src/content/config.ts`
2. `src/pages/post/[slug].astro` (new file)
3. `src/components/Blog/BlogNav.astro`
4. `src/layouts/BlogLayoutCenter.astro`
5. `src/config/en/navData.json.ts`

### Order of Operations
1. Move/rename content directories
2. Create new route structure
3. Update components
4. Test thoroughly

Would you like me to proceed with implementing this plan?

# Color Contrast Audit Report

This report identifies potential color contrast issues in the codebase that may fail WCAG 2.2 AA standards (minimum 4.5:1 for normal text, 3:1 for large text).

## Key Findings

### 1. Low Contrast Text Colors (High Priority)

#### text-base-400 / text-base-500
These colors are extensively used throughout the site and likely have insufficient contrast:
- **Base-400 (RGB: 127, 146, 170)**: Used in dark mode, may not meet 4.5:1 contrast on dark backgrounds
- **Base-500 (RGB: 85, 105, 135)**: Used in light mode, may not meet 4.5:1 contrast on light backgrounds

**Affected Files:**
- `/src/pages/podcasts.astro` - Loading messages and error states
- `/src/pages/overview.astro` - Link text and metadata
- `/src/layouts/BlogLayoutCenter.astro` - Navigation links
- `/src/pages/404.astro` - Error page description
- `/src/components/PostCard/PostCardAtlas.astro` - Date/time text and descriptions
- `/src/components/Blog/BlogNav.astro` - Navigation text
- `/src/components/ThemeToggle/ThemeToggle.astro` - Theme toggle button
- `/src/components/SocialIcon/SocialIcon.astro` - Social icons (base-400/base-500)
- `/src/components/Footer/Footer.astro` - Footer text and links
- `/src/components/CookieConsent/CookieConsent.astro` - Cookie consent text
- Multiple navigation components (`NavLink`, `NavDropdown`, etc.)

#### text-gray-400 / text-gray-500 / text-gray-600
Additional low-contrast grays found:
- `/src/components/Podcasts/PodcastCard.astro` - Metadata text
- `/src/components/Events/EventCard.astro` - Event details

#### Other Low Contrast Colors
- **text-slate-400**: `/src/components/ServiceCard/ServiceCardIcon.astro`
- **text-neutral-600/400**: `/src/components/Press/LinkedInCTA.astro`

### 2. Opacity Issues

Several components use opacity which further reduces contrast:
- `/src/components/Companies/CompanyLogos.astro` - `opacity-50` on logos
- `/src/components/Events/EventCard.astro` - `opacity-80` on images
- `/src/components/Nav/MobileNav/MobileNav.astro` - `opacity-40` on disabled states
- `/src/components/Button/Button.astro` - `disabled:opacity-50`

### 3. Hover States

Many components change to potentially low-contrast colors on hover:
- `hover:text-base-600` / `dark:hover:text-base-300`
- These hover states may also fail contrast requirements

## Recommendations

### Immediate Actions Required

1. **Replace text-base-400/500 with higher contrast alternatives:**
   - Light mode: Consider using `text-base-600` (RGB: 58, 71, 91) or darker
   - Dark mode: Consider using `text-base-300` (RGB: 180, 190, 199) or lighter

2. **Replace gray-400/500/600 with higher contrast alternatives:**
   - Light mode: Use `text-gray-700` or darker
   - Dark mode: Use `text-gray-300` or lighter

3. **Review opacity usage:**
   - Remove or reduce opacity on text elements
   - If opacity is needed for design, ensure the resulting color still meets contrast requirements

4. **Test all color combinations:**
   - Use a contrast checker tool to verify all text/background combinations
   - Pay special attention to:
     - Error states
     - Disabled states
     - Placeholder text
     - Links in different states (normal, hover, visited, focus)

### Specific Component Updates Needed

1. **Navigation Components**: All nav links and dropdowns need higher contrast text
2. **Footer**: Both main text and copyright text need better contrast
3. **Form Elements**: Any placeholder or helper text needs review
4. **Cards**: Metadata text (dates, categories, etc.) needs higher contrast
5. **Buttons**: Disabled states should maintain readable contrast

### Testing Recommendations

1. Use automated tools like axe DevTools or WAVE to scan pages
2. Manually test with a contrast checker (e.g., WebAIM's Color Contrast Checker)
3. Test in both light and dark modes
4. Test with Windows High Contrast Mode
5. Consider users with color blindness

## Priority Order

1. **Critical**: Fix main body text and navigation (text-base-400/500)
2. **High**: Fix metadata and secondary text (gray colors)
3. **Medium**: Fix hover states and interactive elements
4. **Low**: Review decorative elements and images with text overlays
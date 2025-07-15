# Product Requirements Document: Astro 5.11 Feature Implementation

**Project**: gxjansen.github.io  
**Date**: January 15, 2025  
**Version**: 1.0  
**Status**: Draft

## Executive Summary

This PRD outlines the implementation of three key features from Astro 5.11 to improve the performance, security, and developer experience of gxjansen.github.io:

1. **Responsive Images** - Automatic generation of multiple image sizes for optimal loading
2. **CSP Headers** - Migration from meta tags to HTTP headers for enhanced security
3. **SVG Components** - Native SVG component support for better performance and flexibility

## 1. Responsive Images Implementation

### 1.1 Overview
Implement Astro's native responsive image generation to automatically create multiple image sizes and serve the most appropriate version based on device viewport and pixel density.

### 1.2 Business Value
- **Performance**: 40-60% reduction in image bandwidth for mobile users
- **SEO**: Improved Core Web Vitals (LCP) scores
- **User Experience**: Faster page loads, especially on mobile networks
- **Cost**: Reduced CDN bandwidth costs

### 1.3 Technical Requirements

#### 1.3.1 Configuration
```javascript
// astro.config.mjs
export default defineConfig({
  experimental: {
    responsiveImages: true
  }
});
```

#### 1.3.2 Implementation Scope
- Update all `<Image>` components to include responsive attributes
- Define standard breakpoints for the site: 360, 640, 768, 1024, 1280, 1920
- Implement density descriptors for high-DPI displays

#### 1.3.3 Component Updates Required
- `src/components/BlogPostPreview.astro` - Blog post thumbnails
- `src/components/Hero.astro` - Hero images
- `src/pages/posts/[...slug].astro` - Blog post featured images
- `src/components/ImageGallery.astro` - Gallery images
- `src/components/TestimonialsSwiperQuotes.astro` - Testimonial avatars

#### 1.3.4 Example Implementation
```astro
<!-- Before -->
<Image 
  src={heroImage} 
  alt="Hero image" 
  width={1200} 
  height={600} 
/>

<!-- After -->
<Image 
  src={heroImage} 
  alt="Hero image"
  widths={[360, 640, 768, 1024, 1280, 1920]}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
  quality={85}
  format="webp"
/>
```

### 1.4 Success Metrics
- Lighthouse Performance score improvement of 5-10 points
- 50% reduction in average image transfer size on mobile
- No visual quality degradation
- Build time increase < 20%

### 1.5 Testing Requirements
- Visual regression testing across all breakpoints
- Performance testing on 3G/4G networks
- Browser compatibility: Chrome, Safari, Firefox, Edge
- Verify srcset and sizes attributes are correctly generated

## 2. CSP Headers Migration

### 2.1 Overview
Migrate Content Security Policy from HTML meta tags to HTTP headers using Netlify's header support for improved security and performance.

### 2.2 Business Value
- **Security**: Headers cannot be modified by malicious JavaScript
- **Performance**: CSP evaluated before HTML parsing begins
- **Compliance**: Better alignment with security best practices
- **Monitoring**: Enable CSP violation reporting

### 2.3 Technical Requirements

#### 2.3.1 Current Implementation
Currently using meta tags in `src/components/BaseHead.astro`:
```html
<meta http-equiv="Content-Security-Policy" content="..." />
```

#### 2.3.2 Target Implementation

**Option A: Netlify Headers File**
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' 
        https://*.googletagmanager.com 
        https://www.google-analytics.com 
        https://js.tinyanalytics.io;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' 
        https://www.google-analytics.com 
        https://api.tinyanalytics.io 
        https://vitals.vercel-insights.com;
      media-src 'self' https:;
      frame-src 'self' 
        https://www.youtube.com 
        https://www.youtube-nocookie.com 
        https://share.transistor.fm;
      frame-ancestors 'self';
      base-uri 'self';
      form-action 'self' https://share.transistor.fm;
    """
```

**Option B: Astro Adapter Configuration**
```javascript
// astro.config.mjs
adapter: netlify({
  csp: {
    policy: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 
        "https://*.googletagmanager.com", 
        "https://www.google-analytics.com",
        "https://js.tinyanalytics.io"],
      // ... rest of policy
    }
  }
})
```

#### 2.3.3 Migration Steps
1. Extract current CSP from meta tag
2. Configure CSP in Netlify adapter
3. Test on staging environment
4. Enable CSP reporting endpoint
5. Remove meta tag from BaseHead.astro
6. Deploy to production

### 2.4 Success Metrics
- Security headers score: A+ on securityheaders.com
- Zero CSP violations in production
- No functionality breakage
- CSP report-only mode for 1 week before enforcement

### 2.5 Testing Requirements
- Test all interactive features (forms, embeds, analytics)
- Verify YouTube embeds still work
- Confirm Transistor podcast embeds function
- Test Google Analytics and TinyAnalytics tracking
- Validate CSP reports are being received

## 3. SVG Component Support

### 3.1 Overview
Implement Astro's native SVG component support to replace current icon system with more performant, type-safe SVG components.

### 3.2 Business Value
- **Performance**: Eliminate runtime SVG loading, reduce JavaScript bundle
- **Developer Experience**: Type-safe SVG props, better IDE support
- **Flexibility**: Dynamic styling and animation capabilities
- **Maintenance**: Easier to update and manage icons

### 3.3 Technical Requirements

#### 3.3.1 Configuration
```javascript
// astro.config.mjs
export default defineConfig({
  experimental: {
    svg: true
  }
});
```

#### 3.3.2 Current Implementation
- Using `astro-icon` package for icons
- Country flag SVGs in `public/flags/`
- Custom SVG logos in components

#### 3.3.3 Migration Plan

**Phase 1: Enable SVG Components**
```astro
---
// Before
import { Icon } from 'astro-icon/components';
---
<Icon name="mdi:github" />

// After
import GitHubIcon from '@icons/github.svg';
---
<GitHubIcon class="w-6 h-6" />
```

**Phase 2: Create Icon Library Structure**
```
src/
  icons/
    social/
      github.svg
      linkedin.svg
      twitter.svg
    ui/
      menu.svg
      close.svg
      arrow-right.svg
    flags/
      [country-code].svg
```

**Phase 3: Type Definitions**
```typescript
// src/types/svg.d.ts
declare module '*.svg' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
  const component: AstroComponentFactory;
  export default component;
}
```

#### 3.3.4 Components to Update
- `src/components/Nav.astro` - Navigation icons
- `src/components/SocialList.astro` - Social media icons
- `src/components/PresCard.astro` - Country flags
- `src/components/Footer.astro` - Footer icons

### 3.4 Success Metrics
- 20% reduction in JavaScript bundle size
- Zero runtime SVG loading
- All icons properly typed
- Improved build performance

### 3.5 Testing Requirements
- Visual regression testing for all icons
- Verify SVG animations still work
- Test icon color inheritance
- Validate accessibility attributes
- Cross-browser SVG rendering

## 4. Implementation Timeline

### Phase 1: Responsive Images (Week 1-2)
- Day 1-2: Configure and test responsive image generation
- Day 3-5: Update high-impact components (Hero, Blog posts)
- Day 6-8: Update remaining components
- Day 9-10: Performance testing and optimization

### Phase 2: CSP Headers (Week 3)
- Day 1: Set up CSP in report-only mode
- Day 2-3: Monitor and fix violations
- Day 4: Migrate to enforcement mode
- Day 5: Remove meta tags and final testing

### Phase 3: SVG Components (Week 4)
- Day 1-2: Enable SVG support and create icon library
- Day 3-4: Migrate existing icons
- Day 5: Update all components and remove astro-icon

## 5. Risk Analysis

### 5.1 Responsive Images
- **Risk**: Increased build times
- **Mitigation**: Implement caching, optimize only critical images
- **Risk**: Storage increase
- **Mitigation**: Use efficient formats (WebP, AVIF)

### 5.2 CSP Headers
- **Risk**: Breaking third-party integrations
- **Mitigation**: Comprehensive testing, report-only mode first
- **Risk**: Overly restrictive policy
- **Mitigation**: Start permissive, tighten gradually

### 5.3 SVG Components
- **Risk**: Breaking existing icon references
- **Mitigation**: Phased migration, maintain backward compatibility
- **Risk**: Loss of icon flexibility
- **Mitigation**: Implement proper prop passing system

## 6. Success Criteria

1. **Performance**
   - Lighthouse score improvement: +10 points
   - Image bandwidth reduction: 50% on mobile
   - JS bundle size reduction: 20%

2. **Security**
   - A+ rating on securityheaders.com
   - Zero CSP violations after 30 days

3. **Developer Experience**
   - Build time increase < 25%
   - All features documented
   - Zero runtime errors

## 7. Future Considerations

- Implement AVIF format support when browser adoption reaches 90%
- Add image lazy loading with native loading="lazy"
- Implement CSP nonce generation for inline scripts
- Create icon sprite system for frequently used SVGs

## 8. Approval

**Product Owner**: ___________________ Date: ___________

**Technical Lead**: ___________________ Date: ___________

**Security Review**: ___________________ Date: ___________
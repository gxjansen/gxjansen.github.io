# Development Workflow & Deployment

## Local Development

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Scripts
- `npm run dev`: Start Astro development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run production`: Build for production with specific mode
- `npm run check-dark-mode`: Validate dark mode implementation
- `npm run fix-dark-mode`: Fix dark mode issues
- `npm run fix-dark-mode:dry`: Dry run of dark mode fixes

## Build Process

### Build Configuration
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Build Steps
1. Content Processing
   - MDX compilation
   - Image optimization
   - Asset processing

2. Static Generation
   - Page generation
   - Dynamic routes
   - Sitemap creation

3. Asset Optimization
   - Image compression
   - CSS/JS minification
   - SVG optimization

4. Deployment Preparation
   - robots.txt generation
   - Redirect configuration
   - Function bundling

## Netlify Deployment

### Configuration
- Framework: Astro
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

### Environment Modes
1. **Development**
   - Local content management
   - Hot module replacement
   - Development-specific robots.txt

2. **Preview**
   - Staging environment
   - Draft content visible
   - Preview-specific robots.txt

3. **Production**
   - Live environment
   - Published content only
   - Production robots.txt
   - Sitemap generation

## URL Management

### External Redirects
```toml
[[redirects]]
  from = "/kit"
  to = "https://kit.co/gxjansen"
  status = 301
  force = true

[[redirects]]
  from = "/call"
  to = "https://app.reclaim.ai/m/gxjansen/flexible-quick-meeting"
  status = 301
  force = true

[[redirects]]
  from = "/youtube"
  to = "https://www.youtube.com/c/GuidoJansen"
  status = 301
  force = true
```

### Internal Redirects
```toml
[[redirects]]
  from = "/admin"
  to = "/keystatic"
  status = 301

[[redirects]]
  from = "/post/*"
  to = "/post/:splat"
  status = 301
```

### Function Handling
```toml
[[redirects]]
  from = "/*"
  to = "/.netlify/functions/entry"
  status = 200
```

## Performance Optimization

### Image Optimization
- Sharp for image processing
- Responsive image generation
- WebP format conversion
- Lazy loading implementation

### Asset Management
- Automatic compression
- CSS/JS bundling
- SVG optimization
- Font optimization

### Caching Strategy
- Static asset caching
- API response caching
- CDN optimization

## Testing & Validation

### Pre-deployment Checks
1. Build validation
2. Link checking
3. Image optimization
4. Dark mode validation
5. Responsive testing

### Post-deployment Validation
1. URL redirect verification
2. Function testing
3. Performance monitoring
4. SEO validation

## Maintenance Tasks

### Regular Maintenance
1. **Dependency Updates**
   - Regular npm updates
   - Security patches
   - Compatibility checks

2. **Content Audits**
   - Broken link checks
   - Image optimization
   - Content validation

3. **Performance Monitoring**
   - Load time analysis
   - Resource usage
   - Error tracking

### Emergency Procedures
1. **Build Failures**
   - Check build logs
   - Verify dependencies
   - Test locally

2. **Function Issues**
   - Check function logs
   - Verify environment variables
   - Test endpoints

3. **Content Problems**
   - Revert to last working version
   - Check content schema
   - Verify file permissions

## Best Practices

### Development
1. **Code Quality**
   - Follow TypeScript standards
   - Use ESLint/Prettier
   - Document complex logic

2. **Component Development**
   - Follow atomic design
   - Maintain prop types
   - Document usage

3. **Performance**
   - Optimize images
   - Minimize dependencies
   - Use code splitting

### Deployment
1. **Version Control**
   - Clear commit messages
   - Feature branches
   - Version tagging

2. **Environment Management**
   - Separate dev/prod configs
   - Secure environment variables
   - Regular backups

3. **Monitoring**
   - Error tracking
   - Performance metrics
   - User analytics

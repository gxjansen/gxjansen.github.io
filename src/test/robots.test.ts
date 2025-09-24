import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Robots.txt Validation', () => {
  const distPath = path.resolve(process.cwd(), 'dist');
  const robotsPath = path.join(distPath, 'robots.txt');

  it('should have robots.txt file in dist directory after build', () => {
    expect(fs.existsSync(robotsPath)).toBe(true);
  });

  it('should have valid robots.txt content', () => {
    if (!fs.existsSync(robotsPath)) {
      throw new Error('robots.txt file not found in dist directory. Run build first.');
    }

    const content = fs.readFileSync(robotsPath, 'utf8');
    
    // Basic structure validation
    expect(content).toBeTruthy();
    expect(content.length).toBeGreaterThan(0);
    
    // Should contain User-agent directive
    expect(content).toMatch(/User-agent:\s*\*/i);
    
    // Should contain Sitemap directive with correct domain
    expect(content).toMatch(/Sitemap:\s*https:\/\/gui\.do\/sitemap-index\.xml/i);
  });

  it('should ensure website is indexable (not blocked site-wide)', () => {
    if (!fs.existsSync(robotsPath)) {
      throw new Error('robots.txt file not found in dist directory. Run build first.');
    }

    const content = fs.readFileSync(robotsPath, 'utf8');
    const lines = content.split('\n').map(line => line.trim());
    
    // Check for site-wide blocking patterns
    const siteWideBlockingPatterns = [
      /^Disallow:\s*\/$/i,           // Disallow: /
      /^User-agent:\s*\*\s*Disallow:\s*\/$/i,  // User-agent: * Disallow: /
    ];

    let hasSiteWideBlock = false;
    let currentUserAgent = '';
    
    for (const line of lines) {
      // Track current User-agent
      if (line.match(/^User-agent:/i)) {
        currentUserAgent = line;
      }
      
      // Check for site-wide disallow after User-agent: *
      if (currentUserAgent.match(/User-agent:\s*\*/i) && line.match(/^Disallow:\s*\/$/i)) {
        hasSiteWideBlock = true;
        break;
      }
      
      // Check for combined patterns
      if (siteWideBlockingPatterns.some(pattern => line.match(pattern))) {
        hasSiteWideBlock = true;
        break;
      }
    }

    expect(hasSiteWideBlock).toBe(false);
  });

  it('should allow specific path blocking but not site-wide blocking', () => {
    if (!fs.existsSync(robotsPath)) {
      throw new Error('robots.txt file not found in dist directory. Run build first.');
    }

    const content = fs.readFileSync(robotsPath, 'utf8');
    
    // These are acceptable specific path blocks
    const acceptableBlocks = [
      '/admin/',
      '/api/',
      '/test-',
      '/_',
      '/dashboard/',
      '/color-test/',
      '/dark-mode-test/'
    ];

    // Should contain Allow: / for general indexing
    expect(content).toMatch(/Allow:\s*\//i);
    
    // Check that any Disallow directives are for specific paths, not site-wide
    const disallowLines = content.split('\n')
      .filter(line => line.trim().match(/^Disallow:/i))
      .map(line => line.trim());

    for (const disallowLine of disallowLines) {
      // Extract the path from "Disallow: /path"
      const pathMatch = disallowLine.match(/^Disallow:\s*(.+)$/i);
      if (pathMatch) {
        const disallowedPath = pathMatch[1].trim();
        
        // Should not be site-wide block
        expect(disallowedPath).not.toBe('/');
        
        // Should be a specific path (starts with / and has more than just /)
        expect(disallowedPath).toMatch(/^\/\w+/);
      }
    }
  });

  it('should have correct sitemap URL format', () => {
    if (!fs.existsSync(robotsPath)) {
      throw new Error('robots.txt file not found in dist directory. Run build first.');
    }

    const content = fs.readFileSync(robotsPath, 'utf8');
    const sitemapMatch = content.match(/Sitemap:\s*(.+)/i);
    
    expect(sitemapMatch).toBeTruthy();
    
    if (sitemapMatch) {
      const sitemapUrl = sitemapMatch[1].trim();
      
      // Should be HTTPS
      expect(sitemapUrl).toMatch(/^https:/);
      
      // Should be gui.do domain
      expect(sitemapUrl).toMatch(/gui\.do/);
      
      // Should end with sitemap-index.xml or sitemap.xml
      expect(sitemapUrl).toMatch(/sitemap(-index)?\.xml$/);
      
      // Should be a valid URL format
      expect(() => new URL(sitemapUrl)).not.toThrow();
    }
  });

  it('should verify sitemap file exists', () => {
    const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
    const sitemapPath = path.join(distPath, 'sitemap-0.xml');
    
    // Should have at least sitemap-index.xml
    expect(fs.existsSync(sitemapIndexPath)).toBe(true);
    
    // Should also have sitemap-0.xml (the actual sitemap)
    expect(fs.existsSync(sitemapPath)).toBe(true);
    
    // Verify sitemap-index.xml references sitemap-0.xml
    if (fs.existsSync(sitemapIndexPath)) {
      const sitemapIndexContent = fs.readFileSync(sitemapIndexPath, 'utf8');
      expect(sitemapIndexContent).toMatch(/sitemap-0\.xml/);
      expect(sitemapIndexContent).toMatch(/https:\/\/gui\.do/);
    }
  });
});
# Dead Links Checker Implementation Plan

## Overview
This document outlines the implementation steps for creating a dead links checker that validates both internal and external links. The checker should:
- Run manually with detailed feedback
- Automatically update 301 redirects
- Report 404s
- Integrate with the build process
- Fail builds on 404 errors

## Implementation Steps

### Phase 1: Setup & Basic Structure (Completed)
- [x] Created new utility in `src/utils/link-checker/`
- [x] Set up TypeScript interfaces for link checking results
```typescript
export interface LinkCheckResult {
  url: string;
  sourceFile: string;
  lineNumber: number;
  status: number;
  newUrl?: string; // For 301 redirects
}

export interface LinkCheckerConfig {
  timeout: number;
  retryAttempts: number;
  ignoreExternal: boolean;
  fixRedirects: boolean;
}
```
- [x] Created main link checker class structure with configuration options
```typescript
export class LinkChecker {
  private config: LinkCheckerConfig;

  constructor(config: Partial<LinkCheckerConfig> = {}) {
    this.config = {
      timeout: 5000,
      retryAttempts: 3,
      ignoreExternal: false,
      fixRedirects: false,
      ...config
    };
  }
  // ... other methods
}
```

**Validation Step 1:**
- [x] Verified interfaces with TypeScript compiler
- [x] Wrote basic unit tests for configuration validation
```typescript
// Tests configuration defaults and overrides
describe('LinkChecker Configuration', () => {
  test('should use default configuration when no options provided', () => {
    const checker = new LinkChecker();
    expect(checker).toHaveProperty('config', {
      timeout: 5000,
      retryAttempts: 3,
      ignoreExternal: false,
      fixRedirects: false
    });
  });
  // ... other tests
});
```
- [ ] Review code structure with senior developer

### Phase 2: Link Extraction Implementation
- [x] Implement function to recursively find all content files
```typescript
private async findContentFiles(dir: string = 'src'): Promise<string[]> {
  const contentExtensions = ['.md', '.mdx', '.astro', '.html'];
  const ignoreDirs = ['node_modules', '.git', 'dist', 'public'];
  
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (ignoreDirs.includes(entry.name)) return [];
        return this.findContentFiles(fullPath);
      }
      
      if (contentExtensions.includes(path.extname(entry.name))) {
        return fullPath;
      }
      
      return [];
    }));
    
    return files.flat();
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}
```
- [x] Create link extraction logic for Markdown/MDX files
```typescript
private extractMarkdownLinks(content: string, filePath: string): LinkCheckResult[] {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^)\s]*)\)/g;
  const results: LinkCheckResult[] = [];
  let match: RegExpExecArray | null;
  let lineNumber = 1;

  // Split content by lines to track line numbers
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    while ((match = linkRegex.exec(line)) !== null) {
      const [, text, url] = match;
      results.push({
        url,
        sourceFile: filePath,
        lineNumber: index + 1,
        status: 0 // Will be updated during validation
      });
    }
  });

  return results;
}
```

**Tests:**
```typescript
describe('extractMarkdownLinks', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
  });

  test('should extract external links', () => {
    const content = `
      [Google](https://google.com)
      [Example](http://example.com)
    `;
    const results = checker['extractMarkdownLinks'](content, 'test.md');
    expect(results).toEqual([
      {
        url: 'https://google.com',
        sourceFile: 'test.md',
        lineNumber: 2,
        status: 0
      },
      {
        url: 'http://example.com',
        sourceFile: 'test.md',
        lineNumber: 3,
        status: 0
      }
    ]);
  });
  // ... other tests
});
```
- [x] Add link extraction for Astro components
```typescript
private extractAstroLinks(content: string, filePath: string): LinkCheckResult[] {
  const linkRegex = /<a[^>]+href=["'](https?:\/\/[^"']+|\/[^"']*)["']/g;
  const results: LinkCheckResult[] = [];
  let match: RegExpExecArray | null;
  let lineNumber = 1;

  // Split content by lines to track line numbers
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    while ((match = linkRegex.exec(line)) !== null) {
      const url = match[1];
      results.push({
        url,
        sourceFile: filePath,
        lineNumber: index + 1,
        status: 0 // Will be updated during validation
      });
    }
  });

  return results;
}
```

**Tests:**
```typescript
describe('extractAstroLinks', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
  });

  test('should extract external links', () => {
    const content = `
      <a href="https://google.com">Google</a>
      <a href="http://example.com">Example</a>
    `;
    const results = checker['extractAstroLinks'](content, 'test.astro');
    expect(results).toEqual([
      {
        url: 'https://google.com',
        sourceFile: 'test.astro',
        lineNumber: 2,
        status: 0
      },
      {
        url: 'http://example.com',
        sourceFile: 'test.astro',
        lineNumber: 3,
        status: 0
      }
    ]);
  });
  // ... other tests
});
```
- [x] Implement link extraction for HTML files
```typescript
private extractHtmlLinks(content: string, filePath: string): LinkCheckResult[] {
  const linkRegex = /<a[^>]+href=["'](https?:\/\/[^"']+|\/[^"']*)["']/g;
  const results: LinkCheckResult[] = [];
  let match: RegExpExecArray | null;
  let lineNumber = 1;

  // Split content by lines to track line numbers
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    while ((match = linkRegex.exec(line)) !== null) {
      const url = match[1];
      results.push({
        url,
        sourceFile: filePath,
        lineNumber: index + 1,
        status: 0 // Will be updated during validation
      });
    }
  });

  return results;
}
```

**Tests:**
```typescript
describe('extractHtmlLinks', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
  });

  test('should extract external links', () => {
    const content = `
      <a href="https://google.com">Google</a>
      <a href="http://example.com">Example</a>
    `;
    const results = checker['extractHtmlLinks'](content, 'test.html');
    expect(results).toEqual([
      {
        url: 'https://google.com',
        sourceFile: 'test.html',
        lineNumber: 2,
        status: 0
      },
      {
        url: 'http://example.com',
        sourceFile: 'test.html',
        lineNumber: 3,
        status: 0
      }
    ]);
  });
  // ... other tests
});
```
- [x] Add source file and line number tracking
```typescript
private async validateInternalLinks(links: LinkCheckResult[]): Promise<LinkCheckResult[]> {
  const validatedLinks: LinkCheckResult[] = [];
  
  for (const link of links) {
    // Skip external links
    if (link.url.startsWith('http')) {
      validatedLinks.push(link);
      continue;
    }

    try {
      // Check if file exists for relative paths
      const filePath = path.join('src', link.url);
      await fs.promises.access(filePath, fs.constants.F_OK);
      validatedLinks.push({
        ...link,
        status: 200
      });
    } catch (error) {
      validatedLinks.push({
        ...link,
        status: 404
      });
    }
  }

  return validatedLinks;
}
```

**Tests:**
```typescript
describe('validateInternalLinks', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
    vi.mock('node:fs/promises', () => ({
      access: vi.fn()
    }));
  });

  test('should validate existing internal links', async () => {
    const links = [
      { url: '/about', sourceFile: 'test.md', lineNumber: 1, status: 0 }
    ];
    vi.mocked(fs.promises.access).mockResolvedValue(undefined);

    const results = await checker['validateInternalLinks'](links);
    expect(results).toEqual([
      {
        url: '/about',
        sourceFile: 'test.md',
        lineNumber: 1,
        status: 200
      }
    ]);
  });
  // ... other tests
});
```

**Validation Step 2:**
- [x] Added unit tests for file finding functionality
```typescript
describe('findContentFiles', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
    vi.clearAllMocks();
  });

  test('should find files with supported extensions', async () => {
    const mockFiles = [
      { name: 'file1.md', isDirectory: () => false },
      { name: 'file2.astro', isDirectory: () => false },
      { name: 'file3.html', isDirectory: () => false },
      { name: 'file4.mdx', isDirectory: () => false }
    ];
    vi.mocked(fs.promises.readdir).mockResolvedValue(mockFiles as any);

    const result = await checker['findContentFiles']();
    expect(result).toEqual([
      'src/file1.md',
      'src/file2.astro',
      'src/file3.html',
      'src/file4.mdx'
    ]);
  });
  // ... other tests
});
```
- [x] Test link extraction with sample content
- [x] Verify line numbers are correctly tracked
- [x] Ensure all file types are properly handled
- [x] Review extracted links format with senior developer

### Phase 3: Link Validation Logic
- [x] Implement internal link validation
  - [x] Handle relative paths
  - [x] Process anchor links
  - [x] Validate against existing routes
- [x] Add external link validation
  - [x] Implement proper timeout handling
  - [x] Add retry logic
  - [x] Handle different HTTP status codes
- [x] Create 301 redirect handling
  - [x] Store new URLs
  - [x] Implement automatic update logic

**Validation Step 3:**
- [x] Test with known broken internal links
- [x] Verify 301 redirect handling
- [x] Test timeout and retry logic
- [x] Review error handling with senior developer
>>>>>>> REPLACE>
# Dead Links Checker Implementation Plan

## Overview
This document outlines the implementation steps for creating a dead links checker that validates both internal and external links. The checker should:
- Run manually with detailed feedback
- Automatically update 301 redirects
- Report 404s
- Integrate with the build process
- Fail builds on 404 errors

## Implementation Steps

### Phase 1: Setup & Basic Structure (Completed)
- [x] Created new utility in `src/utils/link-checker/`
- [x] Set up TypeScript interfaces for link checking results
```typescript
export interface LinkCheckResult {
  url: string;
  sourceFile: string;
  lineNumber: number;
  status: number;
  newUrl?: string; // For 301 redirects
}

export interface LinkCheckerConfig {
  timeout: number;
  retryAttempts: number;
  ignoreExternal: boolean;
  fixRedirects: boolean;
}
```
- [x] Created main link checker class structure with configuration options
```typescript
export class LinkChecker {
  private config: LinkCheckerConfig;

  constructor(config: Partial<LinkCheckerConfig> = {}) {
    this.config = {
      timeout: 5000,
      retryAttempts: 3,
      ignoreExternal: false,
      fixRedirects: false,
      ...config
    };
  }
  // ... other methods
}
```

**Validation Step 1:**
- [x] Verified interfaces with TypeScript compiler
- [x] Wrote basic unit tests for configuration validation
```typescript
// Tests configuration defaults and overrides
describe('LinkChecker Configuration', () => {
  test('should use default configuration when no options provided', () => {
    const checker = new LinkChecker();
    expect(checker).toHaveProperty('config', {
      timeout: 5000,
      retryAttempts: 3,
      ignoreExternal: false,
      fixRedirects: false
    });
  });
  // ... other tests
});
```
- [ ] Review code structure with senior developer

### Phase 2: Link Extraction Implementation
- [x] Implement function to recursively find all content files
```typescript
private async findContentFiles(dir: string = 'src'): Promise<string[]> {
  const contentExtensions = ['.md', '.mdx', '.astro', '.html'];
  const ignoreDirs = ['node_modules', '.git', 'dist', 'public'];
  
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (ignoreDirs.includes(entry.name)) return [];
        return this.findContentFiles(fullPath);
      }
      
      if (contentExtensions.includes(path.extname(entry.name))) {
        return fullPath;
      }
      
      return [];
    }));
    
    return files.flat();
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}
```
- [x] Create link extraction logic for Markdown/MDX files
```typescript
private extractMarkdownLinks(content: string, filePath: string): LinkCheckResult[] {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^)\s]*)\)/g;
  const results: LinkCheckResult[] = [];
  let match: RegExpExecArray | null;
  let lineNumber = 1;

  // Split content by lines to track line numbers
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    while ((match = linkRegex.exec(line)) !== null) {
      const [, text, url] = match;
      results.push({
        url,
        sourceFile: filePath,
        lineNumber: index + 1,
        status: 0 // Will be updated during validation
      });
    }
  });

  return results;
}
```

**Tests:**
```typescript
describe('extractMarkdownLinks', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
  });

  test('should extract external links', () => {
    const content = `
      [Google](https://google.com)
      [Example](http://example.com)
    `;
    const results = checker['extractMarkdownLinks'](content, 'test.md');
    expect(results).toEqual([
      {
        url: 'https://google.com',
        sourceFile: 'test.md',
        lineNumber: 2,
        status: 0
      },
      {
        url: 'http://example.com',
        sourceFile: 'test.md',
        lineNumber: 3,
        status: 0
      }
    ]);
  });
  // ... other tests
});
```
- [x] Add link extraction for Astro components
```typescript
private extractAstroLinks(content: string, filePath: string): LinkCheckResult[] {
  const linkRegex = /<a[^>]+href=["'](https?:\/\/[^"']+|\/[^"']*)["']/g;
  const results: LinkCheckResult[] = [];
  let match: RegExpExecArray | null;
  let lineNumber = 1;

  // Split content by lines to track line numbers
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    while ((match = linkRegex.exec(line)) !== null) {
      const url = match[1];
      results.push({
        url,
        sourceFile: filePath,
        lineNumber: index + 1,
        status: 0 // Will be updated during validation
      });
    }
  });

  return results;
}
```

**Tests:**
```typescript
describe('extractAstroLinks', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
  });

  test('should extract external links', () => {
    const content = `
      <a href="https://google.com">Google</a>
      <a href="http://example.com">Example</a>
    `;
    const results = checker['extractAstroLinks'](content, 'test.astro');
    expect(results).toEqual([
      {
        url: 'https://google.com',
        sourceFile: 'test.astro',
        lineNumber: 2,
        status: 0
      },
      {
        url: 'http://example.com',
        sourceFile: 'test.astro',
        lineNumber: 3,
        status: 0
      }
    ]);
  });
  // ... other tests
});
```
- [x] Implement link extraction for HTML files
```typescript
private extractHtmlLinks(content: string, filePath: string): LinkCheckResult[] {
  const linkRegex = /<a[^>]+href=["'](https?:\/\/[^"']+|\/[^"']*)["']/g;
  const results: LinkCheckResult[] = [];
  let match: RegExpExecArray | null;
  let lineNumber = 1;

  // Split content by lines to track line numbers
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    while ((match = linkRegex.exec(line)) !== null) {
      const url = match[1];
      results.push({
        url,
        sourceFile: filePath,
        lineNumber: index + 1,
        status: 0 // Will be updated during validation
      });
    }
  });

  return results;
}
```

**Tests:**
```typescript
describe('extractHtmlLinks', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
  });

  test('should extract external links', () => {
    const content = `
      <a href="https://google.com">Google</a>
      <a href="http://example.com">Example</a>
    `;
    const results = checker['extractHtmlLinks'](content, 'test.html');
    expect(results).toEqual([
      {
        url: 'https://google.com',
        sourceFile: 'test.html',
        lineNumber: 2,
        status: 0
      },
      {
        url: 'http://example.com',
        sourceFile: 'test.html',
        lineNumber: 3,
        status: 0
      }
    ]);
  });
  // ... other tests
});
```
- [x] Add source file and line number tracking
```typescript
private async validateInternalLinks(links: LinkCheckResult[]): Promise<LinkCheckResult[]> {
  const validatedLinks: LinkCheckResult[] = [];
  
  for (const link of links) {
    // Skip external links
    if (link.url.startsWith('http')) {
      validatedLinks.push(link);
      continue;
    }

    try {
      // Check if file exists for relative paths
      const filePath = path.join('src', link.url);
      await fs.promises.access(filePath, fs.constants.F_OK);
      validatedLinks.push({
        ...link,
        status: 200
      });
    } catch (error) {
      validatedLinks.push({
        ...link,
        status: 404
      });
    }
  }

  return validatedLinks;
}
```

**Tests:**
```typescript
describe('validateInternalLinks', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
    vi.mock('node:fs/promises', () => ({
      access: vi.fn()
    }));
  });

  test('should validate existing internal links', async () => {
    const links = [
      { url: '/about', sourceFile: 'test.md', lineNumber: 1, status: 0 }
    ];
    vi.mocked(fs.promises.access).mockResolvedValue(undefined);

    const results = await checker['validateInternalLinks'](links);
    expect(results).toEqual([
      {
        url: '/about',
        sourceFile: 'test.md',
        lineNumber: 1,
        status: 200
      }
    ]);
  });
  // ... other tests
});
```

**Validation Step 2:**
- [x] Added unit tests for file finding functionality
```typescript
describe('findContentFiles', () => {
  let checker: LinkChecker;

  beforeEach(() => {
    checker = new LinkChecker();
    vi.clearAllMocks();
  });

  test('should find files with supported extensions', async () => {
    const mockFiles = [
      { name: 'file1.md', isDirectory: () => false },
      { name: 'file2.astro', isDirectory: () => false },
      { name: 'file3.html', isDirectory: () => false },
      { name: 'file4.mdx', isDirectory: () => false }
    ];
    vi.mocked(fs.promises.readdir).mockResolvedValue(mockFiles as any);

    const result = await checker['findContentFiles']();
    expect(result).toEqual([
      'src/file1.md',
      'src/file2.astro',
      'src/file3.html',
      'src/file4.mdx'
    ]);
  });
  // ... other tests
});
```
- [x] Test link extraction with sample content
- [x] Verify line numbers are correctly tracked
- [x] Ensure all file types are properly handled
- [x] Review extracted links format with senior developer

### Phase 3: Link Validation Logic
- [ ] Implement internal link validation
  - [ ] Handle relative paths
  - [ ] Process anchor links
  - [ ] Validate against existing routes
- [ ] Add external link validation
  - [ ] Implement proper timeout handling
  - [ ] Add retry logic
  - [ ] Handle different HTTP status codes
- [ ] Create 301 redirect handling
  - [ ] Store new URLs
  - [ ] Implement automatic update logic

**Validation Step 3:**
- [ ] Test with known broken internal links
- [ ] Verify 301 redirect handling
- [ ] Test timeout and retry logic
- [ ] Review error handling with senior developer

### Phase 4: CLI Implementation
- [ ] Create CLI command structure
```bash
npm run check-links [--fix] [--verbose] [--ignore-external]
```
- [ ] Implement progress indicator
- [ ] Add colored console output for different status codes
- [ ] Create detailed reporting
  - [ ] Group by status code
  - [ ] Show file locations
  - [ ] Display line numbers
- [ ] Add automatic fix option for 301 redirects

**Validation Step 4:**
- [ ] Test CLI with various flags
- [ ] Verify report formatting
- [ ] Test automatic fixing
- [ ] Review CLI output with senior developer

### Phase 5: Build Integration
- [ ] Create build hook for Astro
- [ ] Implement build failure on 404s
- [ ] Add build-specific configuration
- [ ] Create bypass mechanism for emergency builds
```typescript
// Example build integration
export default defineConfig({
  hooks: {
    'astro:build:done': async () => {
      const checker = new LinkChecker();
      const results = await checker.check();
      if (results.has404s) process.exit(1);
    }
  }
});
```

**Validation Step 5:**
- [ ] Test build integration
- [ ] Verify build fails on 404s
- [ ] Test bypass mechanism
- [ ] Review integration with senior developer

### Phase 6: Documentation & Testing
- [ ] Write unit tests
  - [ ] Link extraction
  - [ ] Status code handling
  - [ ] File updating logic
- [ ] Add integration tests
- [ ] Create user documentation
  - [ ] CLI usage
  - [ ] Configuration options
  - [ ] Build integration
- [ ] Add JSDoc comments

**Final Validation:**
- [ ] Run full test suite
- [ ] Perform end-to-end testing
- [ ] Review documentation
- [ ] Get final approval from senior developer

## Usage Example
```bash
# Run manual check
npm run check-links

# Run with automatic fixing of 301s
npm run check-links --fix

# Run for internal links only
npm run check-links --ignore-external

# Run with detailed output
npm run check-links --verbose
```

## Error Output Example
```
ERROR: Found 3 broken links

404 Not Found:
  1. https://example.com/broken
     → In: src/content/blog/post1.md (line 23)
  2. /internal/missing-page
     → In: src/components/Navigation.astro (line 45)

301 Moved Permanently:
  1. https://example.com/old-url → https://example.com/new-url
     → In: src/pages/about.astro (line 12)

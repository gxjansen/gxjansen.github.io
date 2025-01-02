# Testing Guide

## Overview

This project uses Vitest for testing, with a focus on component testing using snapshots and DOM assertions. The test setup includes support for:

- Component snapshot testing
- DOM manipulation and assertions
- Mock utilities for Astro components
- TypeScript support
- JSDOM environment

## Test Structure

Tests are organized alongside the components they test:

```
src/
  components/
    ComponentName/
      ComponentName.astro
      __tests__/
        ComponentName.test.ts
        __snapshots__/
          ComponentName.test.ts.snap
```

## Test Utilities

### `astro-test-utils.ts`

Contains utilities for testing Astro components:

- `parseHTML`: Parse HTML string into a DOM-like structure
- `getElement`: Get an element from parsed HTML by selector
- `createMockImage`: Mock Astro's Image component
- `createTestPresentation`: Create test data for presentation components

### `utils.tsx`

Contains React-specific test utilities:

- Custom render function with provider support
- Helper functions for creating mock props
- Re-exports from @testing-library/react

## Writing Tests

### Component Tests

Use snapshot testing for component markup:

```typescript
import { parseHTML, createTestPresentation } from '../../../test/astro-test-utils';

describe('ComponentName', () => {
  it('matches snapshot with minimal props', () => {
    const html = // ... component HTML
    expect(parseHTML(html).toString()).toMatchSnapshot();
  });
});
```

### DOM Testing

Use DOM assertions for interactive elements:

```typescript
import { getElement } from '../../../test/astro-test-utils';

it('has correct accessibility attributes', () => {
  const html = // ... component HTML
  const element = getElement(html, '[role="button"]');
  expect(element?.getAttribute('aria-label')).toBe('Expected Label');
});
```

## Running Tests

- `npm test`: Run tests in watch mode
- `npm test -- -u`: Update snapshots
- `npm test -- --coverage`: Generate coverage report

## Best Practices

1. Use snapshot testing for stable component markup
2. Write focused unit tests for complex logic
3. Test accessibility attributes and ARIA roles
4. Test both light and dark mode variants
5. Test responsive behavior where applicable
6. Include error states and edge cases
7. Keep snapshots focused and readable

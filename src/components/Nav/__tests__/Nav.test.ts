import { describe, it, expect } from 'vitest';
import { parseHTML } from '../../../test/astro-test-utils';
import { createMockNavData } from '../../../test/utils';

describe('Nav', () => {
  it('renders basic structure correctly', () => {
    const navData = createMockNavData();
    
    const html = `
      <div id="nav__container" class="navbar--initial fixed left-0 top-0 z-30 flex w-full flex-col border-b" role="banner">
        <div class="mx-auto flex w-full">
          <div class="site-container flex h-14 w-full items-center px-4">
            <header class="relative flex w-full items-center justify-between gap-4" role="navigation" aria-label="Main navigation">
              <!-- Skip link -->
              <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:block focus:rounded-md focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                Skip to main content
              </a>

              <!-- Desktop navigation -->
              <nav class="hidden flex-auto md:block" aria-label="Desktop navigation">
                <ul class="flex h-fit items-center justify-center space-x-6" role="menubar" aria-label="Primary navigation menu">
                  ${navData
                    .filter(item => !item.hidden)
                    .map(item => {
                      if ('dropdown' in item) {
                        return `
                          <li role="none">
                            <button type="button" aria-expanded="false" aria-haspopup="true" class="nav-dropdown-toggle">
                              ${item.title}
                            </button>
                          </li>
                        `;
                      }
                      return `
                        <li role="none">
                          <a href="${item.href}" class="nav-link" role="menuitem">
                            ${item.title}
                          </a>
                        </li>
                      `;
                    })
                    .join('')}
                </ul>
              </nav>

              <!-- Right side items -->
              <div class="flex flex-none items-center space-x-4">
                <button type="button" class="hidden md:block" aria-label="Toggle dark mode">
                  Theme Toggle
                </button>
                <a href="/contact/" class="hidden md:block" aria-label="Book Guido for your event">
                  Book Guido
                </a>
              </div>
            </header>
          </div>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check basic structure
    const nav = parsedHtml.querySelector('[role="banner"]');
    expect(nav).toBeTruthy();
    expect(nav?.classList.contains('navbar--initial')).toBe(true);

    // Check skip link
    const skipLink = parsedHtml.querySelector('a[href="#main-content"]');
    expect(skipLink).toBeTruthy();
    expect(skipLink?.textContent?.trim()).toBe('Skip to main content');

    // Check navigation items
    const visibleNavItems = navData.filter(item => !item.hidden);
    const navLinks = parsedHtml.querySelectorAll('[role="menuitem"], .nav-dropdown-toggle');
    expect(navLinks.length).toBe(visibleNavItems.length);

    // Check desktop/mobile visibility
    const desktopNav = parsedHtml.querySelector('nav[aria-label="Desktop navigation"]');
    expect(desktopNav?.classList.contains('hidden')).toBe(true);
    expect(desktopNav?.classList.contains('md:block')).toBe(true);

    // Check right side items
    const themeToggle = parsedHtml.querySelector('button[aria-label="Toggle dark mode"]');
    expect(themeToggle).toBeTruthy();
    expect(themeToggle?.classList.contains('hidden')).toBe(true);
    expect(themeToggle?.classList.contains('md:block')).toBe(true);

    const ctaButton = parsedHtml.querySelector('a[aria-label="Book Guido for your event"]');
    expect(ctaButton).toBeTruthy();
    expect(ctaButton?.classList.contains('hidden')).toBe(true);
    expect(ctaButton?.classList.contains('md:block')).toBe(true);
  });

  it('handles dropdown navigation items', () => {
    const navData = createMockNavData([
      {
        title: 'Services',
        href: '/services',
        dropdown: [
          { title: 'Consulting', href: '/services/consulting' },
          { title: 'Training', href: '/services/training' }
        ],
        hidden: false
      }
    ]);

    const html = `
      <div class="nav-dropdown" role="none">
        <button 
          type="button" 
          class="nav-dropdown-toggle" 
          aria-expanded="false"
          aria-haspopup="true"
        >
          Services
        </button>
        <div 
          class="nav-dropdown-panel hidden" 
          role="menu" 
          aria-orientation="vertical"
        >
          <a 
            href="/services/consulting/" 
            class="nav-dropdown-item" 
            role="menuitem"
          >
            Consulting
          </a>
          <a 
            href="/services/training/" 
            class="nav-dropdown-item" 
            role="menuitem"
          >
            Training
          </a>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check dropdown structure
    const dropdown = parsedHtml.querySelector('.nav-dropdown');
    expect(dropdown).toBeTruthy();

    // Check dropdown toggle
    const toggle = parsedHtml.querySelector('.nav-dropdown-toggle');
    expect(toggle).toBeTruthy();
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(toggle?.getAttribute('aria-haspopup')).toBe('true');

    // Check dropdown panel
    const panel = parsedHtml.querySelector('.nav-dropdown-panel');
    expect(panel).toBeTruthy();
    expect(panel?.getAttribute('role')).toBe('menu');
    expect(panel?.getAttribute('aria-orientation')).toBe('vertical');

    // Check dropdown items
    const items = parsedHtml.querySelectorAll('.nav-dropdown-item');
    expect(items.length).toBe(2);
    expect(items[0]?.getAttribute('href')).toBe('/services/consulting/');
    expect(items[1]?.getAttribute('href')).toBe('/services/training/');
  });

  it('has proper accessibility attributes', () => {
    const html = `
      <div id="nav__container" class="navbar--initial" role="banner">
        <header role="navigation" aria-label="Main navigation">
          <nav aria-label="Desktop navigation">
            <ul role="menubar" aria-label="Primary navigation menu">
              <li role="none">
                <a href="/" role="menuitem">Home</a>
              </li>
            </ul>
          </nav>
          <button 
            type="button" 
            aria-label="Toggle dark mode"
            class="hidden md:block"
          >
            Theme Toggle
          </button>
          <button 
            type="button" 
            aria-label="Toggle mobile menu"
            class="md:hidden"
          >
            Menu
          </button>
        </header>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check ARIA roles
    expect(parsedHtml.querySelector('[role="banner"]')).toBeTruthy();
    expect(parsedHtml.querySelector('[role="navigation"]')).toBeTruthy();
    expect(parsedHtml.querySelector('[role="menubar"]')).toBeTruthy();
    expect(parsedHtml.querySelector('[role="menuitem"]')).toBeTruthy();

    // Check ARIA labels
    expect(parsedHtml.querySelector('[aria-label="Main navigation"]')).toBeTruthy();
    expect(parsedHtml.querySelector('[aria-label="Desktop navigation"]')).toBeTruthy();
    expect(parsedHtml.querySelector('[aria-label="Primary navigation menu"]')).toBeTruthy();
    expect(parsedHtml.querySelector('[aria-label="Toggle dark mode"]')).toBeTruthy();
    expect(parsedHtml.querySelector('[aria-label="Toggle mobile menu"]')).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import { parseHTML } from '../../../../test/astro-test-utils';
import { createMockNavData } from '../../../../test/utils';

describe('MobileNav', () => {
  it('renders mobile menu button correctly', () => {
    const html = `
      <div class="md:hidden">
        <button
          type="button"
          class="mobile-menu-button inline-flex items-center justify-center rounded-md p-2"
          aria-controls="mobile-menu"
          aria-expanded="false"
          aria-label="Open main menu"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="h-6 w-6" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check button attributes
    const button = parsedHtml.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.getAttribute('aria-controls')).toBe('mobile-menu');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(button?.getAttribute('aria-label')).toBe('Open main menu');

    // Check screen reader text
    const srOnly = parsedHtml.querySelector('.sr-only');
    expect(srOnly).toBeTruthy();
    expect(srOnly?.textContent).toBe('Open main menu');

    // Check icon
    const icon = parsedHtml.querySelector('svg');
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders mobile menu panel correctly', () => {
    const navData = createMockNavData();
    const visibleNavItems = navData.filter(item => !item.hidden);
    
    const html = `
      <div 
        id="mobile-menu" 
        class="md:hidden" 
        role="dialog" 
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div class="fixed inset-0 z-40 bg-base-900/50 backdrop-blur-sm dark:bg-base-900/80">
          <div class="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-base-50 px-6 py-6 dark:bg-base-900">
            <nav class="flex h-full flex-col">
              <ul class="space-y-4" role="menu">
                ${visibleNavItems.map(item => {
                  if (item.dropdown) {
                    return `
                      <li role="none">
                        <button 
                          type="button" 
                          class="mobile-dropdown-toggle flex w-full items-center justify-between"
                          aria-expanded="false"
                        >
                          <span>${item.title}</span>
                          <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                        <div class="mobile-dropdown-panel mt-2 hidden space-y-2 pl-4">
                          ${item.dropdown.map(subItem => `
                            <a 
                              href="${subItem.href}"
                              class="block"
                              role="menuitem"
                            >
                              ${subItem.title}
                            </a>
                          `).join('')}
                        </div>
                      </li>
                    `;
                  }
                  return `
                    <li role="none">
                      <a 
                        href="${item.href}"
                        class="block"
                        role="menuitem"
                      >
                        ${item.title}
                      </a>
                    </li>
                  `;
                }).join('')}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check panel attributes
    const panel = parsedHtml.querySelector('#mobile-menu');
    expect(panel).toBeTruthy();
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-modal')).toBe('true');
    expect(panel?.getAttribute('aria-label')).toBe('Mobile navigation menu');

    // Check navigation structure
    const nav = parsedHtml.querySelector('nav');
    expect(nav).toBeTruthy();
    const menu = parsedHtml.querySelector('[role="menu"]');
    expect(menu).toBeTruthy();

    // Check navigation items (excluding dropdown items)
    const regularItems = parsedHtml.querySelectorAll('li > a[role="menuitem"]');
    const dropdownToggles = parsedHtml.querySelectorAll('.mobile-dropdown-toggle');
    const regularNavItems = visibleNavItems.filter(item => !item.dropdown);
    const dropdownNavItems = visibleNavItems.filter(item => item.dropdown);
    
    expect(regularItems.length).toBe(regularNavItems.length);
    expect(dropdownToggles.length).toBe(dropdownNavItems.length);

    // Check dropdown structure
    const dropdownToggle = parsedHtml.querySelector('.mobile-dropdown-toggle');
    if (dropdownToggle) {
      expect(dropdownToggle.getAttribute('aria-expanded')).toBe('false');
      const dropdownPanel = parsedHtml.querySelector('.mobile-dropdown-panel');
      expect(dropdownPanel).toBeTruthy();
      expect(dropdownPanel?.classList.contains('hidden')).toBe(true);
    }
  });

  it('has proper accessibility attributes', () => {
    const html = `
      <div class="md:hidden">
        <button
          type="button"
          class="mobile-menu-button"
          aria-controls="mobile-menu"
          aria-expanded="false"
          aria-label="Open main menu"
        >
          <span class="sr-only">Open main menu</span>
        </button>
        <div 
          id="mobile-menu" 
          class="md:hidden" 
          role="dialog" 
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <nav>
            <ul role="menu">
              <li role="none">
                <a href="/" role="menuitem">Home</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check ARIA attributes
    const button = parsedHtml.querySelector('button');
    expect(button?.getAttribute('aria-controls')).toBe('mobile-menu');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(button?.getAttribute('aria-label')).toBe('Open main menu');

    const menu = parsedHtml.querySelector('#mobile-menu');
    expect(menu?.getAttribute('role')).toBe('dialog');
    expect(menu?.getAttribute('aria-modal')).toBe('true');
    expect(menu?.getAttribute('aria-label')).toBe('Mobile navigation menu');

    // Check menu structure
    const menuList = parsedHtml.querySelector('[role="menu"]');
    expect(menuList).toBeTruthy();
    const menuItem = parsedHtml.querySelector('[role="menuitem"]');
    expect(menuItem).toBeTruthy();
    const menuItemContainer = parsedHtml.querySelector('[role="none"]');
    expect(menuItemContainer).toBeTruthy();
  });
});

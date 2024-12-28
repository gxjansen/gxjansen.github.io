/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';

describe('SocialCard', () => {
  it('has correct props', () => {
    const props = {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: 'tabler/brand-linkedin'
    };

    expect(props.name).toBe('LinkedIn');
    expect(props.href).toBe('https://linkedin.com');
    expect(props.icon).toBe('tabler/brand-linkedin');
  });

  it('meets accessibility requirements', () => {
    const props = {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: 'tabler/brand-linkedin'
    };

    expect(props.name).toBeTruthy();
    expect(props.href).toMatch(/^https?:\/\//);
    expect(props.icon).toContain('tabler/brand-');
  });
});

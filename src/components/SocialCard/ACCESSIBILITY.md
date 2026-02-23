# SocialCard Accessibility Guidelines

## WCAG 2.1 AA Compliance

- Color contrast ratio of at least 4.5:1 for text
- Interactive elements are keyboard accessible
- Focus indicators are visible
- Touch targets are at least 44x44 pixels

## Implementation Details

1. Semantic HTML
   - Uses semantic `<a>` tags for links
   - Proper heading hierarchy with `<h3>`

2. ARIA Attributes
   - Descriptive aria-labels for links
   - Icon images marked as decorative

3. Keyboard Navigation
   - Focusable elements in logical order
   - Visible focus indicators
   - Interactive elements reachable via keyboard

4. Screen Readers
   - Meaningful link text
   - Icon descriptions hidden from screen readers
   - Platform names clearly announced

5. Visual Design
   - Sufficient color contrast
   - Visual feedback on hover/focus
   - Clear visual hierarchy

## Testing Checklist

- [ ] Test with keyboard navigation
- [ ] Verify screen reader announcements
- [ ] Check color contrast ratios
- [ ] Validate focus management
- [ ] Test with browser zoom
- [ ] Verify touch target sizes

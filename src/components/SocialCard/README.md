# SocialCard Component

A card component for displaying social media links with icons and hover effects.

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | The name of the social media platform |
| href | string | Yes | The URL to the social media profile |
| icon | string | Yes | The Tabler icon name for the platform |

## Usage Example

```astro
import SocialCard from '@components/SocialCard/SocialCard.astro';

<SocialCard
  name="LinkedIn"
  href="https://linkedin.com/in/username"
  icon="tabler/brand-linkedin"
/>
```

## Accessibility
- Uses semantic HTML elements
- Includes proper ARIA labels
- Supports keyboard navigation
- Maintains color contrast ratios
- Indicates external links

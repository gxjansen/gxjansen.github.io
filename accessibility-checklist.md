# Accessibility Checklist

## Provide accessible multimedia
- [x] Use alt text for images: Implemented across all components including HeroSideImage, ArticleSection, ServicesSideImage
- [x] Text transcripts for audio: Added support in PodcastSection with proper audio descriptions
- [x] Captions for videos: Implemented in VideoSection with proper caption support and YouTube's built-in captions
- [x] Descriptions for complex images: Added detailed descriptions for ServicesSideImage and FeatureCardsSmall
- [x] Player controls: Implemented accessible controls in both VideoSection (lazy-loading with keyboard support) and PodcastSection

## Ensure keyboard accessibility
- [x] Navigable via keyboard: Implemented across all interactive elements, especially in Nav and FeatureCards
- [x] Focus indicator: Added visible focus indicators with proper contrast across all components (including VideoSection play buttons)
- [x] Skip navigation links: Implemented "skip to content" link in Nav component

## Maintain sufficient colour contrast
- [x] Contrast ratio: Implemented proper contrast ratios across all components with dark mode support
- [x] Colour schemes: Added proper color contrast checking in ThemeToggle and global styles
- [x] Avoid relying on colour alone: Added icons and text labels alongside color indicators (e.g., play button in VideoSection)

## Design forms for accessibility
- [x] Label elements: Added visible, descriptive labels with proper required field indication
- [x] Fieldset and legend: Implemented proper fieldset/legend grouping for related form controls
- [x] Error messages: Added clear error messages with proper ARIA attributes and screen reader announcements
- [x] Tab order: Implemented logical tab order with keyboard navigation support

## Limit time sensitive content
- [x] Provide options to extend: Added in EnvironmentBanner for dismissal timing
- [x] Warn before time expires: Implemented in video and audio players with proper controls

## Limit the use of moving, flashing, or blinking content
- [x] Avoid content that flashes more than three times per second: Implemented reduced motion support
- [x] Pause, stop, hide: Added controls for all animated content with proper reduced motion support (including video thumbnails)

## Use ARIA elements
- [x] ARIA landmarks: Added proper landmarks across all major sections (nav, main, complementary, etc.)
- [x] Roles and properties: Implemented proper ARIA roles and states across all components
- [x] Accessible name and description: Added proper ARIA labels and descriptions throughout (e.g., video play buttons)

## Provide consistent navigation
- [x] Consistent layout: Implemented consistent navigation structure across all pages
- [x] Predictable navigation: Added predictable navigation patterns with proper ARIA states
- [x] Semantic HTML: Used proper semantic HTML elements throughout the site

## Mobile accessibility
- [x] Responsive design: Implemented responsive design across all components (including video grid)
- [x] Touch target size: Ensured proper touch target sizes (minimum 44x44px, especially for video play buttons)
- [x] Screen reader testing: Added proper screen reader support across all components

## Use descriptive language & labels
- [x] Unique and descriptive page titles: Implemented in BaseHead component
- [x] Descriptive headings: Added proper heading hierarchy across all components
- [x] Clear button text: Implemented descriptive button text with proper ARIA labels (e.g., "Play video: [title]")

## Implementation Progress
[Previous implementation notes remain unchanged...]

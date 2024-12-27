# Technical Overview

## Page Mapping

| Page Slug         | .astro File Path          | Components Used |
|-------------------|---------------------------|-----------------|
| /                 | src/pages/index.astro     | BaseLayout, HeroSideImage, SiteContent, FeatureCardsSmall, UpcomingEvents, FeatureFlagsMarquee, FeatureGalleryMarquee, CompanyLogos, CtaCardSplit |
| /about            | src/pages/about.astro     | BaseLayout, AboutHeader, ServicesSideImage, FeatureGalleryMarquee, CtaCardSplit |
| /contact          | src/pages/contact.astro   | BaseLayout, ContactForm, Icon |
| /overview         | src/pages/overview.astro  | BaseLayout, Badge, Button |
| /podcasts         | src/pages/podcasts.astro  | BaseLayout, ServicesIcon, PodcastFeed |
| /press            | src/pages/press.astro     | BaseLayout, Badge, ContentTypeSelector, VideoSection, PodcastSection, ArticleSection, LinkedInCTA |
| /styleguide       | src/pages/styleguide.astro| BaseLayout, Button, Badge, ThemeToggle, NavLink, NavDropdown |
| /404              | src/pages/404.astro       | BaseLayout, Button, Icon, Image |
| /categories       | src/pages/categories/index.astro | BaseLayout, CategoryCloud |
| /categories/[category] | src/pages/categories/[category].astro | BaseLayout, Badge, PostCardAtlas |
| /events           | src/pages/events/index.astro | BaseLayout, Badge, EventCard, UpcomingEvents, FeatureFlagsMarquee |
| /events/[id]      | src/pages/events/[id].astro | BaseLayout, Badge, RelatedPresentations |
| /post             | src/pages/post/index.astro | BaseLayout, Badge, PostCardAtlas, Image |
| /post/[slug]      | src/pages/post/[slug].astro | BlogLayoutCenter |
| /presentations    | src/pages/presentations/index.astro | BaseLayout, Badge, PresentationCard |
| /presentations/[slug] | src/pages/presentations/[slug].astro | BaseLayout, Badge, SlideEmbed, VideoEmbed, PresentationNav, RelatedEvents |

## Project Architecture
[Existing content remains unchanged...]

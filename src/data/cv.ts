/**
 * Curated content for the /cv page. The CV itself comes from the Sifa profile;
 * these lists pick which endorsements and focus areas to feature.
 */

// Endorsements featured as quote cards, by colleague testimonial id. Everyone
// else goes on the names wall.
export const FEATURED = [
  "boris-lokschin",
  "eric-schreiner",
  "svitlana-1",
  "michael-tuerk-1",
];

// Shorter verbatim excerpts for the featured cards (the full versions still
// run on /about). One clean sentence each reads better here.
export const FEATURED_EXCERPT: Record<string, string> = {
  "svitlana-1":
    "Guido has a rare ability to translate community insights into tangible business intelligence, and to bring the business closer to the community.",
  "michael-tuerk-1":
    "At Spryker, Guido became one of the key figures driving our community's success.",
};

// Curated focus areas (from the jobsearch CV master), AT Protocol + Agentic
// Engineering included.
export const FOCUS_AREAS = [
  "Community strategy",
  "Developer relations",
  "Cognitive psychology",
  "Business experimentation",
  "AT Protocol",
  "Agentic engineering",
  "Open-source ecosystems",
  "C-suite advisory",
];

// HTTP Link header (agent resource discovery, issue #190). Static pages get it
// through the dist/_headers file written by src/integrations/markdown-endpoints.ts;
// on-demand pages set it on their own response.

/**
 * Site-wide resources advertised on every static page. Kept in sync with the
 * historical netlify.toml `/*` Link header (the Link line was moved out of
 * netlify.toml; see src/integrations/markdown-endpoints.ts for why). Each
 * entry is one RFC 8288 link-value.
 */
export const SITE_LINK_RESOURCES = [
  '</sitemap-index.xml>; rel="sitemap"',
  '</llms.txt>; rel="alternate"; type="text/plain"',
  '<https://gui.do/about/#guido>; rel="describedby"; type="application/ld+json"',
];

/**
 * Builds the comma-joined `Link` header value for a page. When the page has a
 * markdown source endpoint, its `.md` alternate is appended. Comma-joining
 * multiple link-values in one header line is valid per RFC 7230/8288 and
 * matches what netlify.toml previously emitted.
 */
export function buildLinkValue(mdAlternate: string | null): string {
  const values = [...SITE_LINK_RESOURCES];
  if (mdAlternate) {
    values.push(`<${mdAlternate}>; rel="alternate"; type="text/markdown"`);
  }
  return values.join(", ");
}

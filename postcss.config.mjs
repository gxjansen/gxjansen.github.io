import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    purgecss({
      content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
        './public/**/*.html'
      ],
      defaultExtractor: content => {
        // Extract classes, IDs, and CSS-in-JS patterns
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
        return broadMatches.concat(innerMatches);
      },
      safelist: {
        standard: [
          // Astro and framework classes
          /^astro-/, /^is-/, /^has-/, /^data-/, /^js-/,
          // Animation classes
          /^animate-/, /^transition-/, /^duration-/,
          // Scroll-reveal classes
          'revealed', 'scroll-reveal-fallback',
          // State classes
          'active', 'disabled', 'loading', 'error', 'success',
          // Focus and hover states
          /^focus:/, /^hover:/, /^group-hover:/
        ],
        deep: [
          /dark$/, /light$/, /active$/, /open$/, /closed$/,
          // Dynamic theme classes
          /^bg-/, /^text-/, /^border-/,
          // Scroll-reveal selectors (inside @supports blocks)
          /data-reveal/
        ],
        greedy: [
          /show$/, /hide$/, /sr-only$/, /visible$/, /invisible$/,
          // Responsive classes
          /^sm:/, /^md:/, /^lg:/, /^xl:/, /^2xl:/,
          // Scroll-reveal keyframes and rules
          /reveal-fade/, /reveal-zoom/
        ]
      },
      // Keep keyframes - PurgeCSS can't detect usage inside @supports blocks
      keyframes: false,
      fontFace: true,
      // More aggressive whitespace removal
      rejected: false
    })
  ]
}

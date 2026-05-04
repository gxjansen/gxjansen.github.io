import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import purgecssModule from '@fullhuman/postcss-purgecss';
const purgecss = purgecssModule.default || purgecssModule;

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
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
          // State classes
          'active', 'disabled', 'loading', 'error', 'success',
          // Focus and hover states
          /^focus:/, /^hover:/, /^group-hover:/,
          // Prose typography class (needed to keep element-based selectors like .prose th)
          'prose',
        ],
        deep: [
          /dark$/, /light$/, /active$/, /open$/, /closed$/,
          // Dynamic theme classes
          /^bg-/, /^text-/, /^border-/,
          // Prose element selectors (table, headings, etc.)
          /^prose/,
          // Bluesky comments library uses CSS modules with hashed class names
          // that only exist at runtime -- preserve our attribute selectors
          /bluesky-comments-wrapper/,
        ],
        greedy: [
          /show$/, /hide$/, /sr-only$/, /visible$/, /invisible$/,
          // Responsive classes
          /^sm:/, /^md:/, /^lg:/, /^xl:/, /^2xl:/,
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

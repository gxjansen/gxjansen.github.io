import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    purgecss({
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        standard: [/^astro-/, /^is-/, /^has-/, /^data-/, /^js-/],
        deep: [/dark$/, /light$/, /active$/, /open$/],
        greedy: [/show$/, /hide$/, /sr-only$/]
      }
    })
  ]
}

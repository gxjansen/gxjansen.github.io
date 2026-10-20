/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
        // Match astro.config.mjs (compressHTML: true) so formatting never
        // changes rendered whitespace.
        astroCompressHTML: "html",
      },
    },
  ],
};

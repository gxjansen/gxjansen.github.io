import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

// Tailwind v4 PostCSS pipeline.
// Note: v4 ships its own vendor prefixing via lightningcss, but we keep
// autoprefixer here for safety until we've fully verified browser coverage.
export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
};

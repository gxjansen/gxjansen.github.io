/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

export default {
  // this enables you to cancel out dark mode using the class "light" for specific sections if desired
  darkMode: ["variant", "&:is(.dark *):not(.light *)"],

  content: {
    files: [
      "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    ],
    extract: {
      markdown: content => {
        // Don't process markdown files - let MDX handle it
        return [];
      }
    }
  },
  safelist: [
    // Classes that might be used dynamically
    'dark',
    'light',
    // Animation classes
    'animate-marquee',
    // Interactive states that might be added via JavaScript
    'active',
    'open',
    'show',
    'hide'
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "1000px",
      lg: "1124px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Rosé Pine color palette
        // Dark mode: Main variant | Light mode: Dawn variant
        // https://rosepinetheme.com/palette/

        // Primary accent - Pine (teal)
        primary: {
          50: "#f0f5f7",
          100: "#dceaef",
          200: "#b8d5df",
          300: "#9ccfd8",  // foam (Main)
          400: "#56949f",  // foam (Dawn)
          500: "#31748f",  // pine (Main)
          600: "#286983",  // pine (Dawn)
          700: "#1f5a73",
          800: "#1a4a5e",
          900: "#153a4a",
          950: "#0f2a35",
        },

        // Base colors - Rosé Pine Main (dark) / Dawn (light)
        base: {
          // Light mode (Dawn variant)
          50: "#fffaf3",   // surface
          100: "#faf4ed",  // base
          200: "#f2e9e1",  // overlay
          300: "#dfdad3",  // muted background
          400: "#9893a5",  // muted text
          // Dark mode (Main variant)
          500: "#908caa",  // subtle
          600: "#6e6a86",  // muted
          700: "#393552",  // highlight-high
          800: "#26233a",  // overlay
          900: "#1f1d2e",  // surface
          950: "#191724",  // base
        },

        // Rosé Pine accent colors
        accent: {
          1: "#f6c177",  // gold
          2: "#9ccfd8",  // foam
          3: "#c4a7e7",  // iris
          4: "#eb6f92",  // love
        },

        // Background colors
        background: "#faf4ed",        // Dawn base
        "background-dark": "#1A1825", // Rosé Pine base

        // Semantic colors using Rosé Pine accents
        info: "#9ccfd8",              // foam
        "info-content": "#191724",
        success: "#31748f",           // pine
        "success-content": "#e0def4",
        warning: "#f6c177",           // gold
        "warning-content": "#191724",
        error: "#eb6f92",             // love
        "error-content": "#191724",

        // Direct Rosé Pine accent access
        love: {
          light: "#b4637a",
          DEFAULT: "#eb6f92",
        },
        gold: {
          light: "#ea9d34",
          DEFAULT: "#f6c177",
        },
        rose: {
          light: "#d7827e",
          DEFAULT: "#ebbcba",
        },
        pine: {
          light: "#286983",
          DEFAULT: "#31748f",
        },
        foam: {
          light: "#56949f",
          DEFAULT: "#9ccfd8",
        },
        iris: {
          light: "#907aa9",
          DEFAULT: "#c4a7e7",
        },

        // Text colors for direct use
        "rp-text": {
          light: "#575279",   // Dawn text
          DEFAULT: "#e0def4", // Main text
        },
        "rp-subtle": {
          light: "#797593",   // Dawn subtle
          DEFAULT: "#908caa", // Main subtle
        },
        "rp-muted": {
          light: "#9893a5",   // Dawn muted
          DEFAULT: "#6e6a86", // Main muted
        },
      },
      animation: {
        marquee: "marquee 100s linear infinite",
      },
      keyframes: {
        marquee: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-100% - 2.5rem))",
          },
        },
      },
    },
    fontFamily: {
      sans: [
        "Poppins",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif"
      ],
      serif: [
        "Poppins",
        "Georgia",
        "Cambria",
        "Times New Roman",
        "Times",
        "serif"
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace"
      ]
    },
  },
  plugins: [typography, forms],
};

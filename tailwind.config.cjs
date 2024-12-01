/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  // this enables you to cancel out dark mode using the class "light" for specific sections if desired
  darkMode: ["variant", "&:is(.dark *):not(.light *)"],

  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // use any standard tailwind colors from here https://tailwindcss.com/docs/customizing-colors
        // or generate with https://uicolors.app/create
        primary: colors.teal,

        // recommend not changing the base color scheme
        base: {
          50: "rgb(241, 242, 244)",
          100: "rgb(235, 237, 239)",
          200: "rgb(206, 209, 214)",
          300: "rgb(180, 190, 199)",
          400: "rgb(127, 146, 170)",
          500: "rgb(85, 105, 135)",
          600: "rgb(58, 71, 91)",
          700: "rgb(52, 64, 82)",
          800: "rgb(44, 53, 68)",
          900: "rgb(35, 43, 55)",
          950: "rgb(28, 35, 45)",
        },

        // accents affect various SVG elements
        accent: {
          1: colors.yellow[500],
          2: colors.blue[500],
          3: colors.purple[500],
          4: colors.red[500],
        },

        // if you change the background color, also change the matching color in public/assets/pattern-light.svg and pattern-light-big.svg
        background: "rgb(247, 248, 249)",
        "background-dark": "rgb(28, 35, 45)",

        info: "#7dd3fc",
        "info-content": "#082f49",
        success: "#6ee7b7",
        "success-content": "#022c22",
        warning: "#fcd34d",
        "warning-content": "#111827",
        error: "#fca5a5",
        "error-content": "#450a0a",
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
        "JetBrains Mono",
        "BlinkMacSystemFont",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
      serif: [
        "JetBrains Mono",
        "Iowan Old Style",
        "Apple Garamond",
        "Baskerville",
        "Times New Roman",
        "serif",
      ],
      mono: [
        "JetBrains Mono",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "monospace",
      ],
      inter: [
        "Inter",
        "BlinkMacSystemFont",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Arial",
        "sans-serif",
      ],
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};

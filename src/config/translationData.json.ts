/**
 * * Configuration of the i18n system data files and text translations
 * Example translations below are for English and French, with textTranslations used in src/layouts/BlogLayoutCenter.astro and src/components/Hero/[hero].astro
 */

/**
 * * Data file configuration for the i18n system
 * Every {Data} key must exist in the below object
 */
import siteDataEn from "./en/siteData.json.ts";
import navDataEn from "./en/navData.json.ts";
import faqDataEn from "./en/faqData.json.ts";
import teamDataEn from "./en/teamData.json.ts";
import testimonialDataEn from "./en/testimonialData.json.ts";

export const dataTranslations = {
  en: {
    siteData: siteDataEn,
    navData: navDataEn,
    faqData: faqDataEn,
    teamData: teamDataEn,
    testimonialData: testimonialDataEn,
  },
} as const;

/**
 * * Text translations are used with the `useTranslation` function from src/js/i18nUtils.ts to translate various strings on your site.
 *
 * ## Example
 *
 * ```ts
 * import { getLocaleFromUrl } from "@js/localeUtils";
 * import { useTranslations } from "@js/translationUtils";
 * const currLocale = getLocaleFromUrl(Astro.url);
 * const t = useTranslations(currLocale);
 * t("back_to_all_posts"); // this would be "Retour à tous les articles" if the current locale is "fr"
 * ```
 * or
 * ```ts
 * import { useTranslations } from "@js/translationUtils";
 * const t = useTranslations("fr");
 * t("back_to_all_posts"); // this would be "Retour à tous les articles"
 * ```
 */
export const textTranslations = {
  en: {
    hero_text: "Hi, I'm Guido 👋",
    hero_description:
      "<span class='text-primary-500 font-semibold'>I build Antifragile Developer Ecosystems</span>\n\nFor 20+ years I've been transforming tech communities into strategic growth engines by combining:\n\n🧠 **Cognitive psychology** to decode user behavior\n📈 **Business Experimentation** that drives measurable growth\n🤝 **Community building** that creates mutual value\n🪴 **(AI) automation** making growth systematic and scalable\n⚡ **Open tech** choosing user freedom over vendor lock-in",
    back_to_all_posts: "Back to all posts",
    updated: "Updated",
  },
} as const;

/**
 * * Route translations are used to translate route names for the language switcher component
 * This can be useful for SEO reasons. The key does not matter, it just needs to match between languages
 *
 * ## Examples
 *
 * These routes must be everything after the base domain. So if this is "atlas.com/blog", the route would be "blog"
 * Or if this is "atlas.com/blog/my-post", the route would be "blog/my-post"
 */
export const routeTranslations = {
  en: {
    aboutKey: "about",
  },
} as const;

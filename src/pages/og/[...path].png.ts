/* =====================================================================
   Build-time OG card generator.
   ---------------------------------------------------------------------
   One prerendered PNG per card. getStaticPaths enumerates:
     - home, retainer, training, default (fallback)
     - each landing page          → /og/landing/<page>.png
     - each blog post (article)    → /og/article/<slug>.png
     - each presentation (talk)    → /og/talk/<slug>.png
   GET renders the matching Satori card → 1200×630 PNG with a long cache
   header. Card content + dynamic stats are resolved here so the cards
   themselves stay presentational.
   ===================================================================== */
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import * as React from "react";
import { renderOgCard } from "../../lib/og/render";
import { isPublished } from "../../lib/isPublished";
import {
  HomeCard,
  ArticleCard,
  LandingCard,
  TalkCard,
  RetainerCard,
  TrainingCard,
  FallbackCard,
} from "../../lib/og/cards";
import { LANDING_PAGES } from "../../lib/og/routes";
import { ACCENT_ROTATION } from "../../lib/og/tokens";
import { yearsBuilding, countryCount, talksCount } from "@data/siteStats";
import { readingTime } from "@utils/readingTime";

export const prerender = true;

const years = `${yearsBuilding}+ years`;
const countries = `${countryCount} countries`;
const talks = `${talksCount} events`;

type CardElement = React.ReactElement;

/** Build the full map of "<path>" → JSX element to render. */
async function buildCardMap(): Promise<Record<string, CardElement>> {
  const map: Record<string, CardElement> = {};

  // Single-page cards.
  map["home"] = React.createElement(HomeCard, { years, countries });
  map["retainer"] = React.createElement(RetainerCard, {});
  map["training"] = React.createElement(TrainingCard, {});
  map["default"] = React.createElement(FallbackCard, {
    h1: "Guido X Jansen",
    lead: "I build community functions for tech products.",
    section: "on gui.do",
  });

  // Landing pages.
  for (const [slug, c] of Object.entries(LANDING_PAGES)) {
    map[`landing/${slug}`] = React.createElement(LandingCard, {
      url: c.url,
      title: c.title,
      lead: c.lead,
      hand: c.hand,
      whoExtra: c.showSpeakingStats ? `${countries}, ${talks}` : undefined,
    });
  }

  // Blog posts → article card (per-article accent rotates by index).
  const posts = (
    await getCollection("post", ({ data }) => isPublished(data))
  ).sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );
  posts.forEach((post, i) => {
    const accent = ACCENT_ROTATION[i % ACCENT_ROTATION.length];
    const chips = (post.data.categories ?? []).slice(0, 2);
    map[`article/${post.id}`] = React.createElement(ArticleCard, {
      title: post.data.title,
      lead: post.data.description,
      chips,
      kicker: "field notes",
      readTime: readingTime(post.body),
      accent,
    });
  });

  // Presentations → talk card.
  const presentations = await getCollection(
    "presentations",
    ({ data }) => data.isHidden !== true,
  );
  for (const p of presentations) {
    map[`talk/${p.id}`] = React.createElement(TalkCard, {
      title: p.data.title ?? "Talk",
      duration: p.data.duration,
      isWorkshop: p.data.isWorkshop,
      countries,
      talks,
    });
  }

  return map;
}

// Resolve once at module scope so getStaticPaths and GET share it.
const cardMapPromise = buildCardMap();

export const getStaticPaths: GetStaticPaths = async () => {
  const map = await cardMapPromise;
  return Object.keys(map).map((path) => ({ params: { path } }));
};

export const GET: APIRoute = async ({ params }) => {
  const path = params.path;
  if (!path) return new Response("not found", { status: 404 });

  const map = await cardMapPromise;
  const element = map[path];
  if (!element) {
    return new Response(`no card for "${path}"`, { status: 404 });
  }

  try {
    const png = await renderOgCard(element);
    return new Response(new Uint8Array(png), {
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    return new Response(`render failed: ${(e as Error).message}`, {
      status: 500,
    });
  }
};

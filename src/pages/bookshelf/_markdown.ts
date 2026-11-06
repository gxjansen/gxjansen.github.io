// Markdown version of /bookshelf, served on demand at /bookshelf.md and
// /bookshelf/index.md (the path the markdown-negotiation edge function fetches
// for Accept: text/markdown). Same data as the page: getBookshelf().
import type { APIRoute } from "astro";
import { getBookshelf } from "../../lib/bookhive";
import { bookhiveHref, bookshelfIntro } from "@data/bookshelf";
import {
  LIVE_MD_HEADERS,
  bookshelfMarkdown,
  mdText,
} from "../../lib/liveMarkdown";

export const GET: APIRoute = async () => {
  const shelf = await getBookshelf();
  const body = [
    "# Bookshelf",
    mdText(bookshelfIntro).replace(
      "Suggest it at the bottom.",
      "Suggest it on [the page](https://gui.do/bookshelf/).",
    ),
    `_Live from [Bookhive](${bookhiveHref}) as of ${new Date().toISOString()}._`,
    bookshelfMarkdown(shelf, bookhiveHref),
  ]
    .map((section) => section.trim())
    .join("\n\n");

  return new Response(`${body}\n`, { headers: LIVE_MD_HEADERS });
};

/**
 * Bookhive reading data for the /now page (currently-reading + recently-read)
 * and the /bookshelf page (the "want to read" list).
 *
 * Ingests Guido's `buzz.bookhive.book` records from his PDS (read-only, no auth)
 * and resolves genres from the shared Bookhive catalog so the card can show
 * NON-FICTION only. Fetched at build time; wrapped so a network failure yields
 * an empty fallback rather than breaking the build.
 *
 * Source-of-truth stays on Bookhive/PDS — this is an ingested signal, not
 * content gui.do owns.
 */

const GUIDO_DID = "did:plc:45uheisi25szrjvjurfpritx";
const PDS = "https://chaga.us-west.host.bsky.network";
const CATALOG_DID = "did:plc:enu2j5xjlqsjaylv3du4myh4";
const CATALOG_PDS = "https://bluesky.nickthesick.com";

const BOOK_COLLECTION = "buzz.bookhive.book";
const STATUS_READING = "buzz.bookhive.defs#reading";
const STATUS_FINISHED = "buzz.bookhive.defs#finished";
const STATUS_WANT = "buzz.bookhive.defs#wantToRead";

// Genres that mark a title as fiction (excluded from the non-fiction card).
const FICTION_GENRES = new Set([
  "fiction",
  "science fiction",
  "fantasy",
  "novel",
  "novels",
  "science fiction fantasy",
  "fantasy fiction",
  "literary fiction",
  "young adult",
  "graphic novels",
  "comics",
  "manga",
  "romance",
  "horror",
  "mystery",
  "thriller",
  "space opera",
  "poetry",
]);

const ACCENTS = ["pine", "iris", "gold", "foam", "love", "rose"] as const;
export type BookAccent = (typeof ACCENTS)[number];

export interface Book {
  title: string;
  author: string;
  coverUrl?: string;
  accent: BookAccent;
  rating?: number; // 0–10 (finished)
  finishedLabel?: string;
  startedLabel?: string;
  /** Bookhive book page, when the hive id is known. */
  href?: string;
}

export interface ReadingData {
  /** Books marked "reading" right now (any genre). */
  active: Book[];
  /** Recently-finished non-fiction, capped to ~2 rows. */
  recent: Book[];
}

interface RawBook {
  value: {
    title?: string;
    authors?: string;
    status?: string;
    stars?: number;
    createdAt?: string;
    finishedAt?: string;
    hiveId?: string;
    cover?: { ref?: { $link?: string } };
  };
}

const accentFor = (i: number): BookAccent => ACCENTS[i % ACCENTS.length];

const monthYear = (iso?: string): string | undefined => {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// All book records, following the cursor (listRecords pages at 100). Capped at
// a few pages so a huge shelf can't run away.
async function listBooks(): Promise<RawBook[]> {
  const all: RawBook[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 6; page++) {
    const url =
      `${PDS}/xrpc/com.atproto.repo.listRecords` +
      `?repo=${GUIDO_DID}&collection=${BOOK_COLLECTION}&limit=100` +
      (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`listRecords ${res.status}`);
    const data = (await res.json()) as { records?: RawBook[]; cursor?: string };
    all.push(...(data.records ?? []));
    cursor = data.cursor;
    if (!cursor || !data.records?.length) break;
  }
  return all;
}

interface Enriched {
  raw: RawBook;
  genres: string[];
  catalogCover?: string;
}

// Pull genres + a public cover URL from the shared catalog. Empty/undefined on
// any failure (a metadata gap is treated as non-fiction so it never hides a real
// read). The catalog's Goodreads cover URL loads reliably in-browser; the PDS
// getBlob is only a last-resort fallback.
async function catalogInfo(hiveId?: string): Promise<{
  genres: string[];
  cover?: string;
}> {
  if (!hiveId) return { genres: [] };
  try {
    const url =
      `${CATALOG_PDS}/xrpc/com.atproto.repo.getRecord` +
      `?repo=${CATALOG_DID}&collection=buzz.bookhive.catalogBook&rkey=${hiveId}`;
    const res = await fetch(url);
    if (!res.ok) return { genres: [] };
    const data = (await res.json()) as {
      value?: { genres?: string[]; cover?: string };
    };
    return { genres: data.value?.genres ?? [], cover: data.value?.cover };
  } catch {
    return { genres: [] };
  }
}

const isNonFiction = (genres: string[]): boolean =>
  !genres.some((g) => FICTION_GENRES.has(g.trim().toLowerCase()));

// Fetch genres + cover for each book. No genre filter here — callers decide.
async function enrich(raw: RawBook[]): Promise<Enriched[]> {
  return Promise.all(
    raw.map(async (b) => {
      const { genres, cover } = await catalogInfo(b.value.hiveId);
      return { raw: b, genres, catalogCover: cover };
    }),
  );
}

const mapBook = (e: Enriched, i: number): Book => ({
  title: e.raw.value.title ?? "Untitled",
  author: e.raw.value.authors ?? "",
  // Only the reliable public catalog cover; without it, the card shows a
  // tonal gradient + title overlay (the PDS blob doesn't load cross-origin).
  coverUrl: e.catalogCover,
  accent: accentFor(i),
  rating: typeof e.raw.value.stars === "number" ? e.raw.value.stars : undefined,
  finishedLabel: e.raw.value.finishedAt
    ? `Finished ${monthYear(e.raw.value.finishedAt)}`
    : undefined,
  startedLabel: e.raw.value.createdAt
    ? `Started ${monthYear(e.raw.value.createdAt)}`
    : undefined,
  href: e.raw.value.hiveId
    ? `https://bookhive.buzz/books/${e.raw.value.hiveId}`
    : undefined,
});

const RECENT_CAP = 14; // ~2 rows of the cover grid
// Enrich enough of the newest finished books to reliably yield RECENT_CAP
// non-fiction (the recent shelf skews fairly fiction-heavy), while still
// bounding the catalog lookups. ~50 newest finished currently yields ~24 NF.
const FINISHED_CANDIDATES = 50;

export async function getReading(): Promise<ReadingData> {
  try {
    const books = await listBooks();

    // Currently reading — shown regardless of genre (it's THE current read).
    const reading = books.filter((b) => b.value.status === STATUS_READING);
    const active = (await enrich(reading)).map(mapBook);

    // Recently read — most-recent finished, filtered to non-fiction. Only the
    // newest handful are enriched so the catalog isn't hit hundreds of times.
    const finishedCandidates = books
      .filter((b) => b.value.status === STATUS_FINISHED)
      .sort((a, b) =>
        (b.value.finishedAt ?? "").localeCompare(a.value.finishedAt ?? ""),
      )
      .slice(0, FINISHED_CANDIDATES);
    const recent = (await enrich(finishedCandidates))
      .filter((e) => isNonFiction(e.genres))
      .slice(0, RECENT_CAP)
      .map(mapBook);

    return { active, recent };
  } catch {
    return { active: [], recent: [] };
  }
}

export interface BookshelfData {
  /** Currently reading, any genre. */
  active: Book[];
  /** "Want to read", newest first, any genre — the aspirational shelf. */
  wantToRead: Book[];
  /** Recently finished, newest first, any genre (fiction included here). */
  finished: Book[];
  /** Total finished books (before the shelf cap), for the "see all N" link. */
  finishedCount: number;
}

// Caps bound the per-render catalog lookups (covers/genres). Want-to-read is
// the point of /bookshelf, so it's the most generous; the "read" shelf shows a
// recent slice with a "See all on Bookhive" link for the rest.
const WANT_CAP = 60;
const FINISHED_SHELF_CAP = 24;

// Full bookshelf for /bookshelf: currently-reading + want-to-read + recently
// read. Genre-agnostic across the board (unlike the /now card, this is the
// whole shelf). One listBooks call, three buckets, each enriched for covers.
// The list stays owned on Bookhive/PDS — this is an ingested view of it.
export async function getBookshelf(): Promise<BookshelfData> {
  try {
    const books = await listBooks();

    const byNewest =
      (key: "createdAt" | "finishedAt") => (a: RawBook, b: RawBook) =>
        (b.value[key] ?? "").localeCompare(a.value[key] ?? "");

    const reading = books.filter((b) => b.value.status === STATUS_READING);
    const wanted = books
      .filter((b) => b.value.status === STATUS_WANT)
      .sort(byNewest("createdAt"))
      .slice(0, WANT_CAP);
    const finishedAll = books.filter((b) => b.value.status === STATUS_FINISHED);
    const read = [...finishedAll]
      .sort(byNewest("finishedAt"))
      .slice(0, FINISHED_SHELF_CAP);

    const [active, wantToRead, finished] = await Promise.all([
      enrich(reading).then((e) => e.map(mapBook)),
      enrich(wanted).then((e) => e.map(mapBook)),
      enrich(read).then((e) => e.map(mapBook)),
    ]);

    return { active, wantToRead, finished, finishedCount: finishedAll.length };
  } catch {
    return { active: [], wantToRead: [], finished: [], finishedCount: 0 };
  }
}

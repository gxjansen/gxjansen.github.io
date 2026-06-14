/**
 * Estimated reading time from raw article text — computed locally (no API),
 * the same idea standard.site / Bluesky use for long-form article cards.
 *
 * Strips code fences, inline code, URLs and markdown/HTML punctuation so the
 * word count reflects prose, then divides by an average reading speed.
 */
const WORDS_PER_MINUTE = 220;

export function readingTimeMinutes(raw: string | undefined): number {
  if (!raw) return 1;
  const text = raw
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, " ") // links / images
    .replace(/https?:\/\/\S+/g, " ") // bare URLs
    .replace(/<[^>]+>/g, " ") // html tags
    .replace(/[#>*_~`>|-]+/g, " "); // markdown punctuation
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** "7 min read" style label. */
export function readingTime(raw: string | undefined): string {
  return `${readingTimeMinutes(raw)} min read`;
}

/** Compact "7 min" for tight card meta. */
export function readingTimeShort(raw: string | undefined): string {
  return `${readingTimeMinutes(raw)} min`;
}

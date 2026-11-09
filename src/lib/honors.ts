/**
 * Honors for /awards and /about: Guido's Sifa honor records
 * (id.sifa.profile.honor), read from his PDS at build time. Sifa is the single
 * source: add or change an honor on sifa.id and the daily fingerprint run
 * (scripts/pds-fingerprints.mjs) redeploys the site.
 *
 * `kind` and `links` are optional honor fields (sifa-lexicons#134). Records
 * without `kind` fall back to the title ("nominated", "record", "champion").
 */
import { z } from "astro/zod";
import { loadCollection, type PdsRecord } from "./pds/loader";

export const HONOR_COLLECTION = "id.sifa.profile.honor";

const KIND_PREFIX = "id.sifa.defs#honor";

export const honorSchema = z.looseObject({
  title: z.string().min(1),
  issuer: z.string().optional(),
  description: z.string().optional(),
  awardedAt: z.string().optional(),
  kind: z.string().optional(),
  links: z
    .array(
      z.looseObject({
        url: z.string(),
        kind: z.string().optional(),
        label: z.string().optional(),
      }),
    )
    .optional(),
  createdAt: z.string(),
});

export type HonorRecord = z.output<typeof honorSchema>;

export type HonorKind =
  "award" | "nomination" | "championship" | "record" | "recognition";

export interface HonorLink {
  url: string;
  label: string;
}

export interface Honor {
  rkey: string;
  title: string;
  issuer?: string;
  description?: string;
  /** awardedAt as stored: "YYYY", "YYYY-MM" or "YYYY-MM-DD". */
  date?: string;
  kind?: HonorKind;
  links: HonorLink[];
  /** Swimming (KNZB and other swimming issuers) or everything else. */
  area: "swimming" | "work";
  /** Swimming age class: titles with "- youth" are youth titles. */
  youth: boolean;
}

const KINDS: HonorKind[] = [
  "award",
  "nomination",
  "championship",
  "record",
  "recognition",
];

function kindOf(r: HonorRecord): HonorKind | undefined {
  if (r.kind?.startsWith(KIND_PREFIX)) {
    const k = r.kind.slice(KIND_PREFIX.length).toLowerCase() as HonorKind;
    if (KINDS.includes(k)) return k;
  }
  if (/\bnominated\b/i.test(r.title)) return "nomination";
  if (/\brecord\b/i.test(r.title)) return "record";
  if (/\bchampion\b/i.test(r.title)) return "championship";
  return undefined;
}

const SWIMMING_ISSUER = /KNZB|zwembond|speedo/i;

const hostLabel = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export function toHonor({ rkey, value: r }: PdsRecord<HonorRecord>): Honor {
  return {
    rkey,
    title: r.title,
    issuer: r.issuer,
    description: r.description?.trim() || undefined,
    date: r.awardedAt,
    kind: kindOf(r),
    links: (r.links ?? [])
      .filter((l) => /^https?:\/\//.test(l.url))
      .map((l) => ({ url: l.url, label: l.label || hostLabel(l.url) })),
    area: SWIMMING_ISSUER.test(r.issuer ?? "") ? "swimming" : "work",
    youth: /\s-\s*youth\b/i.test(r.title),
  };
}

/** Newest first; undated honors last. */
export function sortHonors(honors: Honor[]): Honor[] {
  return [...honors].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2001-06" -> "June 2001", "1997" -> "1997", undefined -> undefined. */
export function formatHonorDate(date?: string): string | undefined {
  if (!date) return undefined;
  const [y, m] = date.split("-");
  const month = m ? MONTHS[Number(m) - 1] : undefined;
  return month ? `${month} ${y}` : y;
}

export async function loadHonors(): Promise<Honor[]> {
  const { records } = await loadCollection({
    collection: HONOR_COLLECTION,
    schema: honorSchema,
  });
  return sortHonors(records.map(toHonor));
}

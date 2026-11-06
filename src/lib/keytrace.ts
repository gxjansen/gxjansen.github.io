/**
 * Keytrace (https://keytrace.dev) identity claims for /verify: records in
 * Guido's PDS (`dev.keytrace.claim`) that link his DID to an account elsewhere,
 * each with a public proof (a gist, a post, a DNS record) and a signature from
 * Keytrace's verifier.
 *
 * Schema follows the published lexicon (lexicon authority keytrace.dev, record
 * dev.keytrace.claim). Only the fields the page renders are typed; `type` and
 * `status` are open sets in the lexicon, so they stay plain strings and an
 * unknown claim type renders with a generic label instead of failing.
 */

import { z } from "astro/zod";
import { loadCollection, type PdsRecord } from "./pds/loader";

export const KEYTRACE_COLLECTION = "dev.keytrace.claim";
export const KEYTRACE_PROFILE = "https://keytrace.dev/@gui.do";

export const keytraceClaimSchema = z.looseObject({
  type: z.string(),
  claimUri: z.string(),
  identity: z.looseObject({
    subject: z.string(),
    profileUrl: z.string().optional(),
    displayName: z.string().optional(),
  }),
  sigs: z.array(z.unknown()),
  createdAt: z.string(),
  status: z.string().optional(),
  lastVerifiedAt: z.string().optional(),
  comment: z.string().optional(),
});

export type KeytraceClaimRecord = z.output<typeof keytraceClaimSchema>;

export interface VerifiedClaim {
  rkey: string;
  type: string;
  /** Service name, e.g. "Mastodon". */
  label: string;
  /** astro-icon name. */
  icon: string;
  /** Account name on that service, e.g. "@gxjansen@mstdn.social". */
  account: string;
  profileUrl?: string;
  /** Public proof (gist, post); absent for non-URL claims like dns:. */
  proofUrl?: string;
  verifiedAt: string;
}

/** Display order on the page; unknown types go last, alphabetically. */
const KNOWN: Record<string, { label: string; icon: string }> = {
  tangled: { label: "Tangled", icon: "apps/tangled" },
  activitypub: { label: "Mastodon", icon: "simple-icons:mastodon" },
  github: { label: "GitHub", icon: "social/github" },
  linkedin: { label: "LinkedIn", icon: "social/linkedin" },
  dns: { label: "Domain", icon: "tabler:world-www" },
};
const ORDER = Object.keys(KNOWN);

const isHttpUrl = (s: string | undefined): s is string =>
  !!s && /^https?:\/\//.test(s);

/**
 * The claim URI as a public proof link: http(s) only, without LinkedIn's
 * share-tracking query, and none when it is just the profile again (Mastodon
 * proofs are the profile itself, via its rel=me field).
 */
function proofLink(v: KeytraceClaimRecord): string | undefined {
  if (!isHttpUrl(v.claimUri)) return undefined;
  const url = new URL(v.claimUri);
  const host = url.hostname;
  if (host === "linkedin.com" || host.endsWith(".linkedin.com")) {
    url.search = "";
  }
  const proof = url.toString();
  return proof === v.identity.profileUrl ? undefined : proof;
}

function accountName(v: KeytraceClaimRecord): string {
  const { subject, profileUrl } = v.identity;
  if (v.type === "activitypub" && isHttpUrl(profileUrl)) {
    return `@${subject}@${new URL(profileUrl).hostname}`;
  }
  if (v.type === "tangled" && isHttpUrl(profileUrl)) return "gui.do";
  return subject;
}

/**
 * Claims that currently hold: status "verified", or no status at all (legacy
 * records, which the lexicon says to treat as verified). Failed and retracted
 * claims are dropped.
 */
export function toVerifiedClaims(
  records: PdsRecord<KeytraceClaimRecord>[],
): VerifiedClaim[] {
  return records
    .filter((r) => (r.value.status ?? "verified") === "verified")
    .map(({ rkey, value: v }) => {
      const known = KNOWN[v.type];
      return {
        rkey,
        type: v.type,
        label: known?.label ?? v.type,
        icon: known?.icon ?? "tabler:id-badge-2",
        account: accountName(v),
        profileUrl: isHttpUrl(v.identity.profileUrl)
          ? v.identity.profileUrl
          : undefined,
        proofUrl: proofLink(v),
        verifiedAt: v.lastVerifiedAt ?? v.createdAt,
      };
    })
    .sort((a, b) => {
      const ia = ORDER.indexOf(a.type);
      const ib = ORDER.indexOf(b.type);
      if (ia !== ib) return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      return a.label.localeCompare(b.label);
    });
}

export async function loadVerifiedClaims(): Promise<VerifiedClaim[]> {
  const { records } = await loadCollection({
    collection: KEYTRACE_COLLECTION,
    schema: keytraceClaimSchema,
  });
  return toVerifiedClaims(records);
}

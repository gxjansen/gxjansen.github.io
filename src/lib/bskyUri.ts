/**
 * Normalize the three shapes a `blueskyUri` frontmatter value can take into a
 * canonical AT-URI (what `app.bsky.feed.getPosts` needs) plus the public
 * bsky.app permalink. Accepted inputs:
 *
 *   1. https://bsky.app/profile/<handle>/post/<rkey>
 *   2. https://bsky.app/profile/did:plc:.../post/<rkey>
 *   3. at://did:plc:.../app.bsky.feed.post/<rkey>
 *
 * For the handle form (1) we HARDCODE gui.do's DID rather than resolving the
 * handle over the network — every linked post on this site is gui.do's, and a
 * build-time DNS/HTTP round-trip per post is needless. Anything we can't parse
 * returns null (caller treats null as "no counts").
 */

/** gui.do's stable DID. Handle-form bsky.app URLs are assumed to be gui.do's. */
const GUIDO_DID = "did:plc:45uheisi25szrjvjurfpritx";

export interface NormalizedBskyUri {
  /** Canonical `at://did/app.bsky.feed.post/rkey` — the key getPosts echoes. */
  atUri: string;
  /** Public permalink on bsky.app (handy if we ever want to link out). */
  bskyUrl: string;
}

/** A DID we can use in an at:// URI: either an explicit `did:` or gui.do's. */
function didFor(profile: string): string {
  return profile.startsWith("did:") ? profile : GUIDO_DID;
}

export function normalizeBskyUri(raw: string): NormalizedBskyUri | null {
  const value = raw?.trim();
  if (!value) return null;

  // Form 3: already an at:// URI for a feed post.
  const atMatch = value.match(
    /^at:\/\/(did:[^/]+)\/app\.bsky\.feed\.post\/([^/?#]+)/,
  );
  if (atMatch) {
    const [, did, rkey] = atMatch;
    return {
      atUri: `at://${did}/app.bsky.feed.post/${rkey}`,
      bskyUrl: `https://bsky.app/profile/${did}/post/${rkey}`,
    };
  }

  // Forms 1 & 2: a bsky.app profile/post permalink (handle OR did).
  const webMatch = value.match(
    /^https?:\/\/bsky\.app\/profile\/([^/]+)\/post\/([^/?#]+)/,
  );
  if (webMatch) {
    const [, profile, rkey] = webMatch;
    const did = didFor(profile);
    return {
      atUri: `at://${did}/app.bsky.feed.post/${rkey}`,
      bskyUrl: `https://bsky.app/profile/${profile}/post/${rkey}`,
    };
  }

  return null;
}

import { useState, useEffect, useCallback } from "react";
import "bluesky-comments/bluesky-comments.css";
import {
  BlueskyComments as BlueskyCommentsLib,
  BlueskyFilters,
} from "bluesky-comments";

interface Props {
  uri?: string;
  postTitle: string;
  postUrl: string;
}

interface CommentEmptyDetails {
  code: string;
  message: string;
}

// Bluesky butterfly logo SVG path
const BlueskyLogo = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 568 501"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.781C285.169 375.521 284.017 372.502 284 376.101C283.983 372.502 282.831 375.521 280.369 383.781C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0533 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z" />
  </svg>
);

// Convert web URL to direct reply link
function getReplyUrl(uri: string): string {
  // If it's already a web URL, use it directly
  if (uri.startsWith("https://bsky.app/")) {
    return uri;
  }
  // Convert AT URI to web URL
  return uri
    .replace("at://", "https://bsky.app/profile/")
    .replace("/app.bsky.feed.post/", "/post/");
}

// Parse a bsky.app web URL or AT URI into { authority, rkey }
function parseBlueskyUri(
  uri: string,
): { authority: string; rkey: string } | null {
  if (uri.startsWith("https://bsky.app/profile/")) {
    const m = uri.match(/\/profile\/([^/]+)\/post\/([^/?#]+)/);
    if (!m) return null;
    return { authority: m[1], rkey: m[2] };
  }
  if (uri.startsWith("at://")) {
    const m = uri.match(/^at:\/\/([^/]+)\/app\.bsky\.feed\.post\/([^/?#]+)$/);
    if (!m) return null;
    return { authority: m[1], rkey: m[2] };
  }
  return null;
}

interface OpPost {
  text: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  createdAt?: string;
}

async function fetchOpPost(uri: string): Promise<OpPost | null> {
  const parsed = parseBlueskyUri(uri);
  if (!parsed) return null;

  let did = parsed.authority;
  // Resolve handle to DID if needed
  if (!did.startsWith("did:")) {
    const r = await fetch(
      `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(did)}`,
    );
    if (!r.ok) return null;
    const data = await r.json();
    if (!data?.did) return null;
    did = data.did;
  }

  const atUri = `at://${did}/app.bsky.feed.post/${parsed.rkey}`;
  const r = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(atUri)}&depth=0`,
  );
  if (!r.ok) return null;
  const data = await r.json();
  const post = data?.thread?.post;
  if (!post) return null;

  return {
    text: post.record?.text ?? "",
    authorName: post.author?.displayName ?? post.author?.handle ?? "",
    authorHandle: post.author?.handle ?? "",
    authorAvatar: post.author?.avatar,
    createdAt: post.record?.createdAt,
  };
}

/**
 * Bluesky Comments component for blog posts
 * - If uri is provided: Shows comments from that Bluesky post
 * - If no uri: Shows a "Discuss on Bluesky" share button
 */
export default function BlueskyComments({ uri, postTitle, postUrl }: Props) {
  const [emptyDetails, setEmptyDetails] = useState<CommentEmptyDetails | null>(
    null,
  );
  const [opPost, setOpPost] = useState<OpPost | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!uri) {
      setOpPost(null);
      return;
    }
    fetchOpPost(uri)
      .then((p) => {
        if (!cancelled) setOpPost(p);
      })
      .catch(() => {
        if (!cancelled) setOpPost(null);
      });
    return () => {
      cancelled = true;
    };
  }, [uri]);

  // Generate share URL for posts not yet linked
  const shareText = `${postTitle}\n\n${postUrl}`;
  const shareUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(shareText)}`;

  // Reset state when uri changes
  useEffect(() => {
    setEmptyDetails(null);
  }, [uri]);

  // Callback for when comments are empty (handles both no comments and errors)
  const handleEmpty = useCallback((details: CommentEmptyDetails) => {
    setEmptyDetails(details);
  }, []);

  if (!uri) {
    // No Bluesky post linked yet - show share button
    return (
      <section className="bluesky-comments-section mt-12">
        <aside
          className="border-base-300 bg-base-50 dark:border-base-700 dark:bg-base-900 rounded-xl border p-6"
          aria-label="Comments"
        >
          <h3 className="text-base-900 dark:text-base-100 mb-4 text-xl font-bold">
            Comments
          </h3>
          <div className="py-4 text-center">
            <p className="text-base-600 dark:text-base-400 mb-4">
              Want to discuss this post? Start a conversation on Bluesky.
            </p>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bsky-btn inline-flex items-center gap-2 rounded-lg bg-[#0066CC] px-4 py-2 font-medium !text-white transition-colors hover:bg-[#0052A3]"
            >
              <BlueskyLogo />
              Discuss on Bluesky
            </a>
          </div>
        </aside>
      </section>
    );
  }

  const replyUrl = getReplyUrl(uri);

  // Determine if this is an error or just no comments
  const isError =
    emptyDetails?.code === "error" || emptyDetails?.code === "network_error";

  // Show empty/error state
  if (emptyDetails) {
    return (
      <section className="bluesky-comments-section mt-12">
        <aside
          className="border-base-300 bg-base-50 dark:border-base-700 dark:bg-base-900 rounded-xl border p-6"
          aria-label="Comments"
        >
          <h3 className="text-base-900 dark:text-base-100 mb-4 text-xl font-bold">
            Comments
          </h3>
          <div className="py-4 text-center">
            <p className="text-base-600 dark:text-base-400 mb-4">
              {isError
                ? "Couldn't load comments. Join the conversation on Bluesky!"
                : "No comments yet. Be the first to join the conversation!"}
            </p>
            <a
              href={replyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bsky-btn inline-flex items-center gap-2 rounded-lg bg-[#0066CC] px-4 py-2 font-medium !text-white transition-colors hover:bg-[#0052A3]"
            >
              <BlueskyLogo />
              Reply on Bluesky
            </a>
          </div>
        </aside>
      </section>
    );
  }

  // Bluesky post is linked - show comments in styled container
  return (
    <section className="bluesky-comments-section mt-12">
      <aside
        className="border-base-300 bg-base-50 dark:border-base-700 dark:bg-base-900 rounded-xl border p-6"
        aria-label="Comments from Bluesky"
      >
        {opPost && (
          <article className="bluesky-op-post border-base-200 dark:border-base-700 mb-4 rounded-lg border p-4">
            <header className="mb-2 flex items-center gap-3">
              {opPost.authorAvatar && (
                <img
                  src={opPost.authorAvatar}
                  alt=""
                  className="h-10 w-10 rounded-full"
                  loading="lazy"
                />
              )}
              <a
                href={getReplyUrl(uri!)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-900 dark:text-base-100 font-semibold hover:underline"
              >
                {opPost.authorName}
                {opPost.authorHandle && (
                  <span className="text-base-500 dark:text-base-400 ml-2 text-sm font-normal">
                    @{opPost.authorHandle}
                  </span>
                )}
              </a>
            </header>
            <p className="text-base-800 dark:text-base-200 whitespace-pre-wrap">
              {opPost.text}
            </p>
          </article>
        )}
        <div className="bluesky-comments-wrapper">
          <BlueskyCommentsLib
            uri={uri}
            commentFilters={[BlueskyFilters.MinCharacterCountFilter(3)]}
            onEmpty={handleEmpty}
          />
        </div>
        <div className="border-base-200 dark:border-base-700 mt-6 border-t pt-4 text-center">
          <a
            href={replyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0066CC] hover:underline dark:text-[#4da6ff]"
          >
            <BlueskyLogo />
            Join the conversation on Bluesky
          </a>
        </div>
      </aside>
    </section>
  );
}

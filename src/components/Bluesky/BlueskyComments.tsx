import React, { useState, useEffect, useCallback } from 'react';
import 'bluesky-comments/bluesky-comments.css';
import { BlueskyComments as BlueskyCommentsLib, BlueskyFilters } from 'bluesky-comments';

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
    className="w-5 h-5"
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
  if (uri.startsWith('https://bsky.app/')) {
    return uri;
  }
  // Convert AT URI to web URL
  return uri
    .replace('at://', 'https://bsky.app/profile/')
    .replace('/app.bsky.feed.post/', '/post/');
}

/**
 * Bluesky Comments component for blog posts
 * - If uri is provided: Shows comments from that Bluesky post
 * - If no uri: Shows a "Discuss on Bluesky" share button
 */
export default function BlueskyComments({ uri, postTitle, postUrl }: Props) {
  const [emptyDetails, setEmptyDetails] = useState<CommentEmptyDetails | null>(null);

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
      <section className="bluesky-comments-section mt-12 pt-8 border-t border-base-200 dark:border-base-700">
        <h2 className="text-xl font-semibold text-base-900 dark:text-base-100 mb-4">
          Comments
        </h2>
        <div className="bg-base-100 dark:bg-base-800 rounded-lg p-6 text-center border border-base-200 dark:border-base-700">
          <p className="text-base-600 dark:text-base-400 mb-4">
            Want to discuss this post? Start a conversation on Bluesky.
          </p>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white font-medium rounded-lg transition-colors"
          >
            <BlueskyLogo />
            Discuss on Bluesky
          </a>
        </div>
      </section>
    );
  }

  const replyUrl = getReplyUrl(uri);

  // Determine if this is an error or just no comments
  const isError = emptyDetails?.code === 'error' || emptyDetails?.code === 'network_error';

  // Show empty/error state
  if (emptyDetails) {
    return (
      <section className="bluesky-comments-section mt-12 pt-8 border-t border-base-200 dark:border-base-700">
        <h2 className="text-xl font-semibold text-base-900 dark:text-base-100 mb-4">
          Comments
        </h2>
        <div className="bg-base-100 dark:bg-base-800 rounded-lg p-6 text-center border border-base-200 dark:border-base-700">
          <p className="text-base-600 dark:text-base-400 mb-4">
            {isError
              ? "Couldn't load comments. Join the conversation on Bluesky!"
              : "No comments yet. Be the first to join the conversation!"}
          </p>
          <a
            href={replyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white font-medium rounded-lg transition-colors"
          >
            <BlueskyLogo />
            Reply on Bluesky
          </a>
        </div>
      </section>
    );
  }

  // Bluesky post is linked - show comments
  return (
    <section className="bluesky-comments-section mt-12 pt-8 border-t border-base-200 dark:border-base-700">
      <h2 className="text-xl font-semibold text-base-900 dark:text-base-100 mb-4">
        Comments
      </h2>
      <div className="bluesky-comments-wrapper">
        <BlueskyCommentsLib
          uri={uri}
          commentFilters={[
            BlueskyFilters.NoPins,
            BlueskyFilters.MinCharacterCountFilter(3),
          ]}
          onEmpty={handleEmpty}
        />
      </div>
      <div className="mt-4 text-center">
        <a
          href={replyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#0066CC] dark:text-[#4da6ff] hover:underline text-sm"
        >
          <BlueskyLogo />
          Join the conversation on Bluesky
        </a>
      </div>
    </section>
  );
}

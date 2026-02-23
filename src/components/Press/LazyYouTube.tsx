import React, { useState } from "react";

interface Props {
  videoId: string;
  title: string;
}

export default function LazyYouTube({ videoId, title }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const loadVideo = () => {
    console.log("Loading video:", { videoId, title });
    setIsLoaded(true);
  };

  return (
    <div className="lazy-youtube relative aspect-video overflow-hidden rounded-lg bg-neutral-100 dark:bg-white/[.075]">
      {!isLoaded ? (
        <>
          <img
            src={thumbnailUrl}
            alt={`Preview thumbnail for video: ${title}`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <button
            type="button"
            className="group absolute inset-0 flex h-full w-full items-center justify-center"
            aria-label={`Play video: ${title}`}
            onClick={loadVideo}
          >
            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-red-600 transition-colors group-hover:bg-red-700">
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        </>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 h-full w-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}

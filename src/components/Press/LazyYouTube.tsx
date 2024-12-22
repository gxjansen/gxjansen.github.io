import React, { useState } from 'react';

interface Props {
  videoId: string;
  title: string;
}

export default function LazyYouTube({ videoId, title }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const loadVideo = () => {
    console.log('Loading video:', { videoId, title });
    setIsLoaded(true);
  };

  return (
    <div className="lazy-youtube aspect-video bg-neutral-100 dark:bg-white/[.075] relative rounded-lg overflow-hidden">
      {!isLoaded ? (
        <>
          <img 
            src={thumbnailUrl}
            alt={`Preview thumbnail for video: ${title}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <button
            type="button"
            className="absolute inset-0 w-full h-full flex items-center justify-center group"
            aria-label={`Play video: ${title}`}
            onClick={loadVideo}
          >
            <div className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-700 transition-colors">
              <svg 
                className="w-6 h-6 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </button>
        </>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}

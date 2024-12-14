export interface PodcastEpisode {
  title: string;
  description: string;
  pubDate: string;
  duration: string;
  link: string;
  podcastName: string;
  audioUrl?: string;  // Optional since we're not using it for embedding
  imageUrl?: string;  // Optional since the embed includes the artwork
}

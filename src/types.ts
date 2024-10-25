// src/types.ts
export interface PressCoverage {
    title: string;
    language: 'english' | 'dutch' | 'german' | 'swedish';
    publicationDate: string;
    articleUrl?: string;
    youtubeLink?: string;
    spotifyEmbedId?: string;
    personOrganization?: string;
    presentationUrl?: string;
  }
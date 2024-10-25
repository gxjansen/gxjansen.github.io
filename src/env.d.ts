/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'svg-country-flags/countries.json' {
    const content: Record<string, string>;
    export default content;
  }
  
  declare module 'svg-country-flags/svg/*.svg' {
    const content: string;
    export default content;
  }
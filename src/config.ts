// src/config.ts

export const CONFIG = {
  // Convert the string 'true' or 'false' to a boolean
  ALLOW_INDEXING: import.meta.env.PUBLIC_ALLOW_INDEXING === "true",
};

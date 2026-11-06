/**
 * Keeps `.pds-cache/` (last good PDS data, written by src/lib/pds/loader.ts)
 * in the Netlify build cache, so a build during a PDS outage can fall back to
 * it. Also turns the loader's fallback log into a deploy notice, so a deploy
 * built from cached data doesn't look like a normal green build.
 */
import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";

const DIR = ".pds-cache";
const FALLBACKS = join(DIR, "fallbacks.json");

export const onPreBuild = async ({ utils }) => {
  const restored = await utils.cache.restore(DIR);
  console.log(
    restored
      ? "pds-cache: restored last good PDS data"
      : "pds-cache: no cached PDS data yet",
  );
  // Only this build's fallbacks count.
  await rm(FALLBACKS, { force: true });
};

export const onPostBuild = async ({ utils }) => {
  let fallbacks = [];
  try {
    fallbacks = JSON.parse(await readFile(FALLBACKS, "utf8"));
  } catch {
    // no fallback this build
  }
  if (fallbacks.length > 0) {
    const lines = fallbacks.map(
      (f) => `- ${f.collection}: cached copy from ${f.fetchedAt} (${f.reason})`,
    );
    utils.status.show({
      title: "PDS unreachable: built from cached data",
      summary: `${fallbacks.length} collection(s) came from the build cache. Redeploy once the PDS is back.`,
      text: lines.join("\n"),
    });
    await rm(FALLBACKS, { force: true });
  }
  await utils.cache.save(DIR);
};

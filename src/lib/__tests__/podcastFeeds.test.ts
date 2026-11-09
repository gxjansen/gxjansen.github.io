import { describe, expect, it } from "vitest";
import { parseEpisodes } from "../podcastFeeds";

const feed = (items: string) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>CRO.CAFE</title>${items}</channel></rss>`;

describe("parseEpisodes", () => {
  it("returns title, link, audio URL, date and show name", () => {
    const episodes = parseEpisodes(
      feed(`<item>
        <title><![CDATA[From CRO to AXO]]></title>
        <link>https://www.cro.cafe/en/episodes/from-cro-to-axo/</link>
        <pubDate>Tue, 03 Nov 2026 06:00:00 GMT</pubDate>
        <enclosure url="https://podcasts.gui.do/cro-cafe/audio/448b345b.mp3" length="1" type="audio/mpeg"/>
      </item>`),
    );
    expect(episodes).toEqual([
      {
        title: "From CRO to AXO",
        link: "https://www.cro.cafe/en/episodes/from-cro-to-axo/",
        audioUrl: "https://podcasts.gui.do/cro-cafe/audio/448b345b.mp3",
        pubDate: "Tue, 03 Nov 2026 06:00:00 GMT",
        podcastName: "CRO.CAFE",
      },
    ]);
  });

  it("handles a single item, numeric titles and missing links", () => {
    const [episode] = parseEpisodes(
      feed(`<item>
        <title>2024</title>
        <enclosure url="https://api-na1.hubspot.com/podcasts/v1/audio/file.mp3?portalId=1&amp;id=2" type="audio/mpeg"/>
      </item>`),
    );
    expect(episode.title).toBe("2024");
    expect(episode.link).toBeUndefined();
    expect(episode.audioUrl).toBe(
      "https://api-na1.hubspot.com/podcasts/v1/audio/file.mp3?portalId=1&id=2",
    );
  });

  it("skips items without an https audio enclosure and drops unsafe links", () => {
    const episodes = parseEpisodes(
      feed(`<item><title>No audio</title></item>
      <item><title>Plain http</title><enclosure url="http://example.com/a.mp3"/></item>
      <item>
        <title>Bad link</title>
        <link>javascript:alert(1)</link>
        <enclosure url="https://podcasts.gui.do/a.mp3"/>
      </item>`),
    );
    expect(episodes).toHaveLength(1);
    expect(episodes[0].title).toBe("Bad link");
    expect(episodes[0].link).toBeUndefined();
  });

  it("returns [] for non-RSS input", () => {
    expect(parseEpisodes("<html></html>")).toEqual([]);
    expect(parseEpisodes("")).toEqual([]);
  });
});

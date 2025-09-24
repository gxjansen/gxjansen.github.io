1) Render-blocking CSS delaying first paint

This is embarrassing. Your CSS is forcing users to wait an extra 300ms (blocking 450ms) for nothing — shipped in 2 files with 0KB wasted? Ridiculous. Inline critical CSS, defer or preload the rest, and stop pretending this is acceptable. Management and QA should be ashamed; retrain or replace the people who let /_astro/_slug_.wRzfpAOO.css and /_astro/keystatic-astro-page.bKIoiw0L.css ship like this.

2) Unused CSS rules wasting bytes and parse time

You’ve shipped 24.6KB of pointless CSS across 2 files and it’s costing ~300ms. That’s sloppy, lazy, and a middle-management failure. Purge unused rules, run critical CSS extraction, and stop relying on hope. Whoever approved /_astro/_slug_.DuQNRaOT.css and /_astro/keystatic-astro-page.bKIoiw0L.css needs retraining — or a new job.

3) Image larger than the displayed size

One image is costing you an avoidable 150ms and wasting 18.2KB. Use responsive srcset/sizes, serve properly scaled WebP, and stop shipping one-size-fits-all assets. This is basic competence — if your team can’t handle /_astro/guido-couch.DIstDi1h_5X2VV.webp correctly, they need a serious wake-up call (or replacement).

4) TTFB above sub-100ms goal

Your TTFB is 227ms — you could shave 127ms to hit 100ms. That’s not an architectural mystery, it’s sloppy ops: tune caching, push logic to the edge, and stop accepting mediocre hosting. One slow server request (1 server request) is a sign of either neglect or incompetence. Replace the people who treat 227ms as ‘good enough.’

// Derive the /events entries from Guido's atproto records (see
// src/data/events.snapshot.json) plus the committed display overrides.
//
// Sources, per the scope rule:
//   - id.sifa.profile.project events[]  -> events he organized or hosted
//   - id.sifa.profile.presentationDelivery -> talks and hosted sessions
// A delivery whose eventRef points at a project-linked event is merged into
// that entry (exact AT-URI match only, never by date or name).
//
// Overrides keep only what the records can't hold: the preserved URL slug,
// Guido's own role wording, the logo file and links to presentation pages.
//
// Plain JS so the site, the snapshot tooling and the tests share one copy.

const EVENT_COLLECTION = "community.lexicon.calendar.event";
const token = (v) => (v ? String(v).split("#").pop() : undefined);

/** Readable label for a delivery role token, used when no override exists. */
export const ROLE_LABELS = {
  presenter: "Speaker",
  keynote: "Keynote speaker",
  panelist: "Panellist",
  workshop: "Speaker",
  host: "Event host/moderator",
};

/** An override applies when its key is present, so null can clear a value. */
const pick = (o, k, fallback) => (Object.hasOwn(o, k) ? o[k] : fallback);

function slugify(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function eventFields(ev) {
  const loc = (ev.locations ?? []).find(
    (l) => l?.$type === "community.lexicon.location.address",
  );
  const online = token(ev.mode) === "virtual";
  return {
    name: ev.name ?? "",
    date: String(ev.startsAt ?? "").slice(0, 10),
    url: ev.uris?.[0]?.uri ?? "",
    city: loc?.locality ?? (online ? "Online event" : ""),
    country: loc?.country ?? "",
  };
}

function deliveryFields(d) {
  const online = token(d.mode) === "virtual";
  const link = (d.links ?? []).find((l) => token(l.type) === "linkEvent");
  return {
    name: d.eventName ?? d.title ?? "",
    date: String(d.date ?? "").slice(0, 10),
    url: link?.uri ?? "",
    city:
      d.address?.locality ??
      (online ? "Online event" : (d.location ?? "").split(",")[0].trim()),
    country: d.address?.country ?? "",
  };
}

function talkTopic(d, presentationsByUri) {
  const title = d.presentationRef?.uri
    ? presentationsByUri.get(d.presentationRef.uri)?.title
    : d.title;
  const t = (title ?? "").trim();
  // Placeholder titles aren't topics: the event's own name, "<event> host", or
  // a hosted livestream's generic title.
  const flat = (x) =>
    String(x ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  if (!t || flat(t) === flat(d.eventName) || / host$/i.test(t)) return "";
  if (token(d.role) === "host" && /^podcast livestream$/i.test(t)) return "";
  return t;
}

/**
 * @param {{deliveries: {uri: string, value: any}[], projects: {uri: string, value: any}[],
 *          presentations: {uri: string, value: any}[], events: {uri: string, value: any}[]}} snapshot
 * @param {{byKey: Record<string, any>, projectIcons?: Record<string, string>,
 *          presentationSlugs?: Record<string, string>}} overrides
 * @returns {Array<{id: string, key: string, name: string, date: string, url: string, city: string,
 *          country: string, topic: string, role: string, workshop: boolean, icon?: string,
 *          relatedPresentationSlugs: string[]}>}
 */
export function deriveEvents(snapshot, overrides) {
  const byKey = overrides.byKey ?? {};
  const projectIcons = overrides.projectIcons ?? {};
  const presentationSlugs = overrides.presentationSlugs ?? {};
  const presentationsByUri = new Map(
    snapshot.presentations.map((p) => [p.uri, p.value]),
  );
  const eventsByUri = new Map(
    snapshot.events
      .filter((e) => e.uri.split("/")[3] === EVENT_COLLECTION)
      .map((e) => [e.uri, e.value]),
  );

  /** @type {Map<string, any>} */
  const entries = new Map();

  // 1. Events Guido organized or hosted (project events[]).
  for (const p of snapshot.projects) {
    for (const pe of p.value.events ?? []) {
      const uri = pe?.event?.uri;
      const ev = uri && eventsByUri.get(uri);
      if (!ev || entries.has(uri)) continue;
      entries.set(uri, {
        key: uri,
        ...eventFields(ev),
        topic: (ev.description ?? "").trim(),
        workshop: false,
        roleLabel: pe.role ?? p.value.role ?? "Organizer",
        icon: projectIcons[p.uri],
        presentationSlugs: [],
      });
    }
  }

  // 2. Talks and hosted sessions. Merge into a project entry on exact event URI.
  for (const { uri, value: d } of snapshot.deliveries) {
    const ref = d.eventRef?.uri;
    const merged = ref ? entries.get(ref) : undefined;
    const slug = d.presentationRef?.uri
      ? presentationSlugs[d.presentationRef.uri]
      : undefined;
    const topic = talkTopic(d, presentationsByUri);
    if (merged) {
      if (topic) merged.topic = topic;
      if (token(d.role) === "workshop") merged.workshop = true;
      if (slug) merged.presentationSlugs.push(slug);
      continue;
    }
    const base =
      ref && eventsByUri.get(ref)
        ? eventFields(eventsByUri.get(ref))
        : deliveryFields(d);
    entries.set(uri, {
      key: uri,
      ...base,
      topic,
      workshop: token(d.role) === "workshop",
      roleLabel: ROLE_LABELS[token(d.role)] ?? "Speaker",
      icon: undefined,
      presentationSlugs: slug ? [slug] : [],
    });
  }

  // 3. Apply overrides, assign stable unique slugs.
  // Preserved slugs are reserved first, so a new event can never take one.
  const reserved = new Set(
    Object.values(byKey)
      .map((o) => o.id)
      .filter(Boolean),
  );
  const used = new Set();
  const out = [];
  const list = [...entries.values()].sort(
    (a, b) => b.date.localeCompare(a.date) || a.key.localeCompare(b.key),
  );
  for (const e of list) {
    const o = byKey[e.key] ?? {};
    let id = o.id;
    if (!id) {
      const taken = (x) => used.has(x) || reserved.has(x);
      const base = `${slugify(e.name)}-${e.date.slice(0, 7)}`;
      id = taken(base) ? `${slugify(e.name)}-${e.date}` : base;
      for (let n = 2; taken(id); n++) id = `${slugify(e.name)}-${e.date}-${n}`;
    }
    if (used.has(id)) throw new Error(`duplicate event slug ${id}`);
    used.add(id);
    out.push({
      id,
      key: e.key,
      name: pick(o, "name", e.name),
      date: e.date,
      url: pick(o, "url", e.url),
      city: pick(o, "city", e.city),
      // Records from other apps may carry a country name; an override gives the ISO code.
      country: pick(o, "country", e.country),
      topic: pick(o, "topic", e.topic),
      role: pick(o, "role", e.roleLabel),
      workshop: e.workshop,
      // null in the overrides means "no logo", even when the project has one.
      icon: pick(o, "icon", e.icon) ?? undefined,
      relatedPresentationSlugs: pick(o, "relatedPresentationSlugs", [
        ...new Set(e.presentationSlugs),
      ]),
    });
  }
  return out;
}

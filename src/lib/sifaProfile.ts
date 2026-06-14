/**
 * Live CV data from the Sifa profile (verifiable track record on the AT
 * Protocol). Fetches gui.do's aggregated profile via @singi-labs/sifa-sdk and
 * normalizes it for the /cv page. Falls back to a minimal representative set on
 * any failure so the page always renders. Never throws.
 */
import { fetchProfile } from "@singi-labs/sifa-sdk/query/fetchers";
import { format } from "date-fns";

export interface CvExperience {
  title: string;
  company: string;
  description?: string;
  period: string;
  location?: string;
}
export interface CvEducation {
  institution: string;
  detail?: string;
  period: string;
}
export interface CvData {
  name: string;
  headline?: string;
  about?: string;
  avatar?: string;
  location?: string;
  experience: CvExperience[];
  education: CvEducation[];
  skills: string[];
  live: boolean;
}

/** Format "2026-03" / "2000" → "Mar 2026" / "2000". */
function fmtDate(s?: string): string {
  if (!s) return "";
  const [y, m] = s.split("-");
  if (m) {
    const d = new Date(Number(y), Number(m) - 1, 1);
    return Number.isNaN(d.getTime()) ? y : format(d, "MMM yyyy");
  }
  return y;
}
const period = (start?: string, end?: string) =>
  [fmtDate(start), end ? fmtDate(end) : "Present"].filter(Boolean).join(" – ");

const locOf = (loc: any): string | undefined => {
  if (!loc) return undefined;
  if (typeof loc === "string") return loc;
  return (
    [loc.locality, loc.region, loc.country].filter(Boolean).join(", ") ||
    undefined
  );
};

/** Decode HTML entities (Sifa text can contain e.g. `&#x20;`, `&amp;`). */
function decodeEntities(s?: string | null): string | undefined {
  if (!s) return undefined;
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

const FALLBACK: CvData = {
  name: "Guido X Jansen",
  headline: "Community builder · Cognitive psychologist · Experimentation",
  about:
    "Community builder and cognitive psychologist. For 20+ years I've helped grow developer & customer communities — and the teams that run them — using psychology and experimentation to turn participation into product strategy.",
  location: "Netherlands",
  experience: [
    {
      title: "Community & Developer Relations leadership",
      company: "Spryker",
      period: "2021 – 2024",
      description:
        "Built the community & DevRel function from zero; swapped 'one idea a month' for hackathons — 80+ community-built projects.",
    },
    {
      title: "Founder & host",
      company: "CRO.CAFE",
      period: "2018 – Present",
      description:
        "200+ conversations on growth, experimentation & optimization, in EN & NL.",
    },
  ],
  education: [
    {
      institution: "Applied Cognitive Psychology (Human Factors)",
      period: "2005 – 2007",
    },
    { institution: "Psychology, BSc", period: "2002 – 2005" },
  ],
  skills: [
    "Community strategy",
    "Developer relations",
    "Cognitive psychology",
    "Experimentation / CRO",
    "AI automation",
    "Open standards (AT Protocol)",
  ],
  live: false,
};

export async function getCV(): Promise<CvData> {
  try {
    const p: any = await fetchProfile({ baseUrl: "https://sifa.id" }, "gui.do");
    if (!p) return FALLBACK;

    const experience: CvExperience[] = (p.positions ?? [])
      .filter((x: any) => !x.hidden)
      .sort((a: any, b: any) =>
        String(b.startedAt).localeCompare(String(a.startedAt)),
      )
      .map((x: any) => ({
        title: decodeEntities(x.title) ?? x.title,
        company: decodeEntities(x.company) ?? x.company,
        description: decodeEntities(x.description),
        period: period(x.startedAt, x.endedAt),
        location: locOf(x.location),
      }));

    const education: CvEducation[] = (p.education ?? [])
      .filter((x: any) => !x.hidden)
      .sort((a: any, b: any) =>
        String(b.startedAt).localeCompare(String(a.startedAt)),
      )
      .map((x: any) => ({
        institution: x.institution,
        detail:
          [x.degree, x.fieldOfStudy].filter(Boolean).join(" · ") || undefined,
        period: period(x.startedAt, x.endedAt),
      }));

    // Dedupe skills by name; activity-backed / most-endorsed first.
    const seen = new Set<string>();
    const skills: string[] = (p.skills ?? [])
      .slice()
      .sort(
        (a: any, b: any) =>
          Number(!!b.activityBacked) - Number(!!a.activityBacked) ||
          (b.endorsementCount ?? 0) - (a.endorsementCount ?? 0),
      )
      .map((s: any) => s.name)
      .filter((n: string) => {
        const key = n?.toLowerCase().trim();
        if (!n || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 24);

    return {
      name: decodeEntities(p.displayName) ?? p.handle ?? FALLBACK.name,
      headline: decodeEntities(p.headline),
      about: decodeEntities(p.about),
      avatar: p.avatar ?? undefined,
      location: locOf(p.location) ?? p.locationCountry ?? FALLBACK.location,
      experience: experience.length ? experience : FALLBACK.experience,
      education: education.length ? education : FALLBACK.education,
      skills: skills.length ? skills : FALLBACK.skills,
      live: true,
    };
  } catch {
    return FALLBACK;
  }
}

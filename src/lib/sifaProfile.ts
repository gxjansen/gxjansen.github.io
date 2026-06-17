/**
 * Live CV data from the Sifa profile (a portable, AT Protocol-native profile).
 * Fetches gui.do's aggregated profile via @singi-labs/sifa-sdk and
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
export interface CvProject {
  name: string;
  description?: string;
  url?: string;
  period: string;
}
export interface CvCertification {
  name: string;
  issuingOrg?: string;
  date: string;
  credentialUrl?: string;
}
export interface CvVolunteering {
  organization: string;
  role?: string;
  cause?: string;
  description?: string;
  period: string;
}
export interface CvAward {
  title: string;
  issuer?: string;
  description?: string;
  date: string;
}
export interface CvLanguage {
  language: string;
  proficiency?: string;
}
/** A rendered block from a free-text field: a paragraph or a bullet list. */
export type RichBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

// Markers Sifa text uses for bullets: → ✭ ★ ☆ ✦ • ▪ ● » plus - * –.
const BULLET = /^[→✭★☆✦•▪●»\-*–]\s+/u;

/**
 * Parse a free-text field (Sifa about / position descriptions) into paragraphs
 * and bullet lists. Blank lines separate paragraphs; lines that open with a
 * bullet marker become list items. Consecutive bullet lines — even when split
 * by blank lines — group into one list, so a hand-written "→ … → … → …" block
 * renders as a single list instead of a wall of text.
 */
export function richText(s?: string | null): RichBlock[] {
  if (!s) return [];
  const blocks: RichBlock[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: "ul", items: list });
    list = [];
  };
  for (const raw of s.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flushPara(); // keep the list open across blank lines
      continue;
    }
    if (BULLET.test(line)) {
      flushPara();
      list.push(line.replace(BULLET, "").trim());
      continue;
    }
    flushList(); // a normal line ends any list
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}

export interface CvData {
  name: string;
  headline?: string;
  about?: string;
  avatar?: string;
  location?: string;
  openTo: string[];
  workplace?: string;
  experience: CvExperience[];
  education: CvEducation[];
  projects: CvProject[];
  certifications: CvCertification[];
  volunteering: CvVolunteering[];
  awards: CvAward[];
  languages: CvLanguage[];
  skills: string[];
  live: boolean;
}

// id.sifa.defs# tokens → readable labels.
const OPEN_TO_LABELS: Record<string, string> = {
  collaborations: "Collaborations",
  boardPositions: "Board & advisory roles",
  mentoringOthers: "Mentoring",
  fullTimeRoles: "Full-time roles",
  partTimeRoles: "Part-time roles",
  contractRoles: "Contract work",
  consulting: "Consulting",
  speaking: "Speaking",
  advisoryRoles: "Advisory roles",
};
const WORKPLACE_LABELS: Record<string, string> = {
  remoteGlobal: "Remote, anywhere",
  remoteRegion: "Remote (same region)",
  remoteLocal: "Remote (same country)",
  remote: "Remote",
  hybrid: "Hybrid",
  onSite: "On-site",
};
// Language proficiency tokens → readable labels.
const PROFICIENCY_LABELS: Record<string, string> = {
  native: "Native",
  nativeOrBilingual: "Native / bilingual",
  native_or_bilingual: "Native / bilingual",
  fullProfessional: "Full professional",
  full_professional: "Full professional",
  professionalWorking: "Professional working",
  professional_working: "Professional working",
  limitedWorking: "Limited working",
  limited_working: "Limited working",
  elementary: "Elementary",
};
const proficiencyLabel = (v: any): string | undefined => {
  const decoded = decodeEntities(v);
  if (!decoded) return undefined;
  return PROFICIENCY_LABELS[defKey(decoded)] ?? decoded;
};

const defKey = (v: string) => v.split("#").pop() ?? v;
const openToLabels = (arr: any): string[] =>
  Array.isArray(arr)
    ? arr
        .map((v) => OPEN_TO_LABELS[defKey(String(v))])
        .filter((x): x is string => Boolean(x))
    : [];
// Pick the most permissive workplace preference for a single clean label.
const workplaceLabel = (arr: any): string | undefined => {
  if (!Array.isArray(arr)) return undefined;
  const keys = arr.map((v) => defKey(String(v)));
  for (const k of [
    "remoteGlobal",
    "hybrid",
    "onSite",
    "remote",
    "remoteRegion",
    "remoteLocal",
  ]) {
    if (keys.includes(k)) return WORKPLACE_LABELS[k];
  }
  return undefined;
};

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

/** Decode HTML entities (Sifa text can contain e.g. `&#x20;`, `&amp;`). Done in
 *  ONE pass so a decoded `&` is never re-scanned and double-decoded: input like
 *  `&amp;lt;` must stay `&lt;`, not collapse to `<` (CWE-116 double-unescaping). */
function decodeEntities(s?: string | null): string | undefined {
  if (!s) return undefined;
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return s
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (m, e) => {
      const ent = (e as string).toLowerCase();
      if (ent[0] === "#") {
        const code =
          ent[1] === "x"
            ? parseInt(ent.slice(2), 16)
            : parseInt(ent.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return named[ent] ?? m;
    })
    .trim();
}

const FALLBACK: CvData = {
  name: "Guido X Jansen",
  headline: "Community builder · Cognitive psychologist · Experimentation",
  about:
    "Community builder and cognitive psychologist. For 20+ years I've helped grow developer & customer communities — and the teams that run them — using psychology and experimentation to turn participation into product strategy.",
  location: "Netherlands",
  openTo: ["Collaborations", "Board & advisory roles", "Mentoring"],
  workplace: "Remote, anywhere",
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
  projects: [
    {
      name: "CRO.CAFE",
      description:
        "Podcast network on growth, experimentation & optimization, in EN & NL.",
      url: "https://www.cro.cafe/",
      period: "2018 – Present",
    },
    {
      name: "Sifa",
      description:
        "My portable professional profile on AT Protocol, and the source of this CV.",
      url: "https://sifa.id/p/gui.do",
      period: "2025 – Present",
    },
  ],
  certifications: [
    {
      name: "Online Test & Optimization Specialist",
      issuingOrg: "Online Dialogue",
      date: "2014",
    },
  ],
  volunteering: [
    {
      organization: "CmasterZ",
      role: "Mentor",
      cause: "Education",
      period: "2019 – Present",
    },
  ],
  awards: [
    {
      title: "Experimentation Culture Award",
      issuer: "Community vote",
      date: "2021",
    },
  ],
  languages: [
    { language: "Dutch", proficiency: "Native" },
    { language: "English", proficiency: "Full professional" },
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

    const projects: CvProject[] = (p.projects ?? [])
      .filter((x: any) => !x.hidden)
      .sort((a: any, b: any) =>
        String(b.startDate ?? "").localeCompare(String(a.startDate ?? "")),
      )
      .map((x: any) => ({
        name: decodeEntities(x.name) ?? x.name,
        description: decodeEntities(x.description),
        url: x.url || undefined,
        period: period(x.startDate, x.endDate),
      }));

    const certifications: CvCertification[] = (p.certifications ?? [])
      .filter((x: any) => !x.hidden)
      .sort((a: any, b: any) =>
        String(b.issueDate ?? "").localeCompare(String(a.issueDate ?? "")),
      )
      .map((x: any) => ({
        name: decodeEntities(x.name) ?? x.name,
        issuingOrg: decodeEntities(x.issuingOrg),
        date: fmtDate(x.issueDate),
        credentialUrl: x.credentialUrl || undefined,
      }));

    const volunteering: CvVolunteering[] = (p.volunteering ?? [])
      .filter((x: any) => !x.hidden)
      .sort((a: any, b: any) =>
        String(b.startDate ?? "").localeCompare(String(a.startDate ?? "")),
      )
      .map((x: any) => ({
        organization: decodeEntities(x.organization) ?? x.organization,
        role: decodeEntities(x.role),
        cause: decodeEntities(x.cause),
        description: decodeEntities(x.description),
        period: period(x.startDate, x.endDate),
      }));

    const awards: CvAward[] = (p.honors ?? [])
      .filter((x: any) => !x.hidden)
      .sort((a: any, b: any) =>
        String(b.date ?? "").localeCompare(String(a.date ?? "")),
      )
      .map((x: any) => ({
        title: decodeEntities(x.title) ?? x.title,
        issuer: decodeEntities(x.issuer),
        description: decodeEntities(x.description),
        date: fmtDate(x.date),
      }));

    const languages: CvLanguage[] = (p.languages ?? [])
      .filter((x: any) => !x.hidden)
      .map((x: any) => ({
        language: decodeEntities(x.language) ?? x.language,
        proficiency: proficiencyLabel(x.proficiency),
      }));

    return {
      name: decodeEntities(p.displayName) ?? p.handle ?? FALLBACK.name,
      headline: decodeEntities(p.headline),
      about: decodeEntities(p.about),
      avatar: p.avatar ?? undefined,
      location: locOf(p.location) ?? p.locationCountry ?? FALLBACK.location,
      openTo: openToLabels(p.openTo).length
        ? openToLabels(p.openTo)
        : FALLBACK.openTo,
      workplace: workplaceLabel(p.preferredWorkplace) ?? FALLBACK.workplace,
      experience: experience.length ? experience : FALLBACK.experience,
      education: education.length ? education : FALLBACK.education,
      projects: projects.length ? projects : FALLBACK.projects,
      certifications: certifications.length
        ? certifications
        : FALLBACK.certifications,
      volunteering: volunteering.length ? volunteering : FALLBACK.volunteering,
      awards: awards.length ? awards : FALLBACK.awards,
      languages: languages.length ? languages : FALLBACK.languages,
      skills: skills.length ? skills : FALLBACK.skills,
      live: true,
    };
  } catch {
    return FALLBACK;
  }
}

/**
 * Sanitize an AMA question before validation, storage, and rendering.
 *
 * Goal: render correctness, not abuse-prevention. The card renderer
 * (Satori), the Telegram caption (plain text, no parse_mode), and the
 * Astro template (auto-escaped) are already injection-safe by design.
 * What can still go wrong is *visual* — bidi overrides reverse text,
 * zero-width chars insert invisible content, combining marks render
 * inconsistently across font fallbacks. This helper normalizes those.
 *
 * The function is intentionally *not* destructive beyond stripping
 * known-bad codepoints and collapsing whitespace runs. Emoji, mixed
 * scripts, and ordinary Unicode pass through untouched.
 */

// Strip:
// - U+0000–U+0008, U+000B–U+001F : C0 controls (keep \t \n \r,
//                                  collapsed to space below)
// - U+007F                       : DEL
// - U+200B–U+200D                : zero-width space/non-joiner/joiner
// - U+202A–U+202E                : bidi overrides (visual spoofing)
// - U+2066–U+2069                : directional isolates
// - U+FEFF                       : byte order mark
const STRIP_RE = new RegExp(
  "[\\u0000-\\u0008\\u000B-\\u001F\\u007F\\u200B-\\u200D\\u202A-\\u202E\\u2066-\\u2069\\uFEFF]",
  "g",
);

export function sanitizeQuestion(input: string): string {
  return input
    .normalize("NFC")
    .replace(STRIP_RE, "")
    .replace(/\s+/g, " ")
    .trim();
}

# /events migration (one-off, 2026-09-30)

Moved `src/data/events.json` (204 hand-maintained entries) onto Guido's AT
Protocol records. Kept for traceability and a possible rollback; not part of
the build.

- Talks and hosted sessions: `id.sifa.profile.presentationDelivery`
- Events Guido organized or hosted: `community.lexicon.calendar.event` in his
  repo, linked from `id.sifa.profile.project` `events[]`
- Organize + speak at one event = both records, merged on /events by event AT-URI

Steps (artifacts are written to the brand workspace, `events-migration/`):

| Script | Does |
|---|---|
| `0-backup.mjs` | CAR export + record dump (read-only) |
| `1-plan.mjs <backup-dir>` | Frozen write plan + review report + events.json→record mapping. No writes. Validates every record against the lexicons in `lexicons/` and sifa-lexicons |
| `2-apply.mjs [--collection <nsid>] [--only <rkey>]` | Executes the plan: idempotent, swapRecord on updates/deletes, ledger per write, ≤550 writes/hour |
| `3-rollback.mjs [--dry-run]` | Undoes every ledgered write in reverse order |
| `4-site-overrides.mjs [--simulate]` | Generates `src/data/events-overrides.json` |

The old data lives on as the parity fixture
`src/data/__tests__/fixtures/events-2026-09-30.json`.

## Adding an event now

No code change. Add it on sifa.id:

- A talk or a hosted session: add a talk/session (presentationDelivery). Link
  the event if it exists as a calendar event.
- An event you organized: create the calendar event (e.g. on atmo.rsvp) and
  link it from the project on sifa.id ("Link an event" offers events you
  created, events you RSVPed to, or a pasted atmo.rsvp URL).

The daily "Events snapshot" workflow picks it up and opens a PR. Until the
workflow can attach the required checks to its own PR, refresh the snapshot
locally (`node scripts/snapshot-events.mjs`) and ship it in a normal PR. Logo, role wording or presentation-page links for an
entry go in `src/data/events-overrides.json` (keyed by the record AT-URI).

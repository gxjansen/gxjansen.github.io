/**
 * Unit tests for deriveEvents on a minimal snapshot: an event authored by
 * another DID (as atmo.rsvp does for organizer-run events) linked from a
 * project, plus the override fields the records can't carry.
 */
import { describe, it, expect } from "vitest";
import { deriveEvents } from "../eventsDerive.js";

const ME = "did:plc:45uheisi25szrjvjurfpritx";
const ORG = "did:plc:3xewinw4wtimo2lqfy5fm5sw";
const EVENT_URI = `at://${ORG}/community.lexicon.calendar.event/3mw74r4r3gsej`;
const PROJECT_URI = `at://${ME}/id.sifa.profile.project/3newproject`;

const snapshot = {
  deliveries: [],
  presentations: [],
  projects: [
    {
      uri: PROJECT_URI,
      value: {
        $type: "id.sifa.profile.project",
        name: "Atmosphere Conference",
        role: "Co-organizer",
        events: [{ event: { uri: EVENT_URI } }],
      },
    },
  ],
  events: [
    {
      uri: EVENT_URI,
      value: {
        $type: "community.lexicon.calendar.event",
        name: "AtmosphereConf 2027",
        description: "The third edition of the global gathering...",
        startsAt: "2027-04-29T07:00:00.000Z",
        mode: "community.lexicon.calendar.event#hybrid",
        // atmo.rsvp writes the localized country name, not an ISO code.
        locations: [
          {
            $type: "community.lexicon.location.address",
            country: "Nederland",
            locality: "Amsterdam",
            region: "Noord-Holland",
          },
        ],
        uris: [{ name: "", uri: "https://atmosphereconf.org" }],
      },
    },
  ],
};

describe("deriveEvents: project-linked event on another DID", () => {
  it("lists the event with the project's role and the record's fields", () => {
    const [e] = deriveEvents(snapshot, { byKey: {} });
    expect(e).toMatchObject({
      id: "atmosphereconf-2027-2027-04",
      key: EVENT_URI,
      name: "AtmosphereConf 2027",
      date: "2027-04-29",
      city: "Amsterdam",
      country: "Nederland",
      role: "Co-organizer",
      url: "https://atmosphereconf.org",
    });
  });

  it("lets overrides replace the country with an ISO code", () => {
    const [e] = deriveEvents(snapshot, {
      byKey: {
        [EVENT_URI]: {
          id: "atmosphereconf-2027",
          country: "NL",
          topic: "Third global gathering of the Atmosphere community",
        },
      },
    });
    expect(e.id).toBe("atmosphereconf-2027");
    expect(e.country).toBe("NL");
    expect(e.topic).toBe("Third global gathering of the Atmosphere community");
  });
});

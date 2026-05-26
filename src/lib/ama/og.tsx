/* =====================================================================
   OG image for gui.do/ama
   ---------------------------------------------------------------------
   Page-level OG (the one Bluesky / social shows when someone shares the
   /ama URL itself, not an individual question). Same render constraints
   as card.tsx — Satori-safe HTML/CSS subset, embedded fonts, no SVG
   filters or masks. Shares chrome with the question cards: Rosé Pine
   palette, Poppins type, JetBrains-Mono footer, the "Guido × Jansen"
   wordmark glyph.

   The feed-stack composition: three faux question cards fan out from
   the right behind the headline "You ask. Guido answers." — shows the
   AMA system in action.
   ===================================================================== */
import * as React from 'react';
import { variants, personas, Wordmark } from './card';

const FONT      = '"Poppins", system-ui, sans-serif';
const FONT_MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

function OgFooter({ textColor, subtleColor, accent }: { textColor: string; subtleColor: string; accent: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 1, paddingTop: 14,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        fontFamily: FONT_MONO, fontSize: 26, fontWeight: 600,
        color: textColor, letterSpacing: '-0.01em',
      }}>
        <span style={{ display: 'flex' }}>gui.do/ama</span>
        <span style={{ display: 'flex', color: subtleColor, opacity: 0.7 }}>·</span>
        <span style={{
          display: 'flex', color: subtleColor, fontFamily: FONT,
          fontSize: 24, fontWeight: 500,
        }}>ask anonymously</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: FONT_MONO, fontSize: 30, fontWeight: 600,
        color: accent, letterSpacing: '-0.01em',
      }}>
        <span style={{ display: 'flex' }}>#ama</span>
      </div>
    </div>
  );
}

function OgHeader({ textColor, subtleColor, accent, eyebrow }: { textColor: string; subtleColor: string; accent: string; eyebrow?: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 1,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: FONT_MONO, fontSize: 18, fontWeight: 600,
        color: subtleColor, letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>
        <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 10, background: accent }} />
        <span style={{ display: 'flex' }}>{eyebrow ?? 'AMA · Open'}</span>
      </div>
      <Wordmark size={22} color={textColor} xColor={accent} />
    </div>
  );
}

export function OgFeedStack() {
  const v = variants[0]; // cream-pine
  const findP = (name: string) => personas.find((p) => p.name === name)!;

  const sampleQs = [
    { q: "How do you build community without burning out?",                       variant: variants[2], persona: findP('Heron')    },
    { q: "What's the best book on community work you've read this year?",        variant: variants[3], persona: findP('Honeybee') },
    { q: "Discord, Slack, or a forum for a 200-person dev community?",            variant: variants[1], persona: findP('Owl')      },
  ];

  return (
    <div style={{
      width: 1200, height: 630, display: 'flex', flexDirection: 'column',
      background: v.bg, color: v.textColor, fontFamily: FONT,
      padding: '44px 64px', position: 'relative', overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Three faux cards fanning from the right */}
      {sampleQs.map((s, i) => {
        const PAvatar = s.persona.Avatar;
        return (
          <div key={i} style={{
            position: 'absolute', display: 'flex',
            right: -130 + i * 30,
            top: 70 + i * 32,
            width: 760, height: 400,
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: `0 16px 40px rgba(26,24,37,0.${22 - i * 4}), 0 4px 12px rgba(26,24,37,0.16)`,
            transform: `rotate(${4 - i * 3}deg)`,
            transformOrigin: 'top right',
          }}>
            <div style={{
              display: 'flex', flexDirection: 'column', flex: 1,
              background: s.variant.bg,
              color: s.variant.textColor, fontFamily: FONT,
              padding: '28px 36px', boxSizing: 'border-box', overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', width: 64, height: 64, borderRadius: 64, overflow: 'hidden' }}>
                  <PAvatar />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', fontSize: 20, fontWeight: 700, color: s.variant.textColor, letterSpacing: '-0.01em' }}>
                    <span style={{ display: 'flex' }}>{`${s.persona.adjective} ${s.persona.name}`}</span>
                  </div>
                  <div style={{ display: 'flex', fontSize: 14, color: s.variant.subtleColor }}>
                    <span style={{ display: 'flex' }}>asked Guido…</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'center', marginTop: 10 }}>
                <div style={{
                  display: 'flex', flex: 1, fontSize: 30, fontWeight: 600,
                  lineHeight: 1.2, letterSpacing: '-0.02em', color: s.variant.textColor,
                }}>{s.q}</div>
              </div>
            </div>
          </div>
        );
      })}

      <OgHeader textColor={v.textColor} subtleColor={v.subtleColor} accent={v.accent} />

      <div style={{
        display: 'flex', flex: 1, flexDirection: 'column',
        justifyContent: 'center', zIndex: 1, marginTop: 8, paddingRight: 560,
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column',
          fontSize: 80, fontWeight: 700,
          color: v.textColor, lineHeight: 1.04,
          letterSpacing: '-0.03em',
        }}>
          <span style={{ display: 'flex' }}>You ask.</span>
          <span style={{ display: 'flex', color: v.accent }}>Guido answers.</span>
        </div>
        <div style={{
          display: 'flex', fontSize: 22, fontWeight: 500,
          color: v.subtleColor, lineHeight: 1.3, marginTop: 18, paddingRight: 40,
        }}>
          <span style={{ display: 'flex' }}>… and posts it on Bluesky.</span>
        </div>
      </div>

      <OgFooter textColor={v.textColor} subtleColor={v.subtleColor} accent={v.accent} />
    </div>
  );
}

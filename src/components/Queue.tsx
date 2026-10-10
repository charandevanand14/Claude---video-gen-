import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PaperCard} from './Paper';
import {SLAM, SNAP, theme} from '../theme';

export type Company = {name: string; sub: string; flag?: string};

export const COMPANIES: Company[] = [
  {name: 'STARLINK', sub: 'SpaceX · Musk'},
  {name: 'JIO SATELLITE', sub: 'Reliance · Ambani'},
  {name: 'ONEWEB', sub: 'Eutelsat · Airtel-backed'},
];

/**
 * Three licence cards dealt into a row. `focus` dims the others;
 * `stampLicence` shows the LICENCE ✓ chip; `badge` overlays a per-card label.
 */
export const CompanyCards: React.FC<{
  dealAt?: number;
  stagger?: number;
  top?: number;
  focus?: number | null;
  stampLicence?: number | null; // frame at which ✓ chips pop
  badges?: (string | null)[];
  shiftY?: number;
}> = ({dealAt = 0, stagger = 6, top = 760, focus = null, stampLicence = null, badges = [], shiftY = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w = 300;
  const gap = 30;
  const x0 = (1080 - (w * 3 + gap * 2)) / 2;

  return (
    <>
      {COMPANIES.map((c, i) => {
        const p = spring({frame: frame - dealAt - i * stagger, fps, config: SNAP});
        const dim = focus !== null && focus !== i;
        const chip = stampLicence !== null ? spring({frame: frame - stampLicence - i * 4, fps, config: SLAM}) : 0;
        return (
          <PaperCard
            key={c.name}
            rotate={interpolate(p, [0, 1], [25, [-2, 1, -1][i]])}
            style={{
              left: x0 + i * (w + gap),
              top: top + shiftY,
              width: w,
              height: 380,
              boxSizing: 'border-box',
              transform: `translateY(${(1 - p) * 1300}px) rotate(${interpolate(p, [0, 1], [25, [-2, 1, -1][i]])}deg) scale(${focus === i ? 1.08 : 1})`,
              opacity: dim ? 0.38 : 1,
              filter: dim ? 'grayscale(1)' : 'none',
            }}
          >
            <div style={{fontFamily: theme.display, fontSize: 50, lineHeight: 0.95, color: theme.ink}}>{c.name.split(' ').map((s) => <div key={s}>{s}</div>)}</div>
            <div style={{fontFamily: theme.mono, fontSize: 22, marginTop: 14, color: '#5a5045'}}>{c.sub}</div>
            {chip > 0.01 && (
              <div style={{position: 'absolute', bottom: 28, left: 30, border: `4px solid ${theme.ink}`, padding: '4px 12px', fontFamily: theme.display, fontSize: 28, transform: `scale(${interpolate(chip, [0, 1], [2, 1])})`, transformOrigin: 'left center'}}>
                LICENCE ✓
              </div>
            )}
            {badges[i] && (
              <div style={{position: 'absolute', top: -34, right: -18, background: theme.red, color: '#fff', fontFamily: theme.display, fontSize: 30, padding: '6px 14px', transform: 'rotate(6deg)'}}>
                {badges[i]}
              </div>
            )}
          </PaperCard>
        );
      })}
    </>
  );
};

/**
 * Striped toll-gate barrier. Arm rests raised (~78°) until `slamAt`, then
 * drops with a heavy spring and a small rebound. Pivot sits left of the cards.
 */
export const TollGate: React.FC<{slamAt: number; y: number; liftAt?: number}> = ({slamAt, y, liftAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const down = spring({frame: frame - slamAt, fps, config: {damping: 9, stiffness: 520, mass: 1.4}});
  const up = liftAt === undefined ? 0 : spring({frame: frame - liftAt, fps, config: SNAP});
  const angle = interpolate(down - up, [0, 1], [-78, 0]);
  const postIn = spring({frame: frame - (slamAt - 8), fps, config: SNAP});

  return (
    <div style={{position: 'absolute', left: 30, top: y, transform: `translateY(${(1 - postIn) * 600}px)`}}>
      <div style={{position: 'absolute', left: 0, top: -40, width: 70, height: 300, background: theme.ink, borderRadius: 8, boxShadow: '8px 12px 18px rgba(0,0,0,0.35)'}} />
      <div
        style={{
          position: 'absolute',
          left: 35,
          top: -10,
          width: 1000,
          height: 54,
          transformOrigin: '0 50%',
          transform: `rotate(${angle}deg)`,
          background: `repeating-linear-gradient(-45deg, ${theme.ink} 0 40px, #fff 40px 80px)`,
          border: `5px solid ${theme.ink}`,
          boxShadow: '6px 14px 16px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{position: "absolute", left: 340, top: -62, background: theme.red, color: '#fff', fontFamily: theme.display, fontSize: 34, padding: '4px 14px', opacity: down > 0.9 ? 1 : 0}}>STOP</div>
      </div>
      <div style={{position: 'absolute', left: 14, top: -24, width: 42, height: 42, borderRadius: 21, background: theme.yellow, border: `5px solid ${theme.ink}`}} />
    </div>
  );
};

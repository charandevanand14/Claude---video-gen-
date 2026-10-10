import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SNAP, SLAM, theme} from '../theme';

/**
 * Kinetic headline. Markup: *word* = red marker, _word_ = yellow marker,
 * "/" = forced line break. Words snap in one by one, `stagger` frames apart;
 * markers wipe left→right once their word has landed.
 */
export const Kinetic: React.FC<{
  text: string;
  startAt?: number;
  stagger?: number;
  size?: number;
  color?: string;
  top: number;
  left?: number;
  right?: number;
  align?: 'left' | 'center';
  rotate?: number;
}> = ({text, startAt = 0, stagger = 3, size = 120, color = theme.ink, top, left = 60, right = 60, align = 'left', rotate = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = text.split('/').map((l) => l.trim().split(/\s+/));
  let i = 0;

  return (
    <div style={{position: 'absolute', top, left, right, textAlign: align, transform: `rotate(${rotate}deg)`}}>
      {lines.map((words, li) => (
        <div key={li} style={{lineHeight: 0.98}}>
          {words.map((raw, wi) => {
            const idx = i++;
            const red = /^\*.*\*[.,?!]*$/.test(raw);
            const yellow = /^_.*_[.,?!]*$/.test(raw);
            const word = raw.replace(/[*_]/g, '');
            const at = startAt + idx * stagger;
            const p = spring({frame: frame - at, fps, config: red || yellow ? SLAM : SNAP});
            const wipe = interpolate(frame - at, [4, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const hl = red ? theme.red : yellow ? theme.yellow : null;
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  marginRight: size * 0.26,
                  fontFamily: theme.display,
                  fontSize: size,
                  letterSpacing: -size * 0.03,
                  color: red ? '#fff' : color,
                  opacity: p > 0.01 ? 1 : 0,
                  transform: `translateY(${(1 - p) * size * 0.8}px) scale(${interpolate(p, [0, 1], [hl ? 1.8 : 0.6, 1])})`,
                  transformOrigin: '50% 80%',
                }}
              >
                {hl && (
                  <span
                    style={{
                      position: 'absolute',
                      left: -size * 0.04,
                      right: -size * 0.04,
                      top: size * 0.08,
                      bottom: size * 0.02,
                      background: hl,
                      transform: `scaleX(${wipe}) rotate(-1.5deg)`,
                      transformOrigin: 'left center',
                      zIndex: -1,
                    }}
                  />
                )}
                <span style={{position: 'relative', color: red ? (wipe > 0.5 ? '#fff' : theme.ink) : color}}>{word}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Small mono kicker label, e.g. "ON X · 9 OCT". */
export const Kicker: React.FC<{text: string; top: number; left?: number; startAt?: number}> = ({text, top, left = 60, startAt = 0}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - startAt, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top, left, fontFamily: theme.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: theme.ink, opacity: o}}>
      {text}
    </div>
  );
};

/** Rubber stamp that slams down from 2.4x with ink-bleed opacity. */
export const Stamp: React.FC<{
  text: string;
  at?: number;
  x: number;
  y: number;
  rotate?: number;
  color?: string;
  size?: number;
}> = ({text, at = 0, x, y, rotate = -12, color = theme.red, size = 110}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: SLAM});
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
        opacity: interpolate(p, [0, 0.3, 1], [0, 1, 0.92]),
        border: `10px solid ${color}`,
        borderRadius: 14,
        padding: '6px 30px',
        color,
        fontFamily: theme.display,
        fontSize: size,
        letterSpacing: 4,
        whiteSpace: 'nowrap',
        mixBlendMode: 'multiply',
      }}
    >
      {text}
    </div>
  );
};

import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person} from '../timeline';
import {SNAP, theme} from '../theme';

export const PEOPLE: Record<Person, {name: string; src: string | null}> = {
  // Drop transparent PNGs in public/cutouts and set src, e.g. 'cutouts/musk.png'.
  // Left null, a labelled silhouette renders so the comp works without assets.
  musk: {name: 'ELON MUSK', src: null},
  ambani: {name: 'MUKESH AMBANI', src: null},
  rahul: {name: 'RAHUL GANDHI', src: null},
};

type Side = 'left' | 'right' | 'bottom' | 'top';

/**
 * Photo cutout with a white paper-cut border. Snaps in from `from` side with
 * over-bounce, optionally snaps out at `exitAt` (frames, relative to parent Sequence).
 */
export const Cutout: React.FC<{
  person: Person;
  from: Side;
  enterAt?: number;
  exitAt?: number;
  x: number; // final centre x
  y: number; // final bottom y
  height?: number;
  rotate?: number;
  flip?: boolean;
  showName?: boolean;
  dim?: number; // 0..1 desaturate/fade when not the focus
}> = ({person, from, enterAt = 0, exitAt, x, y, height = 900, rotate = 0, flip, showName = true, dim = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame: frame - enterAt, fps, config: SNAP});
  const outP = exitAt === undefined ? 0 : spring({frame: frame - exitAt, fps, config: {damping: 20, stiffness: 260}});
  const p = inP - outP;

  const off = 1400;
  const vec: Record<Side, [number, number]> = {left: [-off, 0], right: [off, 0], bottom: [0, off], top: [0, -off]};
  const [ox, oy] = vec[from];
  const tx = interpolate(p, [0, 1], [ox, 0]);
  const ty = interpolate(p, [0, 1], [oy, 0]);
  const rot = rotate + interpolate(p, [0, 1], [from === 'left' ? -14 : 14, 0]);
  const width = height * 0.72;
  const {name, src} = PEOPLE[person];

  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height,
        width,
        height,
        transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scaleX(${flip ? -1 : 1})`,
        transformOrigin: '50% 100%',
        filter: `drop-shadow(0 0 0 #fff) drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff) drop-shadow(14px 22px 18px rgba(30,20,5,0.4)) grayscale(${dim}) brightness(${1 - dim * 0.25})`,
      }}
    >
      {src ? (
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom'}} />
      ) : (
        <Silhouette />
      )}
      {showName && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: `translateX(-50%) scaleX(${flip ? -1 : 1}) rotate(-3deg)`,
            background: theme.ink,
            color: theme.card,
            fontFamily: theme.display,
            fontSize: 44,
            padding: '6px 18px',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
};

const Silhouette: React.FC = () => (
  <svg viewBox="0 0 72 100" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
    <ellipse cx="36" cy="30" rx="15" ry="18" fill="#3a332b" />
    <path d="M4 100 C6 66 18 56 36 56 C54 56 66 66 68 100 Z" fill="#3a332b" />
    <text x="36" y="33" textAnchor="middle" fontSize="5" fill="#bfb39c" fontFamily="monospace">PHOTO</text>
  </svg>
);

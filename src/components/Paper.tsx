import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';

/** Paper stock with fibre noise and fold creases. `tint` lets scenes shift the base colour. */
export const PaperBackground: React.FC<{tint?: string}> = ({tint = theme.paper}) => (
  <AbsoluteFill style={{backgroundColor: tint}}>
    <svg width="100%" height="100%" style={{position: 'absolute', mixBlendMode: 'multiply', opacity: 0.55}}>
      <filter id="fibre">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0.35 0" />
      </filter>
      <filter id="blotch">
        <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="9" />
        <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.38  0 0 0 0 0.2  0 0 0 0.5 -0.1" />
      </filter>
      <rect width="100%" height="100%" filter="url(#blotch)" />
      <rect width="100%" height="100%" filter="url(#fibre)" />
    </svg>
    {[640, 1280].map((y) => (
      <div key={y} style={{position: 'absolute', top: y, left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.06)', boxShadow: '0 2px 0 rgba(255,255,255,0.25)'}} />
    ))}
    <div style={{position: 'absolute', left: 540, top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,0.05)'}} />
  </AbsoluteFill>
);

/** Off-white card with a strip of masking tape. */
export const PaperCard: React.FC<{
  style?: React.CSSProperties;
  rotate?: number;
  tape?: boolean;
  children: React.ReactNode;
}> = ({style, rotate = 0, tape = true, children}) => (
  <div
    style={{
      position: 'absolute',
      background: theme.card,
      padding: '28px 34px',
      boxShadow: '0 18px 30px rgba(40,25,5,0.28), 0 2px 0 rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}
  >
    {tape && (
      <div style={{position: 'absolute', top: -18, left: '50%', width: 150, height: 40, marginLeft: -75, background: 'rgba(250,240,200,0.75)', transform: 'rotate(-3deg)', boxShadow: '0 1px 2px rgba(0,0,0,0.15)'}} />
    )}
    {children}
  </div>
);

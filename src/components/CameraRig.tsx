import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {sec} from '../timeline';

/**
 * Global camera. Each pulse snaps scale up by `amount` (default 1.0 → 1.05)
 * and eases back over `decay` seconds. Pulses add, so overlapping hits stack slightly.
 * `shakeAt` frames add a 6-frame positional shake (for slams).
 */
export const CameraRig: React.FC<{
  pulses: number[]; // seconds
  shakeAt?: number[]; // seconds
  amount?: number;
  decay?: number;
  children: React.ReactNode;
}> = ({pulses, shakeAt = [], amount = 0.05, decay = 1.6, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  let scale = 1;
  for (const p of pulses) {
    const start = sec(p);
    if (frame < start || frame > start + sec(decay) + 10) continue;
    const punch = spring({frame: frame - start, fps, config: {damping: 14, stiffness: 300}, durationInFrames: 8});
    const release = interpolate(frame - start, [8, sec(decay)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * t * (3 - 2 * t)});
    scale += amount * punch * (1 - release);
  }

  let dx = 0;
  let dy = 0;
  for (const s of shakeAt) {
    const t = frame - sec(s);
    if (t >= 0 && t < 8) {
      const k = (8 - t) / 8;
      dx += Math.sin(t * 2.7) * 14 * k;
      dy += Math.cos(t * 3.3) * 10 * k;
    }
  }

  return (
    <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) scale(${scale})`, transformOrigin: '50% 45%'}}>
      {children}
    </AbsoluteFill>
  );
};

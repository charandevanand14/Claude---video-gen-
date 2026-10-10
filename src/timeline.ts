/**
 * Single source of truth for timing. All values are SECONDS of narration.
 * These are ESTIMATES (~2.9 words/sec). Re-time against the real VO
 * (e.g. word-level timestamps from Whisper) by editing only this file.
 */
export const FPS = 30;
export const DURATION_S = 56;

export type Person = 'musk' | 'ambani' | 'rahul';

export type Beat = {
  id: string;
  from: number; // seconds
  to: number; // seconds
  vo: string; // spoken line (for reference + captions)
  sfx?: string; // file in public/sfx, played at `from`
};

export const beats: Beat[] = [
  {id: 'hook', from: 0, to: 1.4, vo: '(cold open tease)', sfx: 'impact.mp3'},
  {id: 'blames', from: 1.4, to: 3.6, vo: 'Elon Musk blames Ambani for Starlink\'s delay in India.', sfx: 'whoosh.mp3'},
  {id: 'jioWaiting', from: 3.6, to: 6.6, vo: 'So—why is Ambani\'s own Jio satellite service waiting too?', sfx: 'record-scratch.mp3'},
  {id: 'oligarchs', from: 6.6, to: 9.2, vo: 'Musk accused certain oligarchs of blocking Starlink.', sfx: 'paper-slap.mp3'},
  {id: 'baseless', from: 9.2, to: 11.4, vo: 'The government called that baseless.', sfx: 'stamp.mp3'},
  {id: 'realBoss', from: 11.4, to: 14.8, vo: 'Then Musk asked: "Is Ambani the real boss of India?"', sfx: 'riser-hit.mp3'},
  {id: 'rahul', from: 14.8, to: 19.8, vo: 'Rahul Gandhi replied: "Welcome to India, Elon. Wait till you discover the other guy."', sfx: 'pop.mp3'},
  {id: 'queue', from: 19.8, to: 21.6, vo: 'Now—look at the queue.', sfx: 'whoosh.mp3'},
  {id: 'licences', from: 21.6, to: 26.0, vo: 'Starlink, Reliance\'s Jio satellite arm, and Airtel-backed OneWeb all have licenses.', sfx: 'card-deal.mp3'},
  {id: 'sameStage', from: 26.0, to: 29.8, vo: 'The government says all three are at roughly the same stage.', sfx: 'tick.mp3'},
  {id: 'security', from: 29.8, to: 31.4, vo: 'Security checks first.', sfx: 'gate-slam.mp3'},
  {id: 'spectrum', from: 31.4, to: 34.4, vo: 'Then spectrum—the airwaves they need to operate.', sfx: 'radio-sweep.mp3'},
  {id: 'flagged', from: 34.4, to: 38.0, vo: 'Reports say regulators also flagged a Starlink-specific concern:', sfx: 'alert.mp3'},
  {id: 'drugBust', from: 38.0, to: 41.0, vo: 'Starlink devices were found in a drug bust in the Andamans,', sfx: 'stamp.mp3'},
  {id: 'manipur', from: 41.0, to: 43.6, vo: 'and in an army operation in Manipur.', sfx: 'stamp.mp3'},
  {id: 'fair', from: 43.6, to: 47.6, vo: 'But to be fair to Musk—Starlink first applied back in 2022.', sfx: 'calendar-flip.mp3'},
  {id: 'checkQueue', from: 47.6, to: 50.6, vo: 'So before you pick a side, check the queue.', sfx: 'whoosh.mp3'},
  {id: 'allWaiting', from: 50.6, to: DURATION_S, vo: 'Then ask: why are they all still waiting?', sfx: 'clock-tick.mp3'},
];

export const sec = (s: number) => Math.round(s * FPS);

/** Micro-zoom pulses: every beat start + a mid-beat pulse for beats > 3s. */
export const zoomPulses = (): number[] => {
  const out: number[] = [];
  for (const b of beats) {
    out.push(b.from);
    if (b.to - b.from > 3) out.push((b.from + b.to) / 2);
  }
  return out;
};

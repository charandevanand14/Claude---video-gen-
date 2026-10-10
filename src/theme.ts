export const theme = {
  paper: '#EADBC0',
  paperDark: '#D9C6A3',
  ink: '#141210',
  red: '#E0261B',
  yellow: '#FFD400',
  card: '#F6F0E2',
  display: '"Inter Display Black", "Inter Black", "Archivo Black", "Arial Black", sans-serif',
  serif: 'Georgia, "DejaVu Serif", serif',
  mono: '"DejaVu Sans Mono", monospace',
};

/** Spring presets. SNAP over-bounces ~8%, SLAM barely bounces (heavy objects). */
export const SNAP = {damping: 11, stiffness: 220, mass: 0.6};
export const SLAM = {damping: 16, stiffness: 400, mass: 1.2};
export const SOFT = {damping: 20, stiffness: 140, mass: 0.8};

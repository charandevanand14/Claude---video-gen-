import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PaperBackground, PaperCard} from './components/Paper';
import {CameraRig} from './components/CameraRig';
import {Cutout} from './components/Cutout';
import {Kicker, Kinetic, Stamp} from './components/Kinetic';
import {CompanyCards, TollGate} from './components/Queue';
import {beats, sec, zoomPulses} from './timeline';
import {SNAP, theme} from './theme';

export type CheckTheQueueProps = {
  withSfx: boolean;
  voiceover: string | null; // file in public/, e.g. 'vo.mp3'
};

const B = Object.fromEntries(beats.map((b) => [b.id, b])) as Record<string, (typeof beats)[number]>;
/** Frame offset of beat `id` relative to a Sequence that starts at beat `base`. */
const rel = (id: string, base: string) => sec(B[id].from - B[base].from);
const span = (a: string, b: string) => ({from: sec(B[a].from), durationInFrames: sec(B[b].to - B[a].from)});

export const CheckTheQueue: React.FC<CheckTheQueueProps> = ({withSfx, voiceover}) => {
  return (
    <AbsoluteFill>
      <PaperBackground />
      <CameraRig pulses={zoomPulses()} shakeAt={[0, B.baseless.from + 0.1, B.security.from + 0.25, B.drugBust.from + 0.1]}>
        <Sequence {...span('hook', 'jioWaiting')}><Faceoff /></Sequence>
        <Sequence {...span('oligarchs', 'baseless')}><Oligarchs /></Sequence>
        <Sequence {...span('realBoss', 'realBoss')}><RealBoss /></Sequence>
        <Sequence {...span('rahul', 'rahul')}><Rahul /></Sequence>
        <Sequence {...span('queue', 'spectrum')}><QueueBlock /></Sequence>
        <Sequence {...span('flagged', 'manipur')}><Evidence /></Sequence>
        <Sequence {...span('fair', 'fair')}><Fair /></Sequence>
        <Sequence {...span('checkQueue', 'allWaiting')}><Outro /></Sequence>
      </CameraRig>
      <ProgressTicks />
      {voiceover && <Audio src={staticFile(voiceover)} />}
      {withSfx &&
        beats.filter((b) => b.sfx).map((b) => (
          <Sequence key={b.id} from={sec(b.from)} durationInFrames={sec(3)}>
            <Audio src={staticFile(`sfx/${b.sfx}`)} volume={0.6} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};

/* 0.0–6.6  hook tease → "Musk blames Ambani" → "why is Jio waiting too?" */
const Faceoff: React.FC = () => {
  const frame = useCurrentFrame();
  const tBlame = rel('blames', 'hook');
  const tJio = rel('jioWaiting', 'hook');
  const flash = interpolate(frame, [0, 3], [1, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: theme.yellow, opacity: flash}} />
      <Cutout person="musk" from="left" enterAt={2} exitAt={tJio} x={340} y={1920} height={1050} rotate={-4} />
      <Cutout person="ambani" from="right" enterAt={5} x={760} y={1920} height={1050} rotate={4} />
      {frame < tBlame && <Kinetic text="*REAL* *BOSS* / OF INDIA?" top={180} size={168} stagger={2} />}
      {frame >= tBlame && frame < tJio && (
        <>
          <Kicker text="STARLINK · DELAYED IN INDIA" top={150} startAt={tBlame} />
          <Kinetic text="MUSK / *BLAMES* / AMBANI." top={210} size={150} startAt={tBlame} />
        </>
      )}
      {frame >= tJio && (
        <>
          <Kinetic text="SO WHY IS / AMBANI'S OWN / _JIO_ SATELLITE / *WAITING* TOO?" top={160} size={112} startAt={tJio} stagger={2} />
          <Stamp text="IN THE QUEUE" at={tJio + 30} x={400} y={900} rotate={-8} size={80} />
        </>
      )}
    </AbsoluteFill>
  );
};

/* 6.6–11.4  "certain oligarchs" → govt: "baseless" */
const Oligarchs: React.FC = () => {
  const tBase = rel('baseless', 'oligarchs');
  return (
    <AbsoluteFill>
      <Cutout person="musk" from="left" enterAt={0} x={300} y={1920} height={900} rotate={-3} dim={0} />
      <Kicker text="MUSK, ON X" top={170} />
      <Kinetic text="CERTAIN / *OLIGARCHS* / BLOCKING / STARLINK?" top={230} size={130} stagger={3} />
      <Kicker text="THE GOVERNMENT:" top={1040} left={560} startAt={tBase - 4} />
      <Stamp text="BASELESS" at={tBase} x={720} y={1180} size={120} rotate={-10} />
    </AbsoluteFill>
  );
};

/* 11.4–14.8  callback to the hook, now on the spoken line */
const RealBoss: React.FC = () => (
  <AbsoluteFill style={{background: theme.ink}}>
    <Cutout person="musk" from="bottom" enterAt={0} x={290} y={1920} height={980} rotate={-5} />
    <Cutout person="ambani" from="bottom" enterAt={6} x={800} y={1920} height={980} rotate={5} />
    <Kinetic text="IS AMBANI / THE *REAL* *BOSS* / OF INDIA?" top={200} size={130} color={theme.card} stagger={3} />
  </AbsoluteFill>
);

/* 14.8–19.8  Rahul Gandhi's reply; "the other guy" gets a mystery cutout */
const Rahul: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tOther = sec(3.4); // ≈ "the other guy"
  const card = spring({frame: frame - 4, fps, config: SNAP});
  const mystery = spring({frame: frame - tOther, fps, config: SNAP});
  return (
    <AbsoluteFill>
      <Cutout person="rahul" from="right" enterAt={0} x={760} y={1920} height={1000} rotate={3} />
      <Kicker text="RAHUL GANDHI · LEADER OF OPPOSITION" top={170} />
      <PaperCard rotate={-2} style={{left: 60, top: 260, width: 900, transform: `translateX(${(1 - card) * -1200}px) rotate(-2deg)`}}>
        <div style={{fontFamily: theme.serif, fontSize: 68, lineHeight: 1.15, color: theme.ink}}>
          “Welcome to India, Elon. Wait till you discover{' '}
          <span style={{background: frame > tOther ? theme.yellow : 'transparent', padding: '0 8px'}}>the other guy.</span>”
        </div>
      </PaperCard>
      <PaperCard tape rotate={-8} style={{left: 90, top: 1060, width: 300, height: 360, transform: `scale(${mystery}) rotate(-8deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: theme.display, fontSize: 280, color: theme.red, textAlign: 'center', lineHeight: 1}}>?</div>
      </PaperCard>
    </AbsoluteFill>
  );
};

/* 19.8–34.4  queue → licences → same stage → security gate → spectrum */
const QueueBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const tLic = rel('licences', 'queue');
  const tSame = rel('sameStage', 'queue');
  const tSec = rel('security', 'queue');
  const tSpec = rel('spectrum', 'queue');
  const dash = interpolate(frame, [0, 20], [1080, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      {frame < tLic && (
        <>
          <Kinetic text="NOW, LOOK AT / *THE* *QUEUE*." top={300} size={150} stagger={2} />
          <svg width={1080} height={40} style={{position: 'absolute', top: 1000}}>
            <line x1={0} y1={20} x2={1080} y2={20} stroke={theme.ink} strokeWidth={8} strokeDasharray="30 22" strokeDashoffset={dash} />
          </svg>
        </>
      )}
      {frame >= tLic && (
        <>
          <CompanyCards dealAt={tLic} stampLicence={tLic + sec(2.4)} top={800} />
          {frame < tSame && <Kinetic text="ALL THREE / HAVE A _LICENCE_." top={250} size={120} startAt={tLic} />}
        </>
      )}
      {frame >= tSame && frame < tSec && (
        <>
          <Kicker text="GOVERNMENT SAYS" top={190} startAt={tSame} />
          <Kinetic text="ROUGHLY THE / *SAME* *STAGE*." top={250} size={120} startAt={tSame} />
          <StageBars startAt={tSame} />
        </>
      )}
      {frame >= tSec - 8 && <TollGate slamAt={tSec + 6} y={1075} />}
      {frame >= tSec && frame < tSpec && <Kinetic text="STEP 1: / *SECURITY* *CHECKS*" top={250} size={120} startAt={tSec} stagger={2} />}
      {frame >= tSpec && (
        <>
          <Kinetic text="STEP 2: / _SPECTRUM_" top={250} size={120} startAt={tSpec} />
          <Kicker text="= THE AIRWAVES THEY NEED TO OPERATE" top={560} startAt={tSpec + 20} />
          <Airwaves startAt={tSpec} />
        </>
      )}
    </AbsoluteFill>
  );
};

const StageBars: React.FC<{startAt: number}> = ({startAt}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - startAt, [6, 30], [0, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 75 + i * 330, top: 1210, width: 300, height: 26, border: `4px solid ${theme.ink}`, boxSizing: 'border-box'}}>
          <div style={{width: `${w * 100}%`, height: '100%', background: theme.red}} />
        </div>
      ))}
    </>
  );
};

const Airwaves: React.FC<{startAt: number}> = ({startAt}) => {
  const frame = useCurrentFrame() - startAt;
  return (
    <svg width={1080} height={400} style={{position: 'absolute', top: 1250}}>
      {[0, 1, 2, 3].map((i) => {
        const r = ((frame * 6 + i * 70) % 280) + 20;
        return <circle key={i} cx={540} cy={330} r={r} fill="none" stroke={theme.ink} strokeWidth={6} opacity={1 - r / 300} />;
      })}
    </svg>
  );
};

/* 34.4–43.6  Starlink-specific concern → drug bust → Manipur */
const Evidence: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tDrug = rel('drugBust', 'flagged');
  const tMan = rel('manipur', 'flagged');
  const card = spring({frame, fps, config: SNAP});
  const tag = (at: number) => spring({frame: frame - at, fps, config: SNAP});
  return (
    <AbsoluteFill>
      <Kicker text="REPORTS SAY REGULATORS FLAGGED" top={170} />
      <Kinetic text="A *STARLINK*- / SPECIFIC / CONCERN" top={230} size={120} stagger={2} />
      <PaperCard rotate={-3} style={{left: 330, top: 760, width: 420, height: 300, transform: `scale(${card}) rotate(-3deg)`}}>
        <div style={{fontFamily: theme.display, fontSize: 76, color: theme.ink}}>STARLINK</div>
        <div style={{fontFamily: theme.mono, fontSize: 24}}>user terminal</div>
      </PaperCard>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {frame >= tDrug && <line x1={540} y1={1050} x2={290} y2={1300} stroke={theme.red} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tag(tDrug)} />}
        {frame >= tMan && <line x1={540} y1={1050} x2={790} y2={1500} stroke={theme.red} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tag(tMan)} />}
      </svg>
      {frame >= tDrug && (
        <>
          <EvidenceTag x={80} y={1280} p={tag(tDrug)} title="DRUG BUST" sub="ANDAMAN ISLANDS" rotate={-5} />
          <Stamp text="DRUG BUST" at={tDrug + 6} x={540} y={680} size={96} rotate={-6} />
        </>
      )}
      {frame >= tMan && <EvidenceTag x={560} y={1480} p={tag(tMan)} title="ARMY OP" sub="MANIPUR" rotate={4} />}
    </AbsoluteFill>
  );
};

const EvidenceTag: React.FC<{x: number; y: number; p: number; title: string; sub: string; rotate: number}> = ({x, y, p, title, sub, rotate}) => (
  <PaperCard rotate={rotate} style={{left: x, top: y, width: 440, transform: `translateY(${(1 - p) * 900}px) rotate(${rotate}deg)`, borderLeft: `14px solid ${theme.red}`}}>
    <div style={{fontFamily: theme.mono, fontSize: 22, color: '#6a5f52'}}>EVIDENCE</div>
    <div style={{fontFamily: theme.display, fontSize: 64, color: theme.ink}}>{title}</div>
    <div style={{fontFamily: theme.mono, fontWeight: 700, fontSize: 28}}>{sub}</div>
  </PaperCard>
);

/* 43.6–47.6  "to be fair to Musk — applied in 2022" */
const Fair: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tYear = sec(2.4); // ≈ "2022"
  const flip = spring({frame: frame - tYear, fps, config: SNAP});
  return (
    <AbsoluteFill>
      <Cutout person="musk" from="left" enterAt={0} x={300} y={1920} height={950} rotate={-3} />
      <Kinetic text="TO BE FAIR / TO MUSK:" top={200} size={120} />
      <Kicker text="STARLINK FIRST APPLIED IN" top={520} startAt={sec(1)} />
      <PaperCard rotate={6} style={{left: 520, top: 640, width: 470, height: 420, transformOrigin: '50% 0%', transform: `perspective(1200px) rotateX(${(1 - flip) * -90}deg) rotate(6deg)`, opacity: frame >= tYear ? 1 : 0}}>
        <div style={{background: theme.red, color: '#fff', fontFamily: theme.display, fontSize: 40, margin: '-28px -34px 20px', padding: '10px 30px'}}>YEAR</div>
        <div style={{fontFamily: theme.display, fontSize: 190, lineHeight: 1, background: theme.yellow, display: 'inline-block', padding: '0 10px'}}>2022</div>
      </PaperCard>
    </AbsoluteFill>
  );
};

/* 47.6–56.0  "check the queue" → "why are they ALL still waiting?" */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const tAll = rel('allWaiting', 'checkQueue');
  const waiting = frame >= tAll ? ['WAITING', 'WAITING', 'WAITING'] : [];
  return (
    <AbsoluteFill>
      <CompanyCards dealAt={0} stagger={3} top={980} badges={waiting} />
      <TollGate slamAt={8} y={1255} />
      {frame < tAll ? (
        <Kinetic text="BEFORE YOU PICK / A SIDE, *CHECK* / *THE* *QUEUE*." top={240} size={112} stagger={2} />
      ) : (
        <Kinetic text="WHY ARE THEY / *ALL* STILL / _WAITING?_" top={240} size={130} startAt={tAll} stagger={3} />
      )}
      <div style={{position: 'absolute', bottom: 70, left: 60, right: 60, fontFamily: theme.mono, fontSize: 20, color: '#5a5045', opacity: frame > tAll ? 1 : 0}}>
        SOURCES: [FILL IN — posts on X, DoT/MoC statements, news reports]
      </div>
    </AbsoluteFill>
  );
};

/** Thin progress strip at the very top: one tick per beat, so viewers feel momentum. */
const ProgressTicks: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 10, background: 'rgba(0,0,0,0.12)'}}>
      <div style={{width: `${(frame / durationInFrames) * 100}%`, height: '100%', background: theme.red}} />
    </div>
  );
};

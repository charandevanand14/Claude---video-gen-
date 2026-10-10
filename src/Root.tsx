import React from 'react';
import {Composition} from 'remotion';
import {CheckTheQueue, CheckTheQueueProps} from './CheckTheQueue';
import {DURATION_S, FPS} from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CheckTheQueue"
    component={CheckTheQueue}
    durationInFrames={Math.round(DURATION_S * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{withSfx: false, voiceover: null} satisfies CheckTheQueueProps}
  />
);

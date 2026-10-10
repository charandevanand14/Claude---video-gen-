# Check the Queue (Remotion)

```
npm install
npm run studio        # preview / scrub
npm run render        # → out/check-the-queue.mp4
```

- **Timing:** `src/timeline.ts` (seconds). Re-time it against the real voiceover.
- **Photos:** drop transparent PNGs in `public/cutouts/` and set `src` in `src/components/Cutout.tsx` (`PEOPLE`). Placeholder silhouettes render until then.
- **Audio:** render with props `{"voiceover":"vo.mp3","withSfx":true}` once `public/vo.mp3` and the files named in `timeline.ts` exist in `public/sfx/`.
- Pacing table: `PACING.md`.

# Module Quiz 4 — Polish and Beyond

Self-check covering Module 4. Answers below each question.

---

**1. What is "juice," and why does it live in its own systems?**
Non-functional feedback that makes actions feel good (particle bursts, screen shake). It
changes no rules — remove it and the game plays identically — so it belongs in game-agnostic
engine systems (`particles.js`, camera shake) that game logic just *calls*, never embeds.

**2. How does feedback communicate the *weight* of an event without text?**
Proportional response: a small event gets a small reaction, a big one a big reaction. A stomp
shakes the screen a little (4px), taking damage shakes it hard (8px). Pitch contour does the
same for sound — rising = good, falling = bad.

**3. Why are sound effects synthesized instead of loaded from files?**
No binaries in the repo, so the game stays open-and-play, and every sound becomes a tunable
number (frequency, duration, waveform) rather than a fixed recording. `engine/audio.js` sweeps
oscillators via the Web Audio API.

**4. Why is the AudioContext created lazily and resumed on demand?**
Browsers block audio until a user gesture. Creating/​resuming the context on the first sound —
which always follows a keypress (e.g. the jump) — satisfies that rule without extra plumbing.

**5. What is a game, structurally, once it has multiple screens?**
A state machine of scenes: title → play → end → (play again | title). Each scene is
self-contained with its own `update`/`render`; the engine swaps the active one via
`Game.setScene` (using the `enter`/`exit` hooks).

**6. Why is "retry" a one-liner in this codebase?**
All run state lives in the `WorldScene` instance, so a fresh `new WorldScene()` *is* a perfect
reset — there is no separate reset code to write or keep in sync.

**7. How do the win and lose screens stay consistent?**
They're the same scene (`GameOverScene`) parameterized by a `result` flag — symmetric ends,
one code path, differing only in headline and tint. (And the world lingers ~1s before either,
so the moment lands.)

**8. Name the three code layers and the rule between them.**
Engine (`src/engine/`, game-agnostic), entities (`src/entities/`, game objects), scenes
(`src/scenes/`, the flow). Each depends only *downward*; everything is tuned from
`src/config.js` and described by `src/levels/`.

---

**Result:** Module 4 complete — and with it the whole curriculum. The platformer is finished:
a title screen, a scrolling level of coins, enemies, spikes and a goal, three lives, juice,
sound, and an end screen that loops back to play. 48/48 tasks, 360/360 XP. Next steps are pure
content and new systems the engine is already shaped to absorb.

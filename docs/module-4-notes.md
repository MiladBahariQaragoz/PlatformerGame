# Module 4 — Polish and Beyond (lesson notes)

Concept tasks captured as notes tied to the code, same as Modules 1–3.

---

## Juice and Feedback (+10 XP)

"Juice" is the layer of feedback that makes the *same* action feel good. The mechanics didn't
change in this task — coins still collect, stomps still stomp — but each event now *responds*:

- **Feedback closes every loop.** Module 3 built the events (collect, stomp, get hit); juice
  makes each one *announce itself*. A particle burst and a screen kick turn a silent state
  change into a moment the player feels. The reward loop only feels rewarding if the reward is
  sensory.
- **Juice is non-functional on purpose.** Particles and shake change nothing about the rules —
  remove them and the game still plays identically. That's the point: they're pure
  communication, so they live in their own systems and never touch game logic.
- **Proportional response.** A small event gets a small reaction; a big one gets a big one. A
  stomp shakes the screen a little (4px); taking damage shakes it hard (8px). The size of the
  feedback teaches the *weight* of the event without a word of text.
- **Burst, don't sustain.** Good juice is brief and then gone — a half-second spray that fades.
  Feedback that lingers becomes noise; feedback that punctuates stays readable.
- **Reuse the engine seam.** Particles are a *game-agnostic* engine system (`engine/particles.js`),
  same tier as physics and camera — the scene just calls `burst()` on events. Screen shake is a
  decaying offset on the camera. New juice, no new game logic: the engine-vs-game split paying
  off again.
- **Keep juice alive past the freeze.** The sim freezes on game over / win, but particles and
  shake keep updating, so the final hit's burst settles instead of snapping to a halt — the
  ending feels finished, not cut off.

**How it maps to our code:** `engine/particles.js` owns the burst/update/render; `WorldScene`
calls `particles.burst()` on coin pickup (gold), stomp (purple), and hit (red), and
`camera.shake()` on stomp/hit. Render applies `camera.shakeX/shakeY` to the world translate.
All magnitudes live in `config.particles` and `config.shake`. Sound — the *other* half of
feedback — is the next task.

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

---

## Sound Design (+10 XP)

Sound is the half of feedback you hear, and it reaches the player even when their eyes are
elsewhere. A few principles shaped our effects:

- **Every action gets a voice.** Jump, coin, stomp, hit, win, game over — each event has a
  distinct sound. Audio is a parallel feedback channel to the visuals; together they make an
  event unmistakable. You can play half the game by ear.
- **Sound carries meaning through shape.** Rising pitch = good/up (jump, coin); falling pitch
  = bad/down (stomp impact, hit, game over). The player reads "win" vs "lose" from the
  *contour* of a sound before they parse anything else. The win jingle rises (C–E–G); the
  game-over tone sinks.
- **Synthesis over assets.** We generate tones with oscillators instead of shipping `.wav`
  files. That keeps the repo binary-free and the game open-and-play — and it makes every sound
  a tunable number (frequency, duration, waveform), not a fixed recording. Retro bleeps suit
  the placeholder-art aesthetic, too.
- **The autoplay gate.** Browsers won't make sound until the player interacts, so the
  `AudioContext` is created lazily and `resume()`d on demand — the first jump (a keypress)
  unlocks audio naturally. Designing *around* the platform constraint beats fighting it.
- **Respect the player: let them mute.** Sound is also an intrusion. A one-key mute (M) is the
  minimum courtesy, and surfacing it in the control hints makes it discoverable. Good audio
  design includes the off switch.
- **Keep it short and non-blocking.** Effects are ~0.1–0.3s and scheduled on the audio clock
  (the win arpeggio uses timed `delay`s, not `setTimeout`), so sound never stalls the game
  loop and never overstays.

**How it maps to our code:** `engine/audio.js` is a small synth (`tone()` does a frequency
sweep with a gain decay) exposing one method per event; `WorldScene` calls `audio.jump()`,
`audio.coin()`, etc. at the same points it fires particles. `audio.toggle()` (bound to M)
mutes; master volume is `config.audio.volume`.

---

## Menus and Flow (+10 XP)

A game is more than its gameplay — it's a *flow* of screens the player moves through. The
start screen is the front door, and building it well means thinking about state and structure:

- **A game is a state machine of scenes.** Title → play → (win / game over) → play again.
  Each screen is a self-contained scene with its own `update`/`render`; the engine swaps the
  active one. No screen needs to know the internals of another — they share only the seam.
- **The engine already had the seam.** `Game.setScene()` (with `enter`/`exit` hooks) was built
  back in Module 0's loop, anticipating this. Adding a screen meant writing one new scene and
  pointing `main.js` at it — no engine changes. Designing the extension point early is what
  makes late features cheap.
- **A title screen sets expectations.** Before any challenge, the player gets the name, the
  tone, and the controls. It's also a *soft start*: nothing is happening, no clock is running,
  so the player begins on their own terms (and, conveniently, the first keypress unlocks
  audio).
- **Fresh state per run.** Starting gameplay constructs a *new* `WorldScene`, so every playthrough
  begins clean — lives full, coins unspent, enemies alive. Because all run state lives in the
  scene instance, "restart" is just "make a new scene." That single decision makes retry trivial.
- **Consistent input language.** The same keys that mean "go/up" in play (Space/W/↑) mean
  "proceed" in menus. Reusing the player's existing vocabulary means there's nothing new to
  learn at a screen boundary.
- **Separation of concerns, visually too.** Menu rendering lives in the menu scene, gameplay
  rendering in the world scene. They can share a look (the sky/ground backdrop) without sharing
  code paths, so changing one never risks the other.

**How it maps to our code:** `scenes/StartScene.js` is a full scene; its `enter(game)` stores
the engine reference so `update` can call `this.game.setScene(new WorldScene())` on a start
key. `main.js` boots into `StartScene`. The win/game-over screens and an in-game retry build on
this same scene-flow in the next tasks.

---

## Game Over and Retry (+10 XP)

An ending is only satisfying if it leads somewhere. Game over and retry close the outer loop —
the loop *around* the gameplay — and turn a single attempt into a game you keep playing:

- **Endings need an exit.** Module 3 could *reach* an end (zero lives, or the flag) but then
  just froze. A real end screen names the outcome, reflects it back (the coin tally), and —
  crucially — offers a next action. A dead end is a bug in the *flow*, even when the gameplay
  is fine.
- **Retry is free because state lives in the scene.** "Play again" is literally
  `setScene(new WorldScene())`. Because every bit of run state (lives, score, enemy/coin
  status, player position) lives inside the scene instance, throwing it away and making a new
  one *is* a perfect reset. No teardown, no "reset everything" function to keep in sync — the
  cleanest restart is no restart code at all.
- **Symmetric ends, one screen.** Win and lose share `GameOverScene`, differing only by a
  `result` flag (headline + tint). Two outcomes, one code path — the same economy as "one AABB,
  many mechanics." It also guarantees both endings *feel* like part of one system.
- **Let the moment land first.** We don't cut to the menu the instant the last life is lost.
  The world lingers ~1s — particles settle, the screen fades — so the player *feels* the
  ending before they're asked what to do next. Pacing a transition is as much design as the
  screen itself.
- **Give players the two choices they want.** After an ending there are really only two
  intents: "again" or "out." Retry (Space) and title (Esc) cover both, using keys consistent
  with the rest of the game. More options here would be clutter.
- **The loop is now closed.** Title → play → end → (play again | title). The player can run
  the whole cycle forever without touching the page reload — the mark of a finished game rather
  than a tech demo.

**How it maps to our code:** `WorldScene` sets `endTimer = config.flow.endDelay` when the run
ends, fades out (`drawEndFade`), then `setScene(new GameOverScene(result, score, total))`.
`GameOverScene.update` maps retry keys → `new WorldScene()` and Escape → `new StartScene()`.
Fresh-scene-per-run is what makes retry a one-liner.

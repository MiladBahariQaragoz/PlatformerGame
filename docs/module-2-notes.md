# Module 2 — Move and Jump (lesson notes)

Concept tasks captured as notes tied to the code, same as Module 1.

---

## How Characters Move (+10 XP)

Movement is the first thing a player *feels*, so it's built on a few deliberate choices:

- **Velocity, not teleport.** Input sets a velocity (`vx`), and position changes by
  `velocity × dt` each step. Tying motion to `dt` (delta time) makes speed frame-rate
  independent — the character moves the same on a 60Hz or 144Hz display.
- **Intent vs. physics.** The entity decides *intent* (which way it wants to go); the scene
  applies *physics* (integration, bounds, later gravity/collision). This split keeps
  entities simple and the world rules in one place.
- **Fixed timestep.** Updates run at a fixed `dt` (see `engine/game.js`), so motion and
  (soon) jumps are deterministic and reproducible.
- **Bounds.** The world has edges; we clamp the player to `[0, level.width - w]` so they
  can't walk out of the level.

**How it maps to our code:** `Player.update` reads input → sets `vx` and `facing`;
`WorldScene.update` integrates `x` and clamps to `level.width`. Speed lives in
`config.player.speed`.

---

## The Art of Jumping (+10 XP)

A jump is just an upward velocity fighting gravity, but the *feel* is everything:

- **The arc.** Jump height = `jumpSpeed² / (2 × gravity)`. With our 620 / 1800 values the
  apex is ~107px — enough to clear the ~52px platform rises with margin. Tuning these two
  numbers in `config.js` reshapes every jump in the game.
- **Gravity sells weight.** Strong gravity = snappy, arcade jumps; weak gravity = floaty,
  moon-like. The number is a feel decision, not a physics fact.
- **Grounded check.** You can only jump from solid ground (`onGround`), which the collision
  step sets each frame. No mid-air jumps — unless we deliberately add a double jump later.
- **Reachability is a contract.** Because the jump arc and the level's gaps were tuned
  together (Module 1 layout), every gap is fair by construction.
- **Feel upgrades to come (Module 4 juice):** variable jump height (cut the jump short on
  key release), *coyote time* (a few frames of grace after leaving a ledge), and *jump
  buffering* (registering a press made just before landing).

**How it maps to our code:** `config.player.jumpSpeed` + `CONFIG.gravity` define the arc;
`moveAndCollide` sets `onGround`; `WorldScene` only lets a queued jump fire when grounded.

---

## Collision and Solid Ground (+10 XP)

Collision is what makes geometry *solid* instead of decorative. Our approach:

- **AABB.** Everything is an axis-aligned bounding box. Two boxes overlap only if they
  overlap on *both* axes — cheap and exact for rectangles (`aabbOverlap`).
- **Axis-separated resolution.** We move and resolve one axis at a time: horizontal first,
  then vertical. Doing both at once makes corners ambiguous (do you stop sideways or land?);
  separating them gives clean "walls stop you, floors hold you" behavior.
- **Resolve by velocity direction.** Moving right into a box → snap to its left face; falling
  into a box → snap onto its top and set `onGround`; rising into one → bonk the underside.
  After each resolve we zero that axis's velocity.
- **Touching ≠ overlapping.** Resting exactly on a surface isn't an overlap, so a grounded
  player doesn't jitter; gravity nudges them down a hair each frame and the floor snaps them
  back, which is also how `onGround` stays true.
- **Solid ground = the contract for jumping.** `onGround` from this step is exactly what
  gates the jump, ties collision and movement together.

**How it maps to our code:** all of this lives in `engine/physics.js` (`aabbOverlap`,
`moveAndCollide`). The scene just hands it the player and the level's platforms.

---

## Camera and Exploration (+10 XP)

The camera decides what the player sees, which shapes how a level *feels* to explore:

- **World space vs. screen space.** Game objects live in world coordinates; the camera is
  just an offset we subtract when drawing. Splitting "where things are" from "where we look"
  is what lets a small window show a big world.
- **Follow + clamp.** Centering on the player keeps them readable; clamping to the level
  edges stops the camera from revealing empty space past the world. Together they make the
  level feel solid and bounded.
- **Layers of depth.** Some things scroll, some don't: our sky and sun are pinned to the
  screen while the world scrolls underneath. Parallax (backgrounds scrolling slower than the
  foreground) is the natural next step for depth (a Module-4 juice candidate).
- **Exploration is a reward.** A camera that reveals the world a screen at a time turns
  movement into discovery — the off-screen path is a question the player wants to answer.

**How it maps to our code:** `engine/camera.js` holds the offset and the follow+clamp math;
`WorldScene.render` draws the sky/sun in screen space, then translates by the camera for the
world.

---

## Game Feel and Polish (+10 XP)

"Game feel" is the moment-to-moment satisfaction of control — the gap between *functional*
and *fun*:

- **Responsiveness first.** Input must register instantly. Our fixed-timestep loop + reading
  input every step keeps controls tight; nothing buffers or lags.
- **Communicate, don't assume.** A new player shouldn't guess the controls. The fading hint
  HUD teaches them, then gets out of the way — present when useful, invisible when not.
- **Readable state.** The player should always know what's happening: facing direction, when
  they're grounded, where the edges are. Clear silhouettes and a steady camera do this.
- **Polish is many small things.** Fades, easing, and feedback each seem minor; together
  they're the difference. We added one (the hint fade) here; Module 4 ("juice") layers on
  squash/stretch, particles, screen shake, and sound.
- **Tuning is a feature.** Because speed, jump, gravity, and timings live in `config.js`,
  feel is something we *dial in*, not something hard-coded and frozen.

**How it maps to our code:** the responsive loop (`engine/game.js`), centralized tuning
(`config.js`), and the fading hints (`WorldScene.drawHints`) are this module's feel work;
the rest is scaffolded for Module 4.
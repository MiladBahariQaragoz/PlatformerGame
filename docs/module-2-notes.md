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
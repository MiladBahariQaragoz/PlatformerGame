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
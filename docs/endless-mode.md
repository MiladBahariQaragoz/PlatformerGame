# Endless Lava Run (post-curriculum feature)

A procedural, infinite game mode added after the curriculum. The game now boots into it by
default; the authored `level1` still works if passed to `WorldScene` explicitly.

## What it does
- **Unlimited run.** Platforms are generated on the fly as the player advances and culled once
  far behind, so the world is effectively infinite and memory stays bounded.
- **The floor is lava.** Instead of solid ground, a deadly band sits at the bottom of the
  screen. Falling to it costs a life and respawns the player on the last platform they landed
  on. Three lives, then the end screen (with retry) — same flow as before.
- **Random content on platforms.** Coins, patrolling enemies, and spike strips spawn randomly
  on generated platforms (never on the first few, and threats only on platforms wide enough to
  still land on).

## Fair-by-construction generation
The generator never invents distances; it derives them from the real jump physics
(`jumpSpeed`, `gravity`, `speed`):
1. **Height.** Each next platform's top is chosen within `[-maxDrop, +maxRise]` of the
   previous one. `maxRise` (78px) sits safely under the ~107px jump height.
2. **Gap.** Given that rise, the maximum horizontal distance the player can clear is computed
   from the jump arc (`maxJumpGap`), and the actual gap is capped to `gapSafety` (80%) of it —
   so every jump is reachable from the platform edge with margin.
3. **Length.** Each platform is randomly "short" or "long" (`shortWidth` / `longWidth`).

All of this is tunable in `config.endless` / `config.lava`. Verified with headless
simulations: bounded platform counts, working lava death → respawn → game over, and a
threats-off edge-jumping bot clearing hundreds of metres (gaps are clearable).

## Where it lives
- `src/levels/generator.js` — `LevelGenerator` (the math + spawning).
- `src/levels/endless.js` — `createEndlessLevel()` (fresh generator-backed world per run).
- `src/scenes/WorldScene.js` — endless branch: `generateAhead()`, `cullBehind()`, lava check,
  `lastSafe` respawn, distance score, lava + tiled-cloud rendering.
- `src/scenes/GameOverScene.js` — now shows distance + coins.

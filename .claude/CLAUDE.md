# CLAUDE.md - Platformer Game

Guidance for Claude Code when working in this repo. Read before making changes.

## What this is

A 2D platformer built in **vanilla JavaScript + HTML5 Canvas**. No framework, no build
step, no dependencies - it runs by opening `index.html` or serving the folder. The work is
driven by the curriculum in [`../plan.md`](../plan.md), one task at a time.

## Two non-negotiables

### 1. Scalable
- **Engine vs. game.** Reusable, game-agnostic systems live in `src/engine/`. Concrete game
  content (player, enemies, collectibles, levels, menus) lives in `src/entities/` and
  `src/scenes/`. Don't put gameplay logic in the engine, or engine plumbing in entities.
- **Add, don't rewrite.** New mechanics arrive as new entities/scenes or new engine
  systems. Avoid reworking existing files unless the curriculum task is explicitly a
  refactor. Keep diffs small and focused.
- **No magic numbers.** Tunable values (canvas size, gravity, move/jump speed, colors) live
  in `src/config.js`. Reference them; don't hard-code.
- **ES modules.** Use `import`/`export`. One responsibility per file. Keep files small.
- **Data-driven where it pays off.** Levels, enemy types, etc. should be described by data
  (arrays/objects) the engine consumes, so new content needs no new code paths.

### 2. Traceable
- **One curriculum task = one commit.** Each task in `plan.md` maps to exactly one commit.
- **Conventional Commits.** `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`.
  Subject in imperative mood. Body explains the *why*. Reference the plan task by name.
- **Update the trail every task.** When a task is finished:
  1. Tick its box in `plan.md` (`- [ ]` → `- [x]`).
  2. Update its row in `PROGRESS.md` (status → ☑, fill in the short commit hash) and bump
     the totals (tasks completed, XP earned).
  3. Commit code + plan.md + PROGRESS.md **together** so the history is self-describing.
- **Push every step.** After each commit, `git push`. Nothing stays local.
- **Co-author trailer** on every commit:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## Standard workflow for a curriculum task

1. Confirm which task in `plan.md` is next (top-down unless told otherwise).
2. Implement the smallest change that completes that task; keep the game runnable.
3. Tick `plan.md`, update `PROGRESS.md` totals + row.
4. `git add` the relevant files, commit with a Conventional Commit referencing the task.
5. `git push`.
6. State what changed and what the next task is.

## Conventions

- **Coordinates:** top-left origin, +x right, +y down (canvas default).
- **Timestep:** fixed-timestep update loop (see `engine/game.js`); rendering interpolates
  or simply draws latest state. Keep `update(dt)` deterministic.
- **Input:** read from the input module's state in `update`, never from event handlers in
  game logic.
- **Naming:** `camelCase` for vars/functions, `PascalCase` for classes/entity factories,
  `UPPER_SNAKE` for config constants.
- **Assets:** images in `assets/images/`, audio in `assets/audio/`. Reference by relative
  path. Prefer simple shapes/placeholder art until a task calls for real sprites.

## Don't

- Don't add npm packages or a bundler without being asked - it breaks "open and play".
- Don't batch multiple curriculum tasks into one commit.
- Don't leave `plan.md` / `PROGRESS.md` out of sync with the code.
- Don't commit secrets or large binaries.

## Environment notes

- Shell is PowerShell on Windows; the `gh` CLI is **not** installed - use plain `git`.
- Remote `origin` → https://github.com/MiladBahariQaragoz/PlatformerGame
- Git identity is configured globally (MiladBahariQaragoz).

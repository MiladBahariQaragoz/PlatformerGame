# Platformer Game

A 2D platformer built step by step with **vanilla JavaScript + HTML5 Canvas** — no build
step, no dependencies. Just open `index.html` (or serve the folder) and play.

The project follows the curriculum in [`plan.md`](./plan.md), worked through one task at a
time. Every task is a separate, traceable commit so the whole game can be read as a story
from first commit to last. Progress is tracked in [`PROGRESS.md`](./PROGRESS.md).

## Run it

No tooling required. Either:

```bash
# Option A: open directly
start index.html        # Windows

# Option B: serve (recommended — avoids browser file:// limits on modules/assets)
python -m http.server 8000
# then open http://localhost:8000
```

## Project structure

```
.
├── index.html            # Entry point — canvas + script loader
├── src/
│   ├── main.js           # Bootstraps the game
│   ├── config.js         # Tunable constants (size, gravity, speeds)
│   ├── engine/           # Reusable, game-agnostic systems
│   │   ├── game.js       #   Fixed-timestep game loop
│   │   ├── input.js      #   Keyboard/input state
│   │   └── physics.js    #   Gravity, collisions, AABB helpers
│   ├── entities/         # Player, enemies, collectibles, hazards
│   └── scenes/           # World/level, UI, menus
├── assets/
│   ├── images/           # Sprites, tiles, backgrounds
│   └── audio/            # Sound effects, music
├── plan.md               # Course curriculum (the roadmap)
├── PROGRESS.md           # What's done, with the commit that did it
└── .claude/              # Project guidance for Claude Code (see CLAUDE.md)
```

## Conventions

- **Scalable:** new gameplay lives in `entities/` or `scenes/`; shared mechanics live in
  `engine/`. Add, don't rewrite. Constants go in `config.js`, never hard-coded.
- **Traceable:** one curriculum task = one commit (Conventional Commits), pushed to GitHub.
  `PROGRESS.md` links each finished task to its commit.

See [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) for the full working agreement.

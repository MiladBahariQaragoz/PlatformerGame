# Architecture

How the pieces fit together. This is the map; `CLAUDE.md` is the rulebook.

## Layers

```
index.html
   │  loads
   ▼
src/main.js ──────────── bootstraps everything
   │
   ├── config.js         constants (size, gravity, speeds, colors)
   │
   ├── engine/           game-agnostic systems
   │     ├── game.js     fixed-timestep loop: update(dt) → render()
   │     ├── input.js    keyboard state (held / pressed)
   │     └── physics.js  gravity, AABB collision, resolution helpers
   │
   ├── scenes/           a "screen" with its own update/render
   │     └── (world / level, menus, UI come here)
   │
   └── entities/         things that live in a scene
         └── (player, enemies, collectibles, hazards come here)
```

## Core contracts

- **Scene:** an object/class exposing `update(dt, input)` and `render(ctx)`. The game loop
  owns one active scene at a time. Switching scenes (menu → play → game over) is how flow
  works — no global tangle.
- **Entity:** has state (position, velocity, size) and `update(dt)` / `render(ctx)`.
  Entities are owned by a scene, which updates and draws them in order.
- **Engine systems** never import from `entities/` or `scenes/`. Dependencies point
  inward: game content depends on the engine, never the reverse.

## Why this shape

- Each curriculum task slots into exactly one place: a new entity, a new scene, or a new
  engine capability. That keeps commits small and the history readable (traceable).
- The engine stays reusable and testable in isolation; content stays easy to add (scalable).

## Growth plan (maps to plan.md modules)

1. **Your Game World** → first scene (level), tiles/platforms as data, player entity.
2. **Move and Jump** → input + physics in engine; camera in the scene.
3. **Challenge and Reward** → collectible/enemy/hazard entities; lives & exit in the scene.
4. **Polish and Beyond** → juice (engine effects), audio system, menu + game-over scenes.

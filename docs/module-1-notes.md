# Module 1 — Your Game World (lesson notes)

Concept tasks in the curriculum are lessons rather than code. To keep them traceable, each
is captured here as notes that connect the idea to what we actually built.

---

## What Makes a Game World (+10 XP)

A game world is more than a backdrop — it's a *space with rules* the player can read at a
glance. Four ingredients:

1. **Space** — the playable area and its boundaries. Ours is the 800×450 canvas with a
   ground plane; everything above is air.
2. **Structure** — the solid geometry that shapes movement. Our `platforms` data is the
   structure: ground + a climbing path.
3. **Affordances** — visual cues that tell the player what they can do. The grassy caps on
   platforms read as "stand here"; the gaps read as "jump across".
4. **Theme** — the consistent look that ties it together (sky-blue + green hills here).

**How it maps to our code:** the world lives in `scenes/WorldScene.js` (the space + how
it's drawn) and `levels/level1.js` (the structure as data). Keeping structure in data is
what lets us add worlds without rewriting the scene.

---

## Platforms and Level Layout (+10 XP)

Good layout is about **rhythm and reachability**, not random placement:

- **Reachable jumps** — gaps must fit the character's jump arc. We standardized ~120px
  horizontal gaps and ~52px rises so every platform is clearable (jump tuning is dialed in
  during Module 2, but the layout is designed to be fair from the start).
- **Rhythm** — consistent spacing teaches the player a timing they can rely on; occasional
  variation (a wider "rest" platform) breaks monotony without breaking the pattern.
- **Readable path** — the eye should trace ground → steps → summit. Ours climbs left to
  right toward a summit platform, giving the level a clear goal-shape.
- **Pacing** — start easy (ground), build up, then a small reward at the top.

**Applied to `level1.js`:** retuned the platforms into an even climbing staircase with a
wider rest platform before the final summit step.

---

## Characters and Identity (+10 XP)

The player avatar is the thing the eye locks onto, so it needs **instant readability**:

- **Silhouette** — a clear, simple shape reads at any size. Ours is a tall rounded-feeling
  rectangle, taller than wide, so it reads as "a character" not "a block".
- **Contrast** — the character must pop against the world. Red on a blue-sky / green world
  is high-contrast and never camouflages into platforms.
- **Facing** — a single eye gives the character a front. We store `facing` on the player so
  the eye flips with movement direction (wired up in Module 2).
- **Personality through restraint** — even one feature (an eye) suggests a living thing.
  More detail comes later via animation/juice (Module 4), not by cluttering the base shape.

**How it maps to our code:** `entities/Player.js` keeps the character as data + a small
`render`, with color and size in `config.js` so identity stays tunable in one place.

---

## Details That Bring Worlds Alive (+10 XP)

Details are what turn "a level" into "a place". The trick is **cheap detail with depth**:

- **Layering** — background (clouds), midground (platforms/path), foreground (bushes).
  Distinct layers give the flat canvas a sense of depth. We draw strictly back-to-front.
- **Variation** — repeating the same cloud/bush looks fake. We vary `scale` and position so
  the eye reads them as natural, not tiled.
- **Restraint** — detail should frame the action, never compete with it. Scenery is
  low-contrast and sits away from the play path so platforms and the player stay legible.
- **Room to grow** — because decorations are data, "alive" touches (drifting clouds,
  swaying bushes) become a Module-4 juice pass without touching the level's structure.

**How it maps to our code:** `WorldScene.render` composites back-to-front (sky → clouds →
platforms → bushes → player); `level1.decorations` supplies varied, data-driven scenery.

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

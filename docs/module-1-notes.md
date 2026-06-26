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

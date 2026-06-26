# Module Quiz 2 — Move and Jump

Self-check covering Module 2. Answers below each question.

---

**1. Why is movement scaled by `dt` (delta time)?**
So speed is frame-rate independent — the character covers the same distance per second on a
60Hz or a 144Hz display. Position changes by `velocity × dt` each fixed step.

**2. What's the "intent vs. physics" split?**
The entity decides *intent* (which way it wants to move, whether it queued a jump); the
scene + engine apply the *physics* (integration, gravity, collision, bounds). Entities stay
simple; world rules live in one place.

**3. How is jump height determined?**
`jumpSpeed² / (2 × gravity)`. Both values live in `config.js`, so tuning them reshapes every
jump. (Ours: 620² / (2×1800) ≈ 107px.)

**4. Why resolve collisions one axis at a time?**
Resolving X then Y separately gives clean "walls stop you, floors hold you" behavior and
avoids ambiguous corner cases you get when resolving both at once.

**5. What does `onGround` do, and who sets it?**
It marks that the body is standing on a surface. `moveAndCollide` sets it during the vertical
pass (when a downward move lands on a platform top). The scene only lets a jump fire when
`onGround` is true.

**6. Why doesn't a resting player jitter on the ground?**
Touching edges don't count as overlap. Gravity nudges the player down a hair each frame and
the collision step snaps them back onto the surface, which also keeps `onGround` true.

**7. What is the camera, really, and why keep world space separate?**
Just an `x` offset we subtract when drawing. Keeping objects in world space (independent of
where we look) is what lets a small viewport show a large, scrolling level. The camera
follows the player and clamps to the level edges.

---

**Result:** Module 2 complete — the world is alive: run, jump, land, and explore. Next up,
Module 3 adds challenge and reward.

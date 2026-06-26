# Module Quiz 1 - Your Game World

Self-check covering Module 1. Answers below each question.

---

**1. What are the four core ingredients of a game world?**
Space, structure, affordances, and theme.

**2. Why is level layout kept in `level1.js` as data instead of inside `WorldScene`?**
So new levels need new *data*, not new code. The scene knows only how to draw; the level
describes what to draw. This keeps the project scalable.

**3. What makes a platform layout fair?**
Reachability and rhythm - gaps sized to the character's jump arc, with consistent spacing
the player can learn, plus a readable path toward a clear goal.

**4. Name two things that make a character readable at a glance.**
A clear silhouette and high contrast against the world. (Also: a facing cue like the eye.)

**5. What is back-to-front compositing, and what's our draw order?**
Drawing layers from farthest to nearest so nearer things overlap farther ones. Our order:
sky → sun → clouds → platforms → bushes → player.

**6. How would you change the whole world from day to dusk with minimal effort?**
Swap the palette in `config.colors` (sky gradient, sun, ground). Because all color is
centralized, tone is effectively a one-file change.

**7. Why is the player stored as `{x, y, w, h, vx, vy}`?**
So it plugs directly into the `engine/physics.js` helpers (gravity, integrate, AABB) when
movement and collisions are added in Module 2.

---

**Result:** Module 1 complete - the world is built, the character is in it, and the
foundation is ready for movement.

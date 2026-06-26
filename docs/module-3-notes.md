# Module 3 — Challenge and Reward (lesson notes)

Concept tasks captured as notes tied to the code, same as Modules 1 and 2.

---

## Rewards and Motivation (+10 XP)

A world you can move through is a toy; a world that *rewards* you is a game. Collectibles are
the simplest reward loop there is:

- **The loop:** see a coin → want it → move/jump to reach it → get it (feedback) → look for
  the next one. That tiny see-want-get cycle is the engine of engagement; everything else in
  the module raises its stakes.
- **Rewards guide the eye.** A coin floating over a gap is a *suggestion*: "the path goes
  here, the jump is worth it." We placed coins along the natural climbing route, so collecting
  doubles as a breadcrumb trail through the level.
- **Optional, not mandatory.** Coins don't block progress — they're a self-set goal. That's
  what makes them feel like a reward and not a chore: the player chooses to chase them.
- **Feedback closes the loop.** Right now the reward is the score ticking up (`Coins n /
  total`). Module 4's "juice" upgrades this with a sound, a pop, and particles — the same
  event, made satisfying.
- **Counting toward something.** Showing `n / total` reframes loose coins as a *completion
  goal*. Even without a prize for 100%, the denominator creates a quiet pull to finish.

**How it maps to our code:** coins are level data (`levels/level1.js` `collectibles`), built
into `Collectible` entities by `WorldScene`. Collection is an AABB overlap test
(`engine/physics.js` `aabbOverlap`) that flips `collected` and bumps `score`; the count is
drawn by `WorldScene.drawScore`. Tunables (size, bob) live in `config.coin`.

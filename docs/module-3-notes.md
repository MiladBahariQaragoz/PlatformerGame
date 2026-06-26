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

---

## Enemies and Obstacles (+10 XP)

If coins are the carrot, enemies are the stick — they turn a stroll into a *decision*:

- **An enemy is a moving "no".** A coin says "come here"; an enemy says "not like that." The
  tension between the two is where platforming lives: the coin you want is guarded by the
  thing you must avoid or defeat.
- **Readable behaviour beats clever AI.** Our walker just paces back and forth between
  bounds. Predictable patterns are a *feature*: the player learns the rhythm and times their
  move. Randomness here would feel unfair, not challenging.
- **Reuse the physics.** The enemy is the same kind of body as the player — `{x,y,w,h,vx,vy}`
  through `moveAndCollide` — so it falls, lands, and bumps walls for free. New behaviour, no
  new physics. (This is the "engine vs. game" split paying off.)
- **Give the player an answer.** An obstacle with no counter is just punishment. The stomp —
  land on top to defeat it, and rebound — turns the enemy into an *opportunity*: a stepping
  stone, a risk you can choose to take for the coin behind it.
- **Direction matters.** Hitting an enemy from the side is bad; from above is good. That one
  rule (compare the player's falling velocity and feet position to the enemy's top) creates
  the whole stomp mechanic — and teaches the player to commit to the jump.

**How it maps to our code:** `entities/Enemy.js` holds the patrol + turn logic and reuses
`moveAndCollide`; enemies are level data (`enemies`). `WorldScene.update` does the
above-vs-side check: from above → `defeated` + bounce (`config.enemy.stompBounce`); otherwise
`respawnPlayer()`. Tunables live in `config.enemy`.

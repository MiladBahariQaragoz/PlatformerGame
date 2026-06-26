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

---

## Difficulty and Fairness (+10 XP)

Difficulty is easy to add and easy to get wrong. The goal isn't *hard* — it's *fair-but-hard*,
the feeling that a death was your fault and the next try is winnable:

- **Telegraph every threat.** Spikes look sharp and red; enemies pace in plain sight. The
  player should always *see* the danger before it costs them. A hazard you couldn't have
  known about isn't difficulty, it's a gotcha.
- **Reachable by construction.** Hazards sit in open ground with the jump arc (~107px) far
  exceeding their height — so every spike strip is clearable, and every guarded coin is
  gettable. We tune obstacles against the player's *known* abilities, not arbitrarily.
- **Consistent rules.** Touch a spike → reset. Land on an enemy → win. Touch it from the side
  → reset. The rules never change, so the player can *learn* them. Consistency is the bedrock
  of fairness.
- **Short retry loop.** A mistake sends you back to spawn, not to a "you lose" wall. Cheap,
  fast retries keep frustration low and mastery in reach — the player stays in the "one more
  go" zone.
- **Difficulty curve.** Threats are spread along the level, lightest near the start, so the
  player builds skill before the harder mixes (an enemy *on* a platform near coins) show up.
  Pacing the challenge matters as much as the challenge itself.
- **Risk should be opt-in where possible.** The enemy guarding the coin cluster is a *choice*:
  skip it safely, or take the risk for the reward. Player-chosen difficulty feels fair because
  the player set the terms.

**How it maps to our code:** fairness is mostly a *data* property — `levels/level1.js` places
hazards/enemies in clearable spots, tuned against `config.player` (speed, jump) and
`config.gravity`. The consistent, instant reset is `WorldScene.respawnPlayer()`; the
predictable enemy is `Enemy`'s fixed patrol. Nothing here is random.

---

## Stakes and Consequence (+10 XP)

A challenge only matters if failing it *costs* something. Lives turn "oops, reset" into
"careful — you only get three":

- **Consequence makes skill meaningful.** Before lives, a spike was a minor inconvenience.
  With a finite life count, every avoidable hit is a real loss, so playing well actually
  pays off. Stakes are what convert *movement* into *mastery*.
- **A resource to manage.** Lives are a budget. The player now weighs "is that guarded coin
  worth risking a life?" — the same risk/reward calculus that makes the whole loop tick. A
  reward (coin) and a stake (life) are two sides of one decision.
- **Fail states need a floor.** Infinite retries have no tension; instant total failure is
  cruel. Three lives is the middle path: mistakes are survivable, but not free. The number
  lives in `config.lives.start`, so the whole difficulty can be dialed from one place.
- **Show the stake, always.** The heart HUD keeps the cost visible. A resource the player
  can't see can't be managed — feedback is what makes the stake *felt* rather than just
  enforced.
- **One damage path, many sources.** Enemies and spikes both funnel through a single
  `hitPlayer()`. Centralizing "what happens when you get hurt" means the next hazard type
  (or a future shield power-up) plugs into one well-tested place, not five.
- **Game over is a soft wall, for now.** At zero lives the world freezes and announces the
  end. The *retry* — turning that wall back into a fresh attempt — is its own Module 4 task
  (Game Over and Retry); here we just establish the consequence.

**How it maps to our code:** `WorldScene` holds `lives` and `gameOver`. Every hit calls
`hitPlayer()`, which decrements and either `respawnPlayer()`s or trips `gameOver`; `update`
bails immediately while `gameOver` is set. `drawLives` shows the hearts and `drawGameOver`
the end screen. The starting count is `config.lives.start`.

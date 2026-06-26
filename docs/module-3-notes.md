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

---

## Goals and Completion (+10 XP)

Until now the level had no *end* — you could run right forever. A goal turns a space into a
*journey* with a destination, and gives all the challenge a point:

- **A goal gives direction.** The flag answers "where am I going?" Every coin, enemy, and
  spike between spawn and flag becomes part of a route *toward something*, not just scenery to
  wander past. Challenge without a finish line is just an obstacle course with no door.
- **Win states balance fail states.** Module 3 added the ways to lose (hazards, enemies,
  zero lives); the exit adds the way to *win*. A game needs both — a fail state with no win
  state is a punishment, not a game.
- **Completion is a feedback moment.** Touching the flag freezes the world and celebrates
  ("LEVEL COMPLETE") with the coin tally — the same loop-closing payoff as collecting a coin,
  scaled up to the whole level. The journey gets an ending, and the ending acknowledges how
  you played.
- **The flag is a promise kept.** It's been visible (placed in level data on the final
  lookout) as a far-off marker the camera reveals as you progress. Seeing the goal ahead and
  finally reaching it is the level's whole arc in one object.
- **Same pattern, new meaning.** Mechanically the exit is *just another AABB overlap* — the
  same primitive as coins, enemies, and spikes. One simple idea (do two boxes touch?) powers
  collect, hurt, and win. That economy of concepts is the engine staying small while the game
  grows.
- **Symmetric end screens.** Win and lose share a structure (freeze + dim overlay + message),
  so they feel like two outcomes of one system. Module 4 will make either one *replayable*.

**How it maps to our code:** `entities/Exit.js` is the flag (an AABB + render); it's level
data (`level.exit`). `WorldScene.update` step 9 flips `levelComplete` on overlap and the
`update` guard then freezes the world; `drawLevelComplete` shows the win overlay. It mirrors
the game-over path exactly — two ends of the same machine.

---

## Challenge Recap (+10 XP)

What Module 3 turned the movement playground into — a game with reasons to play:

| We built | Where it lives |
| --- | --- |
| Collectible coins + score | `entities/Collectible.js`, `WorldScene.drawScore` |
| Patrolling enemies + stomp | `entities/Enemy.js`, `WorldScene` (above-vs-side) |
| Spike hazards | `entities/Hazard.js` |
| Lives + game over | `WorldScene` (`hitPlayer`, `drawLives`, `drawGameOver`) |
| Level exit + win screen | `entities/Exit.js`, `WorldScene.drawLevelComplete` |
| All of it as level data | `levels/level1.js` (`collectibles`, `enemies`, `hazards`, `exit`) |

**Principles we locked in:**

- **One primitive, many mechanics.** Collect, hurt, and win are all *the same AABB overlap*
  (`aabbOverlap`). New gameplay came from new *meaning* on a shared test, not new physics.
- **Reward and stake are one decision.** Coins pull the player toward risk; lives make that
  risk cost something. The see-want-get loop and the risk/reward weigh-up are the engine of
  engagement.
- **Fair-but-hard.** Threats are telegraphed, reachable by construction, governed by
  consistent rules, and backed by a short retry loop. Difficulty is mostly a *data* property.
- **One damage path.** Every way to get hurt funnels through `hitPlayer()`, so consequence is
  defined once and the next hazard plugs straight in.
- **Symmetric ends.** Win and lose share one structure (freeze + overlay + message) — two
  outcomes of the same small machine.
- **Still data-driven, still additive.** Every new mechanic arrived as a new entity + level
  data; the engine (`physics`, `camera`, `game`) never had to change.

**State of the game:** a real platformer loop — explore a scrolling level, gather coins,
dodge or stomp enemies, avoid spikes, manage three lives, and reach the flag to win (or run
out of lives and lose). Module 4 adds the polish: juice, sound, menus, and an in-game retry
that makes both endings replayable.

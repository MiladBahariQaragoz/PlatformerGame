# Module Quiz 3 — Challenge and Reward

Self-check covering Module 3. Answers below each question.

---

**1. What is the "see-want-get" loop, and why do collectibles use it?**
See a coin → want it → move/jump to get it → feedback (score ticks up) → look for the next.
That tiny cycle is the core of engagement; coins are the simplest way to start it, and their
placement doubles as a breadcrumb trail guiding the player along the level's path.

**2. One primitive powers collecting a coin, getting hurt by an enemy/spike, and reaching the
exit. What is it?**
AABB overlap (`engine/physics.js` `aabbOverlap` — do two boxes touch?). Each mechanic is the
same test with different *meaning*, so new gameplay needs no new physics.

**3. How does the stomp distinguish "defeat the enemy" from "take damage"?**
Direction. If the player is falling (`vy > 0`) and their feet are within the top of the enemy
(`p.y + p.h - e.y < e.h * 0.6`), it's a stomp from above → enemy `defeated` + rebound bounce.
Any other contact → `hitPlayer()`.

**4. Why are the enemy's patrol and the spikes' placement deliberately predictable and
clearable?**
Fairness. Telegraphed, consistent, reachable-by-construction threats (the ~107px jump clears
every spike strip) mean a death feels like the player's fault and the retry feels winnable —
fair-but-hard, not a gotcha. Difficulty is mostly a data property.

**5. What do lives add that a plain respawn didn't?**
Stakes. A finite budget makes every avoidable hit a real cost, turning movement into mastery
and framing each guarded coin as a risk/reward decision. The count lives in
`config.lives.start`.

**6. Every way to get hurt routes through one method. Which, and why does that matter?**
`WorldScene.hitPlayer()`. Centralizing damage means the consequence (decrement, respawn, or
game over) is defined once, so the next hazard type plugs into one well-tested place.

**7. How are the game-over and level-complete screens related?**
They're symmetric: both freeze the world (the `update` guard) and draw a dim overlay with a
message — two outcomes of the same small machine (`drawGameOver` / `drawLevelComplete`).

**8. Where do all the Module 3 mechanics get their content, and why does that matter?**
From level data in `levels/level1.js` (`collectibles`, `enemies`, `hazards`, `exit`). Keeping
content as data means new levels need new data, not new code — the engine never changed.

---

**Result:** Module 3 complete — the world is now a *game*: gather coins, dodge or stomp
enemies, avoid spikes, manage three lives, and reach the flag to win. Module 4 adds the
polish — juice, sound, menus, and a replayable retry.

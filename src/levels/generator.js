// Procedural platform generator for the endless run. It produces one platform at a time,
// each placed within the player's jump reach of the previous one, then sprinkles coins,
// enemies, and spikes onto it. Reachability is derived from the actual jump physics, so every
// generated jump is fair by construction (no magic distances).
//
// Coordinates: top-left origin, +y down. A platform is { x, y, w, h }; items are plain data
// the scene turns into entities.

import { CONFIG } from '../config.js';

const VJ = CONFIG.player.jumpSpeed; // initial jump velocity (px/s)
const G = CONFIG.gravity; // gravity (px/s^2)
const SPEED = CONFIG.player.speed; // horizontal run speed (px/s)

const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const chance = (p) => Math.random() < p;

// Max horizontal distance the player can cover when the landing platform's top is `rise`
// pixels higher than the launch point (negative `rise` = lower). Uses the projectile arc:
// taking up as positive, height(t) = VJ·t − ½·G·t², and landing happens on the descent.
function maxJumpGap(rise) {
  const disc = VJ * VJ - 2 * G * rise;
  if (disc <= 0) return 0; // that height is simply out of reach
  const t = (VJ + Math.sqrt(disc)) / G; // descending root: time back down to `rise`
  return SPEED * t;
}

export class LevelGenerator {
  constructor() {
    this.last = null; // most recently produced platform
    this.count = 0; // platforms produced so far
    this.coinWindow = -1; // which coinPeriod-sized window we've scheduled a coin for
    this.coinTarget = -1; // platform index (count) that gets the coin in the current window
  }

  get lavaY() {
    return CONFIG.height - CONFIG.lava.height;
  }

  get maxTopY() {
    return this.lavaY - CONFIG.endless.clearanceAboveLava;
  }

  // The starting platform: wide, low, and threat-free for a soft start.
  start() {
    const plat = {
      x: 0,
      y: Math.min(this.maxTopY, 320),
      w: 230,
      h: CONFIG.endless.thickness,
    };
    this.last = plat;
    this.count = 1;
    return plat;
  }

  // Produce the next platform plus its items.
  // Returns { platform, coins: [...], enemies: [...], hazards: [...] }.
  next() {
    const e = CONFIG.endless;
    const prev = this.last;

    // 1. Pick the new top within the band, then within the band again after clamping so the
    //    reach calc below uses the *actual* rise.
    let top = prev.y - rand(-e.maxDrop, e.maxRise); // smaller y = higher
    top = Math.max(e.minTopY, Math.min(this.maxTopY, top));
    const rise = prev.y - top; // + = the new platform is higher

    // 2. Gap, capped to a safe fraction of what's physically reachable for that rise.
    const reach = maxJumpGap(rise) * e.gapSafety;
    const gap = rand(e.minGap, Math.max(e.minGap, Math.min(e.maxGap, reach)));

    // 3. Width: a short or a long platform.
    const [wlo, whi] = chance(e.longChance) ? e.longWidth : e.shortWidth;
    const w = rand(wlo, whi);

    const platform = { x: prev.x + prev.w + gap, y: top, w, h: e.thickness };
    this.last = platform;
    this.count += 1;

    const out = { platform, coins: [], enemies: [], hazards: [] };
    const safe = this.count <= e.safeStart;

    // 4. Coins: exactly one per `coinPeriod` platforms, placed on a random platform within
    //    each window. Sparse on purpose - coins are a time refill, so the clock still trends
    //    down between them and the run stays a race.
    const period = e.coinPeriod;
    const win = Math.floor((this.count - 1) / period);
    if (win !== this.coinWindow) {
      this.coinWindow = win;
      const lo = Math.max(win * period + 1, e.safeStart + 1);
      const hi = win * period + period;
      this.coinTarget = lo > hi ? -1 : randInt(lo, hi);
    }
    if (this.count === this.coinTarget) {
      out.coins.push({ x: platform.x + w / 2, y: top - 30 }); // center point
    }
    const hasCoin = out.coins.length > 0;

    // 5. A threat on wide-enough platforms (so there's always room to land): an enemy, or a
    //    spike strip, or nothing. A platform carrying corn never also gets a spike strip - corn
    //    must never sit on a hazard - so the kernel always stays safe to grab. (An enemy is
    //    still allowed: it's avoidable/stompable and the corn floats clear above it.)
    if (!safe && w >= 120) {
      const roll = Math.random();
      if (roll < e.enemyChance) {
        out.enemies.push({
          x: platform.x + w / 2 - CONFIG.enemy.width / 2,
          y: top - CONFIG.enemy.height,
          dir: chance(0.5) ? 1 : -1,
          minX: platform.x + 4,
          maxX: platform.x + w - 4,
        });
      } else if (!hasCoin && roll < e.enemyChance + e.hazardChance) {
        const hw = Math.min(w * 0.45, 56);
        out.hazards.push({ x: platform.x + (w - hw) / 2, y: top - 16, w: hw, h: 16 });
      }
    }

    return out;
  }
}

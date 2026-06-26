// The main game world. Module 1 grows this scene task by task: it starts as a sky and
// a patch of ground, then gains a path, a character, decorations, and mood/atmosphere.

import { CONFIG } from '../config.js';
import { level1 } from '../levels/level1.js';
import { Player } from '../entities/Player.js';
import { Collectible } from '../entities/Collectible.js';
import { Enemy } from '../entities/Enemy.js';
import { Hazard } from '../entities/Hazard.js';
import { moveAndCollide, aabbOverlap } from '../engine/physics.js';
import { Camera } from '../engine/camera.js';

export class WorldScene {
  constructor(level = level1) {
    this.level = level;
    this.player = new Player(level.spawn.x, level.spawn.y);
    this.camera = new Camera(CONFIG.width, level.width);
    this.elapsed = 0; // seconds since the scene started (drives the hint fade)

    // Build one coin per level entry; track how many the player has collected.
    this.collectibles = (level.collectibles ?? []).map((c) => new Collectible(c.x, c.y));
    this.score = 0;

    // Build patrolling enemies from level data.
    this.enemies = (level.enemies ?? []).map((e) => new Enemy(e.x, e.y, e));

    // Build static hazards (spike strips) from level data.
    this.hazards = (level.hazards ?? []).map((h) => new Hazard(h.x, h.y, h.w, h.h));
  }

  update(dt, input) {
    const p = this.player;
    this.elapsed += dt;

    // 1. Entity decides its movement intent from input.
    p.update(dt, input);

    // 2. Apply a queued jump only when standing on solid ground.
    if (p.jumpQueued && p.onGround) p.vy = -CONFIG.player.jumpSpeed;

    // 3. Physics step: gravity + collision resolution against the platforms.
    moveAndCollide(p, this.level.platforms, dt);

    // 4. Keep the player inside the level's horizontal bounds.
    const maxX = this.level.width - p.w;
    if (p.x < 0) p.x = 0;
    if (p.x > maxX) p.x = maxX;

    // 5. Camera tracks the player across the wider level.
    this.camera.follow(p);

    // 6. Coins: animate, then collect any the player is overlapping this step.
    for (const c of this.collectibles) {
      if (c.collected) continue;
      c.update(dt);
      if (aabbOverlap(p, c)) {
        c.collected = true;
        this.score += 1;
      }
    }

    // 7. Enemies: patrol, then resolve contact. Landing on top defeats one (and bounces
    //    the player); any other contact sends the player back to the spawn point.
    for (const e of this.enemies) {
      e.update(dt, this.level.platforms);
      if (e.defeated || !aabbOverlap(p, e)) continue;
      const fromAbove = p.vy > 0 && p.y + p.h - e.y < e.h * 0.6;
      if (fromAbove) {
        e.defeated = true;
        p.vy = -CONFIG.player.jumpSpeed * CONFIG.enemy.stompBounce;
      } else {
        this.respawnPlayer();
      }
    }

    // 8. Hazards: touching any spike strip sends the player back to spawn.
    for (const h of this.hazards) {
      if (aabbOverlap(p, h)) {
        this.respawnPlayer();
        break;
      }
    }
  }

  // Send the player back to the level's spawn point with zeroed motion.
  respawnPlayer() {
    const s = this.level.spawn;
    const p = this.player;
    p.x = s.x;
    p.y = s.y;
    p.vx = 0;
    p.vy = 0;
    p.onGround = false;
  }

  render(ctx) {
    const { width, height, colors } = CONFIG;
    const deco = this.level.decorations;

    // Sky: a vertical gradient sets the time-of-day mood.
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, colors.skyTop);
    sky.addColorStop(1, colors.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Sun stays fixed in the sky (screen space), independent of scrolling.
    this.drawSun(ctx, width - 120, 90, 34);

    // Everything below scrolls with the camera: shift the world left by camera.x.
    ctx.save();
    ctx.translate(-Math.round(this.camera.x), 0);

    // Background scenery: clouds drift behind everything.
    if (deco) for (const c of deco.clouds) this.drawCloud(ctx, c);

    // The path: every solid platform in the level, drawn as soil with a grassy cap.
    for (const p of this.level.platforms) {
      ctx.fillStyle = colors.platform;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = colors.platformTop;
      ctx.fillRect(p.x, p.y, p.w, Math.min(10, p.h));
    }

    // Foreground scenery: bushes sit on the ground.
    if (deco) for (const b of deco.bushes) this.drawBush(ctx, b);

    // Coins, drawn on the world (skip ones already collected).
    for (const c of this.collectibles) if (!c.collected) c.render(ctx);

    // Hazards (spike strips) and enemies, drawn on the world.
    for (const h of this.hazards) h.render(ctx);
    for (const e of this.enemies) e.render(ctx);

    // The character, drawn on top of the world.
    this.player.render(ctx);

    ctx.restore();

    // HUD (screen space): coin score, then control hints that fade out after a few seconds.
    this.drawScore(ctx);
    this.drawHints(ctx);
  }

  // Coin counter, pinned to the top-right (clear of the top-left control hints).
  drawScore(ctx) {
    if (this.collectibles.length === 0) return;
    ctx.save();
    ctx.fillStyle = CONFIG.colors.text;
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Coins  ${this.score} / ${this.collectibles.length}`, CONFIG.width - 16, 28);
    ctx.restore();
  }

  // Control hints, fully visible for ~5s then fading out over ~3s.
  drawHints(ctx) {
    const fadeStart = 5;
    const fadeEnd = 8;
    let alpha = 1;
    if (this.elapsed > fadeStart) {
      alpha = 1 - (this.elapsed - fadeStart) / (fadeEnd - fadeStart);
    }
    if (alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = CONFIG.colors.text;
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Move:  ← →  or  A D', 16, 28);
    ctx.fillText('Jump:  Space  /  ↑  /  W', 16, 48);
    ctx.restore();
  }

  // The sun: a soft glow halo around a bright disc.
  drawSun(ctx, x, y, r) {
    ctx.fillStyle = CONFIG.colors.sunGlow;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CONFIG.colors.sun;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // A cloud is three overlapping puffs; `scale` varies its size.
  drawCloud(ctx, { x, y, scale = 1 }) {
    const r = 18 * scale;
    ctx.fillStyle = CONFIG.colors.cloud;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r, y + r * 0.2, r * 0.85, 0, Math.PI * 2);
    ctx.arc(x - r, y + r * 0.2, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  // A bush is a row of green humps anchored at ground level (y = its base).
  drawBush(ctx, { x, y, scale = 1 }) {
    const r = 14 * scale;
    ctx.fillStyle = CONFIG.colors.bush;
    ctx.beginPath();
    ctx.arc(x, y - r, r, Math.PI, Math.PI * 2);
    ctx.arc(x + r, y - r * 0.8, r * 0.85, Math.PI, Math.PI * 2);
    ctx.arc(x - r, y - r * 0.8, r * 0.85, Math.PI, Math.PI * 2);
    ctx.fillRect(x - r * 2, y - r * 0.8, r * 4, r * 0.8);
    ctx.fill();
  }
}

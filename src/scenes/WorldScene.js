// The main game world. Module 1 grows this scene task by task: it starts as a sky and
// a patch of ground, then gains a path, a character, decorations, and mood/atmosphere.

import { CONFIG } from '../config.js';
import { level1 } from '../levels/level1.js';
import { Player } from '../entities/Player.js';

export class WorldScene {
  constructor(level = level1) {
    this.level = level;
    this.player = new Player(level.spawn.x, level.spawn.y);
  }

  update(dt, input) {
    // Entities update themselves; movement logic arrives in Module 2.
    this.player.update(dt, input);
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

    // Sun with a soft glow, high in the sky.
    this.drawSun(ctx, width - 120, 90, 34);

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

    // The character, drawn on top of the world.
    this.player.render(ctx);
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

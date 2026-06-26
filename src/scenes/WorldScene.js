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

    // Sky
    ctx.fillStyle = colors.sky;
    ctx.fillRect(0, 0, width, height);

    // The path: every solid platform in the level, drawn as soil with a grassy cap.
    for (const p of this.level.platforms) {
      ctx.fillStyle = colors.platform;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = colors.platformTop;
      ctx.fillRect(p.x, p.y, p.w, Math.min(10, p.h));
    }

    // The character, drawn on top of the world.
    this.player.render(ctx);
  }
}

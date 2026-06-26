// A patrolling ground enemy ("walker"). A body { x, y, w, h, vx, vy } so it reuses the
// engine's gravity + collision (moveAndCollide). It walks back and forth, turning at walls
// or at optional patrol bounds, and can be stomped from above - the scene flips `defeated`.
//
// Built from level data: { x, y, dir?, minX?, maxX? } (data-driven, no new code per enemy).

import { CONFIG } from '../config.js';
import { moveAndCollide } from '../engine/physics.js';

export class Enemy {
  constructor(x, y, opts = {}) {
    this.w = CONFIG.enemy.width;
    this.h = CONFIG.enemy.height;
    this.x = x;
    this.y = y;
    this.vx = (opts.dir ?? -1) * CONFIG.enemy.speed;
    this.vy = 0;
    this.onGround = false;
    this.defeated = false;
    // World-x extents the enemy turns around at (defaults: roam until it hits a wall).
    this.minX = opts.minX ?? -Infinity;
    this.maxX = opts.maxX ?? Infinity;
  }

  facing() {
    return this.vx < 0 ? -1 : 1;
  }

  update(dt, platforms) {
    if (this.defeated) return; // stays put as a flattened husk

    // Turn around at the patrol bounds before moving.
    if (this.vx < 0 && this.x <= this.minX) this.vx = CONFIG.enemy.speed;
    else if (this.vx > 0 && this.x + this.w >= this.maxX) this.vx = -CONFIG.enemy.speed;

    // Physics step. A wall zeroes vx (axis-separated collision) - reverse if so.
    const dir = this.vx > 0 ? 1 : -1;
    moveAndCollide(this, platforms, dt);
    if (this.vx === 0) this.vx = -dir * CONFIG.enemy.speed;
  }

  render(ctx) {
    const c = CONFIG.colors;
    let { x, y, w, h } = this;

    if (this.defeated) {
      // Squashed flat onto the surface it was standing on.
      const flat = h * 0.3;
      y = y + h - flat;
      h = flat;
      ctx.fillStyle = c.enemyDefeated;
      ctx.fillRect(x, y, w, h);
      return;
    }

    ctx.fillStyle = c.enemy;
    ctx.fillRect(x, y, w, h);

    // Eyes look the way it's walking, so the threat reads at a glance.
    const eye = 4;
    const ey = y + 8;
    const lean = this.facing() * 2;
    ctx.fillStyle = c.enemyEye;
    ctx.fillRect(x + 5 + lean, ey, eye, eye);
    ctx.fillRect(x + w - 5 - eye + lean, ey, eye, eye);
  }
}

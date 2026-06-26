// Game-agnostic particle system for visual feedback ("juice"). Particles are tiny, short-
// lived colored squares that burst from a point, fall under gravity, and fade out. The scene
// owns an instance and calls burst() on events (coin, stomp, hit); update()/render() each step.
//
// A particle is { x, y, vx, vy, life, maxLife, size, color }. Kept deliberately simple.

import { CONFIG } from '../config.js';

export class Particles {
  constructor() {
    this.items = [];
  }

  // Spawn a burst of `count` particles spraying outward from (x, y) in `color`.
  burst(x, y, color, count = CONFIG.particles.burstCount) {
    const cfg = CONFIG.particles;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = cfg.speed * (0.4 + Math.random() * 0.6);
      const life = cfg.life * (0.6 + Math.random() * 0.4);
      this.items.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - cfg.speed * 0.3, // bias the spray upward
        life,
        maxLife: life,
        size: cfg.size * (0.6 + Math.random() * 0.8),
        color,
      });
    }
  }

  update(dt) {
    const g = CONFIG.particles.gravity;
    for (const p of this.items) {
      p.vy += g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    if (this.items.length) this.items = this.items.filter((p) => p.life > 0);
  }

  render(ctx) {
    for (const p of this.items) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
}

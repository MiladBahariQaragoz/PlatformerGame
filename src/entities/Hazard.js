// A static hazard (spike strip). An AABB { x, y, w, h } the player must avoid - touching it
// sends them back to spawn (and, once the lives system exists, costs a life). Drawn as a row
// of spikes spanning the box. Built from level data (data-driven, no new code per hazard).

import { CONFIG } from '../config.js';

export class Hazard {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  render(ctx) {
    const c = CONFIG.colors;
    // Fit a whole number of spikes across the strip's width.
    const count = Math.max(1, Math.round(this.w / CONFIG.hazard.spikeWidth));
    const sw = this.w / count;
    const baseY = this.y + this.h;

    for (let i = 0; i < count; i++) {
      const x = this.x + i * sw;
      ctx.fillStyle = c.hazard;
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x + sw / 2, this.y);
      ctx.lineTo(x + sw, baseY);
      ctx.closePath();
      ctx.fill();
      // A lighter edge on the left face catches the light.
      ctx.fillStyle = c.hazardEdge;
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x + sw / 2, this.y);
      ctx.lineTo(x + sw / 2, baseY);
      ctx.closePath();
      ctx.fill();
    }
  }
}

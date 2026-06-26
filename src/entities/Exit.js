// The level exit - a goal flag. An AABB { x, y, w, h }; reaching it (overlap with the
// player) completes the level. Drawn as a pole with a pennant that turns gold once reached.
// Built from level data (`level.exit`).

import { CONFIG } from '../config.js';

export class Exit {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.reached = false;
  }

  render(ctx) {
    const c = CONFIG.colors;
    const poleW = 4;
    const px = this.x + this.w / 2 - poleW / 2;

    // Pole.
    ctx.fillStyle = c.exitPole;
    ctx.fillRect(px, this.y, poleW, this.h);

    // Pennant near the top, pointing back across the level so it reads as a goal.
    ctx.fillStyle = this.reached ? c.exitFlagReached : c.exitFlag;
    const fy = this.y + 6;
    const fh = 18;
    ctx.beginPath();
    ctx.moveTo(px, fy);
    ctx.lineTo(px - 26, fy + fh / 2);
    ctx.lineTo(px, fy + fh);
    ctx.closePath();
    ctx.fill();

    // A small knob caps the pole.
    ctx.fillStyle = c.exitFlagReached;
    ctx.beginPath();
    ctx.arc(px + poleW / 2, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// The pursuer. A floating menace that trails the player and closes the gap as the race clock
// runs down — far back when there's plenty of time, right on the player's heels when it's
// nearly up, and catching them the moment time hits zero. It floats (ignoring platforms and
// gravity) so it can always track the player no matter the terrain.
//
// A body { x, y, w, h } so it plugs into engine/physics `aabbOverlap`. Its position is driven
// by the scene each step via update(); it does no physics of its own.

import { CONFIG } from '../config.js';
import { getImage, imageReady, drawImageCircle } from '../engine/assets.js';

export class Chaser {
  constructor(x, y) {
    this.w = CONFIG.chaser.width;
    this.h = CONFIG.chaser.height;
    this.x = x;
    this.y = y;
    this.phase = Math.random() * Math.PI * 2; // desync the float bob
    this.faceImg = getImage(CONFIG.chaser.face.src);
  }

  // Ease toward a spot `gap` pixels behind the player, where the gap shrinks with the time left.
  // `timeFraction` is 0..1 (1 = lots of time → far back, 0 = out of time → on top of the player).
  update(dt, player, timeFraction) {
    const c = CONFIG.chaser;
    const gap = c.minGap + (c.maxGap - c.minGap) * timeFraction;
    const targetX = player.x + player.w / 2 - this.w / 2 - gap;
    const targetY = player.y + player.h / 2 - this.h / 2;
    // Critically-damped-ish smoothing, frame-rate independent.
    const k = Math.min(1, c.ease * dt);
    this.x += (targetX - this.x) * k;
    this.y += (targetY - this.y) * k;
    this.phase += c.bobSpeed * dt;
  }

  render(ctx) {
    const c = CONFIG.colors;
    const bob = Math.sin(this.phase) * CONFIG.chaser.bobAmount;
    const x = this.x;
    const y = this.y + bob;
    const cx = x + this.w / 2;

    // A soft glow halo so it reads as something otherworldly closing in.
    ctx.fillStyle = c.chaserGlow;
    ctx.beginPath();
    ctx.arc(cx, y + this.h / 2, this.w * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Ghostly body: a rounded head over a tattered, wavy hem.
    const r = this.w / 2;
    const hemY = y + this.h - r * 0.6;
    ctx.fillStyle = c.chaserBody;
    ctx.beginPath();
    ctx.arc(cx, y + r, r, Math.PI, 0); // domed top
    ctx.lineTo(x + this.w, hemY);
    // Three tatters along the bottom edge.
    const tatters = 3;
    const tw = this.w / tatters;
    for (let i = 0; i < tatters; i++) {
      const tx = x + this.w - i * tw;
      ctx.quadraticCurveTo(tx - tw * 0.25, hemY + 8, tx - tw * 0.5, hemY);
      ctx.quadraticCurveTo(tx - tw * 0.75, hemY - 8, tx - tw, hemY);
    }
    ctx.lineTo(x, y + r);
    ctx.closePath();
    ctx.fill();

    // Face: the chaser's picture if it has loaded, otherwise two burning eyes.
    const f = CONFIG.chaser.face;
    if (imageReady(this.faceImg)) {
      drawImageCircle(ctx, this.faceImg, cx, y + r + f.offsetY, f.size);
    } else {
      const eye = 6;
      const ey = y + r - 2;
      ctx.fillStyle = c.chaserEye;
      ctx.fillRect(cx - eye - 4, ey, eye, eye);
      ctx.fillRect(cx + 4, ey, eye, eye);
    }
  }
}

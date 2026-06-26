// A collectible coin. Levels describe coins as center points {x, y}; the scene builds one
// instance per entry (data-driven, so new coins need no new code). Bobs gently while in
// play and is marked `collected` once the player touches it, after which the scene skips it.
//
// Stored as an AABB { x, y, w, h } so it plugs straight into engine/physics `aabbOverlap`.

import { CONFIG } from '../config.js';

export class Collectible {
  constructor(cx, cy) {
    const r = CONFIG.coin.radius;
    // The center point from level data becomes the box's top-left corner.
    this.w = r * 2;
    this.h = r * 2;
    this.x = cx - r;
    this.y = cy - r;
    this.collected = false;
    this.phase = Math.random() * Math.PI * 2; // desync bobbing between coins
  }

  // Advance the bob animation. Collision uses the static box, so this is render-only.
  update(dt) {
    this.phase += CONFIG.coin.bobSpeed * dt;
  }

  render(ctx) {
    const r = CONFIG.coin.radius;
    const c = CONFIG.colors;
    const bob = Math.sin(this.phase) * CONFIG.coin.bobAmount;
    const cx = this.x + r;
    const cy = this.y + r + bob;

    // A corn kernel: pointed at the top, rounded at the bottom, with a dark hull, a golden
    // face, a pale tip, and a small highlight. Drawn from the centre with quadratic curves.
    ctx.fillStyle = c.cornEdge;
    kernelPath(ctx, cx, cy, r);
    ctx.fill();

    ctx.fillStyle = c.corn;
    kernelPath(ctx, cx, cy + 0.3, r - 1.6);
    ctx.fill();

    // Pale tip near the pointed top.
    ctx.fillStyle = c.cornTip;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.45, r * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Highlight.
    ctx.fillStyle = c.cornShine;
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Trace a corn-kernel outline (pointed top, rounded bottom) centred at (cx, cy) with radius r.
function kernelPath(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r); // pointed top
  ctx.quadraticCurveTo(cx + r, cy - r * 0.3, cx + r * 0.85, cy + r * 0.35);
  ctx.quadraticCurveTo(cx + r * 0.6, cy + r, cx, cy + r); // rounded bottom-right
  ctx.quadraticCurveTo(cx - r * 0.6, cy + r, cx - r * 0.85, cy + r * 0.35);
  ctx.quadraticCurveTo(cx - r, cy - r * 0.3, cx, cy - r);
  ctx.closePath();
}

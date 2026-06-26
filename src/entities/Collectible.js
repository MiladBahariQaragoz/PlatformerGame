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

    // Darker rim, bright face, and a small highlight read as a metallic coin.
    ctx.fillStyle = c.coinEdge;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = c.coin;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = c.coinShine;
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}

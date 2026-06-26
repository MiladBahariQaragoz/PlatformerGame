// The player character. For now it's a body that spawns and draws itself; movement,
// jumping, and collision are added in Module 2 (Move and Jump).
//
// A body is { x, y, w, h, vx, vy } so it plugs straight into engine/physics helpers.

import { CONFIG } from '../config.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = CONFIG.player.width;
    this.h = CONFIG.player.height;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1; // 1 = right, -1 = left (used once movement exists)
  }

  // Reads input and sets movement intent (velocity). The scene applies the physics
  // step (integration, bounds, and — from "Add Jumping" on — gravity and collision).
  update(_dt, input) {
    const left = input.isDown('ArrowLeft') || input.isDown('KeyA');
    const right = input.isDown('ArrowRight') || input.isDown('KeyD');
    const dir = (right ? 1 : 0) - (left ? 1 : 0);

    this.vx = dir * CONFIG.player.speed;
    if (dir !== 0) this.facing = dir;
  }

  render(ctx) {
    const { player, playerEye } = CONFIG.colors;

    // Body
    ctx.fillStyle = player;
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // A single eye so the character has a face and a clear facing direction.
    const eyeSize = 5;
    const eyeY = this.y + 10;
    const eyeX = this.facing >= 0 ? this.x + this.w - eyeSize - 5 : this.x + 5;
    ctx.fillStyle = playerEye;
    ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);
  }
}

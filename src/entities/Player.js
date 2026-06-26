// The player character. For now it's a body that spawns and draws itself; movement,
// jumping, and collision are added in Module 2 (Move and Jump).
//
// A body is { x, y, w, h, vx, vy } so it plugs straight into engine/physics helpers.

import { CONFIG } from '../config.js';
import { getImage, imageReady, drawImageCircle } from '../engine/assets.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = CONFIG.player.width;
    this.h = CONFIG.player.height;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1; // 1 = right, -1 = left
    this.onGround = false;
    this.jumpQueued = false; // set when a jump was pressed this step; scene consumes it
    this.squash = 0; // landing squash (0 = neutral, 1 = max), decays each step (juice)
    this.invincible = 0; // seconds of post-hit invincibility left; the scene sets this on a hit
    // Optional face picture (swap the file at CONFIG.player.face.src for your own).
    this.faceImg = getImage(CONFIG.player.face.src);
  }

  // Called by the scene when the player touches down, with a 0..1 impact strength.
  onLand(impact) {
    this.squash = Math.max(this.squash, impact);
  }

  // Reads input and sets movement intent (velocity). The scene applies the physics
  // step (integration, bounds, and - from "Add Jumping" on - gravity and collision).
  update(dt, input) {
    // Decay the landing squash back to neutral and tick down post-hit invincibility.
    this.squash *= Math.max(0, 1 - dt * 9);
    this.invincible = Math.max(0, this.invincible - dt);

    const left = input.isDown('ArrowLeft') || input.isDown('KeyA');
    const right = input.isDown('ArrowRight') || input.isDown('KeyD');
    const dir = (right ? 1 : 0) - (left ? 1 : 0);

    this.vx = dir * CONFIG.player.speed;
    if (dir !== 0) this.facing = dir;

    // Queue a jump on press (Space / Up / W). The scene applies it if grounded.
    this.jumpQueued =
      input.wasPressed('Space') ||
      input.wasPressed('ArrowUp') ||
      input.wasPressed('KeyW');
  }

  render(ctx) {
    const { player, playerEye } = CONFIG.colors;

    // Squash & stretch (juice): taller/thinner while airborne (scaled by vertical speed),
    // shorter/wider just after landing. Scaled around the feet so the body stays grounded.
    let sx = 1;
    let sy = 1;
    if (!this.onGround) {
      const k = Math.min(0.22, Math.abs(this.vy) / 1600);
      sx = 1 - k;
      sy = 1 + k;
    } else if (this.squash > 0.01) {
      sx = 1 + 0.3 * this.squash;
      sy = 1 - 0.3 * this.squash;
    }

    const cx = this.x + this.w / 2;
    const footY = this.y + this.h;
    ctx.save();
    // Blink while invincible (just after losing a life) so the i-frames read clearly.
    if (this.invincible > 0 && Math.floor(this.invincible * 12) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }
    ctx.translate(cx, footY);
    ctx.scale(sx, sy);
    ctx.translate(-cx, -footY);

    // Body
    ctx.fillStyle = player;
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // Face: the player's picture if it has loaded, otherwise a single eye that also shows which
    // way the character is facing.
    const f = CONFIG.player.face;
    if (imageReady(this.faceImg)) {
      const faceCx = this.x + this.w / 2;
      const faceCy = this.y + f.size / 2 + f.offsetY;
      drawImageCircle(ctx, this.faceImg, faceCx, faceCy, f.size);
    } else {
      const eyeSize = 5;
      const eyeY = this.y + 10;
      const eyeX = this.facing >= 0 ? this.x + this.w - eyeSize - 5 : this.x + 5;
      ctx.fillStyle = playerEye;
      ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);
    }

    ctx.restore();
  }
}

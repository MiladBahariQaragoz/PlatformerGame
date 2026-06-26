// A horizontal-scrolling camera. It tracks a target (the player) and exposes an `x`
// offset the scene subtracts when drawing the world, so a level wider than the viewport
// scrolls. Clamped so the view never shows past the level edges.

export class Camera {
  constructor(viewportWidth, levelWidth) {
    this.x = 0;
    this.viewportWidth = viewportWidth;
    this.levelWidth = levelWidth;
  }

  // Center the view on the target, then clamp to [0, levelWidth - viewportWidth].
  follow(target) {
    const centered = target.x + target.w / 2 - this.viewportWidth / 2;
    const maxX = Math.max(0, this.levelWidth - this.viewportWidth);
    this.x = Math.max(0, Math.min(centered, maxX));
  }
}

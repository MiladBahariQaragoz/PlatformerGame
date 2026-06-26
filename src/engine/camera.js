// A horizontal-scrolling camera. It tracks a target (the player) and exposes an `x`
// offset the scene subtracts when drawing the world, so a level wider than the viewport
// scrolls. Clamped so the view never shows past the level edges.

export class Camera {
  constructor(viewportWidth, levelWidth) {
    this.x = 0;
    this.viewportWidth = viewportWidth;
    this.levelWidth = levelWidth;
    // Screen shake (juice): a decaying random offset the scene adds when drawing the world.
    this.shakeMag = 0;
    this.shakeTime = 0;
    this.shakeDuration = 1;
    this.shakeX = 0;
    this.shakeY = 0;
  }

  // Center the view on the target, then clamp to [0, levelWidth - viewportWidth].
  follow(target) {
    const centered = target.x + target.w / 2 - this.viewportWidth / 2;
    const maxX = Math.max(0, this.levelWidth - this.viewportWidth);
    this.x = Math.max(0, Math.min(centered, maxX));
  }

  // Kick off (or strengthen) a screen shake. Strongest values win so overlapping events
  // don't cancel each other out.
  shake(magnitude, duration) {
    this.shakeMag = Math.max(this.shakeMag, magnitude);
    this.shakeTime = Math.max(this.shakeTime, duration);
    this.shakeDuration = this.shakeTime; // normalize the decay from the current peak
  }

  // Advance the shake, producing a fresh random offset whose strength decays to zero over
  // the remaining duration.
  update(dt) {
    if (this.shakeTime <= 0) {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeMag = 0;
      return;
    }
    this.shakeTime -= dt;
    const strength = this.shakeMag * Math.max(0, this.shakeTime) / this.shakeDuration;
    this.shakeX = (Math.random() * 2 - 1) * strength;
    this.shakeY = (Math.random() * 2 - 1) * strength;
  }
}

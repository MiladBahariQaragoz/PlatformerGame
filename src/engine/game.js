// Fixed-timestep game loop with single-active-scene management.
//
// A scene is any object exposing:
//   update(dt, input)  - advance logic by a fixed dt (seconds)
//   render(ctx)        - draw the current state
//
// update() runs at a fixed rate (CONFIG.fps) so physics is deterministic; render()
// runs once per animation frame. Scene switching (menu -> play -> game over) is how
// the game changes screens without global state.

import { CONFIG } from '../config.js';
import { input, initInput } from './input.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CONFIG.width;
    canvas.height = CONFIG.height;

    this.scene = null;
    this.step = 1 / CONFIG.fps;
    this.accumulator = 0;
    this.lastTime = 0;
    this.running = false;

    initInput();
  }

  // Swap the active scene. Calls enter()/exit() hooks if the scene defines them.
  setScene(scene) {
    if (this.scene && this.scene.exit) this.scene.exit();
    this.scene = scene;
    if (this.scene && this.scene.enter) this.scene.enter(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  loop(now) {
    if (!this.running) return;

    // Clamp delta so a stalled tab doesn't spiral into a flood of updates.
    let frame = (now - this.lastTime) / 1000;
    if (frame > 0.25) frame = 0.25;
    this.lastTime = now;
    this.accumulator += frame;

    while (this.accumulator >= this.step) {
      if (this.scene && this.scene.update) this.scene.update(this.step, input);
      input.endFrame();
      this.accumulator -= this.step;
    }

    if (this.scene && this.scene.render) this.scene.render(this.ctx);

    requestAnimationFrame((t) => this.loop(t));
  }
}

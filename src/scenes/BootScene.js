// Placeholder scene that proves the engine boots and the loop renders. It is NOT a
// curriculum task — the first real scene (the game world) replaces/precedes it in
// Module 1 (Set the Scene). Kept as a sanity check and a template for new scenes.

import { CONFIG } from '../config.js';

export class BootScene {
  update(_dt, _input) {
    // Nothing to simulate yet.
  }

  render(ctx) {
    ctx.fillStyle = CONFIG.colors.sky;
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    ctx.fillStyle = CONFIG.colors.text;
    ctx.font = '20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Platformer engine ready', CONFIG.width / 2, CONFIG.height / 2);
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(
      'Start with Module 1 → "Set the Scene" in plan.md',
      CONFIG.width / 2,
      CONFIG.height / 2 + 26
    );
  }
}

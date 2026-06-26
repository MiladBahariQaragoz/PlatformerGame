// The main game world. Module 1 grows this scene task by task: it starts as a sky and
// a patch of ground, then gains a path, a character, decorations, and mood/atmosphere.

import { CONFIG } from '../config.js';

export class WorldScene {
  update(_dt, _input) {
    // Nothing moves yet — movement arrives in Module 2.
  }

  render(ctx) {
    const { width, height, groundHeight, colors } = CONFIG;

    // Sky
    ctx.fillStyle = colors.sky;
    ctx.fillRect(0, 0, width, height);

    // Ground: a grassy top strip over a soil body.
    const groundY = height - groundHeight;
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, groundY, width, groundHeight);
    ctx.fillStyle = colors.groundTop;
    ctx.fillRect(0, groundY, width, 10);
  }
}

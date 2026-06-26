// The title screen. The first scene the game shows; pressing Start hands control to a fresh
// WorldScene. Scene switching goes through the engine (Game.setScene) — the `enter(game)` hook
// gives us the reference, so menus and gameplay are separate screens, not global state.

import { CONFIG } from '../config.js';
import { WorldScene } from './WorldScene.js';

const START_KEYS = ['Space', 'Enter', 'ArrowUp', 'KeyW'];

export class StartScene {
  constructor() {
    this.elapsed = 0;
  }

  enter(game) {
    this.game = game;
  }

  update(dt, input) {
    this.elapsed += dt;
    if (START_KEYS.some((k) => input.wasPressed(k))) {
      this.game.setScene(new WorldScene());
    }
  }

  render(ctx) {
    const { width, height, colors, game, groundHeight } = CONFIG;

    // Sky gradient backdrop (same mood as the world).
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, colors.skyTop);
    sky.addColorStop(1, colors.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // A sun and a strip of ground frame the title.
    ctx.fillStyle = colors.sun;
    ctx.beginPath();
    ctx.arc(width - 110, 90, 34, 0, Math.PI * 2);
    ctx.fill();

    const groundY = height - groundHeight;
    ctx.fillStyle = colors.platform;
    ctx.fillRect(0, groundY, width, groundHeight);
    ctx.fillStyle = colors.platformTop;
    ctx.fillRect(0, groundY, width, 10);

    // Title + subtitle.
    ctx.textAlign = 'center';
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 64px system-ui, sans-serif';
    ctx.fillText(game.title, width / 2, height / 2 - 30);
    ctx.font = 'italic 20px system-ui, sans-serif';
    ctx.fillText(game.subtitle, width / 2, height / 2 + 6);

    // Blinking start prompt.
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.45 * Math.sin(this.elapsed * 4);
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('Press SPACE to start', width / 2, height / 2 + 70);
    ctx.restore();

    // Quiet controls line.
    ctx.fillStyle = colors.text;
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText('Move ← →   ·   Jump Space   ·   Mute M', width / 2, groundY + 28);
  }
}

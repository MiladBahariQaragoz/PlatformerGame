// The end-of-run screen. Reached from WorldScene after the run ends — for either outcome,
// since win and lose are two results of one screen (symmetric ends). Offers retry (a fresh
// WorldScene) or a return to the title. Stats (coins gathered) are passed in by the caller.

import { CONFIG } from '../config.js';
import { WorldScene } from './WorldScene.js';
import { StartScene } from './StartScene.js';

const RETRY_KEYS = ['Space', 'Enter', 'KeyR'];

export class GameOverScene {
  constructor(result = 'lose', score = 0, total = 0) {
    this.result = result; // 'win' | 'lose'
    this.score = score;
    this.total = total;
    this.elapsed = 0;
  }

  enter(game) {
    this.game = game;
  }

  update(dt, input) {
    this.elapsed += dt;
    if (RETRY_KEYS.some((k) => input.wasPressed(k))) {
      this.game.setScene(new WorldScene());
    } else if (input.wasPressed('Escape')) {
      this.game.setScene(new StartScene());
    }
  }

  render(ctx) {
    const { width, height, colors } = CONFIG;
    const won = this.result === 'win';

    // Dark menu backdrop (we faded the world out before arriving here).
    ctx.fillStyle = colors.menuBg;
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';

    // Headline, tinted by outcome.
    ctx.fillStyle = won ? colors.exitFlagReached : colors.hazardEdge;
    ctx.font = 'bold 56px system-ui, sans-serif';
    ctx.fillText(won ? 'LEVEL COMPLETE' : 'GAME OVER', width / 2, height / 2 - 24);

    // Coin tally.
    ctx.fillStyle = colors.text;
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText(`Coins  ${this.score} / ${this.total}`, width / 2, height / 2 + 14);

    // Blinking retry prompt.
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.45 * Math.sin(this.elapsed * 4);
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('Press SPACE to play again', width / 2, height / 2 + 64);
    ctx.restore();

    ctx.fillStyle = colors.text;
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('Esc — title screen', width / 2, height / 2 + 96);
  }
}

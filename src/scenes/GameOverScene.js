// The end-of-run screen. Reached from WorldScene after the run ends — for either outcome,
// since win and lose are two results of one screen (symmetric ends). Offers retry (a fresh
// WorldScene) or a return to the title. Shows the run's score, the persisted best, and why
// the run ended; stats are passed in by the caller.

import { CONFIG } from '../config.js';
import { WorldScene } from './WorldScene.js';
import { StartScene } from './StartScene.js';

const RETRY_KEYS = ['Space', 'Enter', 'KeyR'];

export class GameOverScene {
  constructor(result = 'lose', stats = {}) {
    this.result = result; // 'win' | 'lose'
    // { score, best, isNewBest, reason, coins, distance, total } — some fields may be null.
    this.stats = stats;
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
    const cx = width / 2;

    // Headline, tinted by outcome.
    ctx.fillStyle = won ? colors.exitFlagReached : colors.hazardEdge;
    ctx.font = 'bold 52px system-ui, sans-serif';
    ctx.fillText(won ? 'LEVEL COMPLETE' : 'GAME OVER', cx, height / 2 - 70);

    // Why it ended (lose only).
    const { score = 0, best = 0, isNewBest = false, reason = null, coins = 0, distance = null } =
      this.stats;
    if (!won && reason) {
      ctx.fillStyle = colors.text;
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText(reason === 'time' ? 'Out of time!' : 'Out of lives!', cx, height / 2 - 42);
    }

    // Score — the run's distance — as the headline number.
    const unit = distance != null ? ' m' : '';
    ctx.fillStyle = colors.text;
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('SCORE', cx, height / 2 - 8);
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.fillText(`${score}${unit}`, cx, height / 2 + 34);

    // Best, plus a "new best" call-out.
    if (isNewBest) {
      ctx.fillStyle = colors.timeGain;
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText('★ NEW BEST! ★', cx, height / 2 + 62);
    } else {
      ctx.fillStyle = colors.text;
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText(`Best  ${best}${unit}`, cx, height / 2 + 62);
    }

    // Corn gathered (small).
    ctx.fillStyle = colors.corn;
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(`Corn  ${coins}`, cx, height / 2 + 86);

    // Blinking retry prompt + title hint.
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.45 * Math.sin(this.elapsed * 4);
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('Press SPACE to play again', cx, height / 2 + 120);
    ctx.restore();

    ctx.fillStyle = colors.text;
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText('Esc — title screen', cx, height / 2 + 146);
  }
}

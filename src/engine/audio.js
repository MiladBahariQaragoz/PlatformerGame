// Game-agnostic sound via the Web Audio API. Effects are *synthesized* (oscillator sweeps),
// so the game needs no audio files - it stays open-and-play with no binaries in the repo.
//
// The AudioContext is created lazily and resumed on demand: browsers block audio until a user
// gesture, and the first gameplay sound always follows a keypress, which satisfies that.

import { CONFIG } from '../config.js';

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  // Lazily create / resume the context. Returns null if Web Audio is unavailable.
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // One note: a frequency sweep f0 -> f1 over `dur` seconds, with an exponential volume decay.
  // `delay` schedules it relative to now (used to play little arpeggios).
  tone(f0, f1, dur, type = 'square', gain = 1, delay = 0) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;

    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const peak = CONFIG.audio.volume * gain;

    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  // Event sounds - each is a small, recognizable shape.
  coin() {
    this.tone(880, 1320, 0.12, 'square', 0.8);
  }
  jump() {
    this.tone(330, 660, 0.14, 'square', 0.8);
  }
  stomp() {
    this.tone(220, 110, 0.12, 'square', 1.1);
  }
  hit() {
    this.tone(300, 80, 0.3, 'sawtooth', 1.1);
  }
  win() {
    this.tone(523, 523, 0.12, 'square', 0.9, 0); // C
    this.tone(659, 659, 0.12, 'square', 0.9, 0.12); // E
    this.tone(784, 784, 0.2, 'square', 0.9, 0.24); // G
  }
  gameOver() {
    this.tone(400, 70, 0.6, 'sawtooth', 1.1);
  }
}

export const audio = new AudioEngine();

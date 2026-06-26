// The main game world. By default it runs the procedural "endless lava run": a generator
// extends platforms rightward forever over a lava floor, while a static, fully-authored level
// (e.g. level1) can still be passed in. Endless behaviour is gated on `level.endless`.

import { CONFIG } from '../config.js';
import { createEndlessLevel } from '../levels/endless.js';
import { Player } from '../entities/Player.js';
import { Collectible } from '../entities/Collectible.js';
import { Enemy } from '../entities/Enemy.js';
import { Hazard } from '../entities/Hazard.js';
import { Exit } from '../entities/Exit.js';
import { moveAndCollide, aabbOverlap } from '../engine/physics.js';
import { Camera } from '../engine/camera.js';
import { Particles } from '../engine/particles.js';
import { audio } from '../engine/audio.js';
import { getHighScore, setHighScore } from '../engine/highscore.js';
import { GameOverScene } from './GameOverScene.js';

export class WorldScene {
  constructor(level = createEndlessLevel()) {
    this.level = level;
    this.endless = !!level.endless;
    this.player = new Player(level.spawn.x, level.spawn.y);
    // Endless mode is unbounded to the right (Infinity), so the camera only clamps at the left.
    this.camera = new Camera(CONFIG.width, this.endless ? Infinity : level.width);
    this.particles = new Particles(); // juice: bursts on coins, stomps, and hits
    this.elapsed = 0; // seconds since the scene started (drives the hint fade)

    // Endless run bookkeeping: the lava death line, distance score, and the last safe spot
    // to respawn on (set whenever the player lands).
    this.lavaY = level.lavaY ?? Infinity;
    this.distance = 0;
    this.lastSafe = { x: level.spawn.x, y: level.spawn.y };

    // Build one coin per level entry; track how many the player has collected.
    this.collectibles = (level.collectibles ?? []).map((c) => new Collectible(c.x, c.y));
    this.coins = 0;

    // Race the clock: coins add time, distance is the score. (Endless mode only.)
    this.timeLeft = CONFIG.time.start;
    this.timeGainFlash = 0; // brief green pulse on the clock when time is gained
    this.endReason = null; // 'time' | 'lives' — why the run ended

    // Build patrolling enemies from level data.
    this.enemies = (level.enemies ?? []).map((e) => new Enemy(e.x, e.y, e));

    // Build static hazards (spike strips) from level data.
    this.hazards = (level.hazards ?? []).map((h) => new Hazard(h.x, h.y, h.w, h.h));

    // The goal flag (if the level defines one) and the win flag.
    this.exit = level.exit ? new Exit(level.exit.x, level.exit.y, level.exit.w, level.exit.h) : null;
    this.levelComplete = false;

    // Lives: spend one per hit; at zero the run ends.
    this.lives = CONFIG.lives.start;
    this.gameOver = false;

    // When the run ends, the world lingers briefly (juice settling) before the end screen.
    this.endTimer = 0;
  }

  // The engine hands us its reference so we can switch to the end screen.
  enter(game) {
    this.game = game;
  }

  update(dt, input) {
    // Juice keeps animating even after the run ends so bursts settle and shake decays.
    this.particles.update(dt);
    this.camera.update(dt);

    // Once ended or won, freeze the sim and count down to the end screen.
    if (this.gameOver || this.levelComplete) {
      this.endTimer -= dt;
      if (this.endTimer <= 0 && this.game) {
        const result = this.levelComplete ? 'win' : 'lose';
        this.game.setScene(new GameOverScene(result, this.endStats()));
      }
      return;
    }

    const p = this.player;
    this.elapsed += dt;

    // Mute toggle (M).
    if (input.wasPressed('KeyM')) audio.toggle();

    // Race timer: ticks down; running out ends the run (endless mode).
    if (this.endless) {
      this.timeGainFlash = Math.max(0, this.timeGainFlash - dt);
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.endRun('time');
        return;
      }
    }

    // 1. Entity decides its movement intent from input.
    p.update(dt, input);

    // 2. Apply a queued jump only when standing on solid ground.
    if (p.jumpQueued && p.onGround) {
      p.vy = -CONFIG.player.jumpSpeed;
      audio.jump();
    }

    // 3. Physics step: gravity + collision resolution against the platforms. Capture the
    //    pre-step state so we can detect a fresh landing (for the squash juice).
    const wasOnGround = p.onGround;
    const fallSpeed = p.vy;
    moveAndCollide(p, this.level.platforms, dt);
    if (!wasOnGround && p.onGround) {
      p.onLand(Math.min(1, fallSpeed / 700));
      // Remember where we touched down, so a lava/spike death can respawn us on solid ground.
      if (this.endless) this.lastSafe = { x: p.x, y: p.y };
    }

    // 4. Keep the player inside the world's horizontal bounds (left edge only when endless).
    if (p.x < 0) p.x = 0;
    if (!this.endless) {
      const maxX = this.level.width - p.w;
      if (p.x > maxX) p.x = maxX;
    }

    // 5. Camera tracks the player across the world.
    this.camera.follow(p);

    // 5b. Endless: extend the world ahead, trim it behind, and track distance.
    if (this.endless) {
      this.generateAhead();
      this.cullBehind();
      this.distance = Math.max(this.distance, Math.floor(p.x / 50));
    }

    // 6. Coins: animate, then collect any the player is overlapping this step.
    for (const c of this.collectibles) {
      if (c.collected) continue;
      c.update(dt);
      if (aabbOverlap(p, c)) {
        c.collected = true;
        this.coins += 1;
        this.particles.burst(c.x + c.w / 2, c.y + c.h / 2, CONFIG.colors.corn);
        audio.coin();
        if (this.endless) {
          this.timeLeft = Math.min(CONFIG.time.max, this.timeLeft + CONFIG.time.perCoin);
          this.timeGainFlash = 0.4;
        }
      }
    }

    // 7. Enemies: patrol, then resolve contact. Landing on top defeats one (and bounces
    //    the player); any other contact sends the player back to the spawn point.
    for (const e of this.enemies) {
      e.update(dt, this.level.platforms);
      if (e.defeated || !aabbOverlap(p, e)) continue;
      const fromAbove = p.vy > 0 && p.y + p.h - e.y < e.h * 0.6;
      if (fromAbove) {
        e.defeated = true;
        p.vy = -CONFIG.player.jumpSpeed * CONFIG.enemy.stompBounce;
        this.particles.burst(e.x + e.w / 2, e.y, CONFIG.colors.enemy);
        this.camera.shake(CONFIG.shake.stomp, CONFIG.shake.duration);
        audio.stomp();
      } else {
        this.hitPlayer();
      }
    }

    // 8. Hazards: touching any spike strip costs the player a life.
    for (const h of this.hazards) {
      if (aabbOverlap(p, h)) {
        this.hitPlayer();
        break;
      }
    }

    // 9. Lava: falling to the lava surface costs a life (endless mode).
    if (this.endless && p.y + p.h > this.lavaY) this.hitPlayer();

    // 10. Exit: reaching the goal flag completes the level (static levels only).
    if (this.exit && aabbOverlap(p, this.exit)) {
      this.exit.reached = true;
      this.levelComplete = true;
      this.finalizeScore();
      this.endTimer = CONFIG.flow.endDelay;
      audio.win();
    }
  }

  // Extend the world: generate platforms (and their items) until they reach past the right
  // edge of the view by the configured buffer.
  generateAhead() {
    const gen = this.level.generator;
    const limit = this.camera.x + CONFIG.width + CONFIG.endless.aheadBuffer;
    while (gen.last.x + gen.last.w < limit) {
      const chunk = gen.next();
      this.level.platforms.push(chunk.platform);
      for (const c of chunk.coins) this.collectibles.push(new Collectible(c.x, c.y));
      for (const e of chunk.enemies) this.enemies.push(new Enemy(e.x, e.y, e));
      for (const h of chunk.hazards) this.hazards.push(new Hazard(h.x, h.y, h.w, h.h));
    }
  }

  // Trim the world: drop platforms and items that have scrolled well off the left edge, so
  // the arrays don't grow without bound.
  cullBehind() {
    const minX = this.camera.x - CONFIG.endless.cullBuffer;
    this.level.platforms = this.level.platforms.filter((p) => p.x + p.w >= minX);
    this.collectibles = this.collectibles.filter((c) => c.x + c.w >= minX);
    this.enemies = this.enemies.filter((e) => e.x + e.w >= minX);
    this.hazards = this.hazards.filter((h) => h.x + h.w >= minX);
  }

  // Record the final score (distance when endless, coins otherwise) and persist a new best.
  finalizeScore() {
    this.score = this.endless ? this.distance : this.coins;
    const prevBest = getHighScore(CONFIG.game.storageKey);
    this.isNewBest = this.score > prevBest;
    this.highScore = Math.max(prevBest, this.score);
    if (this.isNewBest) setHighScore(CONFIG.game.storageKey, this.score);
  }

  // End the run (out of time or out of lives) and start the linger before the end screen.
  endRun(reason) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.endReason = reason;
    this.finalizeScore();
    this.endTimer = CONFIG.flow.endDelay;
    audio.gameOver();
  }

  // Stats handed to the end screen.
  endStats() {
    return {
      score: this.score,
      best: this.highScore,
      isNewBest: this.isNewBest,
      reason: this.endReason,
      coins: this.coins,
      distance: this.endless ? this.distance : null,
      total: this.endless ? null : this.collectibles.length,
    };
  }

  // Spend a life. With lives left, send the player back to spawn with a window of invincibility
  // (i-frames) so they aren't instantly hit again; at zero, end the run. Hits during the
  // invincibility window are ignored.
  hitPlayer() {
    if (this.gameOver || this.player.invincible > 0) return;
    const p = this.player;
    this.particles.burst(p.x + p.w / 2, p.y + p.h / 2, CONFIG.colors.player);
    this.camera.shake(CONFIG.shake.hit, CONFIG.shake.duration);
    this.lives -= 1;
    if (this.lives <= 0) {
      this.lives = 0;
      this.endRun('lives');
    } else {
      audio.hit();
      this.respawnPlayer();
      this.player.invincible = CONFIG.player.invincibleTime;
    }
  }

  // Send the player back to solid ground with zeroed motion: the last safe platform in an
  // endless run, or the level's spawn point otherwise.
  respawnPlayer() {
    const s = this.endless ? this.lastSafe : this.level.spawn;
    const p = this.player;
    p.x = s.x;
    p.y = s.y;
    p.vx = 0;
    p.vy = 0;
    p.onGround = false;
  }

  render(ctx) {
    const { width, height, colors } = CONFIG;
    const deco = this.level.decorations;

    // Sky: a vertical gradient sets the time-of-day mood.
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, colors.skyTop);
    sky.addColorStop(1, colors.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Sun stays fixed in the sky (screen space), independent of scrolling.
    this.drawSun(ctx, width - 120, 90, 34);

    // Background scenery: clouds drift behind everything, scrolling slower (parallax depth).
    // Endless mode tiles them procedurally so the sky never empties.
    if (this.endless) {
      this.drawEndlessClouds(ctx);
    } else if (deco) {
      ctx.save();
      ctx.translate(-Math.round(this.camera.x * CONFIG.parallax.clouds), 0);
      for (const c of deco.clouds) this.drawCloud(ctx, c);
      ctx.restore();
    }

    // Everything below scrolls with the camera: shift the world left by camera.x, plus the
    // current screen-shake offset (juice).
    ctx.save();
    ctx.translate(
      -Math.round(this.camera.x) + Math.round(this.camera.shakeX),
      Math.round(this.camera.shakeY)
    );

    // The path: every solid platform in the level, drawn as soil with a grassy cap.
    for (const p of this.level.platforms) {
      ctx.fillStyle = colors.platform;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = colors.platformTop;
      ctx.fillRect(p.x, p.y, p.w, Math.min(10, p.h));
    }

    // Foreground scenery: bushes sit on the ground.
    if (deco) for (const b of deco.bushes) this.drawBush(ctx, b);

    // Coins, drawn on the world (skip ones already collected).
    for (const c of this.collectibles) if (!c.collected) c.render(ctx);

    // Goal flag, hazards, and enemies, drawn on the world.
    if (this.exit) this.exit.render(ctx);
    for (const h of this.hazards) h.render(ctx);
    for (const e of this.enemies) e.render(ctx);

    // The character, drawn on top of the world.
    this.player.render(ctx);

    // Particle bursts, on top of everything in the world.
    this.particles.render(ctx);

    ctx.restore();

    // The lava floor: a fixed band at the bottom of the screen (endless mode).
    if (this.endless) this.drawLava(ctx);

    // HUD (screen space): distance (score), coins, lives on the right; the race clock centred.
    this.drawDistance(ctx);
    this.drawScore(ctx);
    this.drawLives(ctx);
    this.drawTime(ctx);
    if (this.gameOver || this.levelComplete) this.drawEndFade(ctx);
    else this.drawHints(ctx);
  }

  // The race clock, centred at the top. Pulses red when low on time, flashes green on a gain.
  drawTime(ctx) {
    if (!this.endless) return;
    const c = CONFIG.colors;
    const low = this.timeLeft < CONFIG.time.lowWarning;
    let color = c.text;
    if (this.timeGainFlash > 0) color = c.timeGain;
    else if (low) color = c.timeLow;

    ctx.save();
    ctx.textAlign = 'center';
    // A subtle pulse when time is running out.
    if (low) ctx.globalAlpha = 0.6 + 0.4 * Math.abs(Math.sin(this.elapsed * 8));
    ctx.fillStyle = color;
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillText(this.timeLeft.toFixed(1), CONFIG.width / 2, 38);
    ctx.globalAlpha = 1;
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = c.text;
    ctx.fillText('TIME', CONFIG.width / 2, 52);
    ctx.restore();
  }

  // The lava floor: a glowing band pinned to the bottom of the screen, with a bright surface
  // line that ripples gently for life.
  drawLava(ctx) {
    const { width, height, colors, lava } = CONFIG;
    const y = height - lava.height;
    ctx.fillStyle = colors.lavaGlow;
    ctx.fillRect(0, y - 10, width, 10);
    ctx.fillStyle = colors.lava;
    ctx.fillRect(0, y, width, lava.height);
    ctx.fillStyle = colors.lavaTop;
    for (let x = 0; x < width; x += 16) {
      const wob = 2 + Math.sin(this.elapsed * 4 + x * 0.05) * 2;
      ctx.fillRect(x, y - wob + 2, 16, 5);
    }
  }

  // Procedurally tiled parallax clouds for the endless sky (deterministic per tile, so they
  // don't flicker as they scroll).
  drawEndlessClouds(ctx) {
    const { width } = CONFIG;
    const tile = 260;
    const scroll = this.camera.x * CONFIG.parallax.clouds;
    const first = Math.floor(scroll / tile) - 1;
    const last = Math.ceil((scroll + width) / tile) + 1;
    for (let i = first; i <= last; i++) {
      const f = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1; // stable pseudo-random
      const x = i * tile + 40 + f * (tile - 80) - scroll;
      this.drawCloud(ctx, { x, y: 46 + f * 70, scale: 0.7 + f * 0.7 });
    }
  }

  // Darken the world as the end timer runs down, easing into the end screen.
  drawEndFade(ctx) {
    const t = 1 - Math.max(0, this.endTimer) / CONFIG.flow.endDelay; // 0 → 1
    ctx.save();
    ctx.globalAlpha = 0.6 * t;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
    ctx.restore();
  }

  // Distance travelled — the run's score — pinned to the top-right (endless mode).
  drawDistance(ctx) {
    if (!this.endless) return;
    ctx.save();
    ctx.fillStyle = CONFIG.colors.text;
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${this.distance} m`, CONFIG.width - 16, 28);
    ctx.restore();
  }

  // Coin counter, under the distance. Endless shows the running total; static levels show
  // progress toward the level's coins.
  drawScore(ctx) {
    const label = this.endless
      ? `Corn  ${this.coins}`
      : this.collectibles.length === 0
        ? null
        : `Corn  ${this.coins} / ${this.collectibles.length}`;
    if (!label) return;
    ctx.save();
    ctx.fillStyle = CONFIG.colors.corn;
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(label, CONFIG.width - 16, 50);
    ctx.restore();
  }

  // Remaining lives as a row of hearts, top-right under the coin counter.
  drawLives(ctx) {
    ctx.save();
    ctx.fillStyle = CONFIG.colors.heart;
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('♥'.repeat(this.lives), CONFIG.width - 16, 72);
    ctx.restore();
  }

  // Control hints, fully visible for ~5s then fading out over ~3s.
  drawHints(ctx) {
    const fadeStart = 5;
    const fadeEnd = 8;
    let alpha = 1;
    if (this.elapsed > fadeStart) {
      alpha = 1 - (this.elapsed - fadeStart) / (fadeEnd - fadeStart);
    }
    if (alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = CONFIG.colors.text;
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Move:  ← →  or  A D', 16, 28);
    ctx.fillText('Jump:  Space  /  ↑  /  W', 16, 48);
    ctx.fillText('Mute:  M', 16, 68);
    ctx.restore();
  }

  // The sun: a soft glow halo around a bright disc.
  drawSun(ctx, x, y, r) {
    ctx.fillStyle = CONFIG.colors.sunGlow;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CONFIG.colors.sun;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // A cloud is three overlapping puffs; `scale` varies its size.
  drawCloud(ctx, { x, y, scale = 1 }) {
    const r = 18 * scale;
    ctx.fillStyle = CONFIG.colors.cloud;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r, y + r * 0.2, r * 0.85, 0, Math.PI * 2);
    ctx.arc(x - r, y + r * 0.2, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  // A bush is a row of green humps anchored at ground level (y = its base).
  drawBush(ctx, { x, y, scale = 1 }) {
    const r = 14 * scale;
    ctx.fillStyle = CONFIG.colors.bush;
    ctx.beginPath();
    ctx.arc(x, y - r, r, Math.PI, Math.PI * 2);
    ctx.arc(x + r, y - r * 0.8, r * 0.85, Math.PI, Math.PI * 2);
    ctx.arc(x - r, y - r * 0.8, r * 0.85, Math.PI, Math.PI * 2);
    ctx.fillRect(x - r * 2, y - r * 0.8, r * 4, r * 0.8);
    ctx.fill();
  }
}

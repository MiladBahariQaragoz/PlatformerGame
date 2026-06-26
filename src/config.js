// Central place for tunable constants. Reference these — never hard-code values
// elsewhere. Curriculum tasks add to this file as the game grows.

export const CONFIG = {
  // Canvas / viewport (logical pixels)
  width: 800,
  height: 450,

  // Fixed-timestep update rate (updates per second)
  fps: 60,

  // Physics (units are pixels and seconds)
  gravity: 1800,
  // Movement / jump tuning gets added in Module 2 (Move and Jump).

  // Ground height (pixels from the bottom of the canvas).
  groundHeight: 64,

  // Character dimensions (pixels) and movement tuning.
  player: {
    width: 28,
    height: 40,
    speed: 220, // horizontal run speed (px/s)
    jumpSpeed: 620, // initial upward velocity on jump (px/s)
  },

  // Collectibles (coins). Positions are defined per-level as center points.
  coin: {
    radius: 9,
    bobAmount: 4, // px of vertical bob, for life
    bobSpeed: 3, // bob rate (radians/s)
  },

  // Patrolling enemies. Positions/patrol bounds are defined per-level.
  enemy: {
    width: 30,
    height: 28,
    speed: 70, // patrol walk speed (px/s)
    stompBounce: 0.6, // fraction of jumpSpeed the player rebounds after a stomp
  },

  // Static hazards (spike strips). Boxes are defined per-level.
  hazard: {
    spikeWidth: 16, // target px width of one spike; strips fit a whole number across
  },

  // Lives: how many hits the player can take before it's game over.
  lives: {
    start: 3,
  },

  // Palette
  colors: {
    sky: '#5c94fc',
    skyTop: '#3b6fd4',
    skyBottom: '#9fd0ff',
    sun: '#fff3b0',
    sunGlow: 'rgba(255, 243, 176, 0.35)',
    ground: '#6b4f2a',
    groundTop: '#3fa34d',
    platform: '#8a5a2b',
    platformTop: '#3fa34d',
    player: '#e23b3b',
    playerEye: '#ffffff',
    cloud: '#ffffff',
    bush: '#2f8f3e',
    coin: '#ffd23f',
    coinShine: '#fff1a8',
    coinEdge: '#caa000',
    enemy: '#8e44ad',
    enemyEye: '#ffffff',
    enemyDefeated: '#5e3370',
    hazard: '#b03a2e',
    hazardEdge: '#e05a47',
    heart: '#e23b3b',
    overlay: 'rgba(0, 0, 0, 0.55)',
    text: '#ffffff',
  },
};

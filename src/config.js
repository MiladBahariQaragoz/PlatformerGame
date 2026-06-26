// Central place for tunable constants. Reference these — never hard-code values
// elsewhere. Curriculum tasks add to this file as the game grows.

export const CONFIG = {
  // Game identity (shown on menus).
  game: {
    title: 'LAVA RUN',
    subtitle: 'race the clock — grab coins for time, distance is your score',
    storageKey: 'lavaRunHighScore', // localStorage key for the persisted best distance
  },

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

  // Race timer (endless mode): the run ends when the clock or the lives run out. Coins buy
  // time. Score is the distance travelled.
  time: {
    start: 20, // seconds on the clock at the start
    perCoin: 3, // seconds added per coin collected
    max: 30, // clock can't be banked above this (keeps the pressure on)
    lowWarning: 5, // below this many seconds the clock turns red and pulses
  },

  // Juice: particle bursts and screen shake for feedback on events.
  particles: {
    burstCount: 12, // particles per burst
    speed: 200, // base spray speed (px/s)
    life: 0.5, // base lifetime (s)
    size: 4, // base square size (px)
    gravity: 600, // downward pull on particles (px/s^2)
  },
  shake: {
    stomp: 4, // magnitude (px) on a stomp
    hit: 8, // magnitude (px) on taking damage
    duration: 0.25, // seconds
  },

  // Audio: synthesized sound effects. `volume` is the master peak gain (0..1).
  audio: {
    volume: 0.14,
  },

  // Scene flow timing.
  flow: {
    endDelay: 1.0, // seconds the world lingers (juice settling) before the end screen
  },

  // Parallax: background layers scroll slower than the world for a sense of depth.
  parallax: {
    clouds: 0.4, // clouds move at 40% of the camera's horizontal speed
  },

  // Lava floor (endless mode): a deadly band fixed at the bottom of the screen.
  lava: {
    height: 56, // px band height (also sets the death line: y = canvas height - this)
  },

  // Procedural endless run. Each next platform's height is chosen within the player's jump
  // reach (derived from jumpSpeed/gravity), then the gap is capped to what's physically
  // clearable, so every generated jump is fair by construction.
  endless: {
    minTopY: 110, // highest a platform top may sit (px from canvas top)
    clearanceAboveLava: 64, // platforms stay at least this far above the lava surface
    maxRise: 78, // biggest upward step (px) — under the ~107px jump height, for margin
    maxDrop: 150, // biggest downward step (px)
    minGap: 46, // smallest horizontal gap between platforms (px)
    maxGap: 230, // hard cap on the gap (px)
    gapSafety: 0.8, // fraction of the reachable gap we actually use (fairness margin)
    thickness: 18, // platform height (px)
    shortWidth: [60, 120], // px range for a "short" platform
    longWidth: [150, 270], // px range for a "long" platform
    longChance: 0.4, // probability a platform is long rather than short
    aheadBuffer: 420, // generate platforms until this far past the right viewport edge
    cullBuffer: 240, // drop platforms/items this far behind the left viewport edge
    safeStart: 3, // first N platforms carry no enemies/hazards
    coinPeriod: 10, // exactly one coin per this many platforms, at a random platform in each
    enemyChance: 0.28, // probability a wide platform gets an enemy
    hazardChance: 0.26, // probability a wide platform gets a spike strip instead
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
    exitPole: '#dfe6e9',
    exitFlag: '#27ae60',
    exitFlagReached: '#f1c40f',
    menuBg: '#1b2330',
    lava: '#e2521a',
    lavaTop: '#ffb24a',
    lavaGlow: 'rgba(255, 120, 40, 0.45)',
    timeLow: '#ff5252',
    timeGain: '#5bf07a',
    text: '#ffffff',
  },
};

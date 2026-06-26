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

  // Character dimensions (pixels).
  player: {
    width: 28,
    height: 40,
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
    text: '#ffffff',
  },
};

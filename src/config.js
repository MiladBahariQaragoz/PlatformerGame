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

  // Palette
  colors: {
    sky: '#5c94fc',
    text: '#ffffff',
  },
};

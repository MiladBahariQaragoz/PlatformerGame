// Level 1 — described as data so new levels need new data, not new code (scalable).
// The engine/scene consumes this; it never hard-codes layout.
//
// Coordinates: top-left origin, +x right, +y down. Canvas is 800x450, ground is the
// bottom 64px (groundY = 386). Platforms are solid rectangles {x, y, w, h}.

export const level1 = {
  name: 'Green Hills 1',

  // Total level width (px) — wider than the 800px viewport, so the world scrolls. The
  // camera follows the player in "Scroll the World".
  width: 1600,

  // Where the character starts — resting on the ground at the far left
  // (ground top is y=386, player is 40px tall, so y=346 sits flush).
  spawn: { x: 48, y: 346 },

  // The base ground spans the whole level; floating platforms form a climbing path.
  // Layout follows a readable rhythm: steady ~120px horizontal gaps and ~52px rises so
  // each jump is reachable, with a wider rest platform before the final step.
  platforms: [
    { x: 0, y: 386, w: 1600, h: 64 }, // ground spans the whole level
    // Climb to the summit (first half).
    { x: 150, y: 334, w: 110, h: 16 },
    { x: 320, y: 282, w: 110, h: 16 },
    { x: 470, y: 230, w: 150, h: 16 }, // rest platform (wider)
    { x: 660, y: 188, w: 110, h: 16 }, // summit
    // Descend and continue across the extended second half.
    { x: 840, y: 240, w: 110, h: 16 },
    { x: 1010, y: 292, w: 110, h: 16 },
    { x: 1190, y: 244, w: 110, h: 16 },
    { x: 1370, y: 200, w: 150, h: 16 }, // final lookout (wider)
  ],

  // Non-interactive scenery — drawn behind the platforms and player. Pure decoration,
  // kept as data so a level's look is part of its description.
  decorations: {
    clouds: [
      { x: 120, y: 70, scale: 1.0 },
      { x: 430, y: 50, scale: 1.3 },
      { x: 650, y: 95, scale: 0.8 },
      { x: 950, y: 64, scale: 1.1 },
      { x: 1240, y: 88, scale: 0.9 },
      { x: 1480, y: 56, scale: 1.2 },
    ],
    bushes: [
      { x: 90, y: 386, scale: 1.0 },
      { x: 300, y: 386, scale: 1.2 },
      { x: 560, y: 386, scale: 0.9 },
      { x: 900, y: 386, scale: 1.1 },
      { x: 1180, y: 386, scale: 0.95 },
      { x: 1440, y: 386, scale: 1.15 },
    ],
  },
};

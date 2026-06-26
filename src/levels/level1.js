// Level 1 — described as data so new levels need new data, not new code (scalable).
// The engine/scene consumes this; it never hard-codes layout.
//
// Coordinates: top-left origin, +x right, +y down. Canvas is 800x450, ground is the
// bottom 64px (groundY = 386). Platforms are solid rectangles {x, y, w, h}.

export const level1 = {
  name: 'Green Hills 1',

  // Where the character starts (used once the player entity is added).
  spawn: { x: 48, y: 330 },

  // The base ground spans the whole level; floating platforms form a climbing path.
  // Layout follows a readable rhythm: steady ~120px horizontal gaps and ~52px rises so
  // each jump is reachable, with a wider rest platform before the final step.
  platforms: [
    { x: 0, y: 386, w: 800, h: 64 }, // ground
    { x: 150, y: 334, w: 110, h: 16 },
    { x: 320, y: 282, w: 110, h: 16 },
    { x: 470, y: 230, w: 150, h: 16 }, // rest platform (wider)
    { x: 660, y: 188, w: 110, h: 16 }, // summit
  ],
};

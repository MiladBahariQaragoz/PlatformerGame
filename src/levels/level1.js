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
  platforms: [
    { x: 0, y: 386, w: 800, h: 64 }, // ground
    { x: 170, y: 320, w: 120, h: 16 },
    { x: 350, y: 268, w: 120, h: 16 },
    { x: 540, y: 220, w: 130, h: 16 },
  ],
};

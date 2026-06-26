// Level 1 - described as data so new levels need new data, not new code (scalable).
// The engine/scene consumes this; it never hard-codes layout.
//
// Coordinates: top-left origin, +x right, +y down. Canvas is 800x450, ground is the
// bottom 64px (groundY = 386). Platforms are solid rectangles {x, y, w, h}.

export const level1 = {
  name: 'Green Hills 1',

  // Total level width (px) - wider than the 800px viewport, so the world scrolls. The
  // camera follows the player in "Scroll the World".
  width: 1600,

  // Where the character starts - resting on the ground at the far left
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

  // Collectible coins, defined as center points {x, y}. Placed along the ground and
  // hovering above each platform so they reward the natural climbing path.
  collectibles: [
    { x: 110, y: 360 }, // ground, near the start
    { x: 230, y: 360 },
    { x: 205, y: 308 }, // above the first step
    { x: 375, y: 256 },
    { x: 545, y: 204 }, // above the rest platform
    { x: 715, y: 162 }, // the summit
    { x: 895, y: 214 }, // descending into the second half
    { x: 1065, y: 266 },
    { x: 1245, y: 218 },
    { x: 1445, y: 174 }, // final lookout
  ],

  // Patrolling enemies: {x, y} top-left, with optional patrol bounds {minX, maxX} (world x)
  // and a starting direction `dir` (-1 left, 1 right). Two roam the ground; one guards the
  // wide rest platform where coins cluster. (Enemy is 28px tall: groundY 386 → y 358.)
  enemies: [
    { x: 420, y: 358, dir: -1, minX: 360, maxX: 600 },
    { x: 520, y: 202, dir: 1, minX: 470, maxX: 620 }, // on the rest platform
    { x: 1040, y: 358, dir: -1, minX: 950, maxX: 1180 },
  ],

  // The level exit (goal flag): an AABB {x, y, w, h}. Stands on the final lookout platform
  // (top y=200), so the pole rises from the platform to y=140. Reaching it wins the level.
  exit: { x: 1466, y: 140, w: 28, h: 60 },

  // Static hazards (spike strips): {x, y, w, h}, resting on the ground (groundY 386, so
  // 20px-tall strips start at y 366). Placed in open stretches so they must be jumped.
  hazards: [
    { x: 720, y: 366, w: 80, h: 20 },
    { x: 1290, y: 366, w: 80, h: 20 },
  ],

  // Non-interactive scenery - drawn behind the platforms and player. Pure decoration,
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

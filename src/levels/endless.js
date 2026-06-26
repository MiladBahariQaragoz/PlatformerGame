// The endless run "level". Unlike the static level1, this has no fixed layout: it carries a
// LevelGenerator the scene calls to extend the world rightward forever, and its floor is lava
// instead of solid ground. Each call to createEndlessLevel() returns a fresh world (fresh
// generator), so a new run is a clean slate — the same fresh-scene-per-run idea as retry.

import { CONFIG } from '../config.js';
import { LevelGenerator } from './generator.js';

export function createEndlessLevel() {
  const generator = new LevelGenerator();
  const first = generator.start();

  return {
    name: 'Endless Lava Run',
    endless: true,
    generator,
    lavaY: CONFIG.height - CONFIG.lava.height, // world y of the lava surface (death line)

    spawn: { x: 60, y: first.y - CONFIG.player.height },

    // Seeded with the start platform; the scene grows/culls these as the player advances.
    platforms: [first],
    collectibles: [],
    enemies: [],
    hazards: [],
    exit: null, // an endless run has no finish line

    // No fixed scenery — the scene tiles clouds procedurally for the endless sky.
    decorations: null,
  };
}

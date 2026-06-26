// Game-agnostic physics helpers: axis-aligned bounding-box (AABB) math and gravity.
// Entities are treated as { x, y, w, h, vx, vy }. Collision response is added in
// Module 2 (Collision and Solid Ground) and builds on these primitives.

import { CONFIG } from '../config.js';

// Do two AABBs overlap?
export function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// Apply gravity to a body's vertical velocity for this timestep.
export function applyGravity(body, dt) {
  body.vy += CONFIG.gravity * dt;
}

// Integrate velocity into position for this timestep.
export function integrate(body, dt) {
  body.x += body.vx * dt;
  body.y += body.vy * dt;
}

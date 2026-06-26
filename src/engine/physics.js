// Game-agnostic physics: AABB overlap and axis-separated collision resolution against a
// set of solid platforms. Bodies are { x, y, w, h, vx, vy } and gain an `onGround` flag.

import { CONFIG } from '../config.js';

// Do two AABBs overlap? (Touching edges do not count as overlap.)
export function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// Advance a body by one fixed step, applying gravity and resolving collisions against
// solid platforms one axis at a time (horizontal first, then vertical). Sets body.onGround
// when the body lands on a surface this step. Resolving per-axis avoids corner snagging.
export function moveAndCollide(body, platforms, dt) {
  // --- Horizontal ---
  body.x += body.vx * dt;
  for (const p of platforms) {
    if (!aabbOverlap(body, p)) continue;
    if (body.vx > 0) body.x = p.x - body.w; // moving right: sit against left face
    else if (body.vx < 0) body.x = p.x + p.w; // moving left: sit against right face
    body.vx = 0;
  }

  // --- Vertical ---
  body.vy += CONFIG.gravity * dt;
  body.y += body.vy * dt;
  body.onGround = false;
  for (const p of platforms) {
    if (!aabbOverlap(body, p)) continue;
    if (body.vy > 0) {
      body.y = p.y - body.h; // falling: land on top
      body.onGround = true;
    } else if (body.vy < 0) {
      body.y = p.y + p.h; // rising: bonk head on underside
    }
    body.vy = 0;
  }
}

// Keyboard input. Game logic reads from this state inside update() — it must never
// attach its own DOM listeners. Tracks both "held" and "just pressed this frame".

const held = new Set();
const pressed = new Set();

export function initInput(target = window) {
  target.addEventListener('keydown', (e) => {
    if (!held.has(e.code)) pressed.add(e.code);
    held.add(e.code);
  });
  target.addEventListener('keyup', (e) => {
    held.delete(e.code);
  });
}

export const input = {
  // True while the key is down.
  isDown(code) {
    return held.has(code);
  },
  // True only on the frame the key went down. Call endFrame() after each update.
  wasPressed(code) {
    return pressed.has(code);
  },
  // Clears one-frame state. The game loop calls this once per update.
  endFrame() {
    pressed.clear();
  },
};

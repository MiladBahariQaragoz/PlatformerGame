// Persistent high score via localStorage, keyed by name so it's game-agnostic. Every access
// is guarded so the game still runs where storage is unavailable (private mode, file://
// quirks, headless tests) — it just won't remember between sessions there.

export function getHighScore(key) {
  try {
    return parseInt(localStorage.getItem(key), 10) || 0;
  } catch {
    return 0;
  }
}

export function setHighScore(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* storage unavailable — ignore */
  }
}

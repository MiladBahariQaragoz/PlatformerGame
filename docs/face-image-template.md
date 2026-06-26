# Face image template

The hero **and** the chaser can each wear a picture as their face. Drop in an image and it
shows up automatically — no code changes needed beyond (optionally) pointing the config at your
file. Until a valid image loads, the game falls back to a drawn face (an eye for the hero, glowing
eyes for the chaser), so the game always runs.

## How it works

- The face is drawn **clipped to a circle**, centred on the character's head.
- The source image is drawn into a **square** box, so a square image is undistorted. A
  non-square image still works but gets centre-cropped to the circle.
- Images are loaded once and cached (`src/engine/assets.js`).

## What to provide

| Property            | Recommendation                                                        |
| ------------------- | --------------------------------------------------------------------- |
| **Shape**           | Square (1:1). The face area is a circle inside that square.            |
| **Resolution**      | 128×128 px or larger (256×256 is plenty). Smaller works but is softer. |
| **Format**          | `.png` (transparency supported), `.jpg`, or `.svg`.                   |
| **Background**      | Transparent or any solid colour — only the circle shows.              |
| **Framing**         | Centre the face; leave a little margin so it isn't cropped too tight. |
| **File size**       | Keep it small (a few hundred KB max) so the page loads fast.          |

## Where to put it

Put the file in `assets/images/`. The defaults are:

- **Hero:** `assets/images/hero-face.svg`  →  configured at `CONFIG.player.face.src`
- **Chaser:** `assets/images/chaser-face.svg`  →  configured at `CONFIG.chaser.face.src`

The two `*.svg` files currently there are **placeholders** — replace them, or add your own file
and update the matching `src` in [`src/config.js`](../src/config.js).

### Two ways to use your own picture

1. **Simplest:** save your picture over the placeholder using the same name, e.g. replace
   `assets/images/hero-face.svg` with your own `hero-face.svg`. No config change needed.
2. **Keep your own filename/format:** add e.g. `assets/images/my-hero.png`, then point the config
   at it:

   ```js
   // src/config.js
   player: {
     // ...
     face: {
       src: 'assets/images/my-hero.png', // ← your file
       size: 24,    // px the face is drawn at (square)
       offsetY: 1,  // nudge the face down from the head top (px)
     },
   },
   ```

The chaser is identical under `CONFIG.chaser.face` (its default `size` is `30`).

## Tuning

- `size` — diameter the face is drawn at, in logical pixels. The hero body is 28×40, so ~24 fits
  neatly; bump it up for a bigger head.
- `offsetY` — positive moves the face down, negative moves it up.

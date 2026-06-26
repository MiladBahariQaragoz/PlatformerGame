// Game-agnostic image loading + drawing helpers. Images are cached by `src`, so asking for
// the same picture twice returns the same <img> and it only downloads once. Drawing is
// tolerant of an image that hasn't finished loading yet — callers check `imageReady` and draw
// their own fallback until it has.

const cache = new Map();

// Get (and lazily start loading) the image at `src`. Returns null for an empty src.
export function getImage(src) {
  if (!src) return null;
  let img = cache.get(src);
  if (!img) {
    img = new Image();
    img.src = src;
    cache.set(src, img);
  }
  return img;
}

// Has the image finished loading and is it safe to draw?
export function imageReady(img) {
  return !!img && img.complete && img.naturalWidth > 0;
}

// Draw an image as a circle of diameter `size` centred at (cx, cy). The source is drawn into a
// square box (templates are square), so faces stay centred and undistorted.
export function drawImageCircle(ctx, img, cx, cy, size) {
  const r = size / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, cx - r, cy - r, size, size);
  ctx.restore();
}

// Draw an image to cover a w×h box (like CSS background-size: cover), centred and cropped so it
// fills the box without stretching. Used for full-screen backdrops.
export function drawImageCover(ctx, img, x, y, w, h) {
  const ir = img.naturalWidth / img.naturalHeight;
  const br = w / h;
  let dw = w;
  let dh = h;
  if (ir > br) dw = h * ir; // image wider than box: overflow horizontally
  else dh = w / ir; // taller than box: overflow vertically
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

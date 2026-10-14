/**
 * Generates the PWA icons from code, so they can be regenerated after a brand
 * change without any binary assets or image tooling in the repo.
 *
 * Run: node scripts/make-icons.mjs
 */
import { createWriteStream } from 'node:fs';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../public/icons');

const NAVY = [8, 15, 29];
const NAVY_LIGHT = [19, 35, 63];
const GOLD = [246, 166, 35];
const GOLD_BRIGHT = [255, 195, 85];
const WATER = [12, 27, 51];

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(size, pixels) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // no filter
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/**
 * Draws the app mark: a night sky over a lake with the midnight sun and its
 * reflection - the same scene as the home screen hero.
 *
 * `inset` leaves a safe margin for maskable icons, which get cropped to a
 * circle on Android.
 */
function draw(size, { maskable = false } = {}) {
  const px = Buffer.alloc(size * size * 4);
  const inset = maskable ? size * 0.1 : 0;
  const box = size - inset * 2;
  const radius = maskable ? 0 : size * 0.22;

  const sunX = inset + box * 0.66;
  const sunY = inset + box * 0.36;
  const sunR = box * 0.17;
  const horizon = inset + box * 0.6;

  const set = (x, y, [r, g, b], a = 255) => {
    const i = (y * size + x) * 4;
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
    px[i + 3] = a;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Outside the (optionally rounded) card: transparent.
      if (x < inset || y < inset || x >= inset + box || y >= inset + box) continue;

      if (radius > 0) {
        const cx = Math.min(Math.max(x, inset + radius), inset + box - radius);
        const cy = Math.min(Math.max(y, inset + radius), inset + box - radius);
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy > radius * radius) continue;
      }

      if (maskable) {
        // Full-bleed circle-safe background.
        const dx = x - size / 2;
        const dy = y - size / 2;
        if (dx * dx + dy * dy > (size / 2) * (size / 2)) continue;
      }

      let colour;
      if (y < horizon) {
        // Sky gradient.
        const t = (y - inset) / (horizon - inset);
        colour = mix(NAVY_LIGHT, NAVY, t);

        // Sun disc.
        const dx = x - sunX;
        const dy = y - sunY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < sunR) {
          colour = mix(GOLD_BRIGHT, GOLD, d / sunR);
        } else if (d < sunR * 1.5) {
          const glow = 1 - (d - sunR) / (sunR * 0.5);
          colour = mix(colour, GOLD, glow * 0.22);
        }
      } else {
        // Water.
        const t = (y - horizon) / (inset + box - horizon);
        colour = mix(WATER, NAVY, t);

        // Reflection bars under the sun.
        const bandIndex = Math.floor((y - horizon) / (box * 0.055));
        const bandY = (y - horizon) % (box * 0.055);
        if (bandY < box * 0.022) {
          const width = box * (0.14 - bandIndex * 0.018);
          if (width > 0 && Math.abs(x - sunX) < width) {
            colour = mix(colour, GOLD, 0.5 - bandIndex * 0.07);
          }
        }
      }

      set(x, y, colour);
    }
  }

  return encodePng(size, px);
}

function write(name, buf) {
  const file = resolve(outDir, name);
  const stream = createWriteStream(file);
  stream.end(buf);
  console.log(`wrote ${name} (${(buf.length / 1024).toFixed(1)} KB)`);
}

mkdirSync(outDir, { recursive: true });
write('icon-192.png', draw(192));
write('icon-512.png', draw(512));
write('maskable-512.png', draw(512, { maskable: true }));

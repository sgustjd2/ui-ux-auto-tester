// Test helpers: synthetic images built in memory (no binary fixtures in the repository) and small utilities.
import { deflateSync, crc32 } from "node:zlib";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0);
  return Buffer.concat([len, body, crc]);
}

// A valid RGBA PNG. `fillData: false` writes a header-only image for dimension tests without allocating pixels.
export function makePng(width, height, { text = null, exif = false, fillData = true } = {}) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
  let raw;
  if (fillData) {
    const row = Buffer.alloc(1 + width * 4, 0x80); row[0] = 0;
    raw = Buffer.concat(Array.from({ length: height }, () => row));
  } else raw = Buffer.from([0]);
  const parts = [PNG_SIG, pngChunk("IHDR", ihdr)];
  if (text) parts.push(pngChunk("tEXt", Buffer.from(`Comment\0${text}`, "latin1")));
  if (exif) parts.push(pngChunk("eXIf", Buffer.from("Exif\0\0GPS 37.5 127.0", "latin1")));
  parts.push(pngChunk("IDAT", deflateSync(raw)), pngChunk("IEND", Buffer.alloc(0)));
  return Buffer.concat(parts);
}

// A structurally plausible JPEG header (JFIF, optional EXIF, SOF0, SOS). Not decodable; enough for header parsing.
export function makeJpeg(width, height, { exif = false } = {}) {
  const seg = (marker, payload) => { const len = Buffer.alloc(2); len.writeUInt16BE(payload.length + 2); return Buffer.concat([Buffer.from([0xff, marker]), len, payload]); };
  const app0 = seg(0xe0, Buffer.from("JFIF\0\x01\x01\0\0\x01\0\x01\0\0", "latin1"));
  const app1 = exif ? seg(0xe1, Buffer.from("Exif\0\0GPSLatitude=37.5", "latin1")) : Buffer.alloc(0);
  const sof = Buffer.alloc(15);
  sof[0] = 8; sof.writeUInt16BE(height, 1); sof.writeUInt16BE(width, 3); sof[5] = 3;
  sof.set([1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1], 6);
  const sos = seg(0xda, Buffer.from([3, 1, 0, 2, 0x11, 3, 0x11, 0, 63, 0]));
  return Buffer.concat([Buffer.from([0xff, 0xd8]), app0, app1, seg(0xc0, sof), sos, Buffer.from([0x12, 0x34, 0x56]), Buffer.from([0xff, 0xd9])]);
}

// A WebP container with a VP8X header (extended format) and an optional EXIF chunk.
export function makeWebp(width, height, { exif = false } = {}) {
  const chunk = (fourcc, data) => { const size = Buffer.alloc(4); size.writeUInt32LE(data.length); const pad = data.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0); return Buffer.concat([Buffer.from(fourcc, "ascii"), size, data, pad]); };
  const vp8x = Buffer.alloc(10);
  vp8x[0] = exif ? 0x08 : 0x00;
  vp8x.writeUIntLE(width - 1, 4, 3); vp8x.writeUIntLE(height - 1, 7, 3);
  const chunks = [chunk("VP8X", vp8x)];
  if (exif) chunks.push(chunk("EXIF", Buffer.from("II*\0GPS", "latin1")));
  chunks.push(chunk("VP8 ", Buffer.alloc(8)));
  const body = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.write("RIFF", 0, "ascii"); header.writeUInt32LE(body.length + 4, 4); header.write("WEBP", 8, "ascii");
  return Buffer.concat([header, body]);
}

export const tempDir = (prefix = "web-test-") => mkdtempSync(join(tmpdir(), prefix));
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const SVG_BYTES = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><script>alert(1)</script></svg>`, "utf8");

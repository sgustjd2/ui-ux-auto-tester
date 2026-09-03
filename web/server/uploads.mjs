// Upload validation for screenshots (docs/web-product/security-privacy.md section 3.1).
// Standard library only: type by magic bytes, size and dimension caps, container-level metadata stripping.
// ponytail: no pixel decoding and therefore no re-encoding here (SEC-03 re-encoding waits for an image
// dependency decision, W-OD-18). Metadata is stripped by dropping PNG/JPEG/WebP metadata chunks instead.

import { createHash } from "node:crypto";

export const LIMITS = Object.freeze({
  maxBytes: 10 * 1024 * 1024,
  maxSide: 8000,
  minSide: 64,
  maxPixels: 40_000_000,
});

export class UploadError extends Error {
  constructor(code, message) { super(message); this.name = "UploadError"; this.code = code; this.status = code === "too_large" ? 413 : 400; }
}

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function detectType(buf) {
  if (buf.length >= 8 && buf.subarray(0, 8).equals(PNG_SIG)) return "image/png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

export const EXTENSIONS = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

function pngDimensions(buf) {
  if (buf.length < 24 || buf.toString("ascii", 12, 16) !== "IHDR") throw new UploadError("corrupt", "PNG header is malformed");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const JPEG_SOF = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

function jpegDimensions(buf) {
  let i = 2;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff) throw new UploadError("corrupt", "JPEG segment marker expected");
    const marker = buf[i + 1];
    if (marker === 0xff) { i++; continue; }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) { i += 2; continue; }
    if (marker === 0xd9 || marker === 0xda) break;
    const len = buf.readUInt16BE(i + 2);
    if (len < 2) throw new UploadError("corrupt", "JPEG segment length invalid");
    if (JPEG_SOF.has(marker)) {
      if (i + 9 > buf.length) throw new UploadError("corrupt", "JPEG frame header truncated");
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new UploadError("corrupt", "JPEG has no frame header");
}

function webpDimensions(buf) {
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    if (buf.length < 30 || buf[23] !== 0x9d || buf[24] !== 0x01 || buf[25] !== 0x2a) throw new UploadError("corrupt", "WebP VP8 header is malformed");
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    if (buf.length < 25 || buf[20] !== 0x2f) throw new UploadError("corrupt", "WebP VP8L header is malformed");
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    if (buf.length < 30) throw new UploadError("corrupt", "WebP VP8X header is malformed");
    return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  }
  throw new UploadError("corrupt", "WebP first chunk is not VP8, VP8L, or VP8X");
}

export function inspectImage(buf) {
  const mediaType = detectType(buf);
  if (!mediaType) throw new UploadError("invalid_type", "Only PNG, JPEG, and WebP images are accepted");
  const dims = mediaType === "image/png" ? pngDimensions(buf) : mediaType === "image/jpeg" ? jpegDimensions(buf) : webpDimensions(buf);
  return { mediaType, ...dims };
}

export function validateImage(buf, limits = LIMITS) {
  if (!Buffer.isBuffer(buf) || buf.length === 0) throw new UploadError("invalid_type", "Empty upload");
  if (buf.length > limits.maxBytes) throw new UploadError("too_large", `File exceeds ${Math.round(limits.maxBytes / 1024 / 1024)} MB`);
  const info = inspectImage(buf);
  if (info.width < limits.minSide || info.height < limits.minSide) throw new UploadError("too_small", `Image must be at least ${limits.minSide} px on each side`);
  if (info.width > limits.maxSide || info.height > limits.maxSide) throw new UploadError("too_large", `Image must be at most ${limits.maxSide} px on the longest side`);
  if (info.width * info.height > limits.maxPixels) throw new UploadError("too_large", "Image has too many pixels");
  return { ...info, ext: EXTENSIONS[info.mediaType] };
}

// PNG: keep chunks needed to render; drop text, time, EXIF, and embedded profiles.
const PNG_KEEP = new Set(["IHDR", "PLTE", "IDAT", "IEND", "tRNS", "gAMA", "sRGB", "cHRM", "pHYs", "sBIT", "bKGD", "acTL", "fcTL", "fdAT"]);

function stripPng(buf) {
  const parts = [buf.subarray(0, 8)];
  let i = 8;
  while (i + 8 <= buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.toString("ascii", i + 4, i + 8);
    const end = i + 12 + len;
    if (end > buf.length) throw new UploadError("corrupt", "PNG chunk exceeds file length");
    if (PNG_KEEP.has(type)) parts.push(buf.subarray(i, end));
    i = end;
    if (type === "IEND") break;
  }
  return Buffer.concat(parts);
}

// JPEG: drop APP1..APP13, APP15 (EXIF, XMP, ICC, Photoshop) and COM segments; keep APP0 (JFIF) and APP14 (Adobe color transform).
function stripJpeg(buf) {
  const parts = [buf.subarray(0, 2)];
  let i = 2;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    if (marker === 0xff) { i++; continue; }
    if (marker === 0xda) { parts.push(buf.subarray(i)); return Buffer.concat(parts); }
    const len = buf.readUInt16BE(i + 2);
    const end = i + 2 + len;
    const drop = (marker >= 0xe1 && marker <= 0xed) || marker === 0xef || marker === 0xfe;
    if (!drop) parts.push(buf.subarray(i, end));
    i = end;
  }
  parts.push(buf.subarray(i));
  return Buffer.concat(parts);
}

// WebP: drop EXIF and XMP chunks and clear their flags in VP8X; keep everything else.
function stripWebp(buf) {
  const chunks = [];
  let i = 12;
  while (i + 8 <= buf.length) {
    const fourcc = buf.toString("ascii", i, i + 4);
    const size = buf.readUInt32LE(i + 4);
    const padded = size + (size % 2);
    const end = Math.min(i + 8 + padded, buf.length);
    if (fourcc !== "EXIF" && fourcc !== "XMP ") {
      const chunk = Buffer.from(buf.subarray(i, end));
      if (fourcc === "VP8X" && chunk.length >= 9) chunk[8] &= ~0x0c; // clear EXIF (0x08) and XMP (0x04) flags
      chunks.push(chunk);
    }
    i = end;
  }
  const body = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(body.length + 4, 4);
  header.write("WEBP", 8, "ascii");
  return Buffer.concat([header, body]);
}

export function stripMetadata(buf, mediaType) {
  if (mediaType === "image/png") return stripPng(buf);
  if (mediaType === "image/jpeg") return stripJpeg(buf);
  if (mediaType === "image/webp") return stripWebp(buf);
  throw new UploadError("invalid_type", "Unsupported media type");
}

// Validate, then strip. Returns the cleaned bytes and the facts the orchestrator stores.
export function prepareUpload(buf, limits = LIMITS) {
  const info = validateImage(buf, limits);
  const cleaned = stripMetadata(buf, info.mediaType);
  // Hash the cleaned bytes so an identical screenshot with identical options can reuse a cached result (W5/WNFR-02).
  const sha256 = createHash("sha256").update(cleaned).digest("hex");
  return { ...info, bytes: cleaned, sha256 };
}

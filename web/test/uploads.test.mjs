import { test } from "node:test";
import assert from "node:assert/strict";
import { detectType, inspectImage, validateImage, stripMetadata, prepareUpload, UploadError, LIMITS } from "../server/uploads.mjs";
import { makePng, makeJpeg, makeWebp, SVG_BYTES } from "./helpers.mjs";

const pngChunkTypes = (buf) => { const t = []; let i = 8; while (i + 8 <= buf.length) { const len = buf.readUInt32BE(i); t.push(buf.toString("ascii", i + 4, i + 8)); i += 12 + len; } return t; };

test("accepts PNG, JPEG, and WebP by magic bytes and reads dimensions", () => {
  assert.deepEqual(inspectImage(makePng(120, 80)), { mediaType: "image/png", width: 120, height: 80 });
  assert.deepEqual(inspectImage(makeJpeg(640, 480)), { mediaType: "image/jpeg", width: 640, height: 480 });
  assert.deepEqual(inspectImage(makeWebp(300, 200)), { mediaType: "image/webp", width: 300, height: 200 });
});

test("rejects non-image and disguised content regardless of declared type or extension", () => {
  assert.equal(detectType(SVG_BYTES), null);
  assert.throws(() => validateImage(SVG_BYTES), (e) => e instanceof UploadError && e.code === "invalid_type");
  assert.throws(() => validateImage(Buffer.from("GIF89a....")), (e) => e.code === "invalid_type");
  assert.throws(() => validateImage(Buffer.from("%PDF-1.4")), (e) => e.code === "invalid_type");
  assert.throws(() => validateImage(Buffer.alloc(0)), (e) => e.code === "invalid_type");
});

test("enforces size and dimension limits and stores nothing on failure paths", () => {
  assert.throws(() => validateImage(makePng(200, 200), { ...LIMITS, maxBytes: 100 }), (e) => e.code === "too_large" && e.status === 413);
  assert.throws(() => validateImage(makePng(20, 20)), (e) => e.code === "too_small");
  assert.throws(() => validateImage(makePng(20_000, 100, { fillData: false })), (e) => e.code === "too_large");
  assert.throws(() => validateImage(makePng(7_000, 7_000, { fillData: false })), (e) => e.code === "too_large"); // pixel cap
  const ok = validateImage(makePng(800, 600));
  assert.equal(ok.ext, "png");
});

test("strips PNG text and EXIF chunks but keeps what is needed to render", () => {
  const dirty = makePng(100, 100, { text: "secret project codename", exif: true });
  assert.ok(pngChunkTypes(dirty).includes("tEXt") && pngChunkTypes(dirty).includes("eXIf"));
  const clean = stripMetadata(dirty, "image/png");
  const types = pngChunkTypes(clean);
  assert.deepEqual(types, ["IHDR", "IDAT", "IEND"]);
  assert.ok(!clean.includes("codename"));
  assert.deepEqual(inspectImage(clean), { mediaType: "image/png", width: 100, height: 100 });
});

test("strips JPEG APP1 EXIF but keeps JFIF and the frame", () => {
  const dirty = makeJpeg(640, 480, { exif: true });
  assert.ok(dirty.includes("GPSLatitude"));
  const clean = stripMetadata(dirty, "image/jpeg");
  assert.ok(!clean.includes("GPSLatitude"));
  assert.ok(clean.includes("JFIF"));
  assert.deepEqual(inspectImage(clean), { mediaType: "image/jpeg", width: 640, height: 480 });
  assert.equal(clean[clean.length - 2], 0xff); assert.equal(clean[clean.length - 1], 0xd9);
});

test("strips WebP EXIF chunk and clears the VP8X EXIF flag", () => {
  const dirty = makeWebp(300, 200, { exif: true });
  assert.ok(dirty.includes("EXIF"));
  const clean = stripMetadata(dirty, "image/webp");
  assert.ok(!clean.includes("EXIF"));
  assert.equal(clean[20] & 0x08, 0);
  assert.equal(clean.readUInt32LE(4), clean.length - 8);
  assert.deepEqual(inspectImage(clean), { mediaType: "image/webp", width: 300, height: 200 });
});

test("prepareUpload returns cleaned bytes with facts for storage", () => {
  const out = prepareUpload(makePng(200, 300, { text: "x" }));
  assert.equal(out.mediaType, "image/png");
  assert.equal(out.width, 200); assert.equal(out.height, 300);
  assert.ok(Buffer.isBuffer(out.bytes) && !pngChunkTypes(out.bytes).includes("tEXt"));
});

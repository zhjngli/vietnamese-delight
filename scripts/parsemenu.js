import { execFile } from "child_process";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execFileP = promisify(execFile);

const UBEREATS_URL =
  "https://www.ubereats.com/store/vietnamese-delight-w-washington-blvd/5qOZv-i2RL6G2blPIkGCAw?diningMode=DELIVERY";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const OUT_TSX = "src/components/items.tsx";
const IMG_DIR = "public/menu";
const IMG_WEB_PREFIX = "/menu";

async function fetchUrl(url) {
  const { stdout } = await execFileP(
    "curl",
    ["-sL", "--fail", "--max-time", "30", "-A", USER_AGENT, url],
    { maxBuffer: 32 * 1024 * 1024 },
  );
  return stdout;
}

async function downloadToFile(url, dest) {
  if (fs.existsSync(dest)) return "cached";
  const tmp = dest + ".part";
  try {
    await execFileP(
      "curl",
      ["-sL", "--fail", "--max-time", "30", "-A", USER_AGENT, "-o", tmp, url],
      { maxBuffer: 32 * 1024 * 1024 },
    );
    fs.renameSync(tmp, dest);
    return "downloaded";
  } catch (err) {
    try {
      fs.unlinkSync(tmp);
    } catch {}
    throw err;
  }
}

function extractScripts(html) {
  const scripts = [];
  const re = /<script[^>]*>([^<]+)<\/script>/g;
  let m;
  while ((m = re.exec(html))) scripts.push(m[1]);
  return scripts;
}

function findJsonLdRestaurant(scripts) {
  for (const s of scripts) {
    if (s.includes('"@type":"Restaurant"') && s.trim().startsWith("{")) {
      return s.trim();
    }
  }
  throw new Error("Restaurant JSON-LD script not found");
}

function findImageBlobScript(scripts) {
  let best = null;
  let bestCount = 0;
  for (const s of scripts) {
    const c = (s.match(/tb-static/g) || []).length;
    if (c > bestCount) {
      best = s;
      bestCount = c;
    }
  }
  if (!best || bestCount < 10) {
    throw new Error(`image blob script not found (best count=${bestCount})`);
  }
  return best.trim();
}

// The blob's quotes are encoded as the 6-char sequence " (etc.).
// Wrapping it as a JSON string body and parsing decodes those escapes.
// A second JSON.parse turns the decoded text into the actual object.
function decodeDoublyEscapedJson(blob) {
  // Replace raw control chars that would make JSON.parse choke.
  const safe = blob.replace(/[\x00-\x1f]/g, (c) => {
    const map = { "\n": "\\n", "\r": "\\r", "\t": "\\t" };
    return map[c] || "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");
  });
  const firstPass = JSON.parse('"' + safe + '"');
  return JSON.parse(firstPass);
}

function collectImagePairs(node, out) {
  if (node === null || node === undefined) return;
  if (Array.isArray(node)) {
    for (const v of node) collectImagePairs(v, out);
    return;
  }
  if (typeof node !== "object") return;
  if (
    typeof node.title === "string" &&
    typeof node.imageUrl === "string" &&
    node.imageUrl.startsWith("https://tb-static")
  ) {
    if (!out.has(node.title)) out.set(node.title, node.imageUrl);
  }
  for (const k of Object.keys(node)) collectImagePairs(node[k], out);
}

function regexFallbackImagePairs(decodedText) {
  const out = new Map();
  const re =
    /"imageUrl":"(https:\/\/tb-static[^"]+)"[^{}]{0,500}?"title":"([^"]{1,200})"/g;
  let m;
  while ((m = re.exec(decodedText))) {
    if (!out.has(m[2])) out.set(m[2], m[1]);
  }
  return out;
}

function decodeHtmlEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeItemName(name) {
  return decodeHtmlEntities(name).replace(/＆/g, "&").replace(/'/g, "'");
}

function sanitizeSectionName(name) {
  return decodeHtmlEntities(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/-/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function sha1Hex(s) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

function emitItemsFile(sections, nameToImage, imageUrlToLocalPath) {
  const blocks = [];
  for (const sec of sections) {
    if (!sec.name || !sec.hasMenuItem || sec.hasMenuItem.length === 0) continue;
    const slug = sanitizeSectionName(sec.name);
    if (!slug) continue;
    const itemLines = [];
    for (const it of sec.hasMenuItem) {
      const name = normalizeItemName(it.name);
      const price = parseFloat(it.offers?.price ?? "0");
      const url = nameToImage.get(it.name) || nameToImage.get(name);
      const imageSrc = url ? imageUrlToLocalPath.get(url) || "" : "";
      const desc = normalizeItemName(it.description || "").trim();
      const fields = [
        `name: ${JSON.stringify(name)}`,
        `price: ${price}`,
        `imageSrc: ${JSON.stringify(imageSrc)}`,
      ];
      if (desc) fields.push(`description: ${JSON.stringify(desc)}`);
      itemLines.push(`  {\n    ${fields.join(",\n    ")},\n  },`);
    }
    blocks.push(`export const ${slug} = [\n${itemLines.join("\n")}\n];`);
  }
  return blocks.join("\n") + "\n";
}

async function main() {
  console.log(`fetching ${UBEREATS_URL} ...`);
  const html = await fetchUrl(UBEREATS_URL);
  console.log(`fetched ${html.length} bytes`);

  const scripts = extractScripts(html);
  console.log(`extracted ${scripts.length} <script> tags`);

  const jsonLd = JSON.parse(findJsonLdRestaurant(scripts));
  const sections = jsonLd?.hasMenu?.hasMenuSection || [];
  console.log(`JSON-LD: ${sections.length} sections`);

  const imageBlob = findImageBlobScript(scripts);
  let nameToImage = new Map();
  try {
    const data = decodeDoublyEscapedJson(imageBlob);
    collectImagePairs(data, nameToImage);
    console.log(`structured image parse: ${nameToImage.size} pairs`);
  } catch (err) {
    console.warn(
      `structured image parse failed (${err.message}); falling back to regex`,
    );
    const safe = imageBlob.replace(/[\x00-\x1f]/g, (c) => {
      const map = { "\n": "\\n", "\r": "\\r", "\t": "\\t" };
      return map[c] || "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");
    });
    const decodedText = JSON.parse('"' + safe + '"');
    nameToImage = regexFallbackImagePairs(decodedText);
    console.log(`regex fallback image parse: ${nameToImage.size} pairs`);
  }

  if (nameToImage.size === 0) {
    console.warn(
      "WARNING: no item images extracted; items.tsx will have empty imageSrc fields",
    );
  }

  fs.mkdirSync(IMG_DIR, { recursive: true });
  const uniqueUrls = new Set(nameToImage.values());
  const imageUrlToLocalPath = new Map();
  let downloaded = 0;
  let cached = 0;
  for (const url of uniqueUrls) {
    const local = path.join(IMG_DIR, sha1Hex(url) + ".jpeg");
    const webPath = `${IMG_WEB_PREFIX}/${path.basename(local)}`;
    imageUrlToLocalPath.set(url, webPath);
    const result = await downloadToFile(url, local);
    if (result === "downloaded") downloaded++;
    else cached++;
  }
  console.log(`images: ${downloaded} downloaded, ${cached} cached`);

  const itemsFile = emitItemsFile(sections, nameToImage, imageUrlToLocalPath);
  fs.writeFileSync(OUT_TSX, itemsFile);
  console.log(`wrote ${OUT_TSX} (${itemsFile.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

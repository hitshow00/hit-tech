import fs from "node:fs";
import path from "node:path";

const cat = fs.readFileSync("src/lib/catalog.ts", "utf8");
const regex = /"(?:url|mediumUrl|thumbUrl)":\s*"(\/media\/[^"]+)"/g;

let match;
let missing = 0;
let checked = 0;

while ((match = regex.exec(cat)) !== null) {
  const urlPath = match[1];
  const diskPath = path.join(process.cwd(), "public", urlPath.replace(/^\//, ""));
  checked++;
  if (!fs.existsSync(diskPath)) {
    console.error("MISSING:", urlPath, "->", diskPath);
    missing++;
  }
}

console.log(`Checked ${checked} image URLs in catalog.ts. Missing: ${missing}`);

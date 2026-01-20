const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const outputFile = path.join(distDir, "precache-manifest.json");
const excludeNames = new Set(["sw.js", "precache-manifest.json"]);

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

if (!fs.existsSync(distDir)) {
  console.error(`dist directory not found at ${distDir}`);
  process.exit(1);
}

const files = walk(distDir)
  .filter((filePath) => !excludeNames.has(path.basename(filePath)))
  .map((filePath) => {
    const rel = path.relative(distDir, filePath).split(path.sep).join("/");
    return `/${rel}`;
  });

files.sort();

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2) + "\n", "utf8");
console.log(`Wrote ${files.length} entries to ${outputFile}`);

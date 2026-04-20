const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SCAN_DIRS = ["apps", "packages"];
const FORBIDDEN = [/from\s+["']src\//g, /from\s+["']@legacy\//g, /require\(["']src\//g];

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (/\.(ts|tsx|js|mjs|cjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function findViolations(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const violations = [];
  FORBIDDEN.forEach((pattern) => {
    if (pattern.test(content)) {
      violations.push(pattern);
    }
  });
  return violations.length > 0;
}

const files = SCAN_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));
const invalidFiles = files.filter(findViolations);

if (invalidFiles.length > 0) {
  console.error("Boundary check failed. Forbidden legacy imports found:");
  invalidFiles.forEach((file) => {
    console.error(`- ${path.relative(ROOT, file)}`);
  });
  process.exit(1);
}

console.log("Boundary check passed.");

import fs from "node:fs";

const TYPES = ["feat", "fix", "chore", "docs", "refactor", "test", "style"];

// Read file with commit message
const args = process.argv.slice(2);

const commitMsg = fs.readFileSync(args[0], "utf8");

if (commitMsg.startsWith('Merge ')) {
  console.log('VALID MERGE');
} else if (TYPES.some(type => commitMsg.startsWith(`${type}:`))) {
  console.log('VALID COMMIT');
} else {
  process.exit(1);
}
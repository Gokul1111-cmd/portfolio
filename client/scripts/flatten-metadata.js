import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-journey-roadmap.js');

// Read the file
let content = fs.readFileSync(seedPath, 'utf8');

// Pattern to match metadata blocks in certification entries
// Match: metadata: {\n      issuer: '...',\n      issueDate: ...,\n    },
const metadataPattern = /metadata:\s*\{\s*issuer:\s*'([^']+)',\s*issueDate:\s*(null|'[^']*'),\s*\},/g;

let replaced = 0;
content = content.replace(metadataPattern, (match, issuer, issueDate) => {
  replaced++;
  return `issuer: '${issuer}',\n    issueDate: ${issueDate},`;
});

console.log(`Replaced ${replaced} metadata blocks`);

// Write back
fs.writeFileSync(seedPath, content, 'utf8');
console.log('✅ Metadata flattened successfully');

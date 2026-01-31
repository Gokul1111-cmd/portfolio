const fs = require('fs');

let content = fs.readFileSync('seed-journey-roadmap.js', 'utf8');

// Fix 1: Replace type: 'module' with type: 'exercise'
content = content.replace(/type: 'module'/g, "type: 'exercise'");

// Fix 2: Replace learningModules with exercises
content = content.replace(
  /const learningModules = entries\.filter\(\(e\) => e\.type === 'module'\);/g,
  "const exercises = entries.filter((e) => e.type === 'exercise');"
);

// Fix 3: Add notes filter
content = content.replace(
  /const certifications = entries\.filter\(\(e\) => e\.type === 'certification'\);/g,
  "const certifications = entries.filter((e) => e.type === 'certification');\nconst notes = entries.filter((e) => e.type === 'note');"
);

// Fix 4: Update summary output
content = content.replace(
  /console\.log\(`- Modules:      \$\{learningModules\.length\}`\);/g,
  "console.log(`- Exercises:    ${exercises.length}`);"
);

content = content.replace(
  /console\.log\(`- Certs:        \$\{certifications\.length\}`\);/g,
  "console.log(`- Certs:        ${certifications.length}`);\n    console.log(`- Notes:        ${notes.length}`);"
);

// Fix 5: Replace provider with issuer
content = content.replace(/provider:/g, 'issuer:');

// Fix 6: Simplify metadata to only issuer and issueDate
content = content.replace(
  /metadata: \{\s+issuer: '([^']+)',\s+duration: '[^']+'\s+\}/g,
  "metadata: {\n      issuer: '$1',\n      issueDate: null\n    }"
);

content = content.replace(
  /metadata: \{\s+issuer: '([^']+)',\s+duration: '[^']+',\s+prerequisite: '[^']+'\s+\}/g,
  "metadata: {\n      issuer: '$1',\n      issueDate: null\n    }"
);

fs.writeFileSync('seed-journey-roadmap.js', content, 'utf8');
console.log('✅ All fixes applied successfully');

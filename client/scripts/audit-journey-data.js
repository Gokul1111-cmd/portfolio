import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceAccountPath = path.join(
  __dirname,
  '../firebase-service-account.json'
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://portfolio-gokul-b1e9f-default-rtdb.firebaseio.com',
});

const db = admin.firestore();

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) acc[value] = [];
    acc[value].push(item);
    return acc;
  }, {});
}

function printSection(title) {
  console.log('\n' + title);
  console.log('-'.repeat(title.length));
}

async function auditJourneyData() {
  console.log('======================================================================');
  console.log('JOURNEY DATA AUDIT');
  console.log('======================================================================');

  const phasesSnapshot = await db.collection('journeyPhases').get();
  const entriesSnapshot = await db.collection('journeyEntries').get();

  const phases = phasesSnapshot.docs.map((doc) => doc.data());
  const entries = entriesSnapshot.docs.map((doc) => doc.data());

  const errors = [];
  const warnings = [];

  // Basic counts
  printSection('Counts');
  console.log(`Phases: ${phases.length}`);
  console.log(`Entries: ${entries.length}`);

  // Duplicate entry IDs
  const seenIds = new Set();
  const duplicateIds = [];
  entries.forEach((entry) => {
    if (seenIds.has(entry.id)) duplicateIds.push(entry.id);
    seenIds.add(entry.id);
  });
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate entry IDs: ${duplicateIds.join(', ')}`);
  }

  // Phase focusArea map
  const phaseFocusAreas = phases.reduce((acc, phase) => {
    acc[phase.id] = phase.focusAreas || [];
    return acc;
  }, {});

  // Domain/focusArea validation
  entries.forEach((entry) => {
    const validDomains = phaseFocusAreas[entry.phaseId] || [];
    if (!validDomains.includes(entry.domain)) {
      errors.push(
        `Entry "${entry.id}" domain "${entry.domain}" not in phase "${entry.phaseId}" focusAreas: [${validDomains.join(', ')}]`
      );
    }
  });

  // Phase totalModules validation
  const entriesByPhase = groupBy(entries, 'phaseId');
  phases.forEach((phase) => {
    const count = entriesByPhase[phase.id]?.length || 0;
    if (phase.totalModules !== count) {
      warnings.push(
        `Phase "${phase.id}" totalModules=${phase.totalModules} but entries=${count}`
      );
    }
  });

  // Order sequence validation
  Object.entries(entriesByPhase).forEach(([phaseId, phaseEntries]) => {
    const orders = phaseEntries.map((e) => e.order).sort((a, b) => a - b);
    const expected = Array.from({ length: phaseEntries.length }, (_, i) => i + 1);
    if (JSON.stringify(orders) !== JSON.stringify(expected)) {
      errors.push(`Phase "${phaseId}" has non-sequential orders: ${orders.join(', ')}`);
    }
  });

  // FocusArea zero-count warning
  phases.forEach((phase) => {
    const focusAreas = phase.focusAreas || [];
    focusAreas.forEach((focusArea) => {
      const count = (entriesByPhase[phase.id] || []).filter(
        (entry) => entry.domain === focusArea
      ).length;
      if (count === 0) {
        warnings.push(
          `Phase "${phase.id}" focusArea "${focusArea}" has 0 entries`
        );
      }
    });
  });

  printSection('Results');
  if (errors.length === 0) {
    console.log('✅ No errors found');
  } else {
    console.log(`❌ ${errors.length} errors found:`);
    errors.forEach((err) => console.log(`  - ${err}`));
  }

  if (warnings.length === 0) {
    console.log('✅ No warnings found');
  } else {
    console.log(`⚠️  ${warnings.length} warnings found:`);
    warnings.forEach((warn) => console.log(`  - ${warn}`));
  }

  console.log('======================================================================');

  if (errors.length > 0) {
    process.exitCode = 1;
  }

  await admin.app().delete();
}

auditJourneyData().catch((error) => {
  console.error('Audit error:', error);
  process.exit(1);
});

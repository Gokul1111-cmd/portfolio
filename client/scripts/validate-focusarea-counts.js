import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Firebase Admin SDK
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

// Phase definitions with focusAreas
const phases = {
  foundations: {
    title: 'Phase 1: Foundations',
    focusAreas: [
      'Linux Administration',
      'Networking',
      'Python',
      'Go',
      'Git',
      'Version Control',
    ],
  },
  cloud: {
    title: 'Phase 2: Cloud',
    focusAreas: [
      'AWS Fundamentals',
      'VPC',
      'IAM',
      'Multi-Account Architecture',
      'Security',
    ],
  },
  iac: {
    title: 'Phase 3: IaC',
    focusAreas: [
      'Terraform',
      'State Management',
      'Policy-as-Code',
      'Supply Chain Security',
    ],
  },
  devops: {
    title: 'Phase 4: DevOps',
    focusAreas: [
      'CI/CD',
      'Docker',
      'Kubernetes',
      'GitOps',
      'Blue/Green Deployment',
      'Canary Deployment',
    ],
  },
  security: {
    title: 'Phase 5: Security',
    focusAreas: [
      'Threat Modeling',
      'DevSecOps',
      'Container Security',
      'AWS Security',
      'Secrets Management',
    ],
  },
  sre: {
    title: 'Phase 6: SRE',
    focusAreas: [
      'Observability',
      'SLO/SLA',
      'Incident Response',
      'Chaos Engineering',
      'FinOps',
    ],
  },
  documentation: {
    title: 'Phase 7: Documentation',
    focusAreas: [
      'ADRs',
      'System Documentation',
      'Runbooks',
      'Postmortems',
      'Technical Writing',
    ],
  },
};

async function validateFocusAreaCounts() {
  console.log(
    '======================================================================\n'
  );
  console.log('FOCUSAREA ENTRY COUNT VALIDATION');
  console.log(
    '======================================================================\n'
  );

  const issues = [];

  for (const [phaseId, phaseData] of Object.entries(phases)) {
    console.log(`\n${phaseData.title}:`);
    console.log('-'.repeat(50));

    for (const focusArea of phaseData.focusAreas) {
      const snapshot = await db
        .collection('journeyEntries')
        .where('phaseId', '==', phaseId)
        .where('domain', '==', focusArea)
        .get();

      const count = snapshot.size;
      const status = count === 0 ? '⚠️  ZERO ITEMS' : '✅';
      console.log(`  ${status} ${focusArea}: ${count} entries`);

      if (count === 0) {
        issues.push({
          phase: phaseData.title,
          focusArea,
          count,
        });
      }
    }
  }

  console.log('\n' + '='.repeat(66));

  if (issues.length === 0) {
    console.log('\n✅ ALL FOCUSAREAS HAVE ENTRIES\n');
  } else {
    console.log(`\n⚠️  FOUND ${issues.length} FOCUSAREAS WITH ZERO ENTRIES:\n`);
    issues.forEach((issue) => {
      console.log(`  - ${issue.phase} → "${issue.focusArea}"`);
    });
    console.log();
  }

  console.log('='.repeat(66));

  await admin.app().delete();
}

validateFocusAreaCounts().catch((error) => {
  console.error('Validation error:', error);
  process.exit(1);
});

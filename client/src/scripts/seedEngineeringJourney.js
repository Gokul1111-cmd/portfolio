/**
 * Seed Script for Engineering Journey Data
 * 
 * This script populates Firestore with sample phases and entries.
 * Useful for initial setup and testing.
 * 
 * Usage:
 * node --input-type=module src/scripts/seedEngineeringJourney.js
 * 
 * Prerequisites:
 * 1. Firebase project must be configured with Firestore
 * 2. VITE_FIREBASE_* environment variables must be set in .env.local
 * 3. Firestore security rules should allow writes (or use service account)
 */

import { createJourneyPhase, createJourneyEntry } from '@/services/engineeringJourneyService.js';

// ============================================================================
// SAMPLE DATA
// ============================================================================

const seedPhases = [
  {
    title: 'Phase 1 — Foundations',
    status: 'Completed',
    focusAreas: ['Linux', 'Networking', 'Git', 'Python'],
    order: 1,
  },
  {
    title: 'Phase 2 — Cloud Infrastructure',
    status: 'In Progress',
    focusAreas: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    order: 2,
  },
  {
    title: 'Phase 3 — DevOps Mastery',
    status: 'Planned',
    focusAreas: ['Terraform', 'Monitoring', 'Security', 'Scaling'],
    order: 3,
  },
];

const seedEntries = [
  {
    title: 'Secure App Directory',
    phaseId: 'phase-1',
    domain: 'Linux',
    status: 'Completed',
    type: 'project',
    description: 'Built a secure file system with user permission management and encryption.',
    techStack: ['Linux', 'Bash', 'OpenSSL', 'Python'],
    githubLink: 'https://github.com/example/secure-app-directory',
    isPublic: true,
    order: 1,
    links: [
      { label: 'GitHub', url: 'https://github.com/example/secure-app-directory' },
      { label: 'Blog Post', url: 'https://example.com/blog/secure-app' },
    ],
    artifacts: [
      { type: 'code', url: 'https://github.com/example/secure-app-directory' },
      { type: 'demo', url: 'https://demo.example.com/secure-app' },
    ],
  },
  {
    title: 'Web Server from Scratch',
    phaseId: 'phase-1',
    domain: 'Networking',
    status: 'Completed',
    type: 'project',
    description: 'Created a multi-threaded HTTP web server with connection pooling.',
    techStack: ['Python', 'Networking', 'Threading', 'HTTP'],
    githubLink: 'https://github.com/example/web-server',
    isPublic: true,
    order: 2,
    links: [],
    artifacts: [],
  },
  {
    title: 'Docker Fundamentals Course',
    phaseId: 'phase-2',
    domain: 'Docker',
    status: 'In Progress',
    type: 'certification',
    description: 'Working through comprehensive Docker course with hands-on labs.',
    techStack: ['Docker', 'Containers', 'Images', 'Compose'],
    githubLink: null,
    isPublic: true,
    order: 1,
    links: [
      { label: 'Course', url: 'https://example.com/docker-course' },
    ],
    artifacts: [],
  },
  {
    title: 'AWS Solutions Architect Associate',
    phaseId: 'phase-2',
    domain: 'AWS',
    status: 'Planned',
    type: 'certification',
    description: 'Pursuing AWS certification with focus on infrastructure design.',
    techStack: ['AWS', 'EC2', 'S3', 'RDS', 'Lambda'],
    githubLink: null,
    isPublic: true,
    order: 2,
    links: [
      { label: 'AWS Training', url: 'https://aws.amazon.com/training/' },
    ],
    artifacts: [],
  },
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedDatabase() {
  console.log('🌱 Starting Engineering Journey seed...\n');

  try {
    // Seed phases
    console.log('📝 Creating phases...');
    const createdPhases = [];
    for (const phaseData of seedPhases) {
      try {
        const createdPhase = await createJourneyPhase(phaseData);
        createdPhases.push(createdPhase);
        console.log(`✓ Created phase: "${createdPhase.title}"`);
      } catch (error) {
        console.error(`✗ Failed to create phase "${phaseData.title}":`, error.message);
      }
    }

    console.log(`\n✓ Created ${createdPhases.length} phases\n`);

    // Seed entries
    console.log('📝 Creating entries...');
    let createdCount = 0;
    for (const entryData of seedEntries) {
      try {
        const createdEntry = await createJourneyEntry(entryData);
        console.log(`✓ Created entry: "${createdEntry.title}"`);
        createdCount++;
      } catch (error) {
        console.error(
          `✗ Failed to create entry "${entryData.title}":`,
          error.message
        );
      }
    }

    console.log(`\n✓ Created ${createdCount} entries`);
    console.log('\n🌱 Seed complete! Your Engineering Journey data is now in Firestore.\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// ============================================================================
// ENVIRONMENT VARIABLE CHECK
// ============================================================================

if (!process.env.VITE_FIREBASE_API_KEY) {
  console.error(
    '❌ Error: Firebase environment variables not found.\n' +
      'Please create a .env.local file with VITE_FIREBASE_* variables.\n' +
      'See client/.env.example for the required variables.'
  );
  process.exit(1);
}

// ============================================================================
// RUN SEED
// ============================================================================

seedDatabase();

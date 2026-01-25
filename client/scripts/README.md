# Development Scripts

This folder contains one-time setup and maintenance scripts for the portfolio project.

## Scripts

### `seed-journey-roadmap.js` ✨ NEW
Seeds the complete Cloud/DevOps/Security Engineering Journey roadmap.

**What it creates:**
- 1 Journey: "Cloud/DevOps/Security Engineering Roadmap"  
- 6 Phases: Foundations, Cloud, IaC, DevOps, Security, SRE
- 27 Entries: Learning topics, projects, and certifications

**Usage:**
```bash
node scripts/seed-journey-roadmap.js
```

**Data Structure:**
- `journeys` collection - Journey cards with progress
- `journeyPhases` collection - Phases with focus areas (includes journeyId)
- `journeyEntries` collection - Learning entries (includes phaseId, certification fields)

### `seed.js`
Seeds the Firestore database with initial portfolio data (projects, skills, content).

**Usage:**
```bash
node scripts/seed.js
```

### `seed-certificates.js`
Seeds the certificates collection with sample certificate data.

**Usage:**
```bash
node scripts/seed-certificates.js
```

### `seed-timeline.js`
Seeds the timeline/experience data.

**Usage:**
```bash
node scripts/seed-timeline.js
```

## Notes

- These scripts require Firebase Admin SDK credentials
- Run these only once during initial setup (or to reset data)
- Make sure `firebase-service-account.json` exists in `/client` directory
- Scripts create new documents (safe to re-run, won't delete existing data)
- Update journey entry status via Admin Dashboard after seeding

## Firebase Configuration

Firebase configuration files are located in `/config/firebase/`:
- `firestore.rules` - Firestore security rules
- `storage.rules` - Firebase Storage security rules
- `firestore-seed.json` - Sample data structure
- `cors.json` - CORS configuration for Firebase Storage

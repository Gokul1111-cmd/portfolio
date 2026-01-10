# Development Scripts

This folder contains one-time setup and maintenance scripts for the portfolio project.

## Scripts

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
- Run these only once during initial setup
- Make sure `.env.local` is configured with Firebase credentials
- Scripts are safe to re-run (they will update existing data)

## Firebase Configuration

Firebase configuration files are located in `/config/firebase/`:
- `firestore.rules` - Firestore security rules
- `storage.rules` - Firebase Storage security rules
- `firestore-seed.json` - Sample data structure
- `cors.json` - CORS configuration for Firebase Storage

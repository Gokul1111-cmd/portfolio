# Engineering Journey — Firebase Integration Guide

## Overview

The Engineering Journey section is now fully integrated with Firebase Firestore, providing persistent data storage with fallback support for offline scenarios.

## Architecture

```
Frontend Components
├── EngineeringJourney.jsx      (reads data, displays phases/entries)
└── AdminEngineeringJourney.jsx (admin form, creates/updates data)
        ↓
Service Layer
└── engineeringJourneyService.js (Firebase operations)
        ↓
Firebase Initialization
└── firebaseJourney.js          (Firebase setup)
        ↓
Firestore Collections
├── journeyPhases               (7 functions: 2 write, 5 read)
└── journeyEntries
```

## Firebase Collections Schema

### `journeyPhases` Collection

```javascript
{
  id: string,              // unique phase identifier (e.g., "phase-1")
  title: string,           // e.g., "Phase 1 — Foundations"
  status: string,          // "Planned" | "In Progress" | "Completed"
  focusAreas: string[],    // e.g., ["Linux", "Networking", "Git"]
  order: number,           // display order (1, 2, 3, ...)
  createdAt: timestamp,    // auto-generated on creation
  updatedAt: timestamp,    // optional, manual updates only
  // Firestore internal field
  docId: string           // firestore document ID (auto-generated)
}
```

### `journeyEntries` Collection

```javascript
{
  id: string,              // unique entry identifier
  title: string,           // e.g., "Secure App Directory"
  phaseId: string,         // references journeyPhases.id
  domain: string,          // e.g., "Linux", "AWS", "DevOps"
  status: string,          // "Planned" | "In Progress" | "Completed"
  type: string,            // "project" | "lab" | "certification" | "exercise" | "note"
  description: string,     // detailed description
  techStack: string[],     // e.g., ["Linux", "Bash", "Docker"]
  githubLink: string|null, // optional GitHub repository URL
  isPublic: boolean,       // visibility on portfolio (default: true)
  order: number,           // display order within phase
  links: object[],         // optional: [{label: string, url: string}, ...]
  artifacts: object[],     // optional: [{type: string, url: string}, ...]
  createdAt: timestamp,    // auto-generated on creation
  // Firestore internal field
  docId: string           // firestore document ID (auto-generated)
}
```

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing one)
3. Enable Firestore Database
4. Go to Project Settings → Service Accounts
5. Copy the web app configuration (API Key, Auth Domain, etc.)

### 2. Configure Environment Variables

Create `client/.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Set Firestore Security Rules

**For Development (permissive):**

Go to Firestore → Rules and set:

```firestore_rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents
    match /journeyPhases/{document=**} {
      allow read;
    }
    match /journeyEntries/{document=**} {
      allow read: if resource.data.isPublic == true;
    }
    
    // Allow write access for authenticated admins
    match /journeyPhases/{document=**} {
      allow write: if request.auth != null;
    }
    match /journeyEntries/{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

**For Production (strict):**

```firestore_rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /journeyPhases/{document=**} {
      allow read;
    }
    match /journeyEntries/{document=**} {
      allow read: if resource.data.isPublic == true;
    }
    
    // Admin-only write access
    match /journeyPhases/{document=**} {
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    match /journeyEntries/{document=**} {
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### 4. Seed Initial Data

Run the seed script to populate sample data:

```bash
cd client
node --input-type=module src/scripts/seedEngineeringJourney.js
```

The script will:
- Create 3 sample phases
- Create 4 sample entries
- Output results to console

### 5. Test the Integration

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Visit the home page — EngineeringJourney section should display data
3. Open browser DevTools console to verify Firebase logs
4. Go to Admin Dashboard (route: `/admin`) to test form submission

## Service Layer Functions

### Read Operations

**`getJourneyPhases()`**
- Returns: Array of phases (public, ordered by `order` field)
- Usage: Frontend display
- Error handling: Falls back to empty array, logs to console

**`getJourneyEntries()`**
- Returns: Array of entries where `isPublic === true`
- Usage: Frontend display
- Ordering: By `order` field ascending

**`getAllJourneyEntries()`**
- Returns: All entries including private ones
- Usage: Admin dashboard
- Requires auth protection (TODO: implement)

**`getEntriesByPhase(phaseId)`**
- Returns: Entries filtered by phaseId and isPublic
- Usage: Component internal filtering
- Parameters: phaseId (string)

### Write Operations

**`createJourneyEntry(entryObject)`**
- Saves: Single entry to Firestore
- Validates: Required fields (title, phaseId, domain, status, type, description, techStack, isPublic, order)
- Returns: Created entry object with docId
- Errors: Throws ValidationError or FirebaseError

**`createJourneyPhase(phaseObject)`**
- Saves: Single phase to Firestore
- Validates: Required fields (title, status, focusAreas, order)
- Returns: Created phase object with docId
- Errors: Throws ValidationError or FirebaseError

### Utility Functions

**`groupEntriesByPhaseAndStatus(phases, entries)`**
- Returns: Nested object structure for rendering
- Usage: EngineeringJourney component
- Structure: `{ phaseId: { "Completed": [...], "In Progress": [...], "Planned": [...] } }`

## Component Integration Points

### EngineeringJourney Component

**Props:** None (fetches data internally via useEffect)

**Features:**
- ✅ Fetches phases and entries from Firebase
- ✅ Falls back to local data if Firebase unavailable
- ✅ Displays loading and error states
- ✅ Responsive grid layout
- ✅ Dark mode support
- ✅ Status badges and progress indicators

**Error Handling:**
- Shows blue banner when data unavailable
- Continues rendering with fallback data
- Logs detailed errors to console

### AdminEngineeringJourney Component

**Props:** None

**Features:**
- ✅ Two tabs: "New Entry" and "New Phase"
- ✅ Form validation before submission
- ✅ Firebase persistence via service layer
- ✅ Success/error message display
- ✅ Form reset on successful submission
- ✅ Loading state during submission

**Form Fields (Entry Tab):**
- Title, Phase ID, Order (required)
- Domain, Type (select), Status (select) (required)
- Description (textarea), Tech Stack (required)
- GitHub Link (optional), Public checkbox
- Submit button with loading state

**Form Fields (Phase Tab):**
- Title, Status (select), Order (required)
- Focus Areas (comma-separated, required)
- Submit button with loading state

## Next Steps & TODOs

### 1. Authentication (High Priority)

```javascript
// TODO: Add Firebase Auth integration
// - useAuth hook
// - Login/logout flows
// - Admin role verification
// - Protected admin routes
```

**Files to update:**
- `src/lib/firebaseClient.js` — Add Auth imports
- `src/services/engineeringJourneyService.js` — Add auth checks in write functions
- `src/pages/AdminDashboard.jsx` — Add auth protection
- Create `src/hooks/useAuth.js`

### 2. Input Validation & Sanitization

```javascript
// TODO: Implement
// - URL validation (GitHub, links, artifacts)
// - HTML sanitization for descriptions
// - Array length limits for techStack, links, artifacts
// - Trimming and normalization of all text fields
```

### 3. Audit Logging

```javascript
// TODO: Add audit trail
// - Log all writes with user info and timestamp
// - Track who created/modified entries
// - Create separate 'auditLog' collection
```

### 4. Batch Operations

```javascript
// TODO: Add batch write support
// - createMultipleEntries()
// - reorderEntries()
// - bulkUpdateStatus()
```

### 5. Offline Support

```javascript
// TODO: Enable Firestore offline persistence
// - enableIndexedDbPersistence(db)
// - Queue writes while offline
// - Sync on reconnection
```

## Troubleshooting

### Issue: "Firebase is not initialized"

**Solution:** Verify `.env.local` has all VITE_FIREBASE_* variables and app is reloaded.

### Issue: "Permission denied" errors

**Solution:** Check Firestore security rules. For development, temporarily allow all writes. For production, ensure user is authenticated and has admin role.

### Issue: Data not appearing in Firestore Console

**Solution:**
1. Verify write operation completed (check browser console)
2. Check security rules allow your user to write
3. Confirm collection names match exactly: `journeyPhases`, `journeyEntries`
4. Check `isPublic: false` entries won't appear in public reads

### Issue: Seed script fails

**Solution:**
1. Verify .env.local is in `client/` directory
2. Run from `client/` directory: `cd client && node --input-type=module src/scripts/seedEngineeringJourney.js`
3. Check Firebase project is accessible from your network
4. Ensure Firestore is enabled (not just Realtime Database)

## Files Modified/Created

**Created:**
- `src/lib/firebaseJourney.js` — Firebase initialization (23 lines)
- `src/services/engineeringJourneyService.js` — Service layer (293 lines, 7 functions)
- `src/scripts/seedEngineeringJourney.js` — Seed script (145 lines)

**Updated:**
- `src/components/EngineeringJourney.jsx` — Firebase integration, loading/error states
- `src/components/AdminEngineeringJourney.jsx` — Form field expansion, Firebase persistence
- `src/index.css` — Admin form styling, new CSS classes
- `src/pages/Home.jsx` — EngineeringJourney component integration

## Performance Considerations

- **Query Optimization:** Firestore queries limited to public entries; consider pagination for large datasets
- **Caching:** Service layer doesn't cache; consider adding useMemo in components for repeated renders
- **Real-time Updates:** Current implementation uses one-time reads; for live updates, use `onSnapshot()` instead of `getDocs()`
- **Limits:** Each request counted toward Firestore quota; monitor usage in Firebase Console

## Security Considerations

1. **API Keys exposed in frontend:** Firestore security rules are first line of defense
2. **Admin validation:** Currently missing — TODO: verify user role before write operations
3. **Input validation:** Current basic validation — TODO: add URL sanitization, text length limits
4. **CORS:** Firestore handles CORS automatically
5. **Sensitive data:** Ensure `isPublic: false` entries are not exposed in read queries

## Deployment Checklist

- [ ] Firebase project created and configured
- [ ] `.env.local` with Firebase credentials added to deployment
- [ ] Firestore security rules updated for production
- [ ] Authentication system implemented (if using admin protection)
- [ ] Seed data script run successfully
- [ ] Admin form tested with real Firestore writes
- [ ] Error handling tested (network offline, auth failures)
- [ ] Performance tested with production data volume
- [ ] Backup/restore procedure documented
- [ ] Monitoring alerts set up in Firebase Console

---

**Last Updated:** 2024
**Status:** Beta (ready for production with auth setup)

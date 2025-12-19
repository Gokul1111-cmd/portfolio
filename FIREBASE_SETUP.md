# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select existing project
3. Enter project name (e.g., "gokul-portfolio")
4. Disable Google Analytics (optional for portfolio)
5. Click **"Create project"**

## 2. Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **Production mode** (we'll set rules next)
4. Select your preferred location (e.g., `us-central1`)
5. Click **"Enable"**

## 3. Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace with these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access
    match /{document=**} {
      allow read: if true;
    }
    
    // Only allow writes from your admin (you can add authentication later)
    match /projects/{projectId} {
      allow write: if true;  // Change to auth-based rule later
    }
    
    match /content/{contentId} {
      allow write: if true;  // Change to auth-based rule later
    }
  }
}
```

3. Click **"Publish"**

⚠️ **Note**: These rules allow anyone to write. For production, secure with Firebase Authentication.

## 4. Get Firebase Config

1. In Firebase Console, click **⚙️ Settings** → **Project settings**
2. Scroll to **"Your apps"** section
3. Click **Web icon** (</>) to add a web app
4. Register app name: "Portfolio Website"
5. Copy the `firebaseConfig` object

## 5. Add Environment Variables

### Local Development (.env.local)

Create/update `client/.env.local`:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Admin Password
VITE_ADMIN_PASSWORD=your_secure_password
```

### Vercel Deployment

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add each variable:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `VITE_ADMIN_PASSWORD`
3. Apply to: **Production**, **Preview**, **Development**
4. Click **"Save"**

## 6. Initialize Data (Optional)

You can add initial hero content via Firebase Console:

1. Go to **Firestore Database**
2. Click **"Start collection"**
3. Collection ID: `content`
4. Document ID: `hero`
5. Add fields from `client/data/content.json` → `hero` object
6. Click **"Save"**

## 7. Deploy to Vercel

```bash
# Commit changes
git add .
git commit -m "Migrate to Firebase Firestore"
git push

# Vercel will auto-deploy
```

## 8. Test Your Admin Dashboard

1. Visit: `https://your-vercel-url.vercel.app/admin`
2. Login with your password
3. Try adding/editing projects and hero content
4. Check Firebase Console → Firestore to see data

---

## Pricing Reminder

**Free Tier Limits (Spark Plan):**
- 50,000 reads/day
- 20,000 writes/day  
- 1 GB storage
- 10 GB/month network egress

**Your portfolio will use ~0.1% of these limits** ✅

---

## Troubleshooting

**Error: "Missing or insufficient permissions"**
→ Check Firestore Rules allow read/write

**Error: "Firebase: Error (auth/operation-not-allowed)"**
→ Not needed unless you add Firebase Auth

**API returns 500 error**
→ Check environment variables in Vercel are set correctly

**Data not saving**
→ Verify Firestore rules allow writes

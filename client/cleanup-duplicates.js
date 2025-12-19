/* eslint-env node */
import { adminDb } from './api/firebase-admin.js';

// Cleanup script to remove duplicate projects
async function cleanupDuplicates() {
  try {
    console.log('🧹 Starting cleanup of duplicate projects...');

    const projectsRef = adminDb.collection('projects');
    const snapshot = await projectsRef.get();
    
    console.log(`📊 Total documents in projects collection: ${snapshot.size}`);
    
    const projects = snapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data()
    }));

    // Group by title to find duplicates
    const titleMap = new Map();
    projects.forEach(project => {
      const title = project.title;
      if (!titleMap.has(title)) {
        titleMap.set(title, []);
      }
      titleMap.get(title).push(project);
    });

    let duplicatesRemoved = 0;

    // For each title, keep only the first one and delete the rest
    for (const [title, projectList] of titleMap.entries()) {
      if (projectList.length > 1) {
        console.log(`\n⚠️  Found ${projectList.length} copies of "${title}"`);
        
        // Keep the first one, delete the rest
        for (let i = 1; i < projectList.length; i++) {
          const duplicateId = projectList[i].firestoreId;
          console.log(`   🗑️  Deleting duplicate: ${duplicateId}`);
          await projectsRef.doc(duplicateId).delete();
          duplicatesRemoved++;
        }
        
        console.log(`   ✅ Kept 1 copy, removed ${projectList.length - 1} duplicates`);
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`📊 Total duplicates removed: ${duplicatesRemoved}`);
    console.log(`📊 Unique projects remaining: ${titleMap.size}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

cleanupDuplicates();

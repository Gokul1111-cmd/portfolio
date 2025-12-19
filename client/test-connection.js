/* eslint-env node */
import { db } from './api/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

async function testConnection() {
  try {
    console.log('🧪 Testing Firestore connection...');
    const projectsRef = collection(db, 'projects');
    const snapshot = await getDocs(projectsRef);
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${snapshot.size} projects`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }
}

testConnection();

import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseJourney';

/**
 * Engineering Journey Service
 * 
 * Handles all Firestore operations for journey phases and entries.
 * Provides data fetching and persistence layer for the Engineering Journey feature.
 */

// ============================================================================
// COLLECTION REFERENCES
// ============================================================================

const JOURNEYS_COLLECTION = 'journeys';
const PHASES_COLLECTION = 'journeyPhases';
const ENTRIES_COLLECTION = 'journeyEntries';

// ============================================================================
// FETCH OPERATIONS
// ============================================================================

/**
 * Fetch all journey phases ordered by `order` field
 * 
 * @returns {Promise<Array>} Array of phase objects
 * @throws {Error} If Firestore query fails
 */
export const getJourneyPhases = async () => {
  try {
    const q = query(
      collection(db, PHASES_COLLECTION),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const phases = [];
    querySnapshot.forEach((doc) => {
      phases.push({
        ...doc.data(),
        docId: doc.id, // Store Firestore doc ID for updates
      });
    });
    return phases;
  } catch (error) {
    console.error('[engineeringJourneyService] Error fetching phases:', error);
    throw error;
  }
};

/**
 * Fetch all journeys ordered by `order` field
 *
 * @param {Object} options - filter options
 * @param {boolean} options.publicOnly - when true, returns only public journeys
 * @returns {Promise<Array>} Array of journey objects
 */
export const getJourneys = async (options = { publicOnly: true }) => {
  const { publicOnly } = options;
  try {
    // Simplified query to avoid index requirement
    // TODO: Create composite index for where+orderBy: https://console.firebase.google.com
    const q = publicOnly
      ? query(collection(db, JOURNEYS_COLLECTION), where('isPublic', '==', true))
      : query(collection(db, JOURNEYS_COLLECTION));
    
    const snapshot = await getDocs(q);
    const journeys = [];
    snapshot.forEach((doc) => {
      journeys.push({ ...doc.data(), docId: doc.id });
    });
    
    // Sort client-side instead of using orderBy to avoid index
    journeys.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return journeys;
  } catch (error) {
    console.error('[engineeringJourneyService] Error fetching journeys:', error);
    throw error;
  }
};

/**
 * Fetch a single journey by ID
 * @param {string} journeyId
 * @returns {Promise<Object|null>}
 */
export const getJourneyById = async (journeyId) => {
  try {
    const q = query(
      collection(db, JOURNEYS_COLLECTION),
      where('id', '==', journeyId),
      where('isPublic', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...doc.data(), docId: doc.id };
  } catch (error) {
    console.error(`[engineeringJourneyService] Error fetching journey ${journeyId}:`, error);
    throw error;
  }
};

/**
 * Fetch all public journey entries ordered by `order` field
 * Only returns entries where isPublic === true
 * 
 * @returns {Promise<Array>} Array of entry objects
 * @throws {Error} If Firestore query fails
 */
export const getJourneyEntries = async () => {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where('isPublic', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const entries = [];
    querySnapshot.forEach((doc) => {
      entries.push({
        ...doc.data(),
        docId: doc.id, // Store Firestore doc ID for updates
      });
    });
    return entries;
  } catch (error) {
    console.error('[engineeringJourneyService] Error fetching entries:', error);
    throw error;
  }
};

/**
 * Fetch ALL entries (including private) - for admin only
 * 
 * @returns {Promise<Array>} Array of all entry objects
 * @throws {Error} If Firestore query fails
 */
export const getAllJourneyEntries = async () => {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const entries = [];
    querySnapshot.forEach((doc) => {
      entries.push({
        ...doc.data(),
        docId: doc.id,
      });
    });
    return entries;
  } catch (error) {
    console.error('[engineeringJourneyService] Error fetching all entries:', error);
    throw error;
  }
};

/**
 * Fetch entries filtered by phase ID and public status
 * 
 * @param {string} phaseId - The phase ID to filter by
 * @returns {Promise<Array>} Array of entry objects for the phase
 * @throws {Error} If Firestore query fails
 */
export const getEntriesByPhase = async (phaseId) => {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where('phaseId', '==', phaseId),
      where('isPublic', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const entries = [];
    querySnapshot.forEach((doc) => {
      entries.push({
        ...doc.data(),
        docId: doc.id,
      });
    });
    return entries;
  } catch (error) {
    console.error(`[engineeringJourneyService] Error fetching entries for phase ${phaseId}:`, error);
    throw error;
  }
};

/**
 * Fetch phases filtered by journey ID
 * 
 * @param {string} journeyId - The journey ID to filter by
 * @returns {Promise<Array>} Array of phase objects for the journey
 * @throws {Error} If Firestore query fails
 */
export const getPhasesByJourney = async (journeyId) => {
  try {
    const q = query(
      collection(db, PHASES_COLLECTION),
      where('journeyId', '==', journeyId),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const phases = [];
    querySnapshot.forEach((doc) => {
      phases.push({
        ...doc.data(),
        docId: doc.id,
      });
    });
    return phases;
  } catch (error) {
    console.error(`[engineeringJourneyService] Error fetching phases for journey ${journeyId}:`, error);
    throw error;
  }
};

// ============================================================================
// CREATE / WRITE OPERATIONS
// ============================================================================

/**
 * Create a new journey (top-level card)
 * @param {Object} journey - journey payload
 * @param {string} journey.title
 * @param {string} journey.description
 * @param {string} journey.icon - icon key used in UI
 * @param {string} journey.color - theme color key
 * @param {boolean} journey.isPublic - visibility
 * @param {number} journey.order - sort order
 * @returns {Promise<Object>} created journey
 */
export const createJourney = async (journey) => {
  try {
    const requiredFields = ['title', 'description', 'icon', 'color', 'isPublic', 'order'];
    for (const field of requiredFields) {
      if (!journey[field] && journey[field] !== 0 && journey[field] !== false) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const journeyData = {
      id: journey.id || `journey-${Date.now()}`,
      title: journey.title.trim(),
      description: journey.description.trim(),
      icon: journey.icon.trim(),
      color: journey.color.trim(),
      isPublic: journey.isPublic,
      order: parseInt(journey.order, 10),
      overallProgress: journey.overallProgress ?? 0,
      totalPhases: journey.totalPhases ?? 0,
      completedPhases: journey.completedPhases ?? 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, JOURNEYS_COLLECTION), journeyData);

    console.log('[engineeringJourneyService] Journey created successfully:', docRef.id);

    return { ...journeyData, docId: docRef.id };
  } catch (error) {
    console.error('[engineeringJourneyService] Error creating journey:', error);
    throw error;
  }
};
/**
 * Create a new journey entry
 * 
 * Validates required fields and adds server timestamp
 * 
 * @param {Object} entry - Entry object with required fields:
 *   - title: string
 *   - phaseId: string
 *   - domain: string
 *   - status: 'Completed' | 'In Progress' | 'Planned'
 *   - type: 'project' | 'lab' | 'certification' | 'exercise' | 'note'
 *   - description: string
 *   - techStack: string[]
 *   - isPublic: boolean
 *   - order: number
 *   - githubLink?: string
 *   - certificateImage?: string
 *   - issuer?: string
 *   - issueDate?: string
 *   - credentialLink?: string
 *   - links?: Array<{label, url}>
 *   - artifacts?: Array<{type, url}>
 * 
 * @returns {Promise<Object>} Created entry with Firestore doc ID
 * @throws {Error} If validation fails or write fails
 */
export const createJourneyEntry = async (entry) => {
  try {
    // =====================================================================
    // TODO: Add auth check and role validation
    // if (!currentUser) throw new Error('User not authenticated');
    // if (currentUser.role !== 'admin') throw new Error('Insufficient permissions');
    // =====================================================================

    // =====================================================================
    // VALIDATION
    // =====================================================================
    const requiredFields = ['title', 'phaseId', 'domain', 'status', 'type', 'description', 'techStack', 'isPublic', 'order'];
    for (const field of requiredFields) {
      if (!entry[field] && entry[field] !== 0 && entry[field] !== false) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // TODO: Add stricter input validation
    // - Validate URLs in githubLink, links[], artifacts[]
    // - Validate enum values (status, type)
    // - Sanitize description

    // =====================================================================
    // CONSTRUCT ENTRY OBJECT
    // =====================================================================
    const entryData = {
      id: entry.id || `entry-${Date.now()}`,
      title: entry.title.trim(),
      phaseId: entry.phaseId.trim(),
      domain: entry.domain.trim(),
      status: entry.status,
      type: entry.type,
      description: entry.description.trim(),
      techStack: Array.isArray(entry.techStack)
        ? entry.techStack.map((tech) => tech.trim()).filter((tech) => tech)
        : [],
      isPublic: entry.isPublic,
      order: parseInt(entry.order, 10),
      githubLink: entry.githubLink?.trim() || null,
      certificateImage: entry.certificateImage?.trim() || null,
      issuer: entry.issuer?.trim() || null,
      issueDate: entry.issueDate?.trim() || null,
      credentialLink: entry.credentialLink?.trim() || null,
      links: entry.links || [],
      artifacts: entry.artifacts || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // =====================================================================
    // TODO: Add audit logging
    // logAction('CREATE_JOURNEY_ENTRY', { entryId: entryData.id, userId: currentUser.uid });
    // =====================================================================

    // Save to Firestore
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), entryData);

    console.log('[engineeringJourneyService] Entry created successfully:', docRef.id);

    return {
      ...entryData,
      docId: docRef.id,
    };
  } catch (error) {
    console.error('[engineeringJourneyService] Error creating entry:', error);
    throw error;
  }
};

/**
 * Create a new journey phase
 * 
 * @param {Object} phase - Phase object with:
 *   - title: string
 *   - status: 'Planned' | 'In Progress' | 'Completed'
 *   - focusAreas: string[]
 *   - order: number
 * 
 * @returns {Promise<Object>} Created phase with Firestore doc ID
 * @throws {Error} If validation fails or write fails
 */
export const createJourneyPhase = async (phase) => {
  try {
    // TODO: Add auth check
    const requiredFields = ['title', 'status', 'focusAreas', 'order', 'journeyId'];
    for (const field of requiredFields) {
      if (!phase[field] && phase[field] !== 0 && phase[field] !== false) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const phaseData = {
      id: phase.id || `phase-${Date.now()}`,
      title: phase.title.trim(),
      journeyId: phase.journeyId.trim(),
      status: phase.status,
      focusAreas: Array.isArray(phase.focusAreas)
        ? phase.focusAreas.map((area) => area.trim()).filter((area) => area)
        : [],
      order: parseInt(phase.order, 10),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, PHASES_COLLECTION), phaseData);

    console.log('[engineeringJourneyService] Phase created successfully:', docRef.id);

    return {
      ...phaseData,
      docId: docRef.id,
    };
  } catch (error) {
    console.error('[engineeringJourneyService] Error creating phase:', error);
    throw error;
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get entries grouped by phase and status
 * Useful for complex UI rendering
 * 
 * @param {Array} phases - Array of phase objects
 * @param {Array} entries - Array of entry objects
 * @returns {Object} Nested object: { phaseId: { status: [entries] } }
 */
export const groupEntriesByPhaseAndStatus = (phases, entries) => {
  const grouped = {};

  phases.forEach((phase) => {
    grouped[phase.id] = {
      Completed: [],
      'In Progress': [],
      Planned: [],
    };
  });

  entries.forEach((entry) => {
    if (grouped[entry.phaseId]) {
      grouped[entry.phaseId][entry.status].push(entry);
    }
  });

  return grouped;
};

import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
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
      where('isPublic', '==', true)
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

    const journeyId = journey.id || journey.path || `journey-${Date.now()}`;
    const journeyData = {
      id: journeyId,
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

    const docRef = doc(db, JOURNEYS_COLLECTION, journeyId);
    await setDoc(docRef, journeyData);

    console.log('[engineeringJourneyService] Journey created successfully:', journeyId);

    return { ...journeyData, docId: journeyId };
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
    const entryId = entry.id || `entry-${Date.now()}`;
    const entryData = {
      id: entryId,
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
    const docRef = doc(db, ENTRIES_COLLECTION, entryId);
    await setDoc(docRef, entryData);

    console.log('[engineeringJourneyService] Entry created successfully:', entryId);

    return {
      ...entryData,
      docId: entryId,
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

    const phaseId = phase.id || `phase-${Date.now()}`;
    const phaseData = {
      id: phaseId,
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

    const docRef = doc(db, PHASES_COLLECTION, phaseId);
    await setDoc(docRef, phaseData);

    console.log('[engineeringJourneyService] Phase created successfully:', phaseId);

    return {
      ...phaseData,
      docId: phaseId,
    };
  } catch (error) {
    console.error('[engineeringJourneyService] Error creating phase:', error);
    throw error;
  }
};

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update an existing journey
 * @param {string} journeyId - The journey docId
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated journey object
 */
export const updateJourney = async (journeyId, updates) => {
  try {
    const journeyRef = doc(db, JOURNEYS_COLLECTION, journeyId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(journeyRef, updateData);
    
    // Fetch and return full document
    const updatedDoc = await getDoc(journeyRef);
    if (updatedDoc.exists()) {
      console.log('[engineeringJourneyService] Journey updated successfully:', journeyId);
      return {
        ...updatedDoc.data(),
        docId: journeyId,
      };
    }
    throw new Error('Document not found after update');
  } catch (error) {
    console.error('[engineeringJourneyService] Error updating journey:', error);
    throw error;
  }
};

/**
 * Update an existing journey phase
 * @param {string} phaseId - The phase docId
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated phase object
 */
export const updateJourneyPhase = async (phaseId, updates) => {
  try {
    const phaseRef = doc(db, PHASES_COLLECTION, phaseId);
    const updateData = {
      ...updates,
      focusAreas: Array.isArray(updates.focusAreas) ? updates.focusAreas : (updates.focusAreas || []).split(',').map(f => f.trim()).filter(Boolean),
      updatedAt: serverTimestamp(),
    };
    await updateDoc(phaseRef, updateData);
    
    // Fetch and return full document
    const updatedDoc = await getDoc(phaseRef);
    if (updatedDoc.exists()) {
      console.log('[engineeringJourneyService] Phase updated successfully:', phaseId);
      return {
        ...updatedDoc.data(),
        docId: phaseId,
      };
    }
    throw new Error('Document not found after update');
  } catch (error) {
    console.error('[engineeringJourneyService] Error updating phase:', error);
    throw error;
  }
};

/**
 * Update an existing journey entry
 * @param {string} entryId - The entry docId
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated entry object
 */
export const updateJourneyEntry = async (entryId, updates) => {
  try {
    const entryRef = doc(db, ENTRIES_COLLECTION, entryId);
    const updateData = {
      ...updates,
      techStack: Array.isArray(updates.techStack) ? updates.techStack : (updates.techStack || []).split(',').map(t => t.trim()).filter(Boolean),
      updatedAt: serverTimestamp(),
    };
    await updateDoc(entryRef, updateData);
    
    // Fetch and return full document
    const updatedDoc = await getDoc(entryRef);
    if (updatedDoc.exists()) {
      console.log('[engineeringJourneyService] Entry updated successfully:', entryId);
      return {
        ...updatedDoc.data(),
        docId: entryId,
      };
    }
    throw new Error('Document not found after update');
  } catch (error) {
    console.error('[engineeringJourneyService] Error updating entry:', error);
    throw error;
  }
};

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a journey and all its associated phases and entries (cascade delete)
 * @param {string} journeyId - The journey docId
 * @returns {Promise<void>}
 */
export const deleteJourney = async (journeyId) => {
  try {
    // First get the journey to find its internal ID
    const journeyRef = doc(db, JOURNEYS_COLLECTION, journeyId);
    const journeyDoc = await getDoc(journeyRef);
    
    if (!journeyDoc.exists()) {
      throw new Error('Journey not found');
    }
    
    const journeyInternalId = journeyDoc.data().id;
    
    // Get all phases for this journey
    const phasesQuery = query(
      collection(db, PHASES_COLLECTION),
      where('journeyId', '==', journeyInternalId)
    );
    const phasesSnapshot = await getDocs(phasesQuery);
    
    // Delete all phases and their entries
    for (const phaseDoc of phasesSnapshot.docs) {
      await deleteJourneyPhase(phaseDoc.id);
    }
    
    // Finally delete the journey itself
    await deleteDoc(journeyRef);
    console.log('[engineeringJourneyService] Journey and all associated data deleted:', journeyId);
  } catch (error) {
    console.error('[engineeringJourneyService] Error deleting journey:', error);
    throw error;
  }
};

/**
 * Delete a journey phase and all its associated entries (cascade delete)
 * @param {string} phaseId - The phase docId
 * @returns {Promise<void>}
 */
export const deleteJourneyPhase = async (phaseId) => {
  try {
    // First get the phase to find its internal ID
    const phaseRef = doc(db, PHASES_COLLECTION, phaseId);
    const phaseDoc = await getDoc(phaseRef);
    
    if (!phaseDoc.exists()) {
      throw new Error('Phase not found');
    }
    
    const phaseInternalId = phaseDoc.data().id;
    
    // Get all entries for this phase
    const entriesQuery = query(
      collection(db, ENTRIES_COLLECTION),
      where('phaseId', '==', phaseInternalId)
    );
    const entriesSnapshot = await getDocs(entriesQuery);
    
    // Delete all entries
    const deletePromises = entriesSnapshot.docs.map(entryDoc => 
      deleteJourneyEntry(entryDoc.id)
    );
    await Promise.all(deletePromises);
    
    // Finally delete the phase itself
    await deleteDoc(phaseRef);
    console.log('[engineeringJourneyService] Phase and all entries deleted:', phaseId);
  } catch (error) {
    console.error('[engineeringJourneyService] Error deleting phase:', error);
    throw error;
  }
};

/**
 * Delete a journey entry
 * @param {string} entryId - The entry docId
 * @returns {Promise<void>}
 */
export const deleteJourneyEntry = async (entryId) => {
  try {
    const entryRef = doc(db, ENTRIES_COLLECTION, entryId);
    await deleteDoc(entryRef);
    console.log('[engineeringJourneyService] Entry deleted successfully:', entryId);
  } catch (error) {
    console.error('[engineeringJourneyService] Error deleting entry:', error);
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

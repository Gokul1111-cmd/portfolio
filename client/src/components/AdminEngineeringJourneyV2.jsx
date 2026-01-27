import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Trash2, Save, AlertCircle, CheckCircle, Cloud, Code, Shield, Database } from 'lucide-react';
import { getJourneys, getPhasesByJourney, getEntriesByPhase, createJourney, updateJourney, deleteJourney, createJourneyPhase, updateJourneyPhase, deleteJourneyPhase, createJourneyEntry, updateJourneyEntry, deleteJourneyEntry } from '@/services/engineeringJourneyService';

const iconMap = { cloud: Cloud, code: Code, shield: Shield, database: Database };

/**
 * AdminEngineeringJourneyV2
 * 
 * Split-screen admin interface:
 * - Left: Live preview of engineering journeys (same as public site)
 * - Right: Edit forms with click-to-edit functionality
 * 
 * Click any card → opens edit panel
 */
export const AdminEngineeringJourneyV2 = () => {
  const [journeys, setJourneys] = useState([]);
  const [phases, setPhases] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editMode, setEditMode] = useState(null); // 'journey' | 'phase' | 'entry' | 'new-journey' | 'new-phase' | 'new-entry'
  
  // Form data
  const [journeyForm, setJourneyForm] = useState({ title: '', description: '', icon: 'code', color: 'blue', isPublic: true, order: 1 });
  const [phaseForm, setPhaseForm] = useState({ title: '', status: 'Planned', focusAreas: '', order: 1 });
  const [entryForm, setEntryForm] = useState({ title: '', domain: '', status: 'Planned', type: 'lab', description: '', techStack: '', githubLink: '', isPublic: true, order: 1 });
  
  // UI feedback
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const journeyList = await getJourneys({ publicOnly: false });
        setJourneys(journeyList);
        
        if (journeyList.length > 0) {
          const firstJourney = journeyList[0];
          setSelectedJourney(firstJourney);
          
          const phaseList = await getPhasesByJourney(firstJourney.id);
          setPhases(phaseList);
          
          if (phaseList.length > 0) {
            const firstPhase = phaseList[0];
            setSelectedPhase(firstPhase);
            const entriesList = await getEntriesByPhase(firstPhase.id);
            setEntries(entriesList);
          }
        }
      } catch (error) {
        showToast(`Failed to load data: ${error.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && editMode) {
        setEditMode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode]);

  // Handle journey selection
  const handleSelectJourney = async (journey) => {
    // If same journey, don't refetch
    if (selectedJourney?.docId === journey.docId) return;
    
    setSelectedJourney(journey);
    setSelectedPhase(null);
    setSelectedEntry(null);
    setEditMode(null);
    
    try {
      const phaseList = await getPhasesByJourney(journey.id);
      setPhases(phaseList);
      if (phaseList.length > 0) {
        setSelectedPhase(phaseList[0]);
        const entriesList = await getEntriesByPhase(phaseList[0].id);
        setEntries(entriesList);
      } else {
        setEntries([]);
      }
    } catch (error) {
      showToast(`Failed to load phases: ${error.message}`, 'error');
    }
  };

  // Handle phase selection
  const handleSelectPhase = async (phase) => {
    // If same phase, don't refetch
    if (selectedPhase?.docId === phase.docId) return;
    
    setSelectedPhase(phase);
    setSelectedEntry(null);
    setEditMode(null);
    
    try {
      const entriesList = await getEntriesByPhase(phase.id);
      setEntries(entriesList);
    } catch (error) {
      showToast(`Failed to load entries: ${error.message}`, 'error');
    }
  };

  // Save journey
  const handleSaveJourney = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editMode === 'new-journey') {
        const newJourney = await createJourney({ ...journeyForm, order: journeys.length + 1 });
        setJourneys([...journeys, newJourney]);
        showToast('✓ Journey created!', 'success');
      } else {
        const updated = await updateJourney(selectedJourney.docId, journeyForm);
        setJourneys(journeys.map(j => j.docId === selectedJourney.docId ? updated : j));
        setSelectedJourney(updated);
        showToast('✓ Journey updated!', 'success');
      }
      setEditMode(null);
    } catch (error) {
      showToast(`Failed to save: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Save phase
  const handleSavePhase = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const phaseData = { ...phaseForm, journeyId: selectedJourney.id, focusAreas: phaseForm.focusAreas.split(',').map(f => f.trim()).filter(Boolean) };
      
      if (editMode === 'new-phase') {
        const newPhase = await createJourneyPhase({ ...phaseData, order: phases.length + 1 });
        setPhases([...phases, newPhase]);
        showToast('✓ Phase created!', 'success');
      } else {
        const updated = await updateJourneyPhase(selectedPhase.docId, phaseData);
        setPhases(phases.map(p => p.docId === selectedPhase.docId ? updated : p));
        setSelectedPhase(updated);
        showToast('✓ Phase updated!', 'success');
      }
      setEditMode(null);
    } catch (error) {
      showToast(`Failed to save: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Save entry
  const handleSaveEntry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const entryData = { 
        ...entryForm, 
        phaseId: selectedPhase.id, 
        techStack: entryForm.techStack.split(',').map(t => t.trim()).filter(Boolean),
        type: entryForm.type || 'lab',
        isPublic: entryForm.isPublic !== undefined ? entryForm.isPublic : true
      };
      
      if (editMode === 'new-entry') {
        const newEntry = await createJourneyEntry({ ...entryData, order: entries.length + 1 });
        setEntries([...entries, newEntry]);
        showToast('✓ Entry created!', 'success');
      } else {
        const updated = await updateJourneyEntry(selectedEntry.docId, entryData);
        setEntries(entries.map(en => en.docId === selectedEntry.docId ? updated : en));
        setSelectedEntry(updated);
        showToast('✓ Entry updated!', 'success');
      }
      setEditMode(null);
    } catch (error) {
      showToast(`Failed to save: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handlers
  const handleDeleteJourney = async (journeyDocId) => {
    if (!confirm('Delete this journey and ALL its phases and entries? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteJourney(journeyDocId);
      setJourneys(journeys.filter(j => j.docId !== journeyDocId));
      setPhases([]);
      setEntries([]);
      setSelectedJourney(null);
      setSelectedPhase(null);
      showToast('✓ Journey deleted!', 'success');
    } catch (error) {
      showToast(`Failed to delete: ${error.message}`, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeletePhase = async (phaseDocId) => {
    if (!confirm('Delete this phase and ALL its entries? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteJourneyPhase(phaseDocId);
      setPhases(phases.filter(p => p.docId !== phaseDocId));
      setEntries([]);
      setSelectedPhase(null);
      showToast('✓ Phase deleted!', 'success');
    } catch (error) {
      showToast(`Failed to delete: ${error.message}`, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteEntry = async (entryDocId) => {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteJourneyEntry(entryDocId);
      setEntries(entries.filter(e => e.docId !== entryDocId));
      setSelectedEntry(null);
      showToast('✓ Entry deleted!', 'success');
    } catch (error) {
      showToast(`Failed to delete: ${error.message}`, 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading engineering journeys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Global Loading Overlay for Deleting */}
      {deleting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-xl p-8 shadow-2xl">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground text-center">Deleting...</p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg flex items-center gap-2 z-50 ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Engineering Journey Manager</h2>
        <button
          onClick={() => {
            setJourneyForm({ title: '', description: '', icon: 'code', color: 'blue', isPublic: true, order: journeys.length + 1 });
            setEditMode('new-journey');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} /> New Journey
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Journeys Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-4">All Journeys</h3>
            {journeys.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h4 className="font-semibold text-lg mb-2">No Journeys Yet</h4>
                <p className="text-muted-foreground mb-4">Create your first engineering journey to get started</p>
                <button
                  onClick={() => {
                    setJourneyForm({ title: '', description: '', icon: 'code', color: 'blue', isPublic: true, order: 1 });
                    setEditMode('new-journey');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  <Plus size={18} /> Create Journey
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {journeys.map((journey) => {
                const Icon = iconMap[journey.icon] || Code;
                return (
                  <motion.div
                    key={journey.id}
                    onClick={() => handleSelectJourney(journey)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedJourney?.id === journey.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{journey.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{journey.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setJourneyForm({
                              title: journey.title,
                              description: journey.description,
                              icon: journey.icon,
                              color: journey.color,
                              isPublic: journey.isPublic,
                              order: journey.order
                            });
                            setEditMode('journey');
                          }}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} className="text-primary" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteJourney(journey.docId);
                          }}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            )}
          </div>

          {/* Phases Grid */}
          {selectedJourney && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Phases</h3>
                <button
                  onClick={() => {
                    setPhaseForm({ title: '', status: 'Planned', focusAreas: '', order: phases.length + 1 });
                    setEditMode('new-phase');
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  <Plus size={16} /> Phase
                </button>
              </div>
              {phases.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <Plus className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-3">No phases in this journey yet</p>
                  <button
                    onClick={() => {
                      setPhaseForm({ title: '', status: 'Planned', focusAreas: '', order: 1 });
                      setEditMode('new-phase');
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    <Plus size={16} /> Add First Phase
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phases.map((phase) => (
                  <motion.div
                    key={phase.id}
                    onClick={() => handleSelectPhase(phase)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPhase?.id === phase.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{phase.title.replace(/^Phase \d+ — /, '')}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{phase.status}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhaseForm({ 
                              title: phase.title, 
                              status: phase.status,
                              focusAreas: (phase.focusAreas || []).join(', '),
                              order: phase.order || 1
                            });
                            setEditMode('phase');
                          }}
                          className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                        >
                          <Edit2 size={16} className="text-primary" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhase(phase.docId);
                          }}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                </div>
              )}
            </div>
          )}

          {/* Entries Grid */}
          {selectedPhase && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Learning Entries</h3>
                <button
                  onClick={() => {
                    setEntryForm({ title: '', domain: '', status: 'Planned', type: 'lab', description: '', techStack: '', githubLink: '', isPublic: true, order: entries.length + 1 });
                    setEditMode('new-entry');
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  <Plus size={16} /> Entry
                </button>
              </div>
              {entries.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <Code className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-3">No learning entries in this phase yet</p>
                  <button
                    onClick={() => {
                      setEntryForm({ title: '', domain: '', status: 'Planned', type: 'lab', description: '', techStack: '', githubLink: '', isPublic: true, order: 1 });
                      setEditMode('new-entry');
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    <Plus size={16} /> Add First Entry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedEntry?.id === entry.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{entry.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{entry.domain} • {entry.status}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEntryForm({
                              title: entry.title,
                              domain: entry.domain,
                              status: entry.status,
                              type: entry.type || 'lab',
                              description: entry.description,
                              techStack: (entry.techStack || []).join(', '),
                              githubLink: entry.githubLink || '',
                              isPublic: entry.isPublic !== undefined ? entry.isPublic : true,
                              order: entry.order || 1
                            });
                            setEditMode('entry');
                          }}
                          className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                        >
                          <Edit2 size={16} className="text-primary" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEntry(entry.docId);
                          }}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {editMode === 'journey' || editMode === 'new-journey' ? (
              <motion.div key="journey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-xl p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold">{editMode === 'new-journey' ? 'New Journey' : 'Edit Journey'}</h3>
                  <button onClick={() => setEditMode(null)} className="p-1 hover:bg-muted rounded"><X size={18} /></button>
                </div>
                <form onSubmit={handleSaveJourney} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <input type="text" value={journeyForm.title || ''} onChange={(e) => setJourneyForm({ ...journeyForm, title: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea rows={3} value={journeyForm.description || ''} onChange={(e) => setJourneyForm({ ...journeyForm, description: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Icon</label>
                      <select value={journeyForm.icon || 'code'} onChange={(e) => setJourneyForm({ ...journeyForm, icon: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none">
                        <option value="cloud">Cloud</option>
                        <option value="code">Code</option>
                        <option value="shield">Shield</option>
                        <option value="database">Database</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Color</label>
                      <select value={journeyForm.color || 'blue'} onChange={(e) => setJourneyForm({ ...journeyForm, color: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none">
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="red">Red</option>
                        <option value="green">Green</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="journeyPublic" checked={journeyForm.isPublic} onChange={(e) => setJourneyForm({ ...journeyForm, isPublic: e.target.checked })} />
                    <label htmlFor="journeyPublic" className="text-sm font-medium">Public</label>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Order</label>
                    <input type="number" min="1" value={journeyForm.order || 1} onChange={(e) => setJourneyForm({ ...journeyForm, order: parseInt(e.target.value) || 1 })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" required />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
                    <Save size={18} /> {submitting ? 'Saving...' : 'Save'}
                  </button>
                </form>
              </motion.div>
            ) : editMode === 'phase' || editMode === 'new-phase' ? (
              <motion.div key="phase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-xl p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold">{editMode === 'new-phase' ? 'New Phase' : 'Edit Phase'}</h3>
                  <button onClick={() => setEditMode(null)} className="p-1 hover:bg-muted rounded"><X size={18} /></button>
                </div>
                <form onSubmit={handleSavePhase} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <input type="text" value={phaseForm.title || ''} onChange={(e) => setPhaseForm({ ...phaseForm, title: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select value={phaseForm.status || 'Planned'} onChange={(e) => setPhaseForm({ ...phaseForm, status: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none">
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Focus Areas (comma-separated)</label>
                    <textarea rows={3} value={phaseForm.focusAreas || ''} onChange={(e) => setPhaseForm({ ...phaseForm, focusAreas: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
                    <Save size={18} /> {submitting ? 'Saving...' : 'Save'}
                  </button>
                </form>
              </motion.div>
            ) : editMode === 'entry' || editMode === 'new-entry' ? (
              <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-xl p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold">{editMode === 'new-entry' ? 'New Entry' : 'Edit Entry'}</h3>
                  <button onClick={() => setEditMode(null)} className="p-1 hover:bg-muted rounded"><X size={18} /></button>
                </div>
                <form onSubmit={handleSaveEntry} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <input type="text" value={entryForm.title || ''} onChange={(e) => setEntryForm({ ...entryForm, title: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Domain</label>
                      <input type="text" value={entryForm.domain || ''} onChange={(e) => setEntryForm({ ...entryForm, domain: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <select value={entryForm.type || 'lab'} onChange={(e) => setEntryForm({ ...entryForm, type: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" required>
                        <option value="lab">Lab</option>
                        <option value="project">Project</option>
                        <option value="certification">Certification</option>
                        <option value="exercise">Exercise</option>
                        <option value="note">Note</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <select value={entryForm.status || 'Planned'} onChange={(e) => setEntryForm({ ...entryForm, status: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none">
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Display Order</label>
                      <input type="number" min="1" value={entryForm.order || 1} onChange={(e) => setEntryForm({ ...entryForm, order: parseInt(e.target.value) || 1 })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea rows={3} value={entryForm.description || ''} onChange={(e) => setEntryForm({ ...entryForm, description: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tech Stack (comma-separated)</label>
                    <textarea rows={2} value={entryForm.techStack || ''} onChange={(e) => setEntryForm({ ...entryForm, techStack: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">GitHub Link</label>
                    <input type="url" value={entryForm.githubLink || ''} onChange={(e) => setEntryForm({ ...entryForm, githubLink: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="entryPublic" checked={entryForm.isPublic !== undefined ? entryForm.isPublic : true} onChange={(e) => setEntryForm({ ...entryForm, isPublic: e.target.checked })} />
                    <label htmlFor="entryPublic" className="text-sm font-medium">Public</label>
                  </div>
                  <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
                    <Save size={18} /> {submitting ? 'Saving...' : 'Save'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground sticky top-8">
                <p>Click on any journey, phase, or entry to edit</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminEngineeringJourneyV2;

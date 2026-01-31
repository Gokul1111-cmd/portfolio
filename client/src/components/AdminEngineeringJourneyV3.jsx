import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Trash2, Save, AlertCircle, CheckCircle, Cloud, Code, Shield, Database, Link2, FileText, ChevronDown } from 'lucide-react';
import { getJourneys, getPhasesByJourney, getEntriesByPhase, createJourney, updateJourney, deleteJourney, createJourneyPhase, updateJourneyPhase, deleteJourneyPhase, createJourneyEntry, updateJourneyEntry, deleteJourneyEntry } from '@/services/engineeringJourneyService';

const iconMap = { cloud: Cloud, code: Code, shield: Shield, database: Database };

/**
 * AdminEngineeringJourneyV3
 * 
 * Enhanced admin interface with:
 * - Smart domain dropdown (filters by phase focusAreas)
 * - Auto-generated entry IDs from title
 * - Conditional certification fields (issuer, issueDate)
 * - Dynamic links & artifacts management
 * - Live preview panel
 * - Bulk actions (status, domain, delete)
 * - Real-time validation
 */
export const AdminEngineeringJourneyV3 = () => {
  const [journeys, setJourneys] = useState([]);
  const [phases, setPhases] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editMode, setEditMode] = useState(null);
  
  // Multi-select for bulk actions
  const [selectedEntryIds, setSelectedEntryIds] = useState(new Set());
  
  // Form data
  const [journeyForm, setJourneyForm] = useState({ title: '', description: '', icon: 'code', color: 'blue', isPublic: true, order: 1 });
  const [phaseForm, setPhaseForm] = useState({ title: '', status: 'Planned', focusAreas: '', order: 1, totalModules: 0 });
  const [entryForm, setEntryForm] = useState({ 
    id: '', title: '', domain: '', status: 'Planned', type: 'lab', 
    description: '', techStack: '', links: [], artifacts: [], 
    issuer: '', issueDate: '', isPublic: true, order: 1 
  });
  
  // UI feedback
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

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

  // Generate entry ID from title (slug format)
  const generateEntryId = (title) => {
    return 'entry-' + title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  // Auto-generate ID when title changes
  const handleEntryTitleChange = (title) => {
    setEntryForm({ 
      ...entryForm, 
      title,
      id: editMode === 'new-entry' ? generateEntryId(title) : entryForm.id 
    });
  };

  // Get valid domains for selected phase
  const getValidDomains = () => {
    if (!selectedPhase) return [];
    return selectedPhase.focusAreas || [];
  };

  // Add link to entry
  const addLink = () => {
    setEntryForm({
      ...entryForm,
      links: [...(entryForm.links || []), { label: '', url: '' }]
    });
  };

  // Remove link from entry
  const removeLink = (index) => {
    setEntryForm({
      ...entryForm,
      links: entryForm.links.filter((_, i) => i !== index)
    });
  };

  // Update link
  const updateLink = (index, field, value) => {
    const newLinks = [...entryForm.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setEntryForm({ ...entryForm, links: newLinks });
  };

  // Add artifact to entry
  const addArtifact = () => {
    setEntryForm({
      ...entryForm,
      artifacts: [...(entryForm.artifacts || []), { type: '', url: '' }]
    });
  };

  // Remove artifact from entry
  const removeArtifact = (index) => {
    setEntryForm({
      ...entryForm,
      artifacts: entryForm.artifacts.filter((_, i) => i !== index)
    });
  };

  // Update artifact
  const updateArtifact = (index, field, value) => {
    const newArtifacts = [...entryForm.artifacts];
    newArtifacts[index] = { ...newArtifacts[index], [field]: value };
    setEntryForm({ ...entryForm, artifacts: newArtifacts });
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
    if (selectedJourney?.docId === journey.docId) return;
    
    setSelectedJourney(journey);
    setSelectedPhase(null);
    setSelectedEntry(null);
    setEditMode(null);
    setSelectedEntryIds(new Set());
    
    try {
      const phaseList = await getPhasesByJourney(journey.id);
      setPhases(phaseList);
      if (phaseList.length > 0) {
        const firstPhase = phaseList[0];
        setSelectedPhase(firstPhase);
        const entriesList = await getEntriesByPhase(firstPhase.id);
        setEntries(entriesList);
      }
    } catch (error) {
      showToast(`Failed to load phases: ${error.message}`, 'error');
    }
  };

  // Handle phase selection
  const handleSelectPhase = async (phase) => {
    if (selectedPhase?.docId === phase.docId) return;
    
    setSelectedPhase(phase);
    setSelectedEntry(null);
    setEditMode(null);
    setSelectedEntryIds(new Set());
    
    try {
      const entriesList = await getEntriesByPhase(phase.id);
      setEntries(entriesList);
    } catch (error) {
      showToast(`Failed to load entries: ${error.message}`, 'error');
    }
  };

  // Save entry with validation
  const handleSaveEntry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Validation
      if (!entryForm.id) {
        showToast('Entry ID is required', 'error');
        setSubmitting(false);
        return;
      }
      
      if (!entryForm.domain) {
        showToast('Domain is required', 'error');
        setSubmitting(false);
        return;
      }

      // Check if domain is valid for this phase
      const validDomains = getValidDomains();
      if (!validDomains.includes(entryForm.domain)) {
        showToast(`Invalid domain. Valid options: ${validDomains.join(', ')}`, 'error');
        setSubmitting(false);
        return;
      }

      const entryData = { 
        id: entryForm.id,
        phaseId: selectedPhase.id,
        journeyId: selectedJourney.id,
        title: entryForm.title,
        domain: entryForm.domain,
        status: entryForm.status,
        type: entryForm.type,
        description: entryForm.description,
        techStack: entryForm.techStack.split(',').map(t => t.trim()).filter(Boolean),
        links: entryForm.links || [],
        artifacts: entryForm.artifacts || [],
        isPublic: entryForm.isPublic,
        order: entryForm.order
      };

      // Add certification fields if applicable
      if (entryForm.type === 'certification') {
        entryData.issuer = entryForm.issuer;
        entryData.issueDate = entryForm.issueDate || null;
      }
      
      if (editMode === 'new-entry') {
        const newEntry = await createJourneyEntry(entryData);
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

  // Bulk update status
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedEntryIds.size === 0) {
      showToast('Select entries first', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const entriesToUpdate = entries.filter(e => selectedEntryIds.has(e.docId));
      
      for (const entry of entriesToUpdate) {
        await updateJourneyEntry(entry.docId, { ...entry, status: newStatus });
      }

      const updated = entries.map(e => 
        selectedEntryIds.has(e.docId) ? { ...e, status: newStatus } : e
      );
      setEntries(updated);
      setSelectedEntryIds(new Set());
      showToast(`✓ Updated ${entriesToUpdate.length} entries to ${newStatus}`, 'success');
    } catch (error) {
      showToast(`Failed to update: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
      setShowBulkActions(false);
    }
  };

  // Bulk delete entries
  const handleBulkDelete = async () => {
    if (selectedEntryIds.size === 0) {
      showToast('Select entries first', 'error');
      return;
    }

    if (!confirm(`Delete ${selectedEntryIds.size} entries? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const entriesToDelete = entries.filter(e => selectedEntryIds.has(e.docId));
      
      for (const entry of entriesToDelete) {
        await deleteJourneyEntry(entry.docId);
      }

      setEntries(entries.filter(e => !selectedEntryIds.has(e.docId)));
      setSelectedEntryIds(new Set());
      showToast(`✓ Deleted ${entriesToDelete.length} entries`, 'success');
    } catch (error) {
      showToast(`Failed to delete: ${error.message}`, 'error');
    } finally {
      setDeleting(false);
      setShowBulkActions(false);
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

  const validDomains = getValidDomains();
  const isCertification = entryForm.type === 'certification';

  return (
    <div className="space-y-6 relative">
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

      {/* Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Journey & Phase List */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Journeys */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">Journeys</h3>
              <button
                onClick={() => {
                  setEditMode('new-journey');
                  setJourneyForm({ title: '', description: '', icon: 'code', color: 'blue', isPublic: true, order: journeys.length + 1 });
                }}
                className="p-1 hover:bg-muted rounded text-xs"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {journeys.map((journey) => (
                <button
                  key={journey.docId}
                  onClick={() => handleSelectJourney(journey)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                    selectedJourney?.docId === journey.docId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <div className="font-medium truncate">{journey.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Phases */}
          {selectedJourney && (
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Phases</h3>
                <button
                  onClick={() => {
                    setEditMode('new-phase');
                    setPhaseForm({ title: '', status: 'Planned', focusAreas: '', order: phases.length + 1, totalModules: 0 });
                  }}
                  className="p-1 hover:bg-muted rounded text-xs"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {phases.map((phase) => (
                  <button
                    key={phase.docId}
                    onClick={() => handleSelectPhase(phase)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                      selectedPhase?.docId === phase.docId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="font-medium truncate">{phase.title.replace(/^Phase \d+ — /, '')}</div>
                    <div className="text-[10px] opacity-70">{phase.focusAreas?.length || 0} focus areas</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Column: Entries List */}
        <div className="lg:col-span-1">
          {selectedPhase && (
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Entries</h3>
                <button
                  onClick={() => {
                    setEditMode('new-entry');
                    setEntryForm({ 
                      id: '', title: '', domain: '', status: 'Planned', type: 'lab', 
                      description: '', techStack: '', links: [], artifacts: [], 
                      issuer: '', issueDate: '', isPublic: true, order: entries.length + 1 
                    });
                  }}
                  className="p-1 hover:bg-muted rounded text-xs"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Bulk Actions Bar */}
              {selectedEntryIds.size > 0 && (
                <div className="mb-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-medium">{selectedEntryIds.size} selected</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setShowBulkActions(!showBulkActions)}
                        className="px-2 py-1 bg-primary text-white rounded text-[10px] hover:opacity-90"
                      >
                        Actions ▼
                      </button>
                      <button
                        onClick={() => setSelectedEntryIds(new Set())}
                        className="px-2 py-1 bg-gray-400 text-white rounded text-[10px] hover:opacity-90"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {showBulkActions && (
                    <div className="space-y-1 mt-2 border-t pt-2">
                      <button
                        onClick={() => handleBulkStatusUpdate('Completed')}
                        disabled={submitting}
                        className="block w-full text-left px-2 py-1 hover:bg-white/20 rounded text-[10px]"
                      >
                        ✓ Mark Completed
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate('In Progress')}
                        disabled={submitting}
                        className="block w-full text-left px-2 py-1 hover:bg-white/20 rounded text-[10px]"
                      >
                        ⏳ Mark In Progress
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate('Planned')}
                        disabled={submitting}
                        className="block w-full text-left px-2 py-1 hover:bg-white/20 rounded text-[10px]"
                      >
                        ◯ Mark Planned
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        disabled={deleting}
                        className="block w-full text-left px-2 py-1 hover:bg-red-500/20 rounded text-[10px] text-red-600 dark:text-red-400"
                      >
                        🗑️ Delete Selected
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {entries.map((entry) => (
                  <div
                    key={entry.docId}
                    className={`p-2 rounded-lg border cursor-pointer transition-all ${
                      selectedEntry?.docId === entry.docId
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedEntryIds.has(entry.docId)}
                        onChange={(e) => {
                          e.stopPropagation();
                          const newSelected = new Set(selectedEntryIds);
                          if (e.target.checked) {
                            newSelected.add(entry.docId);
                          } else {
                            newSelected.delete(entry.docId);
                          }
                          setSelectedEntryIds(newSelected);
                        }}
                        className="mt-1"
                      />
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="flex-1 text-left"
                      >
                        <div className="text-xs font-medium truncate">{entry.title}</div>
                        <div className="text-[10px] text-muted-foreground">{entry.domain}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-white text-[9px] font-medium ${
                            entry.status === 'Completed' ? 'bg-green-500' :
                            entry.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}>
                            {entry.status}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Edit Form + Live Preview */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Edit Form */}
          <AnimatePresence mode="wait">
            {editMode === 'new-entry' || editMode === 'entry' ? (
              <motion.div key="entry-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold">{editMode === 'new-entry' ? 'New Entry' : 'Edit Entry'}</h3>
                  <button onClick={() => setEditMode(null)} className="p-1 hover:bg-muted rounded">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveEntry} className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Entry ID (auto-generated) */}
                  <div>
                    <label className="text-sm font-medium">Entry ID (auto-generated from title)</label>
                    <div className="w-full mt-1 p-2 rounded-lg bg-muted border border-border text-sm font-mono">
                      {entryForm.id || '(auto-generate)'}
                    </div>
                    {editMode === 'entry' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <input
                          type="checkbox"
                          id="manualId"
                          onChange={(e) => {
                            if (!e.target.checked) {
                              setEntryForm({ ...entryForm, id: generateEntryId(entryForm.title) });
                            }
                          }}
                        />
                        <label htmlFor="manualId" className="ml-1">Override ID manually</label>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={entryForm.title || ''}
                      onChange={(e) => handleEntryTitleChange(e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
                      required
                    />
                  </div>

                  {/* Domain (Smart Dropdown) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Domain 
                        <span className="text-xs text-muted-foreground ml-1">(from phase)</span>
                      </label>
                      <select
                        value={entryForm.domain || ''}
                        onChange={(e) => setEntryForm({ ...entryForm, domain: e.target.value })}
                        className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
                        required
                      >
                        <option value="">Select a domain...</option>
                        {validDomains.map((domain) => (
                          <option key={domain} value={domain}>
                            {domain}
                          </option>
                        ))}
                      </select>
                      {validDomains.length === 0 && (
                        <div className="text-xs text-red-500 mt-1">Select a phase first</div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <select
                        value={entryForm.type || 'lab'}
                        onChange={(e) => setEntryForm({ ...entryForm, type: e.target.value })}
                        className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
                        required
                      >
                        <option value="lab">Lab</option>
                        <option value="project">Project</option>
                        <option value="certification">Certification</option>
                        <option value="exercise">Exercise</option>
                        <option value="note">Note</option>
                      </select>
                    </div>
                  </div>

                  {/* Status & Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <select
                        value={entryForm.status || 'Planned'}
                        onChange={(e) => setEntryForm({ ...entryForm, status: e.target.value })}
                        className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Order</label>
                      <input
                        type="number"
                        min="1"
                        value={entryForm.order || 1}
                        onChange={(e) => setEntryForm({ ...entryForm, order: parseInt(e.target.value) || 1 })}
                        className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      rows={3}
                      value={entryForm.description || ''}
                      onChange={(e) => setEntryForm({ ...entryForm, description: e.target.value })}
                      className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
                    />
                  </div>

                  {/* Tech Stack */}
                  {entryForm.type !== 'certification' && (
                    <div>
                      <label className="text-sm font-medium">Tech Stack (comma-separated)</label>
                      <textarea
                        rows={2}
                        value={entryForm.techStack || ''}
                        onChange={(e) => setEntryForm({ ...entryForm, techStack: e.target.value })}
                        placeholder="Docker, Kubernetes, AWS"
                        className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none text-xs"
                      />
                    </div>
                  )}

                  {/* Certification Fields */}
                  {isCertification && (
                    <div className="space-y-3 p-3 bg-yellow-100/20 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <div>
                        <label className="text-sm font-medium">Issuer</label>
                        <input
                          type="text"
                          value={entryForm.issuer || ''}
                          onChange={(e) => setEntryForm({ ...entryForm, issuer: e.target.value })}
                          placeholder="e.g., Linux Foundation, AWS"
                          className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Issue Date (optional)</label>
                        <input
                          type="date"
                          value={entryForm.issueDate || ''}
                          onChange={(e) => setEntryForm({ ...entryForm, issueDate: e.target.value })}
                          className="w-full mt-1 p-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Link2 size={14} /> Links
                      </label>
                      <button
                        type="button"
                        onClick={addLink}
                        className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded"
                      >
                        + Add Link
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(entryForm.links || []).map((link, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Label"
                            value={link.label || ''}
                            onChange={(e) => updateLink(idx, 'label', e.target.value)}
                            className="flex-1 p-2 rounded text-xs border border-border bg-background"
                          />
                          <input
                            type="url"
                            placeholder="URL"
                            value={link.url || ''}
                            onChange={(e) => updateLink(idx, 'url', e.target.value)}
                            className="flex-1 p-2 rounded text-xs border border-border bg-background"
                          />
                          <button
                            type="button"
                            onClick={() => removeLink(idx)}
                            className="px-2 py-1 hover:bg-red-500/20 rounded text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Artifacts */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <FileText size={14} /> Artifacts
                      </label>
                      <button
                        type="button"
                        onClick={addArtifact}
                        className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded"
                      >
                        + Add Artifact
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(entryForm.artifacts || []).map((artifact, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type (e.g., PDF, Certificate)"
                            value={artifact.type || ''}
                            onChange={(e) => updateArtifact(idx, 'type', e.target.value)}
                            className="flex-1 p-2 rounded text-xs border border-border bg-background"
                          />
                          <input
                            type="url"
                            placeholder="URL"
                            value={artifact.url || ''}
                            onChange={(e) => updateArtifact(idx, 'url', e.target.value)}
                            className="flex-1 p-2 rounded text-xs border border-border bg-background"
                          />
                          <button
                            type="button"
                            onClick={() => removeArtifact(idx)}
                            className="px-2 py-1 hover:bg-red-500/20 rounded text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Public Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="entryPublic"
                      checked={entryForm.isPublic !== undefined ? entryForm.isPublic : true}
                      onChange={(e) => setEntryForm({ ...entryForm, isPublic: e.target.checked })}
                    />
                    <label htmlFor="entryPublic" className="text-sm font-medium">Public</label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Save size={18} /> {submitting ? 'Saving...' : 'Save Entry'}
                  </button>
                </form>
              </motion.div>
            ) : selectedEntry ? (
              // Entry Preview
              <motion.div key="entry-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Entry Preview</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMode('entry');
                        setEntryForm({
                          id: selectedEntry.id,
                          title: selectedEntry.title,
                          domain: selectedEntry.domain,
                          status: selectedEntry.status,
                          type: selectedEntry.type,
                          description: selectedEntry.description,
                          techStack: (selectedEntry.techStack || []).join(', '),
                          links: selectedEntry.links || [],
                          artifacts: selectedEntry.artifacts || [],
                          issuer: selectedEntry.issuer || '',
                          issueDate: selectedEntry.issueDate || '',
                          isPublic: selectedEntry.isPublic,
                          order: selectedEntry.order
                        });
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      <Edit2 size={14} className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this entry? Cannot be undone.')) {
                          handleDeleteEntry(selectedEntry.docId);
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      <Trash2 size={14} className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">ID:</span>
                    <div className="font-mono text-xs mt-1">{selectedEntry.id}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Title:</span>
                    <div className="font-bold text-base mt-1">{selectedEntry.title}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Domain:</span>
                    <div className="mt-1">{selectedEntry.domain}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Type:</span>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs font-medium">
                        {selectedEntry.type}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Status:</span>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${
                        selectedEntry.status === 'Completed' ? 'bg-green-500' :
                        selectedEntry.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {selectedEntry.status}
                      </span>
                    </div>
                  </div>
                  {selectedEntry.description && (
                    <div>
                      <span className="font-medium text-muted-foreground">Description:</span>
                      <div className="mt-1 text-xs">{selectedEntry.description}</div>
                    </div>
                  )}
                  {selectedEntry.techStack && selectedEntry.techStack.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground">Tech Stack:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedEntry.techStack.map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-muted rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedEntry.issuer && (
                    <div>
                      <span className="font-medium text-muted-foreground">Issuer:</span>
                      <div className="mt-1">{selectedEntry.issuer}</div>
                    </div>
                  )}
                  {selectedEntry.links && selectedEntry.links.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground">Links:</span>
                      <div className="space-y-1 mt-1">
                        {selectedEntry.links.map((link, idx) => (
                          <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-blue-500 text-xs hover:underline">
                            {link.label} →
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
                <p>Select an entry to preview or click + to create a new one</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminEngineeringJourneyV3;

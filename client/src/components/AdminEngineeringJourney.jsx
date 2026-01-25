import { useState } from 'react';
import { createJourney, createJourneyEntry, createJourneyPhase } from '@/services/engineeringJourneyService';

/**
 * AdminEngineeringJourney Component
 * 
 * Admin interface for managing Engineering Journey entries and phases.
 * Provides forms to create and persist learning entries to Firebase.
 * 
 * TODO: Add auth protection and role-based access control
 */

export const AdminEngineeringJourney = () => {
  const [activeTab, setActiveTab] = useState('entry'); // 'journey' | 'phase' | 'entry'
  const [entryFormData, setEntryFormData] = useState({
    title: '',
    phaseId: '',
    domain: '',
    status: 'Planned',
    type: 'project',
    description: '',
    techStack: '',
    githubLink: '',
    certificateImage: '',
    issuer: '',
    issueDate: '',
    credentialLink: '',
    isPublic: true,
    order: 1,
    links: [],
    artifacts: [],
  });

  const [phaseFormData, setPhaseFormData] = useState({
    journeyId: '',
    title: '',
    status: 'Planned',
    focusAreas: '',
    order: 1,
  });

  const [journeyFormData, setJourneyFormData] = useState({
    title: '',
    description: '',
    icon: 'code',
    color: 'purple',
    isPublic: true,
    order: 1,
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // =========================================================================
  // ENTRY FORM HANDLERS
  // =========================================================================

  const handleEntryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEntryFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // =====================================================================
      // TODO: Add auth check
      // if (!currentUser) {
      //   throw new Error('You must be logged in to create entries');
      // }
      // =====================================================================

      // Construct entry object with parsed techStack
      const entryObject = {
        title: entryFormData.title,
        phaseId: entryFormData.phaseId,
        domain: entryFormData.domain,
        status: entryFormData.status,
        type: entryFormData.type,
        description: entryFormData.description,
        techStack: entryFormData.techStack
          .split(',')
          .map((tech) => tech.trim())
          .filter((tech) => tech),
        githubLink: entryFormData.githubLink || null,
        certificateImage: entryFormData.certificateImage || null,
        issuer: entryFormData.issuer || null,
        issueDate: entryFormData.issueDate || null,
        credentialLink: entryFormData.credentialLink || null,
        isPublic: entryFormData.isPublic,
        order: parseInt(entryFormData.order, 10),
        links: entryFormData.links,
        artifacts: entryFormData.artifacts,
      };

      console.log('[AdminEngineeringJourney] Submitting entry:', entryObject);

      // Save to Firebase
      const createdEntry = await createJourneyEntry(entryObject);

      setSuccessMessage(`✓ Entry "${createdEntry.title}" created successfully!`);

      // Reset form
      setEntryFormData({
        title: '',
        phaseId: '',
        domain: '',
        status: 'Planned',
        type: 'project',
        description: '',
        techStack: '',
        githubLink: '',
        certificateImage: '',
        issuer: '',
        issueDate: '',
        credentialLink: '',
        isPublic: true,
        order: 1,
        links: [],
        artifacts: [],
      });
    } catch (error) {
      console.error('[AdminEngineeringJourney] Error submitting entry:', error);
      setErrorMessage(`✗ Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================================
  // PHASE FORM HANDLERS
  // =========================================================================

  const handlePhaseInputChange = (e) => {
    const { name, value } = e.target;
    setPhaseFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhaseSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // TODO: Add auth check

      const phaseObject = {
        journeyId: phaseFormData.journeyId,
        title: phaseFormData.title,
        status: phaseFormData.status,
        focusAreas: phaseFormData.focusAreas
          .split(',')
          .map((area) => area.trim())
          .filter((area) => area),
        order: parseInt(phaseFormData.order, 10),
      };

      console.log('[AdminEngineeringJourney] Submitting phase:', phaseObject);

      const createdPhase = await createJourneyPhase(phaseObject);

      setSuccessMessage(`✓ Phase "${createdPhase.title}" created successfully!`);

      setPhaseFormData({
        journeyId: '',
        title: '',
        status: 'Planned',
        focusAreas: '',
        order: 1,
      });
    } catch (error) {
      console.error('[AdminEngineeringJourney] Error submitting phase:', error);
      setErrorMessage(`✗ Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================================
  // JOURNEY FORM HANDLERS
  // =========================================================================

  const handleJourneyInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJourneyFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleJourneySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const journeyObject = {
        title: journeyFormData.title,
        description: journeyFormData.description,
        icon: journeyFormData.icon,
        color: journeyFormData.color,
        isPublic: journeyFormData.isPublic,
        order: parseInt(journeyFormData.order, 10),
      };

      const createdJourney = await createJourney(journeyObject);

      setSuccessMessage(`✓ Journey "${createdJourney.title}" created successfully!`);

      setJourneyFormData({
        title: '',
        description: '',
        icon: 'code',
        color: 'purple',
        isPublic: true,
        order: 1,
      });
    } catch (error) {
      console.error('[AdminEngineeringJourney] Error submitting journey:', error);
      setErrorMessage(`✗ Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <section className="admin-engineering-journey">
      <div className="admin-container">
        <h2>Manage Engineering Journey</h2>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'journey' ? 'active' : ''}`}
            onClick={() => setActiveTab('journey')}
          >
            New Journey
          </button>
          <button
            className={`tab-button ${activeTab === 'entry' ? 'active' : ''}`}
            onClick={() => setActiveTab('entry')}
          >
            New Entry
          </button>
          <button
            className={`tab-button ${activeTab === 'phase' ? 'active' : ''}`}
            onClick={() => setActiveTab('phase')}
          >
            New Phase
          </button>
        </div>

        {/* Messages */}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* JOURNEY FORM */}
        {activeTab === 'journey' && (
          <form onSubmit={handleJourneySubmit} className="entry-form">
            <fieldset>
              <legend>Create New Journey</legend>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="journeyTitle">Title *</label>
                  <input
                    type="text"
                    id="journeyTitle"
                    name="title"
                    value={journeyFormData.title}
                    onChange={handleJourneyInputChange}
                    placeholder="e.g., Cloud & DevOps Journey"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="journeyOrder">Order *</label>
                  <input
                    type="number"
                    id="journeyOrder"
                    name="order"
                    value={journeyFormData.order}
                    onChange={handleJourneyInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="journeyDescription">Description *</label>
                <textarea
                  id="journeyDescription"
                  name="description"
                  value={journeyFormData.description}
                  onChange={handleJourneyInputChange}
                  placeholder="Brief description for the journey card"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="journeyIcon">Icon *</label>
                  <select
                    id="journeyIcon"
                    name="icon"
                    value={journeyFormData.icon}
                    onChange={handleJourneyInputChange}
                  >
                    <option value="code">Code</option>
                    <option value="cloud">Cloud</option>
                    <option value="shield">Shield</option>
                    <option value="database">Database</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="journeyColor">Color *</label>
                  <select
                    id="journeyColor"
                    name="color"
                    value={journeyFormData.color}
                    onChange={handleJourneyInputChange}
                  >
                    <option value="purple">Purple</option>
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="journeyIsPublic">
                  <input
                    type="checkbox"
                    id="journeyIsPublic"
                    name="isPublic"
                    checked={journeyFormData.isPublic}
                    onChange={handleJourneyInputChange}
                  />
                  Public (visible on portfolio)
                </label>
              </div>

              <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Journey'}
              </button>
            </fieldset>
          </form>
        )}

        {/* ENTRY FORM */}
        {activeTab === 'entry' && (
          <form onSubmit={handleEntrySubmit} className="entry-form">
            <fieldset>
              <legend>Create New Entry</legend>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phaseId">Phase ID *</label>
                  <input
                    type="text"
                    id="phaseId"
                    name="phaseId"
                    value={entryFormData.phaseId}
                    onChange={handleEntryInputChange}
                    placeholder="e.g., foundations, cloud, devops"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="order">Order *</label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={entryFormData.order}
                    onChange={handleEntryInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={entryFormData.title}
                  onChange={handleEntryInputChange}
                  placeholder="e.g., Secure App Directory"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="domain">Domain *</label>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    value={entryFormData.domain}
                    onChange={handleEntryInputChange}
                    placeholder="e.g., Linux, AWS, DevOps"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={entryFormData.type}
                    onChange={handleEntryInputChange}
                  >
                    <option value="project">Project</option>
                    <option value="lab">Lab</option>
                    <option value="certification">Certification</option>
                    <option value="exercise">Exercise</option>
                    <option value="note">Note</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={entryFormData.status}
                    onChange={handleEntryInputChange}
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={entryFormData.description}
                  onChange={handleEntryInputChange}
                  placeholder="Describe what you learned or built..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="certificateImage">Certificate Image URL (certifications)</label>
                  <input
                    type="url"
                    id="certificateImage"
                    name="certificateImage"
                    value={entryFormData.certificateImage}
                    onChange={handleEntryInputChange}
                    placeholder="https://.../certificate.png"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="credentialLink">Credential Verification URL</label>
                  <input
                    type="url"
                    id="credentialLink"
                    name="credentialLink"
                    value={entryFormData.credentialLink}
                    onChange={handleEntryInputChange}
                    placeholder="https://.../verify"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="issuer">Issuer (certifications)</label>
                  <input
                    type="text"
                    id="issuer"
                    name="issuer"
                    value={entryFormData.issuer}
                    onChange={handleEntryInputChange}
                    placeholder="e.g., AWS, Cisco"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="issueDate">Issue Date (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    id="issueDate"
                    name="issueDate"
                    value={entryFormData.issueDate}
                    onChange={handleEntryInputChange}
                    placeholder="2024-06-15"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="techStack">Tech Stack (comma-separated) *</label>
                <input
                  type="text"
                  id="techStack"
                  name="techStack"
                  value={entryFormData.techStack}
                  onChange={handleEntryInputChange}
                  placeholder="e.g., Linux, Bash, Docker"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="githubLink">GitHub Link (optional)</label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={entryFormData.githubLink}
                  onChange={handleEntryInputChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="isPublic">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={entryFormData.isPublic}
                    onChange={handleEntryInputChange}
                  />
                  Public (visible on portfolio)
                </label>
              </div>

              <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Entry'}
              </button>
            </fieldset>
          </form>
        )}

        {/* PHASE FORM */}
        {activeTab === 'phase' && (
          <form onSubmit={handlePhaseSubmit} className="entry-form">
            <fieldset>
              <legend>Create New Phase</legend>

              <div className="form-group">
                <label htmlFor="phaseJourneyId">Journey ID *</label>
                <input
                  type="text"
                  id="phaseJourneyId"
                  name="journeyId"
                  value={phaseFormData.journeyId}
                  onChange={handlePhaseInputChange}
                  placeholder="journey-123"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phaseTitle">Title *</label>
                <input
                  type="text"
                  id="phaseTitle"
                  name="title"
                  value={phaseFormData.title}
                  onChange={handlePhaseInputChange}
                  placeholder="e.g., Phase 1 — Foundations"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phaseStatus">Status *</label>
                  <select
                    id="phaseStatus"
                    name="status"
                    value={phaseFormData.status}
                    onChange={handlePhaseInputChange}
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="phaseOrder">Order *</label>
                  <input
                    type="number"
                    id="phaseOrder"
                    name="order"
                    value={phaseFormData.order}
                    onChange={handlePhaseInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="focusAreas">Focus Areas (comma-separated) *</label>
                <input
                  type="text"
                  id="focusAreas"
                  name="focusAreas"
                  value={phaseFormData.focusAreas}
                  onChange={handlePhaseInputChange}
                  placeholder="e.g., Linux, Networking, Git, Python"
                  required
                />
              </div>

              <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Phase'}
              </button>
            </fieldset>
          </form>
        )}
      </div>
    </section>
  );
};

export default AdminEngineeringJourney;

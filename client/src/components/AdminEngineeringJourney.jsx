import { useState } from 'react';

/**
 * AdminEngineeringJourney Component
 * 
 * Admin scaffold for managing "Engineering Journey" entries.
 * Provides a form to create, edit, and persist learning entries.
 * 
 * TODO: Connect to actual API/CMS backend for data persistence
 */

export const AdminEngineeringJourney = () => {
  // =========================================================================
  // Form State
  // =========================================================================
  const [formData, setFormData] = useState({
    phaseId: '',
    title: '',
    domain: '',
    status: 'Planned',
    description: '',
    techStack: '',
    githubLink: ''
  });

  const [submittedEntries, setSubmittedEntries] = useState([]);

  // =========================================================================
  // Event Handlers
  // =========================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // =====================================================================
    // Construct Entry Object
    // This is the format that will be sent to the CMS/API
    // =====================================================================
    const entryObject = {
      id: `entry-${Date.now()}`, // Temp ID; backend will assign real ID
      title: formData.title,
      phaseId: formData.phaseId,
      domain: formData.domain,
      status: formData.status,
      description: formData.description,
      techStack: formData.techStack
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0),
      githubLink: formData.githubLink || null
    };

    // =====================================================================
    // TODO: API Integration
    // Replace the console.log with an actual API call:
    //
    // const saveEntry = async () => {
    //   try {
    //     const response = await fetch('/api/engineering-journey/entries', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(entryObject)
    //     });
    //     const savedEntry = await response.json();
    //     setSubmittedEntries([...submittedEntries, savedEntry]);
    //     setFormData({ phaseId: '', title: '', domain: '', status: 'Planned', description: '', techStack: '', githubLink: '' });
    //   } catch (error) {
    //     console.error('Failed to save entry:', error);
    //   }
    // };
    // =====================================================================

    console.log('[AdminEngineeringJourney] Entry submitted:', entryObject);

    // Store locally for now (for demo/testing)
    setSubmittedEntries((prev) => [...prev, entryObject]);

    // Reset form
    setFormData({
      phaseId: '',
      title: '',
      domain: '',
      status: 'Planned',
      description: '',
      techStack: '',
      githubLink: ''
    });
  };

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <section className="admin-engineering-journey">
      <div className="admin-container">
        <h2>Manage Engineering Journey Entries</h2>

        {/* ================================================================ */}
        {/* ENTRY FORM */}
        {/* ================================================================ */}
        <form onSubmit={handleSubmit} className="entry-form">
          <fieldset>
            <legend>New Entry</legend>

            <div className="form-group">
              <label htmlFor="phaseId">Phase ID</label>
              <input
                type="text"
                id="phaseId"
                name="phaseId"
                value={formData.phaseId}
                onChange={handleInputChange}
                placeholder="e.g., foundations, cloud, devops"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Secure App Directory"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="domain">Domain</label>
              <input
                type="text"
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                placeholder="e.g., Linux, AWS, DevOps, Security"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what you learned or built..."
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="techStack">Tech Stack (comma-separated)</label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="e.g., Linux, Bash, Docker"
              />
            </div>

            <div className="form-group">
              <label htmlFor="githubLink">GitHub Link (optional)</label>
              <input
                type="url"
                id="githubLink"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <button type="submit" className="submit-button">
              Create Entry
            </button>
          </fieldset>
        </form>

        {/* ================================================================ */}
        {/* SUBMITTED ENTRIES PREVIEW (For Demo) */}
        {/* ================================================================ */}
        {submittedEntries.length > 0 && (
          <section className="submitted-entries">
            <h3>Submitted Entries (Demo Preview)</h3>
            <pre className="entries-json">
              {JSON.stringify(submittedEntries, null, 2)}
            </pre>
            <p className="info-text">
              These entries are logged to the console and ready to be sent to the
              CMS via API. See code comments for API integration TODO.
            </p>
          </section>
        )}
      </div>
    </section>
  );
};

export default AdminEngineeringJourney;

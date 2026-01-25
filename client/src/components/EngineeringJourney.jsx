import { useEffect, useState } from 'react';
import { getJourneyPhases, getJourneyEntries } from '@/services/engineeringJourneyService';

/**
 * EngineeringJourney Component
 * 
 * Displays a structured learning roadmap with phases and completed/in-progress/planned entries.
 * Supports both fallback data and CMS data with automatic override logic.
 * 
 * Phase Schema:
 * - id: string (unique identifier)
 * - title: string
 * - status: 'Planned' | 'In Progress' | 'Completed'
 * - modulesCompleted: number
 * - totalModules: number
 * - focusAreas: string[] (e.g., ["Linux", "Networking", "Git"])
 * 
 * Entry Schema:
 * - id: string (unique identifier)
 * - title: string
 * - phaseId: string (references phase.id)
 * - domain: string (e.g., "Linux", "AWS", "DevOps")
 * - status: 'Completed' | 'In Progress' | 'Planned'
 * - description: string
 * - techStack: string[] (e.g., ["Linux", "Bash", "Docker"])
 * - githubLink: string (URL to repository)
 */

// ============================================================================
// FALLBACK DATA (used when CMS data is unavailable)
// ============================================================================

const fallbackPhases = [
  {
    id: 'foundations',
    title: 'Phase 1 — Foundations',
    status: 'In Progress',
    modulesCompleted: 1,
    totalModules: 6,
    focusAreas: ['Linux', 'Networking', 'Git', 'Python (Automation)']
  },
  {
    id: 'cloud',
    title: 'Phase 2 — Cloud Fundamentals',
    status: 'Planned',
    modulesCompleted: 0,
    totalModules: 5,
    focusAreas: ['AWS', 'Infrastructure as Code', 'Containers']
  },
  {
    id: 'devops',
    title: 'Phase 3 — DevOps & Automation',
    status: 'Planned',
    modulesCompleted: 0,
    totalModules: 5,
    focusAreas: ['CI/CD', 'Kubernetes', 'Monitoring']
  },
  {
    id: 'devsecops',
    title: 'Phase 4 — DevSecOps',
    status: 'Planned',
    modulesCompleted: 0,
    totalModules: 4,
    focusAreas: ['Security Scanning', 'Compliance', 'Secrets Management']
  }
];

const fallbackEntries = [
  {
    id: 'secure-app-directory',
    title: 'Secure App Directory',
    phaseId: 'foundations',
    domain: 'Linux',
    status: 'Completed',
    description: 'Built a production-style Linux security boundary using users, groups, ownership, and permissions. Implemented least-privilege isolation to prevent unauthorized access and lateral movement.',
    techStack: ['Linux', 'Bash'],
    githubLink: 'https://github.com/Gokul1111-cmd/cloud-devsecops-journey'
  },
  {
    id: 'network-protocols',
    title: 'Network Protocol Deep Dive',
    phaseId: 'foundations',
    domain: 'Networking',
    status: 'In Progress',
    description: 'Exploring TCP/IP stack, DNS resolution, HTTP/HTTPS handshakes, and packet analysis with Wireshark.',
    techStack: ['TCP/IP', 'DNS', 'Wireshark', 'Networking Fundamentals'],
    githubLink: 'https://github.com/Gokul1111-cmd/network-protocols'
  },
  {
    id: 'aws-cloud-quest',
    title: 'AWS Cloud Quest Challenge',
    phaseId: 'cloud',
    domain: 'AWS',
    status: 'Planned',
    description: 'Complete AWS Cloud Quest to master core cloud services: EC2, S3, RDS, and VPC. Build practical cloud architecture understanding.',
    techStack: ['AWS', 'EC2', 'S3', 'RDS', 'VPC'],
    githubLink: null
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const EngineeringJourney = () => {
  const [phases, setPhases] = useState(null);
  const [entries, setEntries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================================
  // Fetch data from Firebase on mount
  // =========================================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [firestorePhases, firestoreEntries] = await Promise.all([
          getJourneyPhases(),
          getJourneyEntries(),
        ]);

        // Use Firebase data if available, fallback to local data
        setPhases(firestorePhases?.length ? firestorePhases : fallbackPhases);
        setEntries(firestoreEntries?.length ? firestoreEntries : fallbackEntries);

        console.log('[EngineeringJourney] Data loaded successfully', {
          phasesCount: firestorePhases?.length || fallbackPhases.length,
          entriesCount: firestoreEntries?.length || fallbackEntries.length,
        });
      } catch (err) {
        console.warn('[EngineeringJourney] Error fetching from Firebase, using fallback:', err);
        // Use fallback data if Firebase fails
        setPhases(fallbackPhases);
        setEntries(fallbackEntries);
        setError('Using offline data. Firebase connection unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================================================================
  // Helper Functions
  // =========================================================================

  /**
   * Get progress percentage for a phase
   */
  const getProgressPercentage = (phase) => {
    if (phase.totalModules === 0) return 0;
    return Math.round((phase.modulesCompleted / phase.totalModules) * 100);
  };

  /**
   * Get status badge color/style
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-in-progress';
      case 'Planned':
        return 'status-planned';
      default:
        return 'status-default';
    }
  };

  /**
   * Filter entries for a specific phase and status
   */
  const getEntriesByPhaseAndStatus = (phaseId, entryStatus) => {
    return entries.filter(
      (entry) => entry.phaseId === phaseId && entry.status === entryStatus
    );
  };

  // =========================================================================
  // Render Helpers
  // =========================================================================

  /**
   * Render a single entry card with all available fields
   */
  const renderEntryCard = (entry) => (
    <div key={entry.id || entry.docId} className="entry-card">
      <div className="entry-header">
        <h4 className="entry-title">{entry.title}</h4>
        <div className="entry-badges">
          <span className={`entry-status ${getStatusColor(entry.status)}`}>
            {entry.status}
          </span>
          {entry.type && (
            <span className="entry-type-badge">{entry.type}</span>
          )}
        </div>
      </div>

      <div className="entry-domain">
        <strong>Domain:</strong> {entry.domain}
      </div>

      <p className="entry-description">{entry.description}</p>

      {entry.techStack && entry.techStack.length > 0 && (
        <div className="entry-tech-stack">
          {entry.techStack.map((tech, idx) => (
            <span key={idx} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
      )}

      {entry.links && entry.links.length > 0 && (
        <div className="entry-links">
          {entry.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="entry-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {entry.githubLink && (
        <a
          href={entry.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          View on GitHub
        </a>
      )}

      {entry.artifacts && entry.artifacts.length > 0 && (
        <div className="entry-artifacts">
          <strong>Artifacts:</strong>
          <ul className="artifacts-list">
            {entry.artifacts.map((artifact, idx) => (
              <li key={idx}>
                <a
                  href={artifact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artifact-link"
                >
                  {artifact.type} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  /**
   * Render all entries for a specific phase grouped by status
   */
  const renderPhaseEntries = (phaseId) => {
    const completed = getEntriesByPhaseAndStatus(phaseId, 'Completed');
    const inProgress = getEntriesByPhaseAndStatus(phaseId, 'In Progress');
    const planned = getEntriesByPhaseAndStatus(phaseId, 'Planned');

    return (
      <div className="phase-entries">
        {completed.length > 0 && (
          <section className="entry-section completed-section">
            <h4 className="section-title">Completed</h4>
            <div className="entry-list">
              {completed.map((entry) => renderEntryCard(entry))}
            </div>
          </section>
        )}

        {inProgress.length > 0 && (
          <section className="entry-section in-progress-section">
            <h4 className="section-title">In Progress</h4>
            <div className="entry-list">
              {inProgress.map((entry) => renderEntryCard(entry))}
            </div>
          </section>
        )}

        {planned.length > 0 && (
          <section className="entry-section planned-section">
            <h4 className="section-title">Planned</h4>
            <div className="entry-list">
              {planned.map((entry) => renderEntryCard(entry))}
            </div>
          </section>
        )}

        {completed.length === 0 && inProgress.length === 0 && planned.length === 0 && (
          <p className="no-entries">No entries yet for this phase.</p>
        )}
      </div>
    );
  };

  /**
   * Render a single phase block
   */
  const renderPhase = (phase) => (
    <article key={phase.id} className="phase-block">
      <div className="phase-header">
        <div className="phase-title-section">
          <h3 className="phase-title">{phase.title}</h3>
          <span className={`phase-status ${getStatusColor(phase.status)}`}>
            {phase.status}
          </span>
        </div>

        <div className="phase-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getProgressPercentage(phase)}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {phase.modulesCompleted} / {phase.totalModules} modules
          </p>
        </div>
      </div>

      {phase.focusAreas && phase.focusAreas.length > 0 && (
        <div className="phase-focus-areas">
          <strong>Focus Areas:</strong>
          <ul className="focus-list">
            {phase.focusAreas.map((area, idx) => (
              <li key={idx}>{area}</li>
            ))}
          </ul>
        </div>
      )}

      {renderPhaseEntries(phase.id)}
    </article>
  );

  // =========================================================================
  // MAIN RENDER
  // =========================================================================

  // Loading state
  if (loading) {
    return (
      <section className="engineering-journey-section">
        <div className="section-container">
          <div className="loading-state">
            <p>Loading your engineering journey...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state (non-blocking - still show fallback data)
  const errorMessage = error ? (
    <div className="error-banner">
      ℹ️ {error}
    </div>
  ) : null;

  return (
    <section className="engineering-journey-section">
      <div className="section-container">
        {errorMessage}
        
        <header className="section-header">
          <h2 className="section-title">Engineering Journey</h2>
          <p className="section-subtitle">
            My structured learning roadmap with completed projects, in-progress labs,
            and planned explorations across cloud, DevOps, and security domains.
          </p>
        </header>

        {phases && phases.length > 0 ? (
          <div className="phases-grid">
            {phases.map((phase) => renderPhase(phase))}
          </div>
        ) : (
          <p className="no-data">No phases available yet.</p>
        )}
      </div>
    </section>
  );
};

export default EngineeringJourney;

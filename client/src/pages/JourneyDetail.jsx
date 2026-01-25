import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, Code, Shield, Database, CheckCircle, Clock, Calendar } from 'lucide-react';
import { getJourneyById, getPhasesByJourney, getEntriesByPhase } from '@/services/engineeringJourneyService';

/**
 * JourneyDetail Component
 * 
 * Shows full details of a specific learning journey including:
 * - Journey header with progress
 * - All phases within the journey
 * - Entries/domains grouped by phase and status
 */

const iconMap = {
  cloud: Cloud,
  code: Code,
  shield: Shield,
  database: Database,
};

const statusColors = {
  Completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'In Progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  Planned: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
};

export const JourneyDetail = () => {
  const { journeyId } = useParams();
  const navigate = useNavigate();

  const [journey, setJourney] = useState(null);
  const [phases, setPhases] = useState([]);
  const [allEntries, setAllEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch journey
        const journeyData = await getJourneyById(journeyId);
        if (!journeyData) {
          setError('Journey not found');
          setLoading(false);
          return;
        }
        setJourney(journeyData);

        // Fetch phases for this journey
        const phasesData = await getPhasesByJourney(journeyId);
        setPhases(phasesData);

        // Set initial selected phase
        if (phasesData.length > 0) {
          setSelectedPhase(phasesData[0].id);
        }

        // Fetch entries for all phases
        const entriesMap = {};
        await Promise.all(
          phasesData.map(async (phase) => {
            const entries = await getEntriesByPhase(phase.id);
            entriesMap[phase.id] = entries;
          })
        );
        setAllEntries(entriesMap);

        setLoading(false);
      } catch (err) {
        console.error('[JourneyDetail] Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJourneyData();
  }, [journeyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading Journey...</h2>
        </div>
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Journey Not Found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[journey.icon] || Code;

  const selectedPhaseData = phases.find(p => p.id === selectedPhase);
  const phaseEntries = selectedPhaseData ? (allEntries[selectedPhaseData.id] || []) : [];
  const completedEntries = phaseEntries.filter((entry) => entry.status === 'Completed');
  const inProgressEntries = phaseEntries.filter((entry) => entry.status === 'In Progress');
  const plannedEntries = phaseEntries.filter((entry) => entry.status === 'Planned');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to All Journeys</span>
        </button>

        {/* Journey Header */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 mb-8 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg">
              <Icon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {journey.title}
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                {journey.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    Overall Progress: {journey.overallProgress}%
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {journey.completedPhases}/{journey.totalPhases} Phases Completed
                  </span>
                </div>
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                    style={{ width: `${journey.overallProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar: Roadmap/Phases */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
                Roadmap
              </h2>
              
              <div className="space-y-2">
                {phases.map((phase, index) => {
                  const isActive = selectedPhase === phase.id;
                  const progress = phase.totalModules > 0 
                    ? (phase.modulesCompleted / phase.totalModules) * 100 
                    : 0;
                  
                  return (
                    <button
                      key={phase.id}
                      onClick={() => setSelectedPhase(phase.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isActive
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          phase.status === 'Completed' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : phase.status === 'In Progress'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm mb-1 ${
                            isActive ? 'text-purple-700 dark:text-purple-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {phase.title.replace(/^Phase \d+ — /, '')}
                          </h3>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[phase.status]}`}>
                            {phase.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Mini Progress Bar */}
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              phase.status === 'Completed' 
                                ? 'bg-green-500' 
                                : 'bg-purple-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {phase.modulesCompleted}/{phase.totalModules} modules
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content: Accomplishments/Entries */}
          <div className="lg:col-span-2">
            {selectedPhaseData && (
              <div className="space-y-6">
                {/* Phase Details Header */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedPhaseData.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[selectedPhaseData.status]}`}>
                      {selectedPhaseData.status}
                    </span>
                  </div>
                  
                  {/* Focus Areas */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Focus Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPhaseData.focusAreas.map((area, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accomplishments Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                    Accomplishments
                  </h3>
                  
                  {phaseEntries.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No entries yet for this phase</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {completedEntries.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400 mb-3">
                            <CheckCircle size={16} />
                            Completed ({completedEntries.length})
                          </h4>
                          <div className="space-y-3">
                            {completedEntries.map((entry) => (
                              <EntryCard key={entry.id} entry={entry} />
                            ))}
                          </div>
                        </div>
                      )}

                      {inProgressEntries.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">
                            <Clock size={16} />
                            In Progress ({inProgressEntries.length})
                          </h4>
                          <div className="space-y-3">
                            {inProgressEntries.map((entry) => (
                              <EntryCard key={entry.id} entry={entry} />
                            ))}
                          </div>
                        </div>
                      )}

                      {plannedEntries.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-400 mb-3">
                            <Calendar size={16} />
                            Planned ({plannedEntries.length})
                          </h4>
                          <div className="space-y-3">
                            {plannedEntries.map((entry) => (
                              <EntryCard key={entry.id} entry={entry} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Entry Card Component
// eslint-disable-next-line react/prop-types
const EntryCard = ({ entry }) => {
  const typeColors = {
    project: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    lab: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    certification: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    exercise: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  };

  // eslint-disable-next-line react/prop-types
  const isCertification = entry.type === 'certification';
  
  // eslint-disable-next-line react/prop-types
  const statusStyle = entry.status === 'Completed' 
    ? 'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-900/10'
    // eslint-disable-next-line react/prop-types
    : entry.status === 'In Progress'
    ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
    : 'border-l-4 border-l-gray-300 dark:border-l-gray-600 bg-gray-50/50 dark:bg-gray-800/50';

  return (
    <div className={`rounded-lg border ${statusStyle} ${isCertification ? 'border-yellow-300 dark:border-yellow-700 overflow-hidden' : 'border-gray-200 dark:border-gray-600'} ${isCertification ? '' : 'p-4'}`}>
      {/* Certificate Image */}
      {isCertification && (
        <div className="mb-4">
          {/* eslint-disable-next-line react/prop-types */}
          {entry.certificateImage && (
            <img
              // eslint-disable-next-line react/prop-types
              src={entry.certificateImage}
              // eslint-disable-next-line react/prop-types
              alt={entry.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          )}
        </div>
      )}

      <div className={isCertification ? 'p-4' : ''}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {/* eslint-disable-next-line react/prop-types */}
              <h5 className="font-semibold text-gray-900 dark:text-white">{entry.title}</h5>
              {/* eslint-disable-next-line react/prop-types */}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[entry.type]}`}>
                {/* eslint-disable-next-line react/prop-types */}
                {entry.type}
              </span>
            </div>
            {!isCertification && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {/* eslint-disable-next-line react/prop-types */}
                <span className="font-medium">Domain:</span> {entry.domain}
              </p>
            )}
            {isCertification && (
              <div className="flex items-center gap-4 mb-2 text-xs text-gray-600 dark:text-gray-400">
                {/* eslint-disable-next-line react/prop-types */}
                {entry.issuer && <span><span className="font-medium">Issuer:</span> {entry.issuer}</span>}
                {/* eslint-disable-next-line react/prop-types */}
                {entry.issueDate && <span><span className="font-medium">Earned:</span> {entry.issueDate}</span>}
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {/* eslint-disable-next-line react/prop-types */}
              {entry.description}
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        {!isCertification && (
          <div className="flex flex-wrap gap-2 mb-3">
            {/* eslint-disable-next-line react/prop-types */}
            {entry.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs border border-gray-300 dark:border-gray-600"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* GitHub Link */}
        {!isCertification && (
          <>
            {/* eslint-disable-next-line react/prop-types */}
            {entry.githubLink && (
              <a
                // eslint-disable-next-line react/prop-types
                href={entry.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                View on GitHub →
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JourneyDetail;

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Cloud, Code, Shield, Database, CheckCircle, Clock, Calendar, ChevronRight, Terminal, Network, Cpu, GitBranch } from 'lucide-react';
import { getCompleteJourney } from '@/services/engineeringJourneyService';

/**
 * JourneyDetail Component
 * 
 * Shows full details of a specific learning journey including:
 * - Journey header with progress
 * - All phases within the journey
 * - Entries/domains grouped by phase and status
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Loads ALL data once on mount (journey + phases + entries)
 * - Phase/focus area switching is CLIENT-SIDE only (no API calls)
 * - Results in instant navigation and lower Firestore costs
 */

const iconMap = {
  cloud: Cloud,
  code: Code,
  shield: Shield,
  database: Database,
};

const focusAreaIconMap = {
  Linux: Terminal,
  Networking: Network,
  Programming: Code,
  Git: GitBranch,
  Cloud: Cloud,
  Docker: Database,
  Kubernetes: Database,
  'CI/CD': Cpu,
  Terraform: Code,
  Ansible: Code,
  Security: Shield,
  Monitoring: Cpu,
  Python: Code,
  JavaScript: Code,
  // Fallback
  default: Code,
};

const statusColors = {
  Completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'In Progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  Planned: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
};

export const JourneyDetail = () => {
  const { journeyId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [journey, setJourney] = useState(null);
  const [phases, setPhases] = useState([]);
  const [allEntries, setAllEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get state from URL params or defaults
  const selectedPhase = searchParams.get('phase') || null;
  const selectedFocusArea = searchParams.get('focus') || null;

  // Helper to update URL params
  const updateParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Single optimized call - loads everything at once
        const { journey: journeyData, phases: phasesData, entriesByPhase } = await getCompleteJourney(journeyId);
        
        setJourney(journeyData);
        setPhases(phasesData);
        setAllEntries(entriesByPhase);

        // Set initial selected phase from URL or first phase
        if (phasesData.length > 0 && !selectedPhase) {
          updateParams({ phase: phasesData[0].id });
        }

        setLoading(false);
      } catch (err) {
        console.error('[JourneyDetail] Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJourneyData();
    // Only run on initial mount or when journeyId changes - NOT when selectedPhase changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyId, updateParams]); // Removed selectedPhase from dependencies

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Skeleton header */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skeleton content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
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
  
  // Filter entries by focus area if one is selected
  const filteredEntries = selectedFocusArea 
    ? phaseEntries.filter(entry => entry.domain === selectedFocusArea)
    : phaseEntries;
  
  const completedEntries = filteredEntries.filter((entry) => entry.status === 'Completed');
  const inProgressEntries = filteredEntries.filter((entry) => entry.status === 'In Progress');
  const plannedEntries = filteredEntries.filter((entry) => entry.status === 'Planned');

  // Calculate stats for focus areas
  const getFocusAreaStats = (focusArea) => {
    const areaEntries = phaseEntries.filter(e => e.domain === focusArea);
    return {
      total: areaEntries.length,
      completed: areaEntries.filter(e => e.status === 'Completed').length,
      inProgress: areaEntries.filter(e => e.status === 'In Progress').length,
      planned: areaEntries.filter(e => e.status === 'Planned').length,
    };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Sticky Header - highest z-index */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to All Journeys</span>
          </button>

          {/* Journey Header - Compact Version */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-2.5 rounded-xl flex-shrink-0">
              <Icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {journey.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {journey.description}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm flex-shrink-0">
              <span className="font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                {journey.overallProgress}% Complete
              </span>
              <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {journey.completedPhases}/{journey.totalPhases} Phases
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                style={{ width: `${journey.overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - with proper padding to account for sticky header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar: Roadmap/Phases - Fixed Position */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 lg:sticky lg:top-28 lg:z-40 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto shadow-sm">
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
                      onClick={() => updateParams({ phase: phase.id, focus: null })}
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

          {/* Right Content: Focus Areas or Entries - Scrollable */}
          <div className="lg:col-span-2">
            {selectedPhaseData && (
              <div className="space-y-6">
                {/* Breadcrumb Navigation - Sticky with proper z-index */}
                <div className="sticky top-24 z-30 bg-white dark:bg-gray-900 py-3 px-4 sm:px-0 -mx-4 sm:mx-0 border-b sm:border-0 border-gray-200 dark:border-gray-700 sm:bg-transparent sm:py-0">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <button
                    onClick={() => updateParams({ phase: null, focus: null })}
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    All Phases
                  </button>
                  <ChevronRight size={16} />
                  <button
                    onClick={() => updateParams({ focus: null })}
                    className={`transition-colors ${
                      selectedFocusArea 
                        ? 'hover:text-purple-600 dark:hover:text-purple-400' 
                        : 'text-purple-600 dark:text-purple-400 font-semibold'
                    }`}
                  >
                    {selectedPhaseData.title.replace(/^Phase \d+ — /, '')}
                  </button>
                  {selectedFocusArea && (
                    <>
                      <ChevronRight size={16} />
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        {selectedFocusArea}
                      </span>
                    </>
                  )}
                  </div>
                </div>

                {/* Phase Details Header */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedFocusArea || selectedPhaseData.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[selectedPhaseData.status]}`}>
                      {selectedPhaseData.status}
                    </span>
                  </div>
                  
                  {!selectedFocusArea && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Select a focus area to explore:
                      </p>
                    </div>
                  )}
                </div>

                {/* Focus Area Cards or Entries */}
                {!selectedFocusArea ? (
                  // Show focus area cards
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPhaseData.focusAreas.map((focusArea) => {
                      const stats = getFocusAreaStats(focusArea);
                      const FocusIcon = focusAreaIconMap[focusArea] || focusAreaIconMap.default;
                      const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                      
                      return (
                        <button
                          key={focusArea}
                          onClick={() => updateParams({ focus: focusArea })}
                          className="group bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-xl p-6 text-left transition-all hover:shadow-lg"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg group-hover:scale-110 transition-transform">
                              <FocusIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {focusArea}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {stats.total} {stats.total === 1 ? 'item' : 'items'}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Status Pills */}
                          <div className="flex items-center gap-2 text-xs">
                            {stats.completed > 0 && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                                ✓ {stats.completed}
                              </span>
                            )}
                            {stats.inProgress > 0 && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">
                                ⏳ {stats.inProgress}
                              </span>
                            )}
                            {stats.planned > 0 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 rounded-full font-medium">
                                ◯ {stats.planned}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  // Show entries for selected focus area
                  <div>
                    {/* Back to Focus Areas */}
                    <button
                      onClick={() => updateParams({ focus: null })}
                      className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline mb-4"
                    >
                      <ArrowLeft size={16} />
                      Back to Focus Areas
                    </button>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                      {selectedFocusArea} Learning Path
                    </h3>
                    
                    {filteredEntries.length === 0 ? (
                      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No entries yet for {selectedFocusArea}</p>
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
                )}
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

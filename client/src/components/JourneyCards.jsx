import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Cloud, Code, Shield, Database, Globe, Cpu } from 'lucide-react';
import { getJourneys } from '@/services/engineeringJourneyService';

/**
 * JourneyCards Component
 * 
 * Displays a grid of learning journey cards on the homepage.
 * Each card shows:
 * - Journey title and description
 * - Overall progress percentage
 * - Visual progress bar
 * - Click to view full journey details
 */

const iconMap = {
  cloud: Cloud,
  code: Code,
  shield: Shield,
  database: Database,
  globe: Globe,
  cpu: Cpu,
};

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    progress: 'bg-blue-600 dark:bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
    progress: 'bg-purple-600 dark:bg-purple-500',
  },
  red: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/30',
    progress: 'bg-red-600 dark:bg-red-500',
  },
  green: {
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-500/30',
    progress: 'bg-green-600 dark:bg-green-500',
  },
};

export const JourneyCards = () => {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        setLoading(true);
        const data = await getJourneys({ publicOnly: true });
        setJourneys(data);
      } catch (err) {
        console.error('[JourneyCards] Error fetching journeys:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, []);

  const handleCardClick = (journeyId) => {
    navigate(`/journey/${journeyId}`);
  };

  if (loading) {
    return (
      <section className="engineering-journey-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Engineering Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading journeys...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="engineering-journey-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Engineering Journey
            </h2>
            <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (journeys.length === 0) {
    return (
      <section className="engineering-journey-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Engineering Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">No journeys available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="engineering-journey-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Engineering Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            My structured learning roadmap with completed projects, in-progress labs, and
            planned explorations across cloud, DevOps, and security domains.
          </p>
        </div>

        {/* Journey Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {journeys.map((journey) => {
            const Icon = iconMap[journey.icon] || Code;
            const colors = colorMap[journey.color] || colorMap.blue;

            return (
              <div
                key={journey.id}
                onClick={() => handleCardClick(journey.id)}
                className={`
                  journey-card group cursor-pointer
                  bg-white dark:bg-gray-800 
                  border-2 ${colors.border} 
                  rounded-xl p-6 
                  transition-all duration-300
                  hover:shadow-xl hover:scale-[1.02]
                  hover:-translate-y-1
                `}
              >
                {/* Card Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${colors.bg} p-3 rounded-lg`}>
                    <Icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {journey.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {journey.description}
                    </p>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors.progress} transition-all duration-500 ease-out`}
                        style={{ width: `${journey.overallProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className={`font-semibold ${colors.text}`}>
                        {journey.overallProgress}% Complete
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {journey.completedPhases}/{journey.totalPhases} Phases
                      </span>
                    </div>
                    <span className="text-purple-600 dark:text-purple-400 font-medium group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Click any journey to explore phases, projects, and learning milestones
          </p>
        </div>
      </div>
    </section>
  );
};

export default JourneyCards;

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Cloud, Code, Shield, Database, Globe, Cpu, ArrowLeft } from 'lucide-react';
import { getJourneys } from '@/services/engineeringJourneyService';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
    shadow: 'hover:shadow-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
    progress: 'bg-purple-600 dark:bg-purple-500',
    shadow: 'hover:shadow-purple-500/20',
  },
  red: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/30',
    progress: 'bg-red-600 dark:bg-red-500',
    shadow: 'hover:shadow-red-500/20',
  },
  green: {
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-500/30',
    progress: 'bg-green-600 dark:bg-green-500',
    shadow: 'hover:shadow-green-500/20',
  },
};

export const JourneyList = () => {
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
        console.error('[JourneyList] Error fetching journeys:', err);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Engineering Journey
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              My structured learning roadmap with completed projects, in-progress labs, and
              planned explorations across cloud, DevOps, and security domains.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading journeys...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-destructive text-lg mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && journeys.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No journeys available yet.</p>
            </div>
          )}

          {/* Journey Cards Grid */}
          {!loading && !error && journeys.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {journeys.map((journey) => {
                const Icon = iconMap[journey.icon] || Code;
                const colors = colorMap[journey.color] || colorMap.blue;

                return (
                  <div
                    key={journey.id}
                    onClick={() => handleCardClick(journey.id)}
                    className={`
                      group cursor-pointer
                      bg-card
                      border-2 ${colors.border} 
                      rounded-2xl p-8 
                      transition-all duration-300
                      hover:shadow-2xl ${colors.shadow}
                      hover:scale-[1.02]
                      hover:-translate-y-2
                    `}
                  >
                    {/* Card Header */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`${colors.bg} p-4 rounded-xl`}>
                        <Icon className={`w-10 h-10 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {journey.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3">
                          {journey.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div className="relative">
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors.progress} transition-all duration-500 ease-out`}
                            style={{ width: `${journey.overallProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-6">
                          <span className={`font-bold text-lg ${colors.text}`}>
                            {journey.overallProgress}% Complete
                          </span>
                          <span className="text-muted-foreground">
                            {journey.completedPhases}/{journey.totalPhases} Phases
                          </span>
                        </div>
                        <span className="text-primary font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JourneyList;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  Users,
  Code2,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

export function GitHubStatsSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const username = "Gokul1111-cmd";

        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!userResponse.ok) throw new Error(`HTTP ${userResponse.status}: Failed to fetch user data`);
        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=stars&per_page=100`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!reposResponse.ok) throw new Error(`HTTP ${reposResponse.status}: Failed to fetch repos`);
        const repos = await reposResponse.json();

        // Calculate statistics
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const languages = {};

        repos.forEach((repo) => {
          if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
          }
        });

        // Sort languages by frequency
        const topLanguages = Object.entries(languages)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([lang]) => lang);

        // Get top repositories
        const topRepos = repos
          .filter((repo) => !repo.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6)
          .map((repo) => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
          }));

        setData({
          profile: {
            name: userData.name,
            avatar: userData.avatar_url,
            bio: userData.bio,
            location: userData.location,
            followers: userData.followers,
            following: userData.following,
            publicRepos: userData.public_repos,
            profileUrl: userData.html_url,
          },
          stats: {
            totalRepos: repos.length,
            totalStars,
            totalForks,
            topLanguages,
            followers: userData.followers,
          },
          topRepos,
        });
      } catch (err) {
        console.error("GitHub Stats Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Github className="w-8 h-8 text-blue-400" />
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section id="github" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Github className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">{error ? `Error: ${error}` : 'Unable to load GitHub stats'}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const { profile, stats, topRepos } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      variants={itemVariants}
      className={`relative overflow-hidden rounded-lg p-6 ${color}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-10" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium opacity-75">{label}</span>
        </div>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
      </div>
    </motion.div>
  );

  return (
    <section id="github" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="w-8 h-8 text-blue-400" />
            <h2 className="text-4xl font-bold text-white">GitHub Stats</h2>
          </div>
          <p className="text-slate-400">
            Open source contributions and public repositories
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          <StatCard
            icon={Code2}
            label="Public Repositories"
            value={stats.totalRepos}
            color="bg-gradient-to-br from-blue-600 to-blue-700 text-blue-50"
          />
          <StatCard
            icon={Star}
            label="Total Stars"
            value={stats.totalStars}
            color="bg-gradient-to-br from-yellow-600 to-yellow-700 text-yellow-50"
          />
          <StatCard
            icon={GitFork}
            label="Total Forks"
            value={stats.totalForks}
            color="bg-gradient-to-br from-purple-600 to-purple-700 text-purple-50"
          />
          <StatCard
            icon={Users}
            label="Followers"
            value={stats.followers}
            color="bg-gradient-to-br from-green-600 to-green-700 text-green-50"
          />
        </motion.div>

        {/* Top Languages */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 rounded-lg bg-slate-800 border border-slate-700 p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Top Languages</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.topLanguages.map((lang, idx) => (
              <motion.div
                key={lang}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm"
              >
                {lang}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Repositories */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Github className="w-5 h-5 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Top Repositories</h3>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {topRepos.map((repo, idx) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 20px 30px rgba(0,0,0,0.3)" }}
                className="group relative overflow-hidden rounded-lg bg-slate-800 border border-slate-700 p-6 hover:border-blue-500 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-transparent to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex-1 break-words">
                      {repo.name}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                  </div>

                  {repo.description && (
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mb-4 text-xs">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <Code2 className="w-3 h-3 text-purple-400" />
                        <span className="text-slate-300">{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-slate-300">{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-blue-400" />
                      <span className="text-slate-300">{repo.forks}</span>
                    </div>
                  </div>

                  <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min((repo.stars / stats.totalStars) * 100, 100)}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                    />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* GitHub Profile Link */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            <Github className="w-5 h-5" />
            View Full GitHub Profile
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

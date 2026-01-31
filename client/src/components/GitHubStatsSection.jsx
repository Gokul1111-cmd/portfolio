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
  Eye,
  Calendar,
  Tag,
  Award,
  Zap,
  FileText,
  LinkIcon,
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

        // Fetch repositories with detailed info
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!reposResponse.ok) throw new Error(`HTTP ${reposResponse.status}: Failed to fetch repos`);
        const repos = await reposResponse.json();

        // Calculate detailed statistics
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const totalWatchers = repos.reduce((sum, repo) => sum + repo.watchers_count, 0);
        const totalOpenIssues = repos.reduce((sum, repo) => sum + repo.open_issues_count, 0);
        const totalSize = repos.reduce((sum, repo) => sum + (repo.size || 0), 0);

        // Language distribution
        const languages = {};
        repos.forEach((repo) => {
          if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
          }
        });

        const topLanguages = Object.entries(languages)
          .sort((a, b) => b[1] - a[1])
          .map(([lang, count]) => ({ name: lang, count }));

        // Repository analysis
        const originalRepos = repos.filter((repo) => !repo.fork);
        const forkedRepos = repos.filter((repo) => repo.fork);

        // Get top repositories with more details
        const topRepos = originalRepos
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 12)
          .map((repo) => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            language: repo.language,
            topics: repo.topics || [],
            license: repo.license?.name || null,
            size: repo.size,
            openIssues: repo.open_issues_count,
            createdAt: new Date(repo.created_at),
            updatedAt: new Date(repo.updated_at),
            homepage: repo.homepage,
          }));

        // Calculate repo stats
        const mostStarredRepo = originalRepos.reduce(
          (max, repo) => (repo.stargazers_count > (max.stargazers_count || 0) ? repo : max),
          {}
        );

        const mostForkedRepo = originalRepos.reduce(
          (max, repo) => (repo.forks_count > (max.forks_count || 0) ? repo : max),
          {}
        );

        const largestRepo = originalRepos.reduce(
          (max, repo) => ((repo.size || 0) > (max.size || 0) ? repo : max),
          {}
        );

        // Calculate average values
        const avgStarsPerRepo = originalRepos.length > 0 ? Math.round(totalStars / originalRepos.length) : 0;

        setData({
          profile: {
            name: userData.name,
            avatar: userData.avatar_url,
            bio: userData.bio,
            location: userData.location,
            company: userData.company,
            blog: userData.blog,
            followers: userData.followers,
            following: userData.following,
            publicRepos: userData.public_repos,
            profileUrl: userData.html_url,
            createdAt: new Date(userData.created_at),
            updatedAt: new Date(userData.updated_at),
          },
          stats: {
            totalRepos: repos.length,
            originalRepos: originalRepos.length,
            forkedRepos: forkedRepos.length,
            totalStars,
            totalForks,
            totalWatchers,
            totalOpenIssues,
            totalSize,
            avgStarsPerRepo,
            topLanguages,
            followers: userData.followers,
            mostStarredRepo: {
              name: mostStarredRepo.name,
              stars: mostStarredRepo.stargazers_count,
            },
            mostForkedRepo: {
              name: mostForkedRepo.name,
              forks: mostForkedRepo.forks_count,
            },
            largestRepo: {
              name: largestRepo.name,
              size: largestRepo.size,
            },
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
      <section className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-6xl mx-auto px-4">
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
      <section id="github" className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-6xl mx-auto px-4">
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
        staggerChildren: 0.08,
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

  const StatCard = ({ icon: Icon, label, value, color, suffix = "" }) => (
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
        <div className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</div>
      </div>
    </motion.div>
  );

  return (
    <section id="github" className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Profile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 bg-slate-800/30 border border-slate-700/50 rounded-lg p-8">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-2 border-blue-500"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{profile.name}</h2>
              {profile.bio && <p className="text-slate-400 mb-3">{profile.bio}</p>}
              <div className="flex flex-wrap gap-4 text-sm">
                {profile.location && (
                  <span className="flex items-center gap-2 text-slate-300">
                    <span>📍</span> {profile.location}
                  </span>
                )}
                {profile.company && (
                  <span className="flex items-center gap-2 text-slate-300">
                    <span>🏢</span> {profile.company}
                  </span>
                )}
                {profile.blog && (
                  <a href={profile.blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                    <LinkIcon className="w-4 h-4" /> Blog
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Primary Stats Grid (2 rows) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
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

        {/* Secondary Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
        >
          <StatCard
            icon={Eye}
            label="Total Watchers"
            value={stats.totalWatchers}
            color="bg-gradient-to-br from-cyan-600 to-cyan-700 text-cyan-50"
          />
          <StatCard
            icon={FileText}
            label="Open Issues"
            value={stats.totalOpenIssues}
            color="bg-gradient-to-br from-red-600 to-red-700 text-red-50"
          />
          <StatCard
            icon={Award}
            label="Original Repos"
            value={stats.originalRepos}
            color="bg-gradient-to-br from-indigo-600 to-indigo-700 text-indigo-50"
          />
          <StatCard
            icon={GitFork}
            label="Forked Repos"
            value={stats.forkedRepos}
            color="bg-gradient-to-br from-orange-600 to-orange-700 text-orange-50"
          />
          <StatCard
            icon={Zap}
            label="Avg Stars/Repo"
            value={stats.avgStarsPerRepo}
            color="bg-gradient-to-br from-pink-600 to-pink-700 text-pink-50"
          />
        </motion.div>

        {/* Highlights Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 hover:border-yellow-500/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-white">Most Starred</h4>
            </div>
            <a
              href={`https://github.com/Gokul1111-cmd/${stats.mostStarredRepo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"
            >
              {stats.mostStarredRepo.name}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-400 mt-2">{stats.mostStarredRepo.stars} stars</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <GitFork className="w-5 h-5 text-purple-400" />
              <h4 className="font-semibold text-white">Most Forked</h4>
            </div>
            <a
              href={`https://github.com/Gokul1111-cmd/${stats.mostForkedRepo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"
            >
              {stats.mostForkedRepo.name}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-400 mt-2">{stats.mostForkedRepo.forks} forks</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <Code2 className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">Largest Repo</h4>
            </div>
            <a
              href={`https://github.com/Gokul1111-cmd/${stats.largestRepo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"
            >
              {stats.largestRepo.name}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-400 mt-2">{Math.round(stats.largestRepo.size / 1024)} MB</p>
          </motion.div>
        </motion.div>

        {/* Top Languages with Details */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 rounded-lg bg-slate-800/30 border border-slate-700/50 p-8"
        >
          <div className="flex items-center gap-2 mb-8">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Top Languages</h3>
          </div>
          <div className="space-y-3">
            {stats.topLanguages.map((lang, idx) => {
              const percentage = Math.round((lang.count / stats.originalRepos) * 100);
              return (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-white">{lang.name}</span>
                    <span className="text-sm text-slate-400">{lang.count} repos ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Repositories - Extended View */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-8">
            <Github className="w-5 h-5 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Top {topRepos.length} Repositories</h3>
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
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 p-6 transition-colors"
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

                  <div className="flex flex-wrap gap-2 mb-4 text-xs">
                    {repo.language && (
                      <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {repo.language}
                      </span>
                    )}
                    {repo.license && (
                      <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {repo.license}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      {repo.stars}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-blue-400" />
                      {repo.forks}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      {repo.watchers}
                    </div>
                    {repo.openIssues > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-red-400" />
                        {repo.openIssues}
                      </div>
                    )}
                  </div>

                  {repo.size > 0 && (
                    <div className="text-xs text-slate-400 mb-3">
                      Size: {Math.round(repo.size / 1024)} MB
                    </div>
                  )}

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300">
                          {topic}
                        </span>
                      ))}
                      {repo.topics.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-400">
                          +{repo.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min((repo.stars / (stats.totalStars || 1)) * 100, 100)}%` }}
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
          className="mt-16 text-center"
        >
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all transform hover:scale-105"
          >
            <Github className="w-5 h-5" />
            View Complete GitHub Profile
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

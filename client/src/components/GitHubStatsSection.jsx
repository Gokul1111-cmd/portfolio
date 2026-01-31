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

        // Fetch contribution data
        const contributionResponse = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
        );
        const contributionData = await contributionResponse.json();
        const contributionItems = Array.isArray(contributionData?.contributions)
          ? contributionData.contributions
          : [];
        const contributionTotal = typeof contributionData?.total?.lastYear === "number"
          ? contributionData.total.lastYear
          : contributionItems.reduce((sum, item) => sum + (item.count || 0), 0);

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
          contributions: {
            total: contributionTotal,
            items: contributionItems,
          },
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

  const { profile, stats, contributions } = data;

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
        <div className="text-3xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}{suffix}</div>
      </div>
    </motion.div>
  );

  const primaryStats = [
    {
      icon: Code2,
      label: "Public Repositories",
      value: stats.totalRepos,
      color: "bg-gradient-to-br from-blue-600 to-blue-700 text-blue-50",
    },
    {
      icon: Star,
      label: "Total Stars",
      value: stats.totalStars,
      color: "bg-gradient-to-br from-yellow-600 to-yellow-700 text-yellow-50",
    },
    {
      icon: GitFork,
      label: "Total Forks",
      value: stats.totalForks,
      color: "bg-gradient-to-br from-purple-600 to-purple-700 text-purple-50",
    },
    {
      icon: Users,
      label: "Followers",
      value: stats.followers,
      color: "bg-gradient-to-br from-green-600 to-green-700 text-green-50",
    },
  ].filter((item) => typeof item.value === "number" && item.value > 0);

  const secondaryStats = [
    {
      icon: Eye,
      label: "Total Watchers",
      value: stats.totalWatchers,
      color: "bg-gradient-to-br from-cyan-600 to-cyan-700 text-cyan-50",
    },
    {
      icon: FileText,
      label: "Open Issues",
      value: stats.totalOpenIssues,
      color: "bg-gradient-to-br from-red-600 to-red-700 text-red-50",
    },
    {
      icon: Award,
      label: "Original Repos",
      value: stats.originalRepos,
      color: "bg-gradient-to-br from-indigo-600 to-indigo-700 text-indigo-50",
    },
    {
      icon: GitFork,
      label: "Forked Repos",
      value: stats.forkedRepos,
      color: "bg-gradient-to-br from-orange-600 to-orange-700 text-orange-50",
    },
    {
      icon: Zap,
      label: "Avg Stars/Repo",
      value: stats.avgStarsPerRepo,
      color: "bg-gradient-to-br from-pink-600 to-pink-700 text-pink-50",
    },
  ].filter((item) => typeof item.value === "number" && item.value > 0);

  const highlights = [
    {
      title: "Most Starred",
      name: stats.mostStarredRepo?.name,
      value: stats.mostStarredRepo?.stars ? `${stats.mostStarredRepo.stars} stars` : null,
      icon: Star,
      color: "yellow",
    },
    {
      title: "Most Forked",
      name: stats.mostForkedRepo?.name,
      value: stats.mostForkedRepo?.forks ? `${stats.mostForkedRepo.forks} forks` : null,
      icon: GitFork,
      color: "purple",
    },
    {
      title: "Largest Repo",
      name: stats.largestRepo?.name,
      value: stats.largestRepo?.size ? `${Math.round(stats.largestRepo.size / 1024)} MB` : null,
      icon: Code2,
      color: "blue",
    },
  ].filter((item) => item.name && item.value);

  const buildContributionGrid = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return { weeks: [], monthLabels: [] };
    }

    const sorted = [...items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const start = new Date(sorted[0].date);
    start.setDate(start.getDate() - start.getDay());

    const end = new Date(sorted[sorted.length - 1].date);
    end.setDate(end.getDate() + (6 - end.getDay()));

    const dayMap = new Map(sorted.map((item) => [item.date, item]));

    const weeks = [];
    const monthLabels = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      const week = [];
      monthLabels.push(cursor.getMonth());
      for (let i = 0; i < 7; i += 1) {
        const iso = cursor.toISOString().slice(0, 10);
        week.push(dayMap.get(iso) || { date: iso, count: 0, level: 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    return { weeks, monthLabels };
  };

  const { weeks: contributionWeeks, monthLabels } = buildContributionGrid(
    contributions?.items || []
  );

  return (
    <section id="github" className="relative py-12 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <h2 className="text-4xl font-bold text-white">GitHub</h2>
        </motion.div>

        {/* Header with Profile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-0 bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
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

        {/* Primary Stats Grid - Only non-zero values */}
        {primaryStats.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {primaryStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </motion.div>
        )}

        {/* Secondary Stats Grid - Only non-zero values */}
        {secondaryStats.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(secondaryStats.length, 5)} gap-4 mb-8`}
          >
            {secondaryStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </motion.div>
        )}

        {/* Highlights Grid - Only non-zero values */}
        {highlights.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {highlights.map((highlight) => (
              <motion.div
                key={highlight.title}
                variants={itemVariants}
                className={`bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 hover:border-${highlight.color}-500/50 transition-colors`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <highlight.icon className={`w-5 h-5 text-${highlight.color}-400`} />
                  <h4 className="font-semibold text-white">{highlight.title}</h4>
                </div>
                <a
                  href={`https://github.com/Gokul1111-cmd/${highlight.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"
                >
                  {highlight.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-sm text-slate-400 mt-2">{highlight.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Contribution Graph */}
        {contributions && contributions.total && contributionWeeks.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8 rounded-lg bg-slate-800/30 border border-slate-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Contribution Activity</h3>
              </div>
              <span className="text-sm text-slate-400">
                {contributions.total.toLocaleString()} contributions in the last year
              </span>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-flex flex-col gap-1 min-w-full">
                {/* Week days labels */}
                <div className="flex gap-1">
                  <div className="w-8"></div>
                  {contributionWeeks.map((week, idx) => {
                    const month = monthLabels[idx];
                    const prevMonth = idx > 0 ? monthLabels[idx - 1] : null;
                    const showLabel = idx === 0 || month !== prevMonth;
                    return showLabel ? (
                      <div key={week[0].date} className="text-xs text-slate-400 w-3">
                        {new Date(week[0].date).toLocaleDateString("en-US", { month: "short" })}
                      </div>
                    ) : (
                      <div key={week[0].date} className="w-3"></div>
                    );
                  })}
                </div>
                {/* Contribution grid */}
                {[
                  { label: "Mon", index: 1 },
                  { label: "Wed", index: 3 },
                  { label: "Fri", index: 5 },
                ].map((row) => (
                  <div key={row.label} className="flex gap-1 items-center">
                    <span className="text-xs text-slate-400 w-8">{row.label}</span>
                    <div className="flex gap-1">
                      {contributionWeeks.map((week) => {
                        const contribution = week[row.index] || { count: 0, level: 0, date: "" };
                        const level = contribution.level;
                        const colors = {
                          0: "bg-slate-700/30",
                          1: "bg-green-900/50",
                          2: "bg-green-700/70",
                          3: "bg-green-500",
                          4: "bg-green-400",
                        };
                        return (
                          <motion.div
                            key={`${row.label}-${contribution.date}`}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.001 }}
                            whileHover={{ scale: 1.5 }}
                            title={`${contribution.count} contributions on ${contribution.date}`}
                            className={`w-3 h-3 rounded-sm ${colors[level] || colors[0]} cursor-pointer transition-transform`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-slate-700/30"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-900/50"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-700/70"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* GitHub Profile Link */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 text-center"
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

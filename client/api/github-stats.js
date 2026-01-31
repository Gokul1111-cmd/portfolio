export default async function handler(req, res) {
  const username = "Gokul1111-cmd";

  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

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

    res.status(200).json({
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
  } catch (error) {
    console.error("GitHub API Error:", error);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
}

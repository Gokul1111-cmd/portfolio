// Legacy file kept to avoid broken imports; directs callers to the correct plural route.
export default function handler(_req, res) {
  return res
    .status(301)
    .json({ message: "Use /api/projects instead of /api/project" });
}

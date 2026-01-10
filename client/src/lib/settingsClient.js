let cachedSettings = null;
let fetchPromise = null; // Track in-flight fetch to prevent duplicates

export const getSettings = async () => {
  // Return cached settings immediately if available
  if (cachedSettings) return cachedSettings;

  // If there's already a fetch in progress, wait for it
  if (fetchPromise) return fetchPromise;

  // Start a new fetch and cache the promise
  fetchPromise = (async () => {
    try {
      const res = await fetch("/api/admin?action=settings");
      if (!res.ok) throw new Error(`settings fetch ${res.status}`);
      cachedSettings = await res.json();
      return cachedSettings;
    } catch (err) {
      console.warn("settings fetch failed", err);
      // Cache the fallback to prevent repeated failures
      cachedSettings = { useSyncedData: false };
      return cachedSettings;
    } finally {
      // Clear the promise after fetch completes
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

export const setSettings = async (payload) => {
  cachedSettings = null;
  const res = await fetch("/api/admin?action=settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`settings update ${res.status}`);
  const data = await res.json();
  cachedSettings = data;
  return data;
};

export const clearSettingsCache = () => {
  cachedSettings = null;
};

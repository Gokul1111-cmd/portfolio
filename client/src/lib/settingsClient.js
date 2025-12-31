let cachedSettings = null;

export const getSettings = async () => {
  if (cachedSettings) return cachedSettings;
  try {
    const res = await fetch("/api/settings");
    if (!res.ok) throw new Error(`settings fetch ${res.status}`);
    cachedSettings = await res.json();
    return cachedSettings;
  } catch (err) {
    console.warn("settings fetch failed", err);
    return { useSyncedData: false };
  }
};

export const setSettings = async (payload) => {
  cachedSettings = null;
  const res = await fetch("/api/settings", {
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

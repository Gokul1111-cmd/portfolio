import { getSettings } from "./settingsClient";

// Track total items fetched for summary (unique data sources only)
let fetchStats = {
  static: 0,
  live: 0,
  fetchedSources: new Set(), // Track which sources we've already counted
  pendingFetches: 0, // Track active fetches
  hasShownSummary: false, // Prevent duplicate summaries
};

const logSummary = () => {
  const total = fetchStats.static + fetchStats.live;
  if (total > 0 && fetchStats.fetchedSources.size > 0) {
    console.log(
      `%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      "color: #6366f1",
    );
    console.log(
      `%c📊 FETCH SUMMARY | Total Items: ${total} (from ${fetchStats.fetchedSources.size} sources)`,
      "color: #6366f1; font-weight: bold; font-size: 14px",
    );
    console.log(
      `%c   Static: ${fetchStats.static} items | Live: ${fetchStats.live} items`,
      "color: #8b5cf6",
    );
    console.log(
      `%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      "color: #6366f1",
    );
  }
};

// Check if all fetches are complete and show summary
const checkAndShowSummary = () => {
  if (fetchStats.pendingFetches === 0 && !fetchStats.hasShownSummary) {
    fetchStats.hasShownSummary = true;
    // Wait a bit to ensure all logs appear first
    setTimeout(() => {
      logSummary();
      // Reset for next page load cycle
      setTimeout(() => {
        fetchStats = {
          static: 0,
          live: 0,
          fetchedSources: new Set(),
          pendingFetches: 0,
          hasShownSummary: false,
        };
      }, 2000);
    }, 100);
  }
};

const staticUrl = (name, version) => {
  // Always use API proxy to avoid CORS issues
  const v = version ? `&v=${version}` : "";
  return `/api/media-proxy?type=storage&name=${name}${v}`;
};

export const fetchStaticOrLive = async ({ name, liveUrl, fallbackEmpty }) => {
  // Track this fetch as pending
  fetchStats.pendingFetches++;

  try {
    const settings = await getSettings();
    const useStatic = Boolean(settings?.useSyncedData);
    const version = settings?.lastSyncedAt || settings?.generatedAt;

    console.log(
      `[${name}] Mode: ${useStatic ? "STATIC" : "LIVE"}, Version: ${version || "none"}`,
    );

    if (useStatic && version) {
      const url = staticUrl(name, version);
      console.log(`[${name}] Fetching from:`, url);
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();

        // Calculate item count - exclude 'generatedAt' from content bundles
        let itemCount;
        if (json?.items?.length) {
          itemCount = json.items.length;
        } else if (json?.data?.length) {
          itemCount = json.data.length;
        } else if (
          name === "content" &&
          json?.data &&
          typeof json.data === "object"
        ) {
          // For content bundles where data is an object with keys
          itemCount = Object.keys(json.data).length;
        } else if (name === "content" && typeof json === "object") {
          // For content bundles, exclude generatedAt from count
          itemCount = Object.keys(json).filter(
            (k) => k !== "generatedAt",
          ).length;
        } else {
          itemCount = Object.keys(json).length;
        }

        // Only count each unique source once
        const sourceKey = `static-${name}`;
        if (!fetchStats.fetchedSources.has(sourceKey)) {
          fetchStats.static += itemCount;
          fetchStats.fetchedSources.add(sourceKey);
        }

        // Show detailed breakdown for bundled content
        if (name === "content" && json?.items) {
          const keys = json.items
            .map((item) => item.key || "unknown")
            .join(", ");
          console.log(
            `[${name}] ✓ Static data loaded: ${itemCount} items [${keys}]`,
          );
        } else if (
          name === "content" &&
          json?.data &&
          typeof json.data === "object"
        ) {
          const keys = Object.keys(json.data).join(", ");
          console.log(
            `[${name}] ✓ Static data loaded: ${itemCount} items [${keys}]`,
          );
        } else if (name === "content" && typeof json === "object") {
          const keys = Object.keys(json)
            .filter((k) => k !== "generatedAt")
            .join(", ");
          console.log(
            `[${name}] ✓ Static data loaded: ${itemCount} items [${keys}]`,
          );
        } else {
          console.log(`[${name}] ✓ Static data loaded: ${itemCount} items`);
        }

        // Validate data freshness
        const dataAge = Date.now() - (json?.generatedAt || 0);
        if (dataAge > 86400000) {
          console.warn(`[${name}] ⚠ Data is >24h old, consider re-syncing`);
        }

        // Mark fetch complete and check if we should show summary
        fetchStats.pendingFetches--;
        checkAndShowSummary();

        if (json?.items) return json.items;
        if (json?.data) return json.data;
        return json;
      } else if (res.status === 403) {
        console.warn(
          `[${name}] ✗ Static fetch 403, falling back to live (check Storage rules)`,
        );
      } else {
        console.warn(
          `[${name}] ✗ Static fetch failed (${res.status}), falling back to live`,
        );
      }
    }
  } catch (err) {
    console.warn(
      `[${name}] ✗ Static fetch error, falling back to live:`,
      err.message,
    );
  }

  try {
    console.log(`[${name}] Fetching from live API:`, liveUrl);
    const res = await fetch(liveUrl);
    if (!res.ok) throw new Error(`Live fetch failed ${res.status}`);
    const data = await res.json();

    // Calculate item count - content items are fetched individually, so count as 1 each
    const itemCount = Array.isArray(data) ? data.length : 1; // Individual content items count as 1

    // Only count each unique source once
    const sourceKey = `live-${name}`;
    if (!fetchStats.fetchedSources.has(sourceKey)) {
      fetchStats.live += itemCount;
      fetchStats.fetchedSources.add(sourceKey);
    }

    // Show key for content items
    if (name === "content" && data?.key) {
      console.log(
        `[${name}] ✓ Live data loaded: ${itemCount} items [${data.key}]`,
      );
    } else {
      console.log(`[${name}] ✓ Live data loaded: ${itemCount} items`);
    }

    // Mark fetch complete and check if we should show summary
    fetchStats.pendingFetches--;
    checkAndShowSummary();

    return data;
  } catch (err) {
    console.error(`[${name}] ✗ Live fetch failed:`, err.message);

    // Mark fetch complete even on error
    fetchStats.pendingFetches--;
    checkAndShowSummary();

    return fallbackEmpty;
  }
};

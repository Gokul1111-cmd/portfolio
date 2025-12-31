import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CloudUpload,
  RefreshCcw,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  FileJson,
} from "lucide-react";
import {
  getSettings,
  setSettings,
  clearSettingsCache,
} from "../../lib/settingsClient";

const targets = [
  {
    id: "all",
    label: "Sync All",
    description: "Sync content, collections, and settings",
    icon: CloudUpload,
  },
  {
    id: "content",
    label: "Content",
    description: "Hero, About, Approach, Contact, Site",
    icon: FileJson,
  },
  {
    id: "projects",
    label: "Projects",
    description: "Projects collection",
    icon: RefreshCcw,
  },
  {
    id: "skills",
    label: "Skills",
    description: "Skills collection",
    icon: RefreshCcw,
  },
  {
    id: "testimonials",
    label: "Testimonials",
    description: "Testimonials collection",
    icon: RefreshCcw,
  },
  {
    id: "certificates",
    label: "Certificates",
    description: "Certificates collection",
    icon: RefreshCcw,
  },
];

const formatTime = (value) => {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
};

export const SyncSettings = () => {
  const [settings, setSettingsState] = useState({ useSyncedData: false });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [syncingTarget, setSyncingTarget] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState(null);

  const loadSettings = async () => {
    setLoadingSettings(true);
    setError("");
    try {
      const data = await getSettings();
      setSettingsState(data || { useSyncedData: false });
      if (data?.lastSummary) setSummary(data.lastSummary);
    } catch (err) {
      console.error("Failed to load settings", err);
      setError("Could not load sync settings.");
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const toggleUseSynced = async () => {
    setError("");
    setMessage("");
    try {
      clearSettingsCache();
      const updated = await setSettings({
        useSyncedData: !settings.useSyncedData,
      });
      setSettingsState(updated);
      setMessage(
        updated.useSyncedData
          ? "✅ Static data enabled - site now uses synced JSON"
          : "🔄 Static data disabled - site now uses live API",
      );
      // Force reload page to clear all component caches
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("Toggle failed", err);
      setError("Failed to update setting.");
    }
  };

  const runSync = async (target) => {
    setSyncingTarget(target);
    setError("");
    setMessage("");
    setSummary(null);
    try {
      const res = await fetch(
        target === "all" ? "/api/sync" : `/api/sync?target=${target}`,
        { method: "POST" },
      );
      const data = await res.json();
      setSummary(data);
      if (data.errors?.length) {
        const errorList = data.errors
          .map((e) => `${e.target}: ${e.message}`)
          .join(", ");
        setError(`Sync completed with errors: ${errorList}`);
      } else if (!res.ok) {
        setError("Sync failed. Check summary.");
      } else {
        const syncedCount =
          data.synced?.reduce((sum, s) => sum + s.count, 0) || 0;
        setMessage(
          `✅ Synced ${syncedCount} items across ${data.synced?.length || 0} targets.`,
        );
      }
      const refreshed = await getSettings();
      setSettingsState(refreshed || { useSyncedData: false });
    } catch (err) {
      console.error("Sync request failed", err);
      setError(`❌ Sync failed: ${err.message}`);
      setSummary(null);
    } finally {
      setSyncingTarget("");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sync &amp; Static Data</h2>
          <p className="text-sm text-muted-foreground">
            Generate static JSON to Storage and control site data source.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Use synced data</span>
          <button
            onClick={toggleUseSynced}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${settings.useSyncedData ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"}`}
            disabled={loadingSettings}
          >
            {settings.useSyncedData ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold">
              {settings.useSyncedData ? "Enabled" : "Disabled"}
            </span>
          </button>
        </div>
      </div>

      {loadingSettings && (
        <p className="text-sm text-muted-foreground">
          Loading current settings...
        </p>
      )}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {targets.map((target) => {
          const Icon = target.icon;
          const isSyncing = syncingTarget === target.id;
          return (
            <motion.div
              key={target.id}
              className="border border-border rounded-xl p-4 bg-card/60 shadow-sm"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">{target.label}</h3>
                </div>
                {isSyncing ? (
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {target.description}
              </p>
              <button
                className="w-full px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-60"
                onClick={() => runSync(target.id)}
                disabled={isSyncing}
              >
                {isSyncing ? "Syncing..." : "Run Sync"}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-border rounded-xl p-4 bg-card/60">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Last Sync</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatTime(settings.lastSyncedAt || summary?.generatedAt)}
          </p>
          {summary?.bucket && (
            <p className="text-xs text-muted-foreground mt-1">
              Bucket: {summary.bucket}
            </p>
          )}
        </div>

        <div className="border border-border rounded-xl p-4 bg-card/60">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Current Source</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {settings.useSyncedData
              ? "Site uses static JSON from Storage."
              : "Site uses live Firestore/API responses."}
          </p>
        </div>
      </div>

      {summary && (
        <div className="border border-border rounded-xl p-4 bg-card/60">
          <div className="flex items-center gap-2 mb-3">
            {summary.errors?.length ? (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
            <h3 className="font-semibold">Last Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {(summary.synced || []).map((item) => (
              <div
                key={item.target}
                className="flex items-center gap-2 p-2 rounded-lg bg-background/60 border border-border"
              >
                <span className="font-medium">{item.target}</span>
                <span className="text-muted-foreground">
                  {item.count} items
                </span>
              </div>
            ))}
            {(summary.errors || []).map((err) => (
              <div
                key={`${err.target}-${err.message}`}
                className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-800"
              >
                <span className="font-medium">{err.target}</span>
                <span>{err.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, LayoutDashboard, Plus, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

export const TimelineEditor = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content?key=approach");
      if (res.ok) {
        const json = await res.json();
        setData(json?.data ? json.data : {});
      }
    } catch (err) {
      console.error("Failed to load timeline", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/content?key=approach", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (res.ok) alert("Timeline saved!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save timeline");
    }
  };

  const updateField = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateListField = (idx, key, value) => {
    const items = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    updateTimelineField(idx, key, items);
  };

  const updateTimelineField = (idx, key, value) => {
    const next = Array.isArray(data.careerTimeline) ? [...data.careerTimeline] : [];
    next[idx] = { ...(next[idx] || {}), [key]: value };
    setData((prev) => ({ ...prev, careerTimeline: next }));
  };

  const addTimelineItem = () => {
    const next = Array.isArray(data.careerTimeline) ? [...data.careerTimeline] : [];
    next.push({
      period: "New Period",
      range: "",
      title: "New Title",
      subtitle: "",
      highlights: [],
      tech: [],
      result: "",
      icon: "work",
    });
    setData((prev) => ({ ...prev, careerTimeline: next }));
  };

  const removeTimelineItem = (idx) => {
    const next = Array.isArray(data.careerTimeline) ? [...data.careerTimeline] : [];
    next.splice(idx, 1);
    setData((prev) => ({ ...prev, careerTimeline: next }));
  };

  const moveTimelineItem = (idx, dir) => {
    const next = Array.isArray(data.careerTimeline) ? [...data.careerTimeline] : [];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setData((prev) => ({ ...prev, careerTimeline: next }));
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <LayoutDashboard className="text-primary" /> Career Timeline
      </h2>
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg max-w-5xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Career Title</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                value={data.careerTitle || ""}
                onChange={(e) => updateField("careerTitle", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Career Intro</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                value={data.careerIntro || ""}
                onChange={(e) => updateField("careerIntro", e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">Career Timeline</label>
              <button
                type="button"
                onClick={addTimelineItem}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Milestone
              </button>
            </div>
            <div className="space-y-3">
              {(data.careerTimeline || []).map((item, idx) => (
                <div key={idx} className="border border-border rounded-md p-3 bg-card/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Milestone {idx + 1}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <button type="button" onClick={() => moveTimelineItem(idx, -1)} className="p-1 hover:bg-primary/10 rounded" title="Move up">
                        <ArrowUp size={14} />
                      </button>
                      <button type="button" onClick={() => moveTimelineItem(idx, 1)} className="p-1 hover:bg-primary/10 rounded" title="Move down">
                        <ArrowDown size={14} />
                      </button>
                      <button type="button" onClick={() => removeTimelineItem(idx)} className="p-1 hover:bg-destructive/10 rounded text-destructive" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    <input
                      className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                      placeholder="Period (e.g., Infosys)"
                      value={item.period || ""}
                      onChange={(e) => updateTimelineField(idx, "period", e.target.value)}
                    />
                    <input
                      className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                      placeholder="Range (e.g., 2023 - Present)"
                      value={item.range || ""}
                      onChange={(e) => updateTimelineField(idx, "range", e.target.value)}
                    />
                  </div>
                  <input
                    className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                    placeholder="Title"
                    value={item.title || ""}
                    onChange={(e) => updateTimelineField(idx, "title", e.target.value)}
                  />
                  <input
                    className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                    placeholder="Subtitle"
                    value={item.subtitle || ""}
                    onChange={(e) => updateTimelineField(idx, "subtitle", e.target.value)}
                  />
                  <textarea
                    rows={2}
                    className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                    placeholder="Highlights (comma separated)"
                    value={(item.highlights || []).join(', ')}
                    onChange={(e) => updateListField(idx, "highlights", e.target.value)}
                  />
                  <textarea
                    rows={2}
                    className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                    placeholder="Tech (comma separated)"
                    value={(item.tech || []).join(', ')}
                    onChange={(e) => updateListField(idx, "tech", e.target.value)}
                  />
                  <input
                    className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                    placeholder="Result"
                    value={item.result || ""}
                    onChange={(e) => updateTimelineField(idx, "result", e.target.value)}
                  />
                  <input
                    className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                    placeholder="Icon (graduation | college | work)"
                    value={item.icon || ""}
                    onChange={(e) => updateTimelineField(idx, "icon", e.target.value)}
                  />
                </div>
              ))}
              {!data.careerTimeline?.length && (
                <p className="text-xs text-muted-foreground">No milestones yet. Click "Add Milestone" to begin.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <Save size={16} /> Save Timeline
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="mt-10 border border-border rounded-xl p-4 bg-card/60">
          <h3 className="text-sm font-semibold mb-3">Career Path Preview</h3>
          <div className="space-y-3">
            {(data.careerTimeline || []).map((item, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-background/70 p-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">{item.period || 'Period'}</span>
                  <span>{item.range || 'Range'}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{item.title || 'Title'}</p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground mb-1">{item.subtitle}</p>
                )}
                <div className="text-xs text-muted-foreground space-y-1">
                  {(item.highlights || []).slice(0, 3).map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
                {item.tech?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tech.slice(0, 4).map((t, i) => (
                      <span key={i} className="px-2 py-0.5 text-[11px] rounded-full bg-primary/10 text-primary border border-primary/20">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
                {item.result && (
                  <p className="mt-2 text-xs font-semibold text-foreground">Result: {item.result}</p>
                )}
              </div>
            ))}
            {!data.careerTimeline?.length && (
              <p className="text-xs text-muted-foreground">Add milestones to see the preview.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

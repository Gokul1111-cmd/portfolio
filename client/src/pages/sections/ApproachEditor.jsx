import { motion } from "framer-motion";
import { Save, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";

export const ApproachEditor = () => {
  const [approachData, setApproachData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApproach();
  }, []);

  const fetchApproach = async () => {
    try {
      const res = await fetch("/api/content?key=approach");
      if (res.ok) {
        const data = await res.json();
        setApproachData(data?.data ? data.data : {});
      }
    } catch (error) {
      console.error("Failed to load", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/content?key=approach", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: approachData }),
      });
      if (res.ok) alert("Saved!");
    } catch (error) {
      alert("Failed to save");
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <LayoutDashboard className="text-primary" /> My Approach
      </h2>
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <input
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={approachData.title || ""}
              onChange={(e) => setApproachData({ ...approachData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              rows={4}
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={approachData.description || ""}
              onChange={(e) => setApproachData({ ...approachData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Steps (JSON)</label>
            <textarea
              rows={6}
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary font-mono text-sm"
              value={approachData.steps ? JSON.stringify(approachData.steps, null, 2) : ""}
              onChange={(e) => {
                try {
                  setApproachData({ ...approachData, steps: JSON.parse(e.target.value) });
                } catch {}
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

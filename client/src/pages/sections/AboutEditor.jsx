import { motion } from "framer-motion";
import { Save, Users } from "lucide-react";
import { useState, useEffect } from "react";

export const AboutEditor = () => {
  const [aboutData, setAboutData] = useState({
    bio: "",
    experience: "",
    education: "",
    personalSummary: "",
    achievements: [],
    techStack: [],
    features: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch("/api/content?key=about");
      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          setAboutData({
            bio: data.data.bio || "",
            experience: data.data.experience || "",
            education: data.data.education || "",
            personalSummary: data.data.personalSummary || "",
            achievements: Array.isArray(data.data.achievements) ? data.data.achievements : [],
            techStack: Array.isArray(data.data.techStack) ? data.data.techStack : [],
            features: Array.isArray(data.data.features) ? data.data.features : [],
          });
        } else {
          setAboutData({ bio: "", experience: "", education: "", personalSummary: "", achievements: [], techStack: [], features: [] });
        }
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
      const res = await fetch("/api/content?key=about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: aboutData }),
      });
      if (res.ok) alert("Saved!");
    } catch (error) {
      alert("Failed to save");
    }
  };

  const updateAchievement = (index, field, value) => {
    const next = [...(aboutData.achievements || [])];
    next[index] = { ...next[index], [field]: value };
    setAboutData({ ...aboutData, achievements: next });
  };

  const addAchievement = () => {
    const next = [...(aboutData.achievements || []), { number: "", suffix: "", label: "", icon: "" }];
    setAboutData({ ...aboutData, achievements: next });
  };

  const removeAchievement = (index) => {
    const next = [...(aboutData.achievements || [])];
    next.splice(index, 1);
    setAboutData({ ...aboutData, achievements: next });
  };

  const updateTechStack = (index, field, value) => {
    const next = [...(aboutData.techStack || [])];
    if (!next[index]) next[index] = { category: "", items: [] };
    if (field === "items") {
      next[index].items = value.split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      next[index][field] = value;
    }
    setAboutData({ ...aboutData, techStack: next });
  };

  const addTechStack = () => {
    const next = [...(aboutData.techStack || []), { category: "", items: [] }];
    setAboutData({ ...aboutData, techStack: next });
  };

  const removeTechStack = (index) => {
    const next = [...(aboutData.techStack || [])];
    next.splice(index, 1);
    setAboutData({ ...aboutData, techStack: next });
  };

  const updateFeature = (index, value) => {
    const next = [...(aboutData.features || [])];
    next[index] = value;
    setAboutData({ ...aboutData, features: next });
  };

  const addFeature = () => {
    const next = [...(aboutData.features || []), ""];
    setAboutData({ ...aboutData, features: next });
  };

  const removeFeature = (index) => {
    const next = [...(aboutData.features || [])];
    next.splice(index, 1);
    setAboutData({ ...aboutData, features: next });
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="text-primary" /> About
      </h2>
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Bio</label>
            <textarea
              rows={4}
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={aboutData.bio || ""}
              onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Experience</label>
            <textarea
              rows={4}
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={aboutData.experience || ""}
              onChange={(e) => setAboutData({ ...aboutData, experience: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Education</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={aboutData.education || ""}
              onChange={(e) => setAboutData({ ...aboutData, education: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Personal Summary</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={aboutData.personalSummary || ""}
              onChange={(e) => setAboutData({ ...aboutData, personalSummary: e.target.value })}
            />
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Achievements</label>
              <button type="button" onClick={addAchievement} className="text-xs text-primary hover:underline">Add</button>
            </div>
            <div className="space-y-3">
              {(aboutData.achievements || []).map((item, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 items-center">
                  <input
                    className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                    placeholder="Number"
                    value={item.number || ""}
                    onChange={(e) => updateAchievement(idx, "number", e.target.value)}
                  />
                  <input
                    className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                    placeholder="Suffix"
                    value={item.suffix || ""}
                    onChange={(e) => updateAchievement(idx, "suffix", e.target.value)}
                  />
                  <input
                    className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                    placeholder="Label"
                    value={item.label || ""}
                    onChange={(e) => updateAchievement(idx, "label", e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input
                      className="flex-1 p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                      placeholder="Icon (emoji)"
                      value={item.icon || ""}
                      onChange={(e) => updateAchievement(idx, "icon", e.target.value)}
                    />
                    <button type="button" onClick={() => removeAchievement(idx)} className="text-xs text-destructive px-2">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Tech Stack (cards)</label>
              <button type="button" onClick={addTechStack} className="text-xs text-primary hover:underline">Add</button>
            </div>
            <div className="space-y-3">
              {(aboutData.techStack || []).map((item, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 items-start">
                  <input
                    className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                    placeholder="Category (e.g., Frontend)"
                    value={item.category || ""}
                    onChange={(e) => updateTechStack(idx, "category", e.target.value)}
                  />
                  <textarea
                    rows={2}
                    className="col-span-2 p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                    placeholder="Items comma-separated (React, HTML, CSS)"
                    value={(item.items || []).join(", ")}
                    onChange={(e) => updateTechStack(idx, "items", e.target.value)}
                  />
                  <div className="col-span-3 flex justify-end">
                    <button type="button" onClick={() => removeTechStack(idx)} className="text-xs text-destructive px-2">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Me */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Why Choose Me (features)</label>
              <button type="button" onClick={addFeature} className="text-xs text-primary hover:underline">Add</button>
            </div>
            <div className="space-y-2">
              {(aboutData.features || []).map((feature, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    className="flex-1 p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                    placeholder="Feature"
                    value={feature || ""}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                  />
                  <button type="button" onClick={() => removeFeature(idx)} className="text-xs text-destructive px-2">✕</button>
                </div>
              ))}
            </div>
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

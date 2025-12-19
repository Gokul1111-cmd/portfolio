import { motion } from "framer-motion";
import { Save, Sparkles, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export const HeroEditor = () => {
  const [heroData, setHeroData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [resumeDragActive, setResumeDragActive] = useState(false);
  const [profileDragActive, setProfileDragActive] = useState(false);

  const defaultHero = {
    name: "Gokul A",
    title: "Full-Stack Developer",
    headline: "I'm Gokul A",
    subheadline: "I build AI-powered web applications.",
    availability: "Available Immediately",
    primaryCtaText: "View Case Studies",
    primaryCtaLink: "#projects",
    secondaryCtaText: "View Projects",
    secondaryCtaLink: "#projects",
    resumeUrl: "/gokul-resume.pdf",
    profileImage: "/profile-logo.png",
    codeSnippets: [
      "import { FullStackDeveloper } from 'gokul.dev';",
      "",
      "const developer = new FullStackDeveloper({",
      "  name: 'Gokul A',",
      "  stack: ['React', 'Spring Boot', 'Java', 'Flask'],",
      "  focus: 'Building AI-powered web solutions',",
      "  status: 'Open to new opportunities'",
      "});",
      "",
      "await developer.launchPortfolio();",
      "// Featured: E-commerce, IoT, AI/ML, Web Applications",
      "",
      "developer.connect();",
      "console.log('🚀 Let's build something exceptional together!');",
    ],
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch("/api/content?key=hero");
      if (res.ok) {
        const data = await res.json();
        setHeroData(data?.data ? { ...defaultHero, ...data.data } : defaultHero);
      } else {
        setHeroData(defaultHero);
      }
    } catch (error) {
      console.error("Failed to load hero content", error);
      setHeroData(defaultHero);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/content?key=hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: heroData }),
      });
      if (res.ok) {
        alert("Hero content saved successfully!");
      }
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save");
    }
  };

  // File helpers
  const handleResumeFile = (file) => {
    if (!file) return;
    if (!file.type.includes("pdf")) {
      alert("Please upload a PDF resume");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") setHeroData((p) => ({ ...p, resumeUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") setHeroData((p) => ({ ...p, profileImage: result }));
    };
    reader.readAsDataURL(file);
  };

  const getDropZoneProps = (setActive, fileHandler) => ({
    onDragOver: (e) => {
      e.preventDefault();
      setActive(true);
    },
    onDragLeave: () => setActive(false),
    onDrop: (e) => {
      e.preventDefault();
      setActive(false);
      fileHandler(e.dataTransfer.files?.[0]);
    },
  });

  const dropZoneClass = (active) =>
    `mt-2 p-4 rounded-md border-2 border-dashed transition-all ${
      active
        ? "border-primary bg-primary/10 scale-[1.02]"
        : "border-border bg-background/50 hover:border-primary/50 cursor-pointer"
    }`;

  const updateCodeSnippet = (index, value) => {
    const next = [...(heroData.codeSnippets || [])];
    next[index] = value;
    setHeroData({ ...heroData, codeSnippets: next });
  };

  const addCodeSnippet = () => {
    const next = [...(heroData.codeSnippets || []), ""];
    setHeroData({ ...heroData, codeSnippets: next });
  };

  const removeCodeSnippet = (index) => {
    const next = [...(heroData.codeSnippets || [])];
    next.splice(index, 1);
    setHeroData({ ...heroData, codeSnippets: next });
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="text-primary" /> Hero Section
      </h2>
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg max-w-4xl">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Main Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.name || ""}
                onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.title || ""}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Headline</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.headline || ""}
                onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Subheadline</label>
              <textarea
                rows={2}
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.subheadline || ""}
                onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Primary CTA Text</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.primaryCtaText || ""}
                onChange={(e) => setHeroData({ ...heroData, primaryCtaText: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Primary CTA Link</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.primaryCtaLink || ""}
                onChange={(e) => setHeroData({ ...heroData, primaryCtaLink: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Secondary CTA Text</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.secondaryCtaText || ""}
                onChange={(e) => setHeroData({ ...heroData, secondaryCtaText: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Secondary CTA Link</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.secondaryCtaLink || ""}
                onChange={(e) => setHeroData({ ...heroData, secondaryCtaLink: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Availability</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.availability || ""}
                onChange={(e) => setHeroData({ ...heroData, availability: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Resume URL</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                value={heroData.resumeUrl || ""}
                onChange={(e) => setHeroData({ ...heroData, resumeUrl: e.target.value })}
              />
              <div
                {...getDropZoneProps(setResumeDragActive, handleResumeFile)}
                className={dropZoneClass(resumeDragActive)}
              >
                <label className="flex flex-col items-center justify-center text-xs text-muted-foreground gap-2 cursor-pointer">
                  <span>📁 Drag & drop resume PDF or</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleResumeFile(e.target.files?.[0])}
                  />
                  <span className="text-primary font-medium">click to browse</span>
                </label>
                <p className="text-[11px] text-muted-foreground/80 text-center mt-2">PDF only • Stored as data URL for preview/download</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Profile Image</label>
              <input
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                placeholder="Image URL or upload below"
                value={heroData.profileImage || ""}
                onChange={(e) => setHeroData({ ...heroData, profileImage: e.target.value })}
              />
              <div
                {...getDropZoneProps(setProfileDragActive, handleProfileImageFile)}
                className={dropZoneClass(profileDragActive)}
              >
                <label className="flex flex-col items-center justify-center text-xs text-muted-foreground gap-2 cursor-pointer">
                  <span>📁 Drag & drop profile image or</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleProfileImageFile(e.target.files?.[0])}
                  />
                  <span className="text-primary font-medium">click to browse</span>
                </label>
                <p className="text-[11px] text-muted-foreground/80 text-center mt-2">JPEG/PNG • Stored as data URL for instant preview</p>
              </div>
            </div>
          </div>

          {/* Code Snippets */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Code Snippet (Portfolio.js)</h3>
              <button type="button" onClick={addCodeSnippet} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Plus size={14} /> Add Line
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(heroData.codeSnippets || []).map((snippet, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="flex-1 p-2 rounded-md bg-background border border-border outline-none focus:border-primary font-mono text-sm"
                    placeholder={`Line ${idx + 1}`}
                    value={snippet}
                    onChange={(e) => updateCodeSnippet(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeCodeSnippet(idx)}
                    className="text-xs text-destructive px-2 hover:bg-destructive/10 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <Save size={16} /> Save Hero
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

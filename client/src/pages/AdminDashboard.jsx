import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, LayoutDashboard, LogOut, Save, X, Pencil, Sparkles } from "lucide-react";

const accentByCategory = {
  "Web Application": "from-blue-500 to-cyan-600",
  "E-commerce": "from-purple-500 to-indigo-600",
  "IoT Application": "from-orange-500 to-red-600",
  "Web Design": "from-emerald-500 to-teal-600",
  "AI/ML": "from-pink-500 to-rose-600",
};

const defaultHero = {
  name: "Gokul A",
  title: "Full-Stack Developer",
  headline: "I'm Gokul A",
  subheadline: "I build AI-powered web applications that solve real-world problems.",
  availability: "Available Immediately for Full-Stack Developer roles",
  primaryCtaText: "View Case Studies",
  primaryCtaLink: "#projects",
  secondaryCtaText: "View Projects",
  secondaryCtaLink: "#projects",
  resumeUrl: "/gokul-resume.pdf",
  achievements: [
    { number: "0", label: "Years Experience", suffix: "+" },
    { number: "8", label: "Projects Completed", suffix: "+" },
    { number: "0", label: "Happy Clients", suffix: "" },
  ],
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

export const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  // Hero state
  const [heroData, setHeroData] = useState(defaultHero);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Application",
    image: "/projects/project1.png", // Default placeholder
    demoUrl: "",
    githubUrl: "",
    video: "",
    status: "Live",
    accentColor: accentByCategory["Web Application"] || "from-blue-500 to-cyan-600",
    tags: "React, Tailwind CSS",
    highlights: "Responsive Design, Modern UI",
    featured: false
  });

  useEffect(() => {
    // Check Auth
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) navigate("/login");
    
    fetchProjects();
    fetchHero();
  }, [navigate]);

  const fetchHero = async () => {
    try {
      const res = await fetch("/api/content?key=hero");
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          setHeroData({ ...defaultHero, ...data.data });
        } else {
          setHeroData(defaultHero);
        }
      } else {
        setHeroData(defaultHero);
      }
    } catch (error) {
      console.error("Failed to load hero content", error);
      setHeroData(defaultHero);
    } finally {
      setIsHeroLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load projects", error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const highlightsArray = formData.highlights
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image: formData.image,
          demoUrl: formData.demoUrl,
          githubUrl: formData.githubUrl,
          video: formData.video,
          status: formData.status,
          accentColor: formData.accentColor,
          tags: tagsArray,
          highlights: highlightsArray,
          featured: formData.featured,
        })
      });
      
      if (res.ok) {
        const newProject = await res.json();
        setProjects([newProject, ...projects]);
        setFormData({
          title: "",
          description: "",
          category: "Web Application",
          image: "/projects/project1.png",
          demoUrl: "",
          githubUrl: "",
          video: "",
          status: "Live",
          accentColor: "from-blue-500 to-cyan-600",
          tags: "React, Tailwind CSS",
          highlights: "Responsive Design, Modern UI",
          featured: false,
        });
        alert("Project Added Successfully!");
      }
    } catch (error) {
      console.error("Submit failed", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/");
  };

  const parseAchievements = (value) => {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [number = "", label = "", suffix = ""] = line.split("|");
        return { number: number.trim(), label: label.trim(), suffix: suffix.trim() };
      });
  };

  const achievementsToText = (arr) =>
    arr
      .map((a) => `${a.number || ""}|${a.label || ""}|${a.suffix || ""}`.trim())
      .join("\n");

  const handleHeroSave = async (e) => {
    e.preventDefault();

    const achievements = parseAchievements(heroData.achievementsText || achievementsToText(defaultHero.achievements));
    const codeSnippets = heroData.codeSnippetsText
      ? heroData.codeSnippetsText.split("\n").map((l) => l)
      : defaultHero.codeSnippets;

    const payload = {
      ...heroData,
      achievements,
      codeSnippets,
    };

    try {
      const res = await fetch("/api/content?key=hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
      if (res.ok) {
        setHeroData((prev) => ({
          ...prev,
          achievements,
          codeSnippets,
          achievementsText: achievementsToText(achievements),
          codeSnippetsText: codeSnippets.join("\n"),
        }));
        alert("Hero content saved");
      }
    } catch (error) {
      console.error("Hero save failed", error);
    }
  };

  const toCommaString = (val) => {
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "string") return val;
    return "";
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      category: project.category || "Web Application",
      image: project.image || "/projects/project1.png",
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      video: project.video || "",
      status: project.status || "Live",
      accentColor: project.accentColor || accentByCategory[project.category] || "from-blue-500 to-cyan-600",
      tags: toCommaString(project.tags) || "React, Tailwind CSS",
      highlights: toCommaString(project.highlights) || "Responsive Design, Modern UI",
      featured: Boolean(project.featured),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const highlightsArray = formData.highlights
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/projects?id=${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image: formData.image,
          demoUrl: formData.demoUrl,
          githubUrl: formData.githubUrl,
          video: formData.video,
          status: formData.status,
          accentColor: formData.accentColor,
          tags: tagsArray,
          highlights: highlightsArray,
          featured: formData.featured,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditingProject(null);
        setFormData({
          title: "",
          description: "",
          category: "Web Application",
          image: "/projects/project1.png",
          demoUrl: "",
          githubUrl: "",
          video: "",
          status: "Live",
          accentColor: accentByCategory["Web Application"] || "from-blue-500 to-cyan-600",
          tags: "React, Tailwind CSS",
          highlights: "Responsive Design, Modern UI",
          featured: false,
        });
        alert("Project updated successfully!");
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-20">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <LayoutDashboard className="text-primary" />
            <span>Admin Dashboard</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Hero Content */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Sparkles className="text-primary" /> Hero Content
            </div>
            {isHeroLoading && <span className="text-xs text-muted-foreground">Loading…</span>}
          </div>

          {!isHeroLoading && (
            <form onSubmit={handleHeroSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="text-xs font-medium text-muted-foreground">Subheadline / Summary</label>
                <textarea
                  rows={2}
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  value={heroData.subheadline || ""}
                  onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Availability Line</label>
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
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Achievements (one per line: number|label|suffix)</label>
                <textarea
                  rows={3}
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  value={heroData.achievementsText ?? achievementsToText(heroData.achievements || defaultHero.achievements)}
                  onChange={(e) => setHeroData({ ...heroData, achievementsText: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Code Snippets (one line per row)</label>
                <textarea
                  rows={5}
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none font-mono text-sm"
                  value={heroData.codeSnippetsText ?? (heroData.codeSnippets || defaultHero.codeSnippets).join("\n")}
                  onChange={(e) => setHeroData({ ...heroData, codeSnippetsText: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                >
                  <Save size={16} /> Save Hero Content
                </button>
              </div>
            </form>
          )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Add Project Form */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg sticky top-24">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="text-primary" /> Add New Project
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Project Title</label>
                <input 
                  required
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select 
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  value={formData.category}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      category: value,
                      accentColor: accentByCategory[value] || prev.accentColor,
                    }));
                  }}
                >
                  <option>Web Application</option>
                  <option>E-commerce</option>
                  <option>IoT Application</option>
                  <option>Web Design</option>
                  <option>AI/ML</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Image URL</label>
                <input 
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Demo URL</label>
                  <input 
                    className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                    value={formData.demoUrl}
                    onChange={e => setFormData({...formData, demoUrl: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">GitHub URL</label>
                  <input 
                    className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                    value={formData.githubUrl}
                    onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Video URL (optional)</label>
                <input 
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  value={formData.video}
                  onChange={e => setFormData({...formData, video: e.target.value})}
                  placeholder="/projects/videos/demo.mp4"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <select
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option>Live</option>
                  <option>In Development</option>
                  <option>Archived</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Accent Gradient</label>
                <input
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  value={formData.accentColor}
                  onChange={e => setFormData({...formData, accentColor: e.target.value})}
                  placeholder="Auto-filled by category (override if needed)"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Auto-fills from category; override only if you want a custom gradient.</p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Tags (comma separated)</label>
                <input
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  placeholder="React, Tailwind CSS, Firebase"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Highlights (comma separated)</label>
                <textarea
                  rows={2}
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none resize-none"
                  value={formData.highlights}
                  onChange={e => setFormData({...formData, highlights: e.target.value})}
                  placeholder="Product catalog, Shopping cart"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={e => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4"
                />
                Mark as featured
              </label>

              <button 
                type="submit" 
                className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save Project
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Existing Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold mb-4">Existing Projects ({projects.length})</h2>
          
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Loading projects...</div>
          ) : (
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center group hover:border-primary/50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{project.title}</h3>
                    <p className="text-xs text-primary mb-1">{project.category}</p>
                    <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(project)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                      title="Edit Project"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {projects.length === 0 && !isLoading && (
            <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-xl">
              No projects found. Add one on the left!
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setEditingProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 250 }}
              className="bg-card border border-border rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Editing</p>
                  <h3 className="text-lg font-bold">{editingProject.title}</h3>
                </div>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Project Title</label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <select
                      className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                      value={formData.category}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          category: value,
                          accentColor: accentByCategory[value] || prev.accentColor,
                        }));
                      }}
                    >
                      <option>Web Application</option>
                      <option>E-commerce</option>
                      <option>IoT Application</option>
                      <option>Web Design</option>
                      <option>AI/ML</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <textarea
                    rows={3}
                    className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Image URL</label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Video URL</label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                      value={formData.video}
                      onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Demo URL</label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">GitHub URL</label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <select
                      className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option>Live</option>
                      <option>In Development</option>
                      <option>Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Accent Gradient</label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">Auto-fills from category; override if desired.</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Tags (comma separated)</label>
                  <input
                    className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Highlights (comma separated)</label>
                  <textarea
                    rows={2}
                    className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none resize-none"
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Mark as featured
                </label>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-md border border-border text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                  >
                    <Save size={16} /> Update Project
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
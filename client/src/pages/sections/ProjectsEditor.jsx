import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Plus,
  Trash2,
  Pencil,
  X,
  Code2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Github,
  Star,
  Loader2,
} from "lucide-react";
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const accentByCategory = {
  "Web Application": "from-blue-500 to-cyan-600",
  "E-commerce": "from-purple-500 to-indigo-600",
  "IoT Application": "from-orange-500 to-red-600",
  "Web Design": "from-emerald-500 to-teal-600",
  "Food Tech": "from-rose-500 to-pink-600",
  "Restaurant Management": "from-amber-500 to-orange-600",
  "Project Management": "from-green-500 to-emerald-600",
  "Food & Recipe": "from-violet-500 to-purple-600",
  "Cybersecurity": "from-red-500 to-rose-600",
};

const categoryColors = {
  "E-commerce":
    "from-purple-500/20 to-indigo-600/20 text-purple-600 border-purple-500/30",
  "Web Application":
    "from-blue-500/20 to-cyan-600/20 text-blue-600 border-blue-500/30",
  "Restaurant Management":
    "from-amber-500/20 to-orange-600/20 text-amber-600 border-amber-500/30",
  "Food Tech":
    "from-rose-500/20 to-pink-600/20 text-rose-600 border-rose-500/30",
  "Food & Recipe":
    "from-violet-500/20 to-purple-600/20 text-violet-600 border-violet-500/30",
  "Cybersecurity":
    "from-red-500/20 to-rose-600/20 text-red-600 border-red-500/30",
  "IoT Application":
    "from-orange-500/20 to-red-600/20 text-orange-600 border-orange-500/30",
  "Web Design":
    "from-emerald-500/20 to-teal-600/20 text-emerald-600 border-emerald-500/30",
  "Project Management":
    "from-green-500/20 to-emerald-600/20 text-green-600 border-green-500/30",
};

// Live Preview Component - Shows exactly how the project will appear on portfolio
const ProjectCardPreview = ({ project }) => {
  const tagsArray =
    typeof project.tags === "string"
      ? project.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : Array.isArray(project.tags)
        ? project.tags
        : [];

  const highlightsArray =
    typeof project.highlights === "string"
      ? project.highlights
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean)
      : Array.isArray(project.highlights)
        ? project.highlights
        : [];

  return (
    <div className="sticky top-6">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Eye size={16} />
        <span>Live Preview</span>
      </div>

      <div className="group relative bg-background border border-border rounded-2xl overflow-hidden shadow-lg">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={project.image || "/placeholder.png"}
            alt={project.title || "Preview"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x400/1e293b/FFF?text=Project+Image";
            }}
          />

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                project.status === "Live"
                  ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-600 border border-amber-500/30"
              }`}
            >
              {project.status || "In Development"}
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${categoryColors[project.category] || "border-gray-500 text-gray-500"}`}
            >
              {project.category || "Web Application"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-foreground line-clamp-1">
              {project.title || "Project Title"}
            </h3>
            {project.featured && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 text-xs font-medium border border-amber-500/30">
                <Star size={11} className="fill-amber-500" />
                Featured
              </div>
            )}
          </div>

          <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
            {project.description || "Project description will appear here..."}
          </p>

          {/* Key Features */}
          {highlightsArray.length > 0 && (
            <div className="mb-3 space-y-1.5">
              {highlightsArray.slice(0, 4).map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="text-muted-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tech Stack */}
          {tagsArray.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tagsArray.slice(0, 5).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-3 border-t border-border">
            <div
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium ${
                !project.demoUrl || project.demoUrl === "#"
                  ? "bg-muted text-muted-foreground border border-border"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              <Eye size={15} />
              {!project.demoUrl || project.demoUrl === "#"
                ? "Coming Soon"
                : "Live Demo"}
            </div>

            <div
              className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium border ${
                !project.githubUrl || project.githubUrl === "#"
                  ? "bg-muted text-muted-foreground border-border"
                  : "bg-background text-foreground border-border"
              }`}
            >
              <Github size={15} />
              Code
            </div>
          </div>
        </div>

        {/* Accent Border */}
        <div
          className={`h-1 bg-gradient-to-r ${accentByCategory[project.category] || "from-primary to-primary/50"}`}
        />
      </div>
    </div>
  );
};

const defaultProjectState = {
  title: "",
  description: "",
  category: "Web Application",
  image: "/projects/project1.png",
  demoUrl: "",
  githubUrl: "",
  video: "",
  status: "Live",
  tags: "",
  highlights: "",
  featured: false,
  accentColor: "from-blue-500 to-cyan-600",
};

export const ProjectsEditor = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [editingProject, setEditingProject] = useState(null);
  const [newSkill, setNewSkill] = useState(defaultProjectState);
  const [imageDragActive, setImageDragActive] = useState(false);
  const [videoDragActive, setVideoDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      console.log("[ProjectsEditor] Fetched projects:", data);
      console.log("[ProjectsEditor] First project ID:", data[0]?.id);
      const uniqueProjects = Array.isArray(data) ? data : [];
      const seen = new Set();
      const filtered = uniqueProjects.filter((project) => {
        if (seen.has(project.id)) return false;
        seen.add(project.id);
        return true;
      });
      console.log("[ProjectsEditor] Filtered projects:", filtered.map(p => ({ id: p.id, title: p.title })));
      setProjects(filtered);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSkill.title.trim()) {
      alert("Please enter project title");
      return;
    }

    setSaving(true);
    try {
      const tagsArray = newSkill.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const highlightsArray = newSkill.highlights
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...newSkill,
        tags: tagsArray,
        highlights: highlightsArray,
      };
      
      console.log("[ProjectsEditor] Creating project with payload:", payload);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[ProjectsEditor] POST response status:", res.status);
      const responseData = await res.json();
      console.log("[ProjectsEditor] POST response data:", responseData);

      if (res.ok) {
        setProjects([responseData, ...projects]);
        setNewSkill(defaultProjectState);
        alert("Project added!");
      } else {
        console.error("[ProjectsEditor] POST failed:", responseData);
        alert(`Failed to add project: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("[ProjectsEditor] Add exception:", error);
      alert(`Failed to add project: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    setDeleting(id);
    try {
      console.log("[ProjectsEditor] Deleting project:", id);
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      console.log("[ProjectsEditor] DELETE response:", res.status, data);
      
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        alert("Deleted!");
      } else {
        console.error("[ProjectsEditor] DELETE failed:", data);
        alert(`Failed to delete: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("[ProjectsEditor] Delete exception:", error);
      alert(`Failed to delete: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (project) => {
    console.log("[ProjectsEditor] handleEdit called with project:", { id: project.id, title: project.title });
    setEditingProject(project);
    setNewSkill({
      title: project.title,
      description: project.description,
      category: project.category,
      image: project.image || "/projects/project1.png",
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      video: project.video || "",
      status: project.status || "Live",
      tags: Array.isArray(project.tags)
        ? project.tags.join(", ")
        : project.tags || "",
      highlights: Array.isArray(project.highlights)
        ? project.highlights.join(", ")
        : project.highlights || "",
      featured: project.featured || false,
      accentColor: project.accentColor || "from-blue-500 to-cyan-600",
    });
  };

  const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string")
        setNewSkill((p) => ({ ...p, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string")
        setNewSkill((p) => ({ ...p, video: result }));
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProject) return;
    if (!newSkill.title.trim()) {
      alert("Please enter project title");
      return;
    }

    setSaving(true);
    try {
      const tagsArray = newSkill.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const highlightsArray = newSkill.highlights
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...newSkill,
        tags: tagsArray,
        highlights: highlightsArray,
      };
      
      console.log("[ProjectsEditor] Updating project:", editingProject.id, payload);

      const res = await fetch(`/api/projects?id=${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[ProjectsEditor] PUT response status:", res.status);
      const responseData = await res.json();
      console.log("[ProjectsEditor] PUT response data:", responseData);

      if (res.ok) {
        setProjects(
          projects.map((p) =>
            p.id === editingProject.id ? { ...p, ...responseData } : p,
          ),
        );
        cancelEdit();
        alert("Project updated!");
      } else {
        console.error("[ProjectsEditor] PUT failed:", responseData);
        alert(`Failed to update project: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("[ProjectsEditor] Update exception:", error);
      alert(`Failed to update project: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setNewSkill(defaultProjectState);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const displayedProjects = projects.slice(startIdx, startIdx + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Code2 className="text-primary" /> Projects
      </h2>

      {/* Top Section - Preview & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left - Live Preview */}
        <div>
          <ProjectCardPreview project={newSkill} />
        </div>

        {/* Right - Form Section */}
        <div className="relative">
          {saving && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Loader2 size={32} className="animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {editingProject ? 'Updating project...' : 'Creating project...'}
                </p>
              </div>
            </div>
          )}
          <div className="bg-card border border-border rounded-xl p-5 shadow-lg sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {editingProject ? (
                  <>
                    <Pencil className="text-primary" /> Edit Project
                  </>
                ) : (
                  <>
                    <Plus className="text-primary" /> Add Project
                  </>
                )}
              </h3>
              {editingProject && (
                <button
                  onClick={cancelEdit}
                  className="p-1 hover:bg-destructive/10 rounded text-destructive"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <form
              onSubmit={editingProject ? handleUpdate : handleAdd}
              className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-2"
            >
              <fieldset disabled={saving} className="space-y-4">
              <input
                placeholder="Title"
                required
                value={newSkill.title}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, title: e.target.value })
                }
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary disabled:opacity-60"
              />

              <textarea
                placeholder="Description"
                rows={3}
                value={newSkill.description}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, description: e.target.value })
                }
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />

              <select
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value })
                }
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              >
                <option>Web Application</option>
                <option>E-commerce</option>
                <option>IoT Application</option>
                <option>Web Design</option>
                <option>Food Tech</option>
                <option>Restaurant Management</option>
                <option>Project Management</option>
                <option>Food & Recipe</option>
                <option>Cybersecurity</option>
              </select>

              <input
                placeholder="Image URL"
                value={newSkill.image}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, image: e.target.value })
                }
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />
              <div
                {...getDropZoneProps(setImageDragActive, handleImageFile)}
                className={dropZoneClass(imageDragActive)}
              >
                <label className="flex flex-col items-center justify-center text-xs text-muted-foreground gap-2 cursor-pointer">
                  <span>📁 Drag & drop project image or</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFile(e.target.files?.[0])}
                  />
                  <span className="text-primary font-medium">
                    click to browse
                  </span>
                </label>
                <p className="text-[11px] text-muted-foreground/80 text-center mt-2">
                  JPEG/PNG • Stored as data URL for instant preview
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Demo URL {newSkill.status === "Live" && <span className="text-red-500">*</span>}
                </label>
                <input
                  placeholder="https://example.com (required for Live projects)"
                  value={newSkill.demoUrl}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, demoUrl: e.target.value })
                  }
                  className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                  required={newSkill.status === "Live"}
                />
                {newSkill.status === "Live" && !newSkill.demoUrl && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Add a demo URL to show the &quot;Live Demo&quot; button on the public page
                  </p>
                )}
              </div>

              <input
                placeholder="GitHub URL"
                value={newSkill.githubUrl}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, githubUrl: e.target.value })
                }
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />

              <input
                placeholder="Video URL (optional)"
                value={newSkill.video}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, video: e.target.value })
                }
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />
              <div
                {...getDropZoneProps(setVideoDragActive, handleVideoFile)}
                className={dropZoneClass(videoDragActive)}
              >
                <label className="flex flex-col items-center justify-center text-xs text-muted-foreground gap-2 cursor-pointer">
                  <span>📁 Drag & drop project video or</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoFile(e.target.files?.[0])}
                  />
                  <span className="text-primary font-medium">
                    click to browse
                  </span>
                </label>
                <p className="text-[11px] text-muted-foreground/80 text-center mt-2">
                  MP4/WebM • Stored as data URL (keep small)
                </p>
              </div>

              <select
                value={newSkill.status}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, status: e.target.value })
                }
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              >
                <option>Live</option>
                <option>In Progress</option>
                <option>Prototype</option>
              </select>

              <input
                placeholder="Tags (comma separated)"
                value={newSkill.tags}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, tags: e.target.value })
                }
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />

              <input
                placeholder="Highlights (comma separated)"
                value={newSkill.highlights}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, highlights: e.target.value })
                }
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newSkill.featured}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, featured: e.target.checked })
                  }
                />
                <span className="text-xs">Featured</span>
              </label>
              </fieldset>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm transition-opacity"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {editingProject ? 'Updating...' : 'Adding...'}
                  </>
                ) : editingProject ? (
                  <>
                    <Save size={16} /> Update
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Add
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section - Projects List */}
      <div>
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {displayedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className={`bg-card border rounded-xl p-5 shadow-sm hover:border-primary/50 transition-all cursor-pointer ${
                    editingProject?.id === project.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => handleEdit(project)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {project.category}
                      </p>
                      <h4 className="font-bold text-base mt-1">
                        {project.title}
                      </h4>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(project);
                        }}
                        className="p-1 rounded hover:bg-primary/10 text-primary"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        disabled={deleting === project.id}
                        className="p-1 rounded hover:bg-destructive/10 text-destructive disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                      >
                        {deleting === project.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {project.description}
                  </p>

                  {Array.isArray(project.tags) && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.status || "Live"}</span>
                    {project.featured && (
                      <span className="text-primary font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-border hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {startIdx + 1} –{" "}
                  {Math.min(startIdx + itemsPerPage, projects.length)} of{" "}
                  {projects.length}
                </span>
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg border border-border hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

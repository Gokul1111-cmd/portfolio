import { motion, AnimatePresence } from "framer-motion";
import { Save, Zap, Plus, Trash2, Pencil, X, ChevronLeft, ChevronRight, Crop } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const normalizeSkillKey = (skill) => `${(skill?.name || '').trim().toLowerCase()}|${(skill?.category || '').trim().toLowerCase()}`;

const dedupeSkills = (list = []) => {
  const seen = new Set();
  return list.filter((skill) => {
    const key = normalizeSkillKey(skill);
    if (!key.trim()) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const clampIconSize = (value) => {
  const num = Number.isFinite(value) ? value : 100;
  if (num < 50) return 50;
  if (num > 200) return 200;
  return num;
};

export const SkillsEditor = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({ name: "", category: "frontend", level: 50, icon: "", iconSize: 100 });
  const [dragActive, setDragActive] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data = await res.json();
        setSkills(Array.isArray(data) ? dedupeSkills(data) : []);
      }
    } catch (error) {
      console.error("Failed to load skills", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) {
      alert("Enter skill name");
      return;
    }
    const normalizedKey = normalizeSkillKey(newSkill);
    if (skills.some((s) => normalizeSkillKey(s) === normalizedKey)) {
      alert("That skill/category already exists.");
      return;
    }
    const payload = {
      ...newSkill,
      name: newSkill.name.trim(),
      category: newSkill.category.trim(),
      iconSize: clampIconSize(newSkill.iconSize || 100),
    };
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setSkills(dedupeSkills([...skills, data]));
        setNewSkill({ name: "", category: "frontend", level: 50, icon: "", iconSize: 100 });
        alert("Added!");
      }
    } catch (error) {
      console.error("Failed to add skill", error);
      alert("Failed to add");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
        alert("Deleted!");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setNewSkill({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || "",
      iconSize: skill.iconSize || 100,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingSkill) return;
    if (!newSkill.name.trim()) {
      alert("Enter skill name");
      return;
    }
    const normalizedKey = normalizeSkillKey(newSkill);
    if (skills.some((s) => s.id !== editingSkill.id && normalizeSkillKey(s) === normalizedKey)) {
      alert("That skill/category already exists.");
      return;
    }
    const payload = {
      ...newSkill,
      name: newSkill.name.trim(),
      category: newSkill.category.trim(),
      iconSize: clampIconSize(newSkill.iconSize || 100),
    };
    try {
      const res = await fetch(`/api/skills?id=${editingSkill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updatedSkill = await res.json();
        setSkills(dedupeSkills(skills.map((s) => (s.id === editingSkill.id ? updatedSkill : s))));
        cancelEdit();
        alert("Updated!");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update");
    }
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setNewSkill({ name: "", category: "frontend", level: 50, icon: "", iconSize: 100 });
  };

  const handleIconFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === 'string') {
        setImageToCrop(result);
        setShowCropModal(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    
    ctx.drawImage(
      image,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    );
    
    const croppedDataUrl = canvas.toDataURL('image/png');
    setNewSkill((prev) => ({ ...prev, icon: croppedDataUrl }));
    setShowCropModal(false);
    setImageToCrop(null);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    const maxX = imageRef.current.width - crop.width;
    const maxY = imageRef.current.height - crop.height;
    
    setCrop({
      ...crop,
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      handleIconFile(files[0]);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  const totalPages = Math.ceil(skills.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const displayedSkills = skills.slice(startIdx, startIdx + itemsPerPage);

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
      {/* Crop Modal */}
      {showCropModal && imageToCrop && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-3xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Crop className="text-primary" /> Crop Image
              </h3>
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setImageToCrop(null);
                }}
                className="p-2 hover:bg-destructive/10 rounded text-destructive"
              >
                <X size={20} />
              </button>
            </div>
            
            <div
              className="relative inline-block border border-border rounded-lg overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={imageToCrop}
                alt="Crop preview"
                className="max-w-full max-h-[60vh] object-contain"
                onLoad={(e) => {
                  const img = e.target;
                  setCrop({
                    x: 0,
                    y: 0,
                    width: Math.min(200, img.width),
                    height: Math.min(200, img.height)
                  });
                }}
              />
              
              <div
                className="absolute border-2 border-primary bg-primary/10 cursor-move"
                style={{
                  left: crop.x,
                  top: crop.y,
                  width: crop.width,
                  height: crop.height,
                }}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-primary/30" />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Width: {crop.width}px</label>
                  <input
                    type="range"
                    min="50"
                    max={imageRef.current?.width || 500}
                    value={crop.width}
                    onChange={(e) => setCrop({ ...crop, width: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Height: {crop.height}px</label>
                  <input
                    type="range"
                    min="50"
                    max={imageRef.current?.height || 500}
                    value={crop.height}
                    onChange={(e) => setCrop({ ...crop, height: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCropComplete}
                  className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Crop size={16} /> Apply Crop
                </button>
                <button
                  onClick={() => {
                    setShowCropModal(false);
                    setImageToCrop(null);
                  }}
                  className="px-4 py-2 rounded-md border border-border hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Zap className="text-primary" /> Skills
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-5 shadow-lg sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {editingSkill ? (
                  <>
                    <Pencil className="text-primary" /> Edit Skill
                  </>
                ) : (
                  <>
                    <Plus className="text-primary" /> Add Skill
                  </>
                )}
              </h3>
              {editingSkill && (
                <button
                  onClick={cancelEdit}
                  className="p-1 hover:bg-destructive/10 rounded text-destructive"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <form onSubmit={editingSkill ? handleUpdate : handleAdd} className="space-y-4 text-sm">
              <input
                placeholder="Skill Name"
                required
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />

              <div className="space-y-2">
                <input
                  placeholder="Icon URL or data URL"
                  value={newSkill.icon}
                  onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                  className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                />
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-4 rounded-md border-2 border-dashed transition-all ${
                    dragActive
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-border bg-background/50 hover:border-primary/50 cursor-pointer'
                  }`}
                >
                  <label className="flex flex-col items-center justify-center text-xs text-muted-foreground gap-2 cursor-pointer">
                    <span>📁 Drag & drop image here or</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleIconFile(e.target.files?.[0])}
                      className="hidden"
                    />
                    <span className="text-primary font-medium">click to browse</span>
                  </label>
                </div>
                {newSkill.icon && (
                  <div className="flex items-center gap-3 p-2 rounded-md border border-border bg-background/50">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 bg-card flex items-center justify-center">
                      <img
                        src={newSkill.icon}
                        alt="icon preview"
                        className="w-full h-full"
                        style={{ 
                          transform: `scale(${clampIconSize(newSkill.iconSize || 100) / 100})`,
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs flex items-center justify-between mb-1">
                        <span>Size</span>
                        <span className="font-semibold text-primary">{clampIconSize(newSkill.iconSize || 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={clampIconSize(newSkill.iconSize || 100)}
                        onChange={(e) => setNewSkill({ ...newSkill, iconSize: parseInt(e.target.value, 10) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobile">Mobile</option>
                <option value="cloud">Cloud</option>
                <option value="devops">DevOps</option>
                <option value="design">Design</option>
                <option value="soft">Soft Skills</option>
              </select>

              <div>
                <label className="text-xs flex items-center justify-between mb-2">
                  <span>Proficiency</span>
                  <span className="font-semibold text-primary">{newSkill.level}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value, 10) })}
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 text-sm"
              >
                {editingSkill ? (
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

        <div className="lg:col-span-3">
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {displayedSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    className={`bg-card border rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer ${
                      editingSkill?.id === skill.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => handleEdit(skill)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/50 bg-card flex items-center justify-center flex-shrink-0">
                          {skill.icon ? (
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="w-full h-full"
                              style={{ 
                                transform: `scale(${clampIconSize(skill.iconSize || 100) / 100})`,
                                objectFit: 'contain'
                              }}
                            />
                          ) : (
                            <span className="text-sm font-semibold text-primary">{skill.name?.charAt(0) || '?'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{skill.name}</h4>
                          <p className="text-xs text-primary font-medium capitalize">{skill.category}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(skill);
                          }}
                          className="p-1 rounded hover:bg-primary/10 text-primary"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(skill.id);
                          }}
                          className="p-1 rounded hover:bg-destructive/10 text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Proficiency</span>
                        <span className="text-xs font-bold text-primary">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/60 h-1.5 rounded-full transition-all"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
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
                    {startIdx + 1} – {Math.min(startIdx + itemsPerPage, skills.length)} of {skills.length}
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
      </div>
    </motion.div>
  );
};

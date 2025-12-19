import { motion, AnimatePresence } from "framer-motion";
import { Save, MessageSquare, Trash2, ChevronLeft, ChevronRight, Star, Pencil, X, Quote } from "lucide-react";
import { useState, useEffect } from "react";

// Live Preview Component
const TestimonialCardPreview = ({ testimonial }) => {
  return (
    <motion.div
      className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-8 shadow-sm h-full flex flex-col group sticky top-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        <Quote className="h-8 w-8 text-primary/30 mb-4 group-hover:text-primary/50 transition-colors" />

        {/* Testimonial Content */}
        <p className="text-base text-muted-foreground mb-6 flex-1 italic min-h-24">
          {testimonial.content ? `"${testimonial.content}"` : '"Your testimonial preview appears here..."'}
        </p>

        {/* Rating */}
        <div className="flex mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
            />
          ))}
        </div>

        {/* Client Info */}
        <div className="mt-auto">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full border-2 border-primary/20 group-hover:border-primary/50 overflow-hidden transition-all">
              {testimonial.image ? (
                <img
                  src={testimonial.image}
                  alt={testimonial.name || 'Client'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/50 font-semibold"
                style={{ display: testimonial.image ? 'none' : 'flex' }}
              >
                {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            <div>
              <p className="font-medium text-base">{testimonial.name || 'Client Name'}</p>
              <p className="text-sm text-muted-foreground">{testimonial.role || 'Job Title'}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    image: "",
  });
  const [imageDragActive, setImageDragActive] = useState(false);

  const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") setNewTestimonial((p) => ({ ...p, image: result }));
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

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const total = Math.ceil(testimonials.length / itemsPerPage);
    if (total > 0 && currentPage > total - 1) {
      setCurrentPage(Math.max(0, total - 1));
    }
  }, [testimonials, currentPage]);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to load", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials(testimonials.filter((t) => t.id !== id));
        alert("Deleted!");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setNewTestimonial({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    if (!newTestimonial.name.trim() || !newTestimonial.content.trim()) {
      alert("Fill all required fields");
      return;
    }
    try {
      const res = await fetch(`/api/testimonials?id=${editingTestimonial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestimonial),
      });
      if (res.ok) {
        const updatedTestimonial = await res.json();
        setTestimonials(testimonials.map((t) => (t.id === editingTestimonial.id ? updatedTestimonial : t)));
        cancelEdit();
        alert("Updated!");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update");
    }
  };

  const cancelEdit = () => {
    setEditingTestimonial(null);
    setNewTestimonial({ name: "", role: "", content: "", rating: 5, image: "" });
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const displayedTestimonials = testimonials.slice(startIdx, startIdx + itemsPerPage);
  
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
        <MessageSquare className="text-primary" /> Testimonials
      </h2>

      {/* Top Section - Preview & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left - Live Preview */}
        <div>
          <TestimonialCardPreview testimonial={newTestimonial} />
        </div>

        {/* Right - Form Section */}
        <div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-lg sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Pencil className="text-primary" /> Edit Testimonial
              </h3>
              {editingTestimonial && (
                <button
                  onClick={cancelEdit}
                  className="p-1 hover:bg-destructive/10 rounded text-destructive"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              Adding new testimonials is disabled—use the public submission page. Select an existing testimonial below to edit or delete.
            </div>
            <form onSubmit={handleUpdate} className="space-y-4 text-sm max-h-[70vh] overflow-y-auto">
              <input
                placeholder="Client Name"
                required
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />
              <input
                placeholder="Role/Title"
                value={newTestimonial.role}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />
              <textarea
                placeholder="Testimonial"
                rows={4}
                required
                value={newTestimonial.content}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary resize-none"
              />
              <input
                placeholder="Image URL (optional)"
                value={newTestimonial.image}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, image: e.target.value })}
                className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              />
              <div
                {...getDropZoneProps(setImageDragActive, handleImageFile)}
                className={dropZoneClass(imageDragActive)}
              >
                <label className="flex flex-col items-center justify-center text-xs text-muted-foreground gap-2 cursor-pointer">
                  <span>📁 Drag & drop testimonial image or</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFile(e.target.files?.[0])}
                  />
                  <span className="text-primary font-medium">click to browse</span>
                </label>
                <p className="text-[11px] text-muted-foreground/80 text-center mt-2">JPEG/PNG • Stored as data URL for preview</p>
              </div>
              <div>
                <label className="text-xs flex items-center gap-2 mb-2">
                  <span>Rating: {newTestimonial.rating}/5</span>
                  <span className="text-yellow-500">
                    {"★".repeat(newTestimonial.rating)}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                disabled={!editingTestimonial}
                className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 text-sm"
              >
                <Save size={16} /> {editingTestimonial ? "Update" : "Select a testimonial to edit"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section - Testimonials List */}
      <div>
        <div className="space-y-6">
          {/* Card Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {displayedTestimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className={`bg-card border rounded-xl p-5 hover:border-primary/50 transition-all cursor-pointer ${
                    editingTestimonial?.id === testimonial.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => handleEdit(testimonial)}
                >
                  {/* Star Rating */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(testimonial);
                        }}
                        className="p-1 rounded hover:bg-primary/10 text-primary"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(testimonial.id);
                        }}
                        className="p-1 rounded hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <p className="text-sm text-muted-foreground italic mb-4">&ldquo;{testimonial.content}&rdquo;</p>

                  {/* Client Info */}
                  <div className="border-t border-border pt-3">
                    <h4 className="font-bold text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-primary font-medium">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
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
                  {startIdx + 1} – {Math.min(startIdx + itemsPerPage, testimonials.length)} of {testimonials.length}
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

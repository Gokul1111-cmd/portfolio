import {
  ArrowRight,
  Github,
  ChevronUp,
  Star,
  Code,
  Sparkles,
  Zap,
  Play,
  Eye,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { fetchStaticOrLive } from "../lib/staticData";

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
  "IoT Application":
    "from-orange-500/20 to-red-600/20 text-orange-600 border-orange-500/30",
  "Web Design":
    "from-emerald-500/20 to-teal-600/20 text-emerald-600 border-emerald-500/30",
  "Project Management":
    "from-green-500/20 to-emerald-600/20 text-green-600 border-green-500/30",
  "AI/ML": "from-pink-500/20 to-rose-600/20 text-pink-600 border-pink-500/30",
};

export const ProjectsSection = () => {
  // --- NEW: Dynamic Data State ---
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Existing State ---
  const [showAll] = useState(true); // Always show all projects
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  // --- NEW: Fetch Data on Mount ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const payload = await fetchStaticOrLive({
          name: "projects",
          liveUrl: "/api/projects",
          fallbackEmpty: [],
        });
        const data = Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload)
            ? payload
            : [];
        const toArray = (value, fallback) => {
          if (Array.isArray(value)) return value;
          if (typeof value === "string") {
            return value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);
          }
          return fallback;
        };

        const formattedData = data.map((p) => ({
          ...p,
          tags: toArray(p.tags, ["React", "Full Stack"]),
          highlights: toArray(p.highlights, ["Responsive Design", "Modern UI"]),
          status: p.status || "Live",
          accentColor: p.accentColor || "from-blue-500 to-cyan-600",
          featured: Boolean(p.featured),
          video: p.video || "",
        }));
        
        // Sort projects: Live first, then Prototype, then Coming Soon
        const statusOrder = { "Live": 1, "Prototype": 2, "Coming Soon": 3 };
        formattedData.sort((a, b) => {
          const orderA = statusOrder[a.status] || 999;
          const orderB = statusOrder[b.status] || 999;
          return orderA - orderB;
        });
        
        setProjects(formattedData);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filtering Logic
  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const displayedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, 3);

  // Get unique categories from fetched data
  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];

  const handleFilterChange = (category) => {
    setActiveFilter(category);
  };

  const handleVideoPlay = (project) => {
    setSelectedVideo(project);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const ProjectHighlights = ({ highlights }) => (
    <div className="space-y-2">
      {highlights &&
        highlights.map((highlight, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="text-muted-foreground">{highlight}</span>
          </div>
        ))}
    </div>
  );

  ProjectHighlights.propTypes = {
    highlights: PropTypes.arrayOf(PropTypes.string),
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
      ref={sectionRef}
    >
      {/* Clean Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-4 w-4" />
            My Projects
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Project
            <span className="block text-primary">Portfolio</span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A collection of projects I&apos;ve built to showcase my skills in
            full-stack development and modern web technologies.
          </motion.p>
        </motion.div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Filter Buttons */}
            <motion.div
              className="flex justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${
                      activeFilter === category
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 relative">
              <AnimatePresence mode="popLayout">
                {displayedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="group"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div className="relative bg-background border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                      {/* Image/Video Section */}
                      <div className="relative h-40 sm:h-48 overflow-hidden bg-muted">
                        <motion.img
                          src={project.image || "/placeholder.png"}
                          alt={`${project.title} - ${project.category} project screenshot`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
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
                            {project.category}
                          </span>
                        </div>

                        {/* Hover Actions */}
                        <motion.div
                          className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: hoveredProject === project.id ? 1 : 0,
                          }}
                        >
                          {/* Video Play Button - Only if video exists */}
                          {project.video && (
                            <motion.button
                              onClick={() => handleVideoPlay(project)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-3 rounded-full backdrop-blur-sm border bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300"
                            >
                              <Play size={20} />
                            </motion.button>
                          )}

                          {/* Code Button */}
                          <motion.a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-3 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                              !project.githubUrl || project.githubUrl === "#"
                                ? "bg-gray-500/50 text-gray-300 border-gray-500/30 cursor-not-allowed"
                                : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                            }`}
                            onClick={(e) =>
                              (!project.githubUrl ||
                                project.githubUrl === "#") &&
                              e.preventDefault()
                            }
                          >
                            <Code size={20} />
                          </motion.a>
                        </motion.div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 sm:p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg md:text-xl font-bold text-foreground">
                            {project.title}
                          </h3>
                          {project.featured && (
                            <motion.div
                              className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 text-xs font-medium border border-amber-500/30"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              <Star size={12} className="fill-amber-500" />
                              Featured
                            </motion.div>
                          )}
                        </div>

                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Key Features */}
                        <div className="mb-4">
                          <ProjectHighlights highlights={project.highlights} />
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags &&
                            project.tags.map((tag, tagIndex) => (
                              <motion.span
                                key={tagIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: index * 0.1 + tagIndex * 0.05 + 0.4,
                                }}
                                className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                              >
                                {tag}
                              </motion.span>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-border">
                          <motion.a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                              !project.demoUrl || project.demoUrl === "#"
                                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                            onClick={(e) =>
                              (!project.demoUrl || project.demoUrl === "#") &&
                              e.preventDefault()
                            }
                          >
                            <Eye size={16} />
                            {!project.demoUrl || project.demoUrl === "#"
                              ? "Coming Soon"
                              : "Live Demo"}
                          </motion.a>

                          <motion.a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium border transition-all duration-300 ${
                              !project.githubUrl || project.githubUrl === "#"
                                ? "bg-muted text-muted-foreground cursor-not-allowed border-border"
                                : "bg-background text-foreground border-border hover:border-primary hover:bg-primary/5"
                            }`}
                            onClick={(e) =>
                              (!project.githubUrl ||
                                project.githubUrl === "#") &&
                              e.preventDefault()
                            }
                          >
                            <Github size={16} />
                            Code
                          </motion.a>
                        </div>
                      </div>

                      {/* Accent Border */}
                      <div
                        className={`h-1 bg-gradient-to-r ${project.accentColor || "from-primary to-primary/50"}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Simple CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-background border border-border rounded-2xl p-6 sm:p-10 md:p-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Zap className="h-4 w-4" />
              Get In Touch
            </motion.div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Interested in collaborating?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Check out my GitHub for more projects or connect with me on
              LinkedIn.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="https://www.linkedin.com/in/gokulanbalagan1112/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                Connect on LinkedIn
                <ArrowRight size={18} />
              </motion.a>

              <motion.a
                href="https://github.com/Gokul1111-cmd"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium border border-border text-foreground hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Github size={18} />
                View GitHub
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence mode="popLayout">
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 relative"
            onClick={handleCloseVideo}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-background rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-foreground">
                    {selectedVideo.title} Demo
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {selectedVideo.category}
                  </p>
                </div>
                <motion.button
                  onClick={handleCloseVideo}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black">
                <video
                  ref={videoRef}
                  src={selectedVideo.video}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  onEnded={handleCloseVideo}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-border">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <p className="text-muted-foreground text-sm flex-1">
                    Watch the demo of {selectedVideo.title} in action
                  </p>
                  <div className="flex gap-3">
                    <motion.a
                      href={selectedVideo.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        !selectedVideo.demoUrl || selectedVideo.demoUrl === "#"
                          ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                      onClick={(e) =>
                        (!selectedVideo.demoUrl ||
                          selectedVideo.demoUrl === "#") &&
                        e.preventDefault()
                      }
                    >
                      Visit Live Site
                    </motion.a>
                    <motion.a
                      href={selectedVideo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-2 rounded-lg text-sm font-medium border transition-all duration-300 ${
                        !selectedVideo.githubUrl ||
                        selectedVideo.githubUrl === "#"
                          ? "bg-muted text-muted-foreground cursor-not-allowed border-border"
                          : "bg-background text-foreground border-border hover:border-primary hover:bg-primary/5"
                      }`}
                      onClick={(e) =>
                        (!selectedVideo.githubUrl ||
                          selectedVideo.githubUrl === "#") &&
                        e.preventDefault()
                      }
                    >
                      View Code
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

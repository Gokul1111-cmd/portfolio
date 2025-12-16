import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, LayoutDashboard, LogOut, Save, X } from "lucide-react";

export const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Application",
    image: "/projects/project1.png", // Default placeholder
    demoUrl: "",
    githubUrl: ""
  });

  useEffect(() => {
    // Check Auth
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) navigate("/login");
    
    fetchProjects();
  }, [navigate]);

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
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const newProject = await res.json();
        setProjects([newProject, ...projects]);
        setFormData({
          title: "", description: "", category: "Web Application", 
          image: "/projects/project1.png", demoUrl: "", githubUrl: ""
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

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
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

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
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
                  onChange={e => setFormData({...formData, category: e.target.value})}
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

                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
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
  );
};
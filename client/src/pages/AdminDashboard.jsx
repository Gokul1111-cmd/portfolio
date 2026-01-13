import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Sparkles,
  Users,
  Code2,
  Zap,
  MessageSquare,
  Mail,
  Settings,
  ChevronRight,
  Milestone,
  Award,
  CloudUpload,
  FileText,
} from "lucide-react";

// Import section editor components
import { HeroEditor } from "./sections/HeroEditor";
import { ProjectsEditor } from "./sections/ProjectsEditor";
import { AboutEditor } from "./sections/AboutEditor";
import { SkillsEditor } from "./sections/SkillsEditor";
import { ApproachEditor } from "./sections/ApproachEditor";
import { TestimonialsEditor } from "./sections/TestimonialsEditor";
import { ContactEditor } from "./sections/ContactEditor";
import { SiteSettingsEditor } from "./sections/SiteSettingsEditor";
import { TimelineEditor } from "./sections/TimelineEditor";
import { CertificatesEditor } from "./sections/CertificatesEditor";
import { SyncSettings } from "./sections/SyncSettings";
import { BlogEditor } from "./sections/BlogEditor";

const navigationItems = [
  { id: "hero", label: "Hero", icon: Sparkles },
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "about", label: "About", icon: Users },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "approach", label: "My Approach", icon: LayoutDashboard },
  { id: "career", label: "Career Timeline", icon: Milestone },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "site", label: "Site Settings", icon: Settings },
  { id: "sync", label: "Sync", icon: CloudUpload },
];

const sectionComponents = {
  hero: HeroEditor,
  projects: ProjectsEditor,
  about: AboutEditor,
  skills: SkillsEditor,
  approach: ApproachEditor,
  career: TimelineEditor,
  testimonials: TestimonialsEditor,
  certificates: CertificatesEditor,
  blog: BlogEditor,
  contact: ContactEditor,
  site: SiteSettingsEditor,
  sync: SyncSettings,
};

export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const navigate = useNavigate();

  useEffect(() => {
    // Check Auth
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/");
  };

  const CurrentComponent = sectionComponents[activeSection] || HeroEditor;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="px-6 h-16 flex items-center justify-between">
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

      <div className="flex">
        {/* Sidebar Navigation - Fixed on md+; hidden on mobile */}
        <aside className="hidden md:block md:w-64 border-r border-border bg-card/30 p-6 md:fixed md:left-0 md:top-16 md:h-[calc(100vh-64px)]">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </aside>

        {/* Main Content - Scrollable; full-width on mobile */}
        <main className="md:ml-64 md:w-[calc(100%-256px)] w-full overflow-y-auto h-[calc(100vh-64px)]">
          <div className="p-4 sm:p-6 md:p-8 pb-20">
            {/* Mobile Section Switcher */}
            <div className="md:hidden mb-6">
              <label className="block text-sm text-muted-foreground mb-2">Section</label>
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full p-2 rounded-md bg-card border border-border"
              >
                {navigationItems.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

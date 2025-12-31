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

const navigationItems = [
  { id: "hero", label: "Hero", icon: Sparkles },
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "about", label: "About", icon: Users },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "approach", label: "My Approach", icon: LayoutDashboard },
  { id: "career", label: "Career Timeline", icon: Milestone },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "certificates", label: "Certificates", icon: Award },
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
    <div className="min-h-screen bg-background text-foreground">
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
        {/* Sidebar Navigation - Fixed */}
        <aside className="w-64 border-r border-border bg-card/30 p-6 fixed left-0 top-16 h-[calc(100vh-64px)]">
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

        {/* Main Content - Scrollable */}
        <main className="ml-64 w-[calc(100%-256px)] overflow-y-auto h-[calc(100vh-64px)]">
          <div className="p-8 pb-20">
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

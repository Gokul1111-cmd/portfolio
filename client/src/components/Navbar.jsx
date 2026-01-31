import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Code,
  Briefcase,
  Mail,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Github,
  Linkedin,
  Award,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fetchStaticOrLive } from "../lib/staticData";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export const Navbar = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("#hero");
  const [showNavbar, setShowNavbar] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [navItems, setNavItems] = useState([
    { name: "Home", href: "#hero", icon: Home },
    { name: "About", href: "#about", icon: User },
    { name: "Skills", href: "#skills", icon: Code },
    { name: "Certificates", href: "#certificates", icon: Award },
    { name: "Projects", href: "#projects", icon: Briefcase },
    { name: "GitHub", href: "#github", icon: Github },
    { name: "Contact", href: "#contact", icon: Mail },
    { name: "Blog", href: "/blog", icon: FileText },
  ]);
  const lastScrollYRef = useRef(0);
  const audioRef = useRef(null);

  const musicUrl = "/music.mp3";

  // Icon mapping for nav items
  const iconMap = {
    Home: Home,
    About: User,
    Skills: Code,
    Certificates: Award,
    Projects: Briefcase,
    GitHub: Github,
    Contact: Mail,
    Blog: FileText,
  };

  // Fetch site settings for nav links
  useEffect(() => {
    const fetchNavSettings = async () => {
      try {
        const payload = await fetchStaticOrLive({
          name: "content",
          liveUrl: "/api/portfolio-data?type=content&key=site",
          fallbackEmpty: {},
        });
        const site = payload?.site || payload?.data || payload || {};
        if (Array.isArray(site.navLinks) && site.navLinks.length) {
          const fetchedNavItems = site.navLinks.map((link) => ({
            name: link.name,
            href: link.href,
            icon: iconMap[link.name] || Home,
          }));

          // Ensure Certificates is always included
          const hasCertificates = fetchedNavItems.some(item => item.name === "Certificates");
          if (!hasCertificates) {
            // Insert Certificates after Skills
            const skillsIndex = fetchedNavItems.findIndex(item => item.name === "Skills");
            const insertIndex = skillsIndex >= 0 ? skillsIndex + 1 : 3;
            fetchedNavItems.splice(insertIndex, 0, {
              name: "Certificates",
              href: "#certificates",
              icon: Award
            });
          }

          setNavItems(fetchedNavItems);
        }
      } catch (error) {
        console.error("Navbar settings fetch failed", error);
      }
    };

    fetchNavSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.preload = "auto";

      const handleCanPlay = () => setIsAudioReady(true);

      audioRef.current.addEventListener("canplaythrough", handleCanPlay);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener("canplaythrough", handleCanPlay);
          audioRef.current = null;
        }
      };
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current || !isAudioReady) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }

    setIsMusicPlaying(!isMusicPlaying);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollYRef.current = currentScrollY;

      const sections = navItems.map((item) => item.href);
      const scrollPosition = currentScrollY + 100;

      for (const section of sections) {
        const element = document.querySelector(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  return (
    <>
      {/* Top Right Buttons */}
      <motion.div
        className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex gap-1 sm:gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* GitHub Button */}
        <motion.a
          href="https://github.com/Gokul1111-cmd"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center min-w-[36px] min-h-[36px]",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="GitHub Profile"
          aria-label="GitHub Profile"
        >
          <Github className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.a>

        {/* LinkedIn Button */}
        <motion.a
          href="https://www.linkedin.com/in/gokulanbalagan1112/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center min-w-[36px] min-h-[36px]",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="LinkedIn Profile"
          aria-label="LinkedIn Profile"
        >
          <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.a>


        {/* Blog Button */}
        <motion.button
          onClick={() => navigate("/blog")}
          className={cn(
            "p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center min-w-[36px] min-h-[36px]",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Blog"
          aria-label="Blog"
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Music Button */}
        <motion.button
          onClick={toggleMusic}
          disabled={!isAudioReady}
          className={cn(
            "p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center min-w-[36px] min-h-[36px]",
            !isAudioReady && "opacity-50 cursor-not-allowed",
          )}
          whileHover={{ scale: isAudioReady ? 1.05 : 1 }}
          whileTap={{ scale: isAudioReady ? 0.95 : 1 }}
          title={
            isAudioReady
              ? isMusicPlaying
                ? "Pause music"
                : "Play music"
              : "Loading music..."
          }
          aria-label={
            isAudioReady
              ? isMusicPlaying
                ? "Pause music"
                : "Play music"
              : "Loading music"
          }
        >
          {isMusicPlaying ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </motion.button>

        <motion.button
          onClick={() => navigate("/login")}
          className={cn(
            "p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center min-w-[36px] min-h-[36px]",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Admin Login"
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </motion.div>

      {/* Bottom Navbar */}
      <motion.div
        className={cn(
          "fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-50",
          "transition-transform duration-300 ease-in-out px-2",
          showNavbar ? "translate-y-0" : "translate-y-full",
        )}
        style={{ willChange: "transform" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg p-1.5 sm:p-2 border border-gray-200 dark:border-gray-700">
          <nav aria-label="Main navigation" className="flex space-x-0.5 sm:space-x-1 items-center">
            {navItems.map((item) => {
              const isBlogLink =
                item.name?.toLowerCase() === "blog" ||
                item.href === "#blog" ||
                item.href === "/blog";

              const handleClick = (e) => {
                if (isBlogLink) {
                  e.preventDefault();
                  navigate("/blog");
                }
              };

              return (
                <a
                  key={item.name}
                  href={isBlogLink ? "/blog" : item.href}
                  onClick={handleClick}
                  className={cn(
                    "p-1.5 sm:p-2 rounded-full transition-colors flex flex-col items-center min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px]",
                    activeSection === item.href
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary",
                  )}
                  aria-label={`Navigate to ${item.name}`}
                  aria-current={activeSection === item.href ? "page" : undefined}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  <span className="text-xs mt-1 hidden md:block">
                    {item.name}
                  </span>
                </a>
              );
            })}
            <div className="flex items-center px-1 sm:px-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
};

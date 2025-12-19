import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import your images
import htmlIcon from "@/assets/icons/html.png";
import cssIcon from "@/assets/icons/css.png";
import sassIcon from "@/assets/icons/saas.png";
import jsIcon from "@/assets/icons/javascript.png";
import tsIcon from "@/assets/icons/typescript.png";
import reactIcon from "@/assets/icons/react.png";
import nextjsIcon from "@/assets/icons/nextjs.png";
import nodejsIcon from "@/assets/icons/nodejs.png";
import expressIcon from "@/assets/icons/express.png";
import mongodbIcon from "@/assets/icons/mongodb.png";
import postgresqlIcon from "@/assets/icons/postgresql.png";
import graphqlIcon from "@/assets/icons/graphql.png";
import javaIcon from "@/assets/icons/java.png";
import pythonIcon from "@/assets/icons/python.png";
import gitIcon from "@/assets/icons/git.png";
import githubIcon from "@/assets/icons/github.png";
import dockerIcon from "@/assets/icons/docker.png";
import firebaseIcon from "@/assets/icons/firebase.png";
import vscodeIcon from "@/assets/icons/vscode.png";
import clearkIcon from "@/assets/icons/cleark.png";
import SQLIcon from "@/assets/icons/sql.png";
import MySQLIcon from "@/assets/icons/mysql.png";

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

const defaultSkills = [
  // Frontend
  { name: "HTML5", level: 90, category: "frontend", icon: "html" },
  { name: "CSS3", level: 80, category: "frontend", icon: "css" },
  { name: "JavaScript", level: 70, category: "frontend", icon: "javascript" },
  { name: "React", level: 75, category: "frontend", icon: "react" },
  { name: "Tailwind CSS", level: 85, category: "frontend", icon: "sass" },

  // Backend
  { name: "Java", level: 70, category: "backend", icon: "java" },
  { name: "SQL", level: 60, category: "backend", icon: "sql" },
  { name: "MySQL", level: 65, category: "backend", icon: "mysql" },
  { name: "MongoDB", level: 60, category: "backend", icon: "mongodb" },
  { name: "Python", level: 65, category: "backend", icon: "python" },
  { name: "Spring Boot", level: 65, category: "backend", icon: "java" },
  { name: "Flask", level: 60, category: "backend", icon: "python" },

  // Tools
  { name: "Git", level: 80, category: "tools", icon: "git" },
  { name: "GitHub", level: 85, category: "tools", icon: "github" },
  { name: "Docker", level: 55, category: "tools", icon: "docker" },
  { name: "Firebase", level: 70, category: "tools", icon: "firebase" },
  { name: "VS Code", level: 90, category: "tools", icon: "vscode" },
];

const categoryColors = {
  all: "bg-gradient-to-r from-purple-500 to-pink-500",
  frontend: "bg-gradient-to-r from-blue-500 to-cyan-500",
  backend: "bg-gradient-to-r from-green-500 to-emerald-500",
  tools: "bg-gradient-to-r from-orange-500 to-yellow-500",
  cloud: "bg-gradient-to-r from-sky-500 to-blue-600",
  devops: "bg-gradient-to-r from-amber-500 to-orange-600",
  mobile: "bg-gradient-to-r from-indigo-500 to-purple-600",
  design: "bg-gradient-to-r from-rose-500 to-pink-500",
  other: "bg-gradient-to-r from-slate-600 to-slate-800",
};

const iconImages = {
  html: htmlIcon,
  css: cssIcon,
  sass: sassIcon,
  javascript: jsIcon,
  typescript: tsIcon,
  react: reactIcon,
  nextjs: nextjsIcon,
  nodejs: nodejsIcon,
  express: expressIcon,
  mongodb: mongodbIcon,
  postgresql: postgresqlIcon,
  graphql: graphqlIcon,
  java: javaIcon,
  python: pythonIcon,
  git: gitIcon,
  github: githubIcon,
  docker: dockerIcon,
  firebase: firebaseIcon,
  vscode: vscodeIcon,
  cleark: clearkIcon,
  sql: SQLIcon,
  mysql: MySQLIcon,
};

const resolveIcon = (skill) => {
  const rawIcon = skill?.icon || '';
  const iconValue = (rawIcon || skill?.category || '').toLowerCase();
  
  console.log(`[resolveIcon] ${skill?.name}:`, {
    rawIcon: rawIcon ? rawIcon.substring(0, 50) + '...' : 'empty',
    iconValue,
    isURL: rawIcon && (rawIcon.startsWith('http') || rawIcon.startsWith('/')),
    isDataURL: rawIcon && rawIcon.startsWith('data:')
  });
  
  if (rawIcon && (rawIcon.startsWith('http') || rawIcon.startsWith('/') || rawIcon.startsWith('data:'))) {
    console.log(`✓ Returning URL/data for ${skill?.name}`);
    return rawIcon;
  }
  const mapped = iconImages[iconValue];
  if (mapped) {
    console.log(`✓ Returning mapped icon for ${skill?.name}: ${iconValue}`);
  } else {
    console.log(`✗ No icon found for ${skill?.name}, iconValue: ${iconValue}`);
  }
  return mapped;
};

const SkillBar = ({ level }) => (
  <div className="w-full h-3 bg-secondary/20 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${level}%` }}
      transition={{ duration: 1.5, delay: 0.2 }}
      className={`h-full rounded-full ${
        level > 75 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
        level > 50 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 
        'bg-gradient-to-r from-red-400 to-pink-500'
      }`}
    />
  </div>
);

const InfiniteScrollSkills = ({ skills }) => {
  if (!skills.length) {
    return <div className="text-center text-muted-foreground">No skills to display yet.</div>;
  }

  const duplicatedSkills = [...skills, ...skills, ...skills];
  
  return (
    <div className="overflow-hidden py-8">
      <motion.div
        className="flex gap-8 mb-8"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {duplicatedSkills.map((skill, index) => (
          <div key={`${skill.name}-${index}`} className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center shadow-lg hover:scale-110 transition-transform overflow-hidden">
              {resolveIcon(skill) ? (
                <img
                  src={resolveIcon(skill)}
                  alt={skill.name}
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: `scale(${clampIconSize(skill.iconSize || 100) / 100})`,
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image for ${skill.name}:`, resolveIcon(skill), e);
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-lg font-semibold text-primary">${skill.name?.charAt(0) || '?'}</span>`;
                    }
                  }}
                  onLoad={() => console.log(`✓ Image loaded for ${skill.name}:`, resolveIcon(skill))}
                />
              ) : (
                <span className="text-lg font-semibold text-primary">{skill.name?.charAt(0) || '?'}</span>
              )}
            </div>
            <span className="text-sm font-medium text-center">{skill.name}</span>
          </div>
        ))}
      </motion.div>
      
      <motion.div
        className="flex gap-8"
        animate={{ x: ["-100%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...duplicatedSkills].reverse().map((skill, index) => (
          <div key={`${skill.name}-reverse-${index}`} className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center shadow-lg hover:scale-110 transition-transform overflow-hidden">
              {resolveIcon(skill) ? (
                <img
                  src={resolveIcon(skill)}
                  alt={skill.name}
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: `scale(${clampIconSize(skill.iconSize || 100) / 100})`,
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image for ${skill.name}:`, resolveIcon(skill), e);
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-lg font-semibold text-primary">${skill.name?.charAt(0) || '?'}</span>`;
                    }
                  }}
                  onLoad={() => console.log(`✓ Image loaded for ${skill.name}:`, resolveIcon(skill))}
                />
              ) : (
                <span className="text-lg font-semibold text-primary">{skill.name?.charAt(0) || '?'}</span>
              )}
            </div>
            <span className="text-sm font-medium text-center">{skill.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [skills, setSkills] = useState(defaultSkills);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/skills?t=${Date.now()}`);
        if (!res.ok) throw new Error('Failed to fetch skills');
        const data = await res.json();
        console.log('Fetched skills from Firebase:', data);
        console.log('First 3 skills detailed:', data.slice(0, 3).map(s => ({
          name: s.name,
          icon: s.icon,
          iconSize: s.iconSize,
          category: s.category
        })));
        if (Array.isArray(data) && data.length) {
          const deduped = dedupeSkills(data);
          console.log('Deduped skills:', deduped);
          console.log('First skill full data:', deduped[0]);
          setSkills(deduped);
        } else {
          console.log('No skills found, using defaults');
          setSkills(defaultSkills);
        }
      } catch (err) {
        console.error('Skills fetch failed', err);
        setSkills(defaultSkills);
        setError('Unable to load latest skills. Showing defaults.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const uniqueSkills = useMemo(() => dedupeSkills(skills), [skills]);

  const categories = useMemo(() => {
    const unique = new Set((uniqueSkills || []).map((skill) => (skill.category ? skill.category.toLowerCase() : 'other')));
    const ordered = ['all', ...Array.from(unique)];
    const toLabel = (id) => id === 'all' ? 'All Skills' : `${id.charAt(0).toUpperCase()}${id.slice(1)}`;

    return ordered.map((id) => ({
      id,
      label: toLabel(id),
      color: categoryColors[id] || categoryColors.other,
    }));
  }, [skills]);

  const filteredSkills = uniqueSkills.filter(skill => 
    activeCategory === "all" || (skill.category || 'other') === activeCategory
  );

  return (
    <section id="skills" className="relative py-28 px-4 bg-gradient-to-br from-background via-secondary/5 to-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            My Skills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Technologies I've mastered and my proficiency levels
          </p>
          {isLoading && <p className="text-sm text-muted-foreground mt-3">Loading skills...</p>}
          {error && !isLoading && <p className="text-sm text-destructive mt-3">{error}</p>}
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-medium border border-transparent hover:shadow-lg ${
                activeCategory === category.id
                  ? `${category.color} text-white shadow-md`
                  : "bg-secondary/50 text-foreground hover:bg-secondary/70"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {activeCategory === "all" ? (
          <InfiniteScrollSkills skills={uniqueSkills} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground">No skills found in this category.</div>
            )}
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.id || skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card p-6 rounded-2xl border border-border/30 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg group"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {resolveIcon(skill) ? (
                        <img
                          src={resolveIcon(skill)}
                          alt={skill.name}
                          className="w-full h-full object-cover"
                          style={{ 
                            transform: `scale(${clampIconSize(skill.iconSize || 100) / 100})`,
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            console.error(`Failed to load image for ${skill.name}:`, resolveIcon(skill));
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-base font-semibold text-primary">${skill.name?.charAt(0) || '?'}</span>`;
                            }
                          }}
                          onLoad={() => console.log(`✓ Grid image loaded for ${skill.name}`)}
                        />
                      ) : (
                        <span className="text-base font-semibold text-primary">{skill.name?.charAt(0) || '?'}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {skill.name}
                        </h3>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          skill.level > 75 ? 'bg-emerald-500/10 text-emerald-500' : 
                          skill.level > 50 ? 'bg-amber-500/10 text-amber-500' : 
                          'bg-pink-500/10 text-pink-500'
                        }`}>
                          {skill.level}%
                        </span>
                      </div>
                      <SkillBar level={skill.level} />
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>Basic</span>
                        <span>Advanced</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
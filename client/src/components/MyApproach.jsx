import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Briefcase,
  Building2,
  ArrowRight,
} from "lucide-react";
import { fetchStaticOrLive } from "../lib/staticData";

const defaultApproachContent = {
  title: "My Approach",
  description:
    "I follow a systematic, user-centric approach to building web applications that are not just functional but also beautiful and performant.",
  steps: [
    {
      number: 1,
      title: "Discovery",
      description: "Understanding requirements, goals, and user needs",
    },
    {
      number: 2,
      title: "Planning",
      description: "Creating architecture and technical specifications",
    },
    {
      number: 3,
      title: "Design",
      description: "Crafting intuitive UI/UX with attention to detail",
    },
    {
      number: 4,
      title: "Development",
      description: "Writing clean, scalable, and maintainable code",
    },
    {
      number: 5,
      title: "Testing",
      description: "Rigorous QA and performance optimization",
    },
  ],
  careerTitle: "Career Path",
  careerIntro:
    "A quick look at how I grew from school to ..., building skills and impact along the way.",
  careerTimeline: [
    {
      period: "School",
      range: "2019 - 2021",
      title: "Biology Major but Passion for Tech",
      subtitle: "Explored programming through self-learning",
      highlights: [
        "Self-taught HTML, CSS basics",
        "Built simple websites",
        "Explored various programming languages",
      ],
      tech: ["HTML"],
      result: "Laid the foundation for a tech career",
      icon: "graduation",
    },
    {
      period: "Diploma",
      range: "2021 - 2022",
      title: "ERP Tally",
      subtitle: "ERP systems and business applications",
      highlights: [
        "Learned Tally ERP",
        "Understood business processes",
        "Developed small business apps",
      ],
      tech: ["Tally ERP", "Basic SQL", "VBScript"],
      result: "Gained practical IT skills for business",
      icon: "graduation",
    },
    {
      period: "College",
      range: "2022 - 2026 (present)",
      title: "Computer Science Engineering",
      subtitle: "Projects, internships, and hackathons",
      highlights: [
        "Built 7+ projects across web, AI",
        "Led team mini-projects, Full - stack projects",
        "Learned Spring Boot, React",
      ],
      tech: ["React", "Java", "Spring Boot", "SQL"],
      result: "Preparing for professional software development",
      icon: "college",
    },
    {
      period: "Internship",
      range: "2023",
      title: "Python Bootcamp Intern",
      subtitle: "python development and best practices",
      highlights: [
        "Developed projects using Python",
        "Learned coding standards",
      ],
      tech: ["Python"],
      result: "Enhanced coding skills and discipline",
      icon: "work",
    },
    {
      period: "Internship",
      range: "2024",
      title: "Cloud computing Intern",
      subtitle: "cloud services and solutions",
      highlights: ["Gained hands-on experience with AWS"],
      tech: ["AWS", "Azure", "Python", "NoteBook"],
      result: "Gained Hands on experience on cloud infra",
      icon: "work",
    },
    {
      period: "Infosys",
      range: "2026",
      title: "Systems Engineer",
      subtitle: "Going to work on real-world enterprise solutions",
      highlights: [
        "Joining Infosys as Systems Engineer",
        "Excited to apply skills in a corporate environment",
        "Looking forward to continuous learning and growth",
      ],
      tech: ["To be determined"],
      result: "Starting professional software engineering career",
      icon: "work",
    },
  ],
};

export const MyApproach = () => {
  const [approachContent, setApproachContent] = useState(
    defaultApproachContent,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("career");

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("approach_view")
        : null;
    if (saved === "approach" || saved === "career") setViewMode(saved);

    const fetchApproach = async () => {
      setIsLoading(true);
      setError("");
      try {
        const payload = await fetchStaticOrLive({
          name: "content",
          liveUrl: "/api/portfolio-data?type=content&key=approach",
          fallbackEmpty: defaultApproachContent,
        });
        const resolved = payload?.approach || payload?.data || payload;
        const merged = resolved || {};
        setApproachContent({
          title: merged.title || defaultApproachContent.title,
          description: merged.description || defaultApproachContent.description,
          steps:
            Array.isArray(merged.steps) && merged.steps.length
              ? merged.steps
              : defaultApproachContent.steps,
          careerTitle: merged.careerTitle || defaultApproachContent.careerTitle,
          careerIntro: merged.careerIntro || defaultApproachContent.careerIntro,
          careerTimeline:
            Array.isArray(merged.careerTimeline) && merged.careerTimeline.length
              ? merged.careerTimeline
              : defaultApproachContent.careerTimeline,
        });
      } catch (err) {
        console.error("Approach fetch failed", err);
        setApproachContent(defaultApproachContent);
        setError("Unable to load approach content. Showing defaults.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApproach();
  }, []);

  if (isLoading) {
    return (
      <section
        id="approach"
        className="relative py-28 px-4 bg-gradient-to-br from-background via-secondary/5 to-background"
      >
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          Loading...
        </div>
      </section>
    );
  }

  const handleViewChange = (mode) => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("approach_view", mode);
    }
  };

  const timeline =
    Array.isArray(approachContent.careerTimeline) &&
    approachContent.careerTimeline.length
      ? approachContent.careerTimeline
      : defaultApproachContent.careerTimeline;

  const renderTimelineIcon = (icon) => {
    if (icon === "graduation")
      return <GraduationCap className="text-primary" size={20} />;
    if (icon === "college")
      return <Building2 className="text-primary" size={20} />;
    return <Briefcase className="text-primary" size={20} />;
  };

  return (
    <section
      id="approach"
      className="relative py-28 px-4 bg-gradient-to-br from-background via-secondary/5 to-background overflow-hidden"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center gap-2">
            <Sparkles className="text-primary" /> {approachContent.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {approachContent.description}
          </p>
          {error && <p className="text-sm text-destructive mt-3">{error}</p>}

          {/* Toggle */}
          <div className="mt-6 inline-flex bg-card border border-border rounded-full p-1 shadow-sm">
            <button
              onClick={() => handleViewChange("approach")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                viewMode === "approach"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Development Approach
            </button>
            <button
              onClick={() => handleViewChange("career")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                viewMode === "career"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Career Path
            </button>
          </div>
        </motion.div>

        {viewMode === "approach" ? (
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 transform -translate-x-1/2" />

            <div className="space-y-8 md:space-y-12">
              <AnimatePresence>
                {(approachContent.steps || []).map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-6 md:gap-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className="flex-1">
                      <motion.div
                        className="bg-gradient-to-br from-card via-card to-card/80 border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 shadow-lg group"
                        whileHover={{ scale: 1.03, y: -4 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <motion.div
                              className="relative flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/50 transition-all"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <span className="text-2xl font-bold text-white">
                                {step.number}
                              </span>
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                              {step.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="hidden md:flex items-center justify-center flex-shrink-0">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full animate-ping" />
                        <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/80 border-2 border-primary shadow-xl shadow-primary/50">
                          <CheckCircle2 size={28} className="text-white" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="hidden md:block flex-1" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto text-muted-foreground">
              <p>
                {approachContent.careerIntro ||
                  defaultApproachContent.careerIntro}
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-8">
                {timeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`flex flex-col md:flex-row md:items-stretch gap-4 md:gap-8 ${idx % 2 === 0 ? "" : "md:flex-row-reverse"}`}
                  >
                    <div className="md:w-1/2 bg-card border border-border rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                          {renderTimelineIcon(item.icon)}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-primary font-semibold">
                            {item.period}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.range}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.subtitle}
                        </p>
                      )}
                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        {(item.highlights || []).map((point, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.tech || []).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {item.result && (
                        <p className="mt-4 text-sm font-semibold text-foreground">
                          Result: {item.result}
                        </p>
                      )}
                    </div>
                    <div className="hidden md:flex md:w-1/2 items-center justify-center">
                      <div className="relative h-full flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: idx * 0.08 + 0.2, type: "spring" }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg shadow-primary/50 border-2 border-background" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-semibold hover:scale-105"
          >
            Let&apos;s Work Together
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MyApproach;

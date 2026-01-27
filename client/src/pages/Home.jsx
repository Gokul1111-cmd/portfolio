import { Navbar } from "../components/Navbar";
import { StarBackground } from "@/components/StarBackground";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { SkillsSection } from "../components/SkillsSection";
import { CertificatesSection } from "../components/CertificatesSection";
import { MyApproach } from "../components/MyApproach";
import { ProjectsSection } from "../components/ProjectsSection";
import { JourneyCards } from "../components/JourneyCards";
import { BlogSection } from "../components/BlogSection";
import { TestimonialSection } from "../components/Testimonial";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { useEffect } from "react";

export const Home = () => {
  // Handle hash-based section navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # prefix
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Delay scroll to ensure WelcomeScreen overlay is completely gone
    // WelcomeScreen exits around 3200ms + 500ms animation = 3700ms total
    const scrollTimer = setTimeout(() => {
      handleHashChange();
    }, 3000);

    // Also listen for manual hash changes (when user clicks links)
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      clearTimeout(scrollTimer);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Theme Toggle */}
      {/* Background Effects */}
      <StarBackground />

      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main id="main-content" className="relative">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <CertificatesSection />
        <MyApproach />
        <ProjectsSection />
        <JourneyCards />
        <BlogSection />
        <TestimonialSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

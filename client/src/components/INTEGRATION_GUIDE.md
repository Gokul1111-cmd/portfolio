/**
 * ENGINEERING JOURNEY – INTEGRATION GUIDE
 * 
 * This guide shows how to integrate the EngineeringJourney component
 * into your existing portfolio site.
 */

// ============================================================================
// STEP 1: Import the component in Home.jsx
// ============================================================================

// Add this import at the top of src/pages/Home.jsx:
import { EngineeringJourney } from "@/components/EngineeringJourney";

// ============================================================================
// STEP 2: Add to the Home component's render (after ProjectsSection)
// ============================================================================

// In your Home component's JSX, add the component like this:

export const Home = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ... existing sections ... */}
      
      <main id="main-content" className="relative">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <CertificatesSection />
        <MyApproach />
        <ProjectsSection />
        {/* ADD THIS LINE BELOW ProjectsSection */}
        <EngineeringJourney />
        {/* ADD THIS LINE ABOVE BlogSection */}
        <BlogSection />
        <TestimonialSection />
        <ContactSection />
      </main>

      {/* ... rest of component ... */}
    </div>
  );
};

// ============================================================================
// STEP 3: (OPTIONAL) Add to Admin Dashboard
// ============================================================================

// If you want to manage Engineering Journey entries in your admin panel,
// import AdminEngineeringJourney in your admin section:

import { AdminEngineeringJourney } from "@/components/AdminEngineeringJourney";

// Then render it in your admin dashboard page alongside other editors.
// See src/pages/AdminDashboard.jsx for reference structure.

// ============================================================================
// STEP 4: Styling (Optional)
// ============================================================================

// The component uses semantic className values. Add Tailwind styles to
// your CSS by creating a .engineering-journey-section class in index.css:

/*
.engineering-journey-section {
  @apply py-20 px-4;
}

.section-container {
  @apply max-w-6xl mx-auto;
}

.section-header {
  @apply mb-16 text-center;
}

.section-title {
  @apply text-4xl font-bold mb-4;
}

.section-subtitle {
  @apply text-lg text-muted-foreground;
}

.phases-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}

.phase-block {
  @apply border border-border rounded-lg p-6 bg-card;
}

.phase-header {
  @apply mb-6;
}

.phase-title-section {
  @apply flex items-center justify-between mb-4;
}

.phase-title {
  @apply text-2xl font-bold;
}

.phase-status {
  @apply inline-block px-3 py-1 rounded-full text-sm font-medium;
}

.status-completed {
  @apply bg-green-100 text-green-800;
}

.status-in-progress {
  @apply bg-blue-100 text-blue-800;
}

.status-planned {
  @apply bg-gray-100 text-gray-800;
}

.phase-progress {
  @apply mt-4;
}

.progress-bar {
  @apply h-2 bg-muted rounded-full overflow-hidden mb-2;
}

.progress-fill {
  @apply h-full bg-primary rounded-full transition-all duration-300;
}

.progress-text {
  @apply text-sm text-muted-foreground;
}

.phase-focus-areas {
  @apply mb-6 pb-6 border-b border-border;
}

.focus-list {
  @apply list-disc list-inside mt-2;
}

.phase-entries {
  @apply space-y-8;
}

.entry-section {
  @apply border-l-4 pl-4;
}

.completed-section {
  @apply border-green-500;
}

.in-progress-section {
  @apply border-blue-500;
}

.planned-section {
  @apply border-gray-400;
}

.section-title {
  @apply text-lg font-bold mb-4;
}

.entry-list {
  @apply space-y-4;
}

.entry-card {
  @apply border border-border rounded-lg p-4 bg-background hover:shadow-md transition-shadow;
}

.entry-header {
  @apply flex items-start justify-between mb-3;
}

.entry-title {
  @apply font-bold text-lg;
}

.entry-status {
  @apply inline-block px-2 py-1 rounded text-xs font-medium;
}

.entry-domain {
  @apply text-sm text-muted-foreground mb-2;
}

.entry-description {
  @apply text-sm mb-3;
}

.entry-tech-stack {
  @apply flex flex-wrap gap-2 mb-3;
}

.tech-tag {
  @apply px-2 py-1 bg-muted rounded text-xs font-medium;
}

.github-link {
  @apply text-primary hover:underline text-sm;
}

.no-entries {
  @apply text-muted-foreground text-sm italic;
}
*/

// ============================================================================
// STEP 5: (FUTURE) Connect to CMS
// ============================================================================

// When you're ready to integrate with your admin/CMS:
//
// 1. Fetch phases and entries from your API:
//    const [cmsPhases, setCmsPhases] = useState([]);
//    const [cmsEntries, setCmsEntries] = useState([]);
//
//    useEffect(() => {
//      fetch('/api/engineering-journey/phases')
//        .then(res => res.json())
//        .then(data => setCmsPhases(data));
//      
//      fetch('/api/engineering-journey/entries')
//        .then(res => res.json())
//        .then(data => setCmsEntries(data));
//    }, []);
//
// 2. Pass them as props to EngineeringJourney:
//    <EngineeringJourney cmsPhases={cmsPhases} cmsEntries={cmsEntries} />
//
// 3. Update EngineeringJourney.jsx to accept props:
//    export const EngineeringJourney = ({ cmsPhases = null, cmsEntries = null }) => {
//      const phases = cmsPhases?.length ? cmsPhases : fallbackPhases;
//      const entries = cmsEntries?.length ? cmsEntries : fallbackEntries;
//      // ... rest of component
//    }

// ============================================================================
// COMPLETE EXAMPLE: Updated Home.jsx with import and render
// ============================================================================

/*
import { Navbar } from "../components/Navbar";
import { StarBackground } from "@/components/StarBackground";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { SkillsSection } from "../components/SkillsSection";
import { CertificatesSection } from "../components/CertificatesSection";
import { MyApproach } from "../components/MyApproach";
import { ProjectsSection } from "../components/ProjectsSection";
import { EngineeringJourney } from "@/components/EngineeringJourney";  // ← NEW
import { BlogSection } from "../components/BlogSection";
import { TestimonialSection } from "../components/Testimonial";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <StarBackground />
      <Navbar />

      <main id="main-content" className="relative">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <CertificatesSection />
        <MyApproach />
        <ProjectsSection />
        <EngineeringJourney />  {/* ← NEW */}
        <BlogSection />
        <TestimonialSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};
*/

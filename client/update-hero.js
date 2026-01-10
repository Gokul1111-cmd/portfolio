/* eslint-env node */
// Quick script to update hero content in Firestore
import { adminDb } from "./api/firebase-admin.js";

const heroData = {
  name: "Gokul A",
  title: "Full-Stack Developer",
  headline: "I'm Gokul A",
  subheadline: "I build AI-powered web applications that solve real-world problems. Passionate about cybersecurity, cloud computing, and creating impactful digital solutions.",
  availability: "Available Immediately for Full-Stack Developer roles",
  primaryCtaText: "View Projects",
  primaryCtaLink: "#projects",
  secondaryCtaText: "View Blogs",
  secondaryCtaLink: "/blog",
  resumeUrl: "/gokul-resume.pdf",
  profileImage: "/profile-logo.png",
  achievements: [
    { number: "0", label: "Years Experience", suffix: "+" },
    { number: "8", label: "Projects Completed", suffix: "+" },
    { number: "0", label: "Happy Clients", suffix: "" },
  ],
  codeSnippets: [
    "import { FullStackDeveloper } from 'gokul.dev';",
    "",
    "const developer = new FullStackDeveloper({",
    "  name: 'Gokul A',",
    "  stack: ['React', 'Spring Boot', 'Java', 'Flask'],",
    "  focus: 'Building AI-powered web solutions',",
    "  status: 'Open to new opportunities'",
    "});",
    "",
    "await developer.launchPortfolio();",
    "// Featured: E-commerce, IoT, AI/ML, Web Applications",
    "",
    "developer.connect();",
    "console.log('🚀 Let's build something exceptional together!');",
  ],
};

async function updateHero() {
  try {
    await adminDb.collection("content").doc("hero").set(heroData, { merge: true });
    console.log("✅ Hero content updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to update hero:", error);
    process.exit(1);
  }
}

updateHero();

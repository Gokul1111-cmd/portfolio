/* eslint-env node */
import { adminDb } from "./api/firebase-admin.js";

// Seeds only the timeline fields under content/approach, leaving other fields intact.
async function seedTimeline() {
  const timelineData = {
    careerTitle: "Career Path",
    careerIntro:
      "A quick look at how I grew from school to Infosys, building skills and impact along the way.",
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
    updatedAt: new Date(),
  };

  try {
    console.log("🌱 Seeding approach timeline...");
    await adminDb
      .collection("content")
      .doc("approach")
      .set(timelineData, { merge: true });
    console.log("✅ Timeline seeded/updated successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed timeline:", err);
    process.exit(1);
  }
}

seedTimeline();

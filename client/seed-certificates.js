/* eslint-env node */
import { adminDb } from "./api/firebase-admin.js";

const manualCertificateMapping = {
  "Introduction to Generative AI.png": {
    title: "Introduction to Generative AI",
    category: "AI & Machine Learning",
  },
  "FUNDAMENTALS OF GENERATIVE AI_page-0001.jpg": {
    title: "Fundamentals of Generative AI",
    category: "AI & Machine Learning",
  },
  "Introduction to Large Language Models.png": {
    title: "Introduction to Large Language Models",
    category: "AI & Machine Learning",
  },
  "Introduction to Responsible Ai.png": {
    title: "Introduction to Responsible AI",
    category: "AI & Machine Learning",
  },
  "RESPONSIBLE AI_page-0001.jpg": {
    title: "Fundamentals of Responsible Generative AI",
    category: "AI & Machine Learning",
  },
  "Applying AI Principles with Google Cloud.png": {
    title: "Applying AI Principles with Google Cloud",
    category: "AI & Machine Learning",
  },
  "COPILOT IN BING_page-0001.jpg": {
    title: "Explore Generative AI with Copilot in Bing",
    category: "AI & Machine Learning",
  },
  "INTRODUNTION TO GITHUB COPILOT_page-0001.jpg": {
    title: "Introduction to GitHub Copilot",
    category: "AI & Machine Learning",
  },
  "Prompt Design in Vertex AI.png": {
    title: "Prompt Design in Vertex AI",
    category: "AI & Machine Learning",
  },
  "Master Chatgpt.png": {
    title: "Master ChatGPT",
    category: "AI & Machine Learning",
  },
  "INTRODUCTION TO MACHINE LEARNING_page-0001.jpg": {
    title: "Introduction to Machine Learning",
    category: "AI & Machine Learning",
  },
  "MACHINE LEARNIING MODELS_page-0001.jpg": {
    title: "Create Machine Learning Models",
    category: "AI & Machine Learning",
  },
  "Machine Learning Onramp_page-0001.jpg": {
    title: "Machine Learning Onramp",
    category: "AI & Machine Learning",
  },
  "Deep Learning Onramp_page-0001.jpg": {
    title: "Deep Learning Onramp",
    category: "AI & Machine Learning",
  },
  "TEST ML MODELS_page-0001.jpg": {
    title: "Refine and Test Machine Learning Models",
    category: "AI & Machine Learning",
  },
  "TRAIN ML MODELS_page-0001.jpg": {
    title: "Train and Evaluate Deep Learning Models",
    category: "AI & Machine Learning",
  },
  "TRAIN CLASSIFICATION MODELS_page-0001.jpg": {
    title: "Train and Evaluate Classification Models",
    category: "AI & Machine Learning",
  },
  "TRAIN CLUSTERING MODELS_page-0001.jpg": {
    title: "Train and Evaluate Clustering Models",
    category: "AI & Machine Learning",
  },
  "TRAIN REGRESSION MODELS_page-0001.jpg": {
    title: "Train and Evaluate Regression Models",
    category: "AI & Machine Learning",
  },
  "AI ON AZURE_page-0001.jpg": {
    title: "Get Started with AI on Azure",
    category: "AI & Machine Learning",
  },
  "AUTOMATED ML IN AZURRE_page-0001.jpg": {
    title: "Use Automated Machine Learning in Azure Machine Learning",
    category: "AI & Machine Learning",
  },
  "CLUSTERING MODEL WITH AZURE ML_page-0001.jpg": {
    title: "Create a Clustering Model with Azure Machine Learning Designer",
    category: "AI & Machine Learning",
  },
  "CLUSTERING MODEL WITH AZURE ML DESIGNER_page-0001.jpg": {
    title: "Create a Classification Model with Azure Machine Learning Designer",
    category: "AI & Machine Learning",
  },
  "REGRESSION MODEL WITH AZURE ML DESIGNER_page-0001.jpg": {
    title: "Create a Regression Model with Azure Machine Learning Designer",
    category: "AI & Machine Learning",
  },
  "Machine Learning with Tensorflow.jpg": {
    title: "Machine Learning with Tensorflow",
    category: "AI & Machine Learning",
  },
  "TensorFlow Badge.png": {
    title: "TensorFlow Badge",
    category: "Badges & Memberships",
  },
  "AI BUILDER_page-0001.jpg": {
    title: "Improve Business Performance with AI Builder",
    category: "AI & Machine Learning",
  },
  "POWER AUTOMATE_page-0001.jpg": {
    title: "Use AI Builder in Power Automate",
    category: "AI & Machine Learning",
  },
  "DETECT OBJECTS_page-0001.jpg": {
    title: "Detect Objects with AI Builder",
    category: "AI & Machine Learning",
  },
  "BUSINESS CARDS_page-0001.jpg": {
    title: "Extract Information from Business Cards with AI Builder",
    category: "AI & Machine Learning",
  },
  "KEY PHRASES_page-0001.jpg": {
    title: "Identify Key Phrases with AI Builder",
    category: "AI & Machine Learning",
  },
  "LANGUAGE IDENTIFIER_page-0001.jpg": {
    title: "Identify the Language of Text with AI Builder",
    category: "AI & Machine Learning",
  },
  "PROCESS CUSTOM DOCUMENTS_page-0001.jpg": {
    title: "Process Custom Documents with AI Builder",
    category: "AI & Machine Learning",
  },
  "PROCESS RECEIPTS_page-0001.jpg": {
    title: "Process Receipts with AI Builder",
    category: "AI & Machine Learning",
  },
  "RECOGNIZE TEXT_page-0001.jpg": {
    title: "Recognize Text with AI Builder",
    category: "AI & Machine Learning",
  },
  "SENTIMENT OF TEXT_page-0001.jpg": {
    title: "Analyze the Sentiment of Text with AI Builder",
    category: "AI & Machine Learning",
  },
  "AI AND VECTOR SEARCH_page-0001.jpg": {
    title: "Introduction to AI and Vector Search",
    category: "AI & Machine Learning",
  },
  "VECTOR AI_page-0001.jpg": {
    title: "Introduction to MongoDB, AI, and Vector Search",
    category: "AI & Machine Learning",
  },
  "Get Started with object detection badge.png": {
    title: "Get Started with Object Detection",
    category: "AI & Machine Learning",
  },
  "Go further with object detection badge.png": {
    title: "Go Further with Object Detection",
    category: "AI & Machine Learning",
  },
  "AWS For Beginners.png": {
    title: "AWS for Beginners",
    category: "Cloud Computing",
  },
  "Azure fundamentals_page-0001.jpg": {
    title: "Azure Fundamentals",
    category: "Cloud Computing",
  },
  "cloud computing_page-0001.jpg": {
    title: "Introduction to Cloud Computing",
    category: "Cloud Computing",
  },
  "Cloud Foundations - Advanced.png": {
    title: "Cloud Foundations - Advanced",
    category: "Cloud Computing",
  },
  "GOKUL A Course _page-0001.jpg": {
    title: "Cloud Computing Program (LearnFlu)",
    category: "Cloud Computing",
  },
  "Workshop kumaraguru cloud computing__page-0001.jpg": {
    title: "Workshop on Cloud Technologies in AWS",
    category: "Cloud Computing",
  },
  "Atlas_page-0001.jpg": {
    title: "Getting Started with MongoDB Atlas",
    category: "Cloud Computing",
  },
  "ANALYTICS_page-0001.jpg": {
    title: "Introduction to End-to-End Analytics using Microsoft Fabric",
    category: "Data Science & Analytics",
  },
  "MICROSOFT FABRIC_page-0001.jpg": {
    title: "Use Data Factory Pipelines in Microsoft Fabric",
    category: "Data Science & Analytics",
  },
  "LAKEHOUSES_page-0001.jpg": {
    title: "Get Started with Lakehouses in Microsoft Fabric",
    category: "Data Science & Analytics",
  },
  "APACHE SPARK_page-0001.jpg": {
    title: "Use Apache Spark in Microsoft Fabric",
    category: "Data Science & Analytics",
  },
  "DELTA LAKE_page-0001.jpg": {
    title: "Work with Delta Lake Tables in Microsoft Fabric",
    category: "Data Science & Analytics",
  },
  "WITH PYTHON_page-0001.jpg": {
    title: "Explore and Analyze Data with Python",
    category: "Data Science & Analytics",
  },
  "Celonis Foundation.png": {
    title: "Celonis Foundations",
    category: "Data Science & Analytics",
  },
  "Academic Process Mining Fundamentals.png": {
    title: "Academic Process Mining Fundamentals (Certificate)",
    category: "Data Science & Analytics",
  },
  "Academic Process Mining Fundamentals - Foundational - Badge.png": {
    title: "Academic Process Mining Fundamentals",
    category: "Data Science & Analytics",
  },
  "Advanced Cyber Securuty - Threats and Governance.png": {
    title: "Advanced Cyber Security - Threats and Governance",
    category: "Cybersecurity",
  },
  "Cyber crime_page-0001.jpg": {
    title: "Introduction to Cybercrime",
    category: "Cybersecurity",
  },
  "Introduction for Ethical Hacking.png": {
    title: "Introduction to Ethical Hacking",
    category: "Cybersecurity",
  },
  "Ethical Hacking - Mobile Platforms and Network Architecture.png": {
    title: "Ethical Hacking - Mobile Platforms and Network Architecture",
    category: "Cybersecurity",
  },
  "Introduction to Information Security.png": {
    title: "Introduction to Information Security",
    category: "Cybersecurity",
  },
  "Network Security.png": {
    title: "Network Security",
    category: "Cybersecurity",
  },
  "Introduction to Firewall.png": {
    title: "Introduction to Firewall",
    category: "Cybersecurity",
  },
  "Types of Cyber Security.png": {
    title: "Types of Cyber Security",
    category: "Cybersecurity",
  },
  "CertificateOfCompletion_HTML Essential Training_page-0001.jpg": {
    title: "HTML Essential Training",
    category: "Web Development & APIs",
  },
  "HTML.png": {
    title: "HTML Certification Course",
    category: "Web Development & APIs",
  },
  "CertificateOfCompletion_CSS Essential Training 2019_page-0001.jpg": {
    title: "CSS Essential Training",
    category: "Web Development & APIs",
  },
  "CSS.png": {
    title: "CSS Certification Course",
    category: "Web Development & APIs",
  },
  "Angular7 for Beginners.png": {
    title: "Angular 7 for Beginners",
    category: "Web Development & APIs",
  },
  "IIT SPOKEN TUTORIAL JavaScript_page-0001.jpg": {
    title: "JavaScript Training",
    category: "Web Development & APIs",
  },
  "Javascript Basic_page-0001.jpg": {
    title: "JavaScript (Basic)",
    category: "Web Development & APIs",
  },
  "POSTMAN API Fundamentals Student Expert.png": {
    title: "Postman API Fundamentals Student Expert",
    category: "Web Development & APIs",
  },
  "POSTMAN API Fundamentals Student Expert Badge.png": {
    title: "Postman API Fundamentals Student Expert Badge",
    category: "Web Development & APIs",
  },
  "C Programming.png": { title: "C Programming", category: "Programming" },
  "Learn C_page-0001.jpg": { title: "Learn C", category: "Programming" },
  "CertificateOfCompletion_C Programming Basics Flow Control Variables and Pointers_page-0001.jpg":
    {
      title: "C Programming Basics: Flow Control, Variables, and Pointers",
      category: "Programming",
    },
  "CertificateOfCompletion_Master C Language Pointers_page-0001.jpg": {
    title: "Master C Language Pointers",
    category: "Programming",
  },
  "Factorial  Program in C.png": {
    title: "Factorial Program in C",
    category: "Programming",
  },
  "Turbo C++.png": { title: "Turbo C++", category: "Programming" },
  "Basics of python.png": {
    title: "Basics of Python",
    category: "Programming",
  },
  "Programming Basics.png": {
    title: "Programming Basics",
    category: "Programming",
  },
  "Loops for Beginners.png": {
    title: "Loops for Beginners",
    category: "Programming",
  },
  "Git certificate_page-0001.jpg": {
    title: "Git Training",
    category: "DevOps, IoT & Automation",
  },
  "GIT.png": {
    title: "Git Certification Course",
    category: "DevOps, IoT & Automation",
  },
  "Visual Studio Online.png": {
    title: "Visual Studio Online",
    category: "DevOps, IoT & Automation",
  },
  "Linux Training_page-0001.jpg": {
    title: "Linux Training",
    category: "DevOps, IoT & Automation",
  },
  "Explore automation development with UiPath Studio.jpg": {
    title: "Explore Automation Development with UiPath Studio",
    category: "DevOps, IoT & Automation",
  },
  "Introduction to Internet Of Things.png": {
    title: "Introduction to Internet of Things",
    category: "DevOps, IoT & Automation",
  },
  "Introduction to Industry 4.0 and Industrial Internet of Things.png": {
    title: "Introduction to Industry 4.0 and Industrial Internet of Things",
    category: "DevOps, IoT & Automation",
  },
  "Arduino vs Raspberry Pi.png": {
    title: "Arduino vs Raspberry Pi",
    category: "DevOps, IoT & Automation",
  },
  "OSI Model Physical Layer.png": {
    title: "OSI Model: Physical Layer",
    category: "DevOps, IoT & Automation",
  },
  "Design App.png": { title: "Design App", category: "Mobile & App Design" },
  "Bitcon for Beginners.png": {
    title: "Bitcoin for Beginners",
    category: "Blockchain",
  },
  "GOKUL A Internship_page-0001.jpg": {
    title: "Internship - Cloud Computing Program",
    category: "Internships",
  },
  "Python Bootcamp Byts - Internship.jpg": {
    title: "Internship on Python",
    category: "Internships",
  },
  "HackElite 2023 - Manakula Vinayagar College.jpg": {
    title: "HackElite 2023 Hackathon Participation",
    category: "Competitions",
  },
  "Smart agrothon - Karpagam College of Engineering.jpg": {
    title: "Smart Agrothon 2023 Participation",
    category: "Competitions",
  },
  "Can u Guess.jpg": {
    title: "Symposium Varunah-2K24 (Can u Guess Event)",
    category: "Competitions",
  },
  "Professionalism_page-0001.jpg": {
    title: "Professionalism",
    category: "Soft Skills",
  },
  "Effective speaking and speaking skills_page-0001.jpg": {
    title: "Effective Speaking and Listening Skills",
    category: "Soft Skills",
  },
  "Human Behaviour.jpeg": { title: "Human Behaviour", category: "Soft Skills" },
  "Software Testing Tutorial.png": {
    title: "Software Testing Tutorial",
    category: "Software Testing",
  },
  "Lifestyle for the Environment Pledge.jpg": {
    title: "Lifestyle for the Environment Pledge",
    category: "Volunteering",
  },
  "MERI MAATI MERA DESH PROGRAMME.png": {
    title: "Meri Maati Mera Desh Programme",
    category: "Volunteering",
  },
  "ROAD SAFETY.jpg": {
    title: "Road Safety Awareness",
    category: "Volunteering",
  },
  "NSS MATHEMATICS COMMITMENT__page-0001.jpg": {
    title: "National Mathematics Day Quiz - Commitment",
    category: "Volunteering",
  },
  "NSS HUMAN RIGHTS COMMITMENT__page-0001.jpg": {
    title: "World Human Rights Quiz Day - Commitment",
    category: "Volunteering",
  },
  "My_Bharat_Registration_Certificate.png": {
    title: "MY Bharat Registration Recognition",
    category: "Volunteering",
  },
  "Diploma in Computer Application(DCA).jpg": {
    title: "Diploma in Computer Application (DCA)",
    category: "Certifications & Tools",
  },
  "IEI - Student's chapter_page-0001.jpg": {
    title: "Certificate of Membership (IEI)",
    category: "Badges & Memberships",
  },
  "Google Developer program.jpg": {
    title: "Google Developer Program Membership",
    category: "Badges & Memberships",
  },
  "First Learning Pathway and Quiz badge.png": {
    title: "First Learning Pathway and Quiz Badge",
    category: "Badges & Memberships",
  },
  "Learning.png": {
    title: "Google Developer Learning Badge",
    category: "Badges & Memberships",
  },
  "Foundations - Badge.png": {
    title: "Celonis Foundations (Badge)",
    category: "Badges & Memberships",
  },
};

const featuredSet = new Set([
  "Applying AI Principles with Google Cloud.png",
  "Azure fundamentals_page-0001.jpg",
  "Advanced Cyber Securuty - Threats and Governance.png",
  "POSTMAN API Fundamentals Student Expert.png",
]);

const toTitle = (fileName) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toType = (fileName) =>
  fileName.toLowerCase().endsWith(".pdf") ? "pdf" : "image";

async function seedCertificates() {
  console.log("🌱 Seeding certificates...");
  const col = adminDb.collection("certificates");

  // simple guard: do not re-seed if already present
  const existing = await col.limit(1).get();
  if (!existing.empty) {
    console.log(
      "⚠️ certificates collection already has data; aborting to avoid duplicates.",
    );
    return;
  }

  const entries = Object.entries(manualCertificateMapping);
  let count = 0;
  for (const [fileName, meta] of entries) {
    const url = `/Certificates/${encodeURIComponent(fileName)}`;
    const doc = {
      title: meta.title || toTitle(fileName),
      category: meta.category || "Other",
      provider: meta.provider || "",
      fileName,
      url,
      type: toType(fileName),
      featured: featuredSet.has(fileName),
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await col.add(doc);
    count += 1;
  }

  console.log(`✅ Seeded ${count} certificates.`);
}

seedCertificates()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed", err);
    process.exit(1);
  });

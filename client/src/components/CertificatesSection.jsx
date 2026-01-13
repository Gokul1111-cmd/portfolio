/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Filter,
  ExternalLink,
  FileText,
  Eye,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { fetchStaticOrLive } from "../lib/staticData";

// Updated fallback list from /public/Certificates (converted PDFs to images where applicable)
const fallbackFiles = [
  "Academic Process Mining Fundamentals - Foundational - Badge.png",
  "Academic Process Mining Fundamentals.png",
  "Advanced Cyber Securuty - Threats and Governance.png",
  "AI AND VECTOR SEARCH_page-0001.jpg",
  "AI BUILDER_page-0001.jpg",
  "AI ON AZURE_page-0001.jpg",
  "ANALYTICS_page-0001.jpg",
  "Angular7 for Beginners.png",
  "APACHE SPARK_page-0001.jpg",
  "Applying AI Principles with Google Cloud.png",
  "Arduino vs Raspberry Pi.png",
  "Atlas_page-0001.jpg",
  "AUTOMATED ML IN AZURRE_page-0001.jpg",
  "AWS For Beginners.png",
  "Azure fundamentals_page-0001.jpg",
  "Basics of python.png",
  "Bitcon for Beginners.png",
  "BUSINESS CARDS_page-0001.jpg",
  "C Programming.png",
  "Can u Guess.jpg",
  "Celonis Foundation.png",
  "CertificateOfCompletion_C Programming Basics Flow Control Variables and Pointers_page-0001.jpg",
  "CertificateOfCompletion_CSS Essential Training 2019_page-0001.jpg",
  "CertificateOfCompletion_HTML Essential Training_page-0001.jpg",
  "CertificateOfCompletion_Master C Language Pointers_page-0001.jpg",
  "cloud computing_page-0001.jpg",
  "Cloud Foundations - Advanced.png",
  "CLUSTERING MODEL WITH AZURE ML DESIGNER_page-0001.jpg",
  "CLUSTERING MODEL WITH AZURE ML_page-0001.jpg",
  "COPILOT IN BING_page-0001.jpg",
  "CSS.png",
  "Cyber crime_page-0001.jpg",
  "Deep Learning Onramp_page-0001.jpg",
  "DELTA LAKE_page-0001.jpg",
  "Design App.png",
  "DETECT OBJECTS_page-0001.jpg",
  "Diploma in Computer Application(DCA).jpg",
  "Effective speaking and speaking skills_page-0001.jpg",
  "Ethical Hacking - Mobile Platforms and Network Architecture.png",
  "Explore automation development with UiPath Studio.jpg",
  "Factorial  Program in C.png",
  "First Learning Pathway and Quiz badge.png",
  "Foundations - Badge.png",
  "FUNDAMENTALS OF GENERATIVE AI_page-0001.jpg",
  "Get Started with object detection badge.png",
  "Git certificate_page-0001.jpg",
  "GIT.png",
  "Go further with object detection badge.png",
  "GOKUL A Course _page-0001.jpg",
  "GOKUL A Internship_page-0001.jpg",
  "Google Developer program.jpg",
  "HackElite 2023 - Manakula Vinayagar College.jpg",
  "HTML.png",
  "Human Behaviour.jpeg",
  "IEI - Student's chapter_page-0001.jpg",
  "IIT SPOKEN TUTORIAL JavaScript_page-0001.jpg",
  "Introduction for Ethical Hacking.png",
  "Introduction to Firewall.png",
  "Introduction to Generative AI.png",
  "Introduction to Industry 4.0 and Industrial Internet of Things.png",
  "Introduction to Information Security.png",
  "Introduction to Internet Of Things.png",
  "Introduction to Large Language Models.png",
  "INTRODUCTION TO MACHINE LEARNING_page-0001.jpg",
  "Introduction to Responsible Ai.png",
  "INTRODUNTION TO GITHUB COPILOT_page-0001.jpg",
  "Javascript Basic_page-0001.jpg",
  "KEY PHRASES_page-0001.jpg",
  "LAKEHOUSES_page-0001.jpg",
  "LANGUAGE IDENTIFIER_page-0001.jpg",
  "Learn C_page-0001.jpg",
  "Learning.png",
  "Lifestyle for the Environment Pledge.jpg",
  "Linux Training_page-0001.jpg",
  "Loops for Beginners.png",
  "MACHINE LEARNIING MODELS_page-0001.jpg",
  "Machine Learning Onramp_page-0001.jpg",
  "Machine Learning with Tensorflow.jpg",
  "Master Chatgpt.png",
  "MERI MAATI MERA DESH PROGRAMME.png",
  "MICROSOFT FABRIC_page-0001.jpg",
  "My_Bharat_Registration_Certificate.png",
  "Network Security.png",
  "NSS HUMAN RIGHTS COMMITMENT__page-0001.jpg",
  "NSS MATHEMATICS COMMITMENT__page-0001.jpg",
  "OSI Model Physical Layer.png",
  "POSTMAN API Fundamentals Student Expert Badge.png",
  "POSTMAN API Fundamentals Student Expert.png",
  "POWER AUTOMATE_page-0001.jpg",
  "PROCESS CUSTOM DOCUMENTS_page-0001.jpg",
  "PROCESS RECEIPTS_page-0001.jpg",
  "Professionalism_page-0001.jpg",
  "Programming Basics.png",
  "Prompt Design in Vertex AI.png",
  "Python Bootcamp Byts - Internship.jpg",
  "RECOGNIZE TEXT_page-0001.jpg",
  "REGRESSION MODEL WITH AZURE ML DESIGNER_page-0001.jpg",
  "RESPONSIBLE AI_page-0001.jpg",
  "ROAD SAFETY.jpg",
  "SENTIMENT OF TEXT_page-0001.jpg",
  "Smart agrothon - Karpagam College of Engineering.jpg",
  "Software Testing Tutorial.png",
  "TensorFlow Badge.png",
  "TEST ML MODELS_page-0001.jpg",
  "TRAIN CLASSIFICATION MODELS_page-0001.jpg",
  "TRAIN CLUSTERING MODELS_page-0001.jpg",
  "TRAIN ML MODELS_page-0001.jpg",
  "TRAIN REGRESSION MODELS_page-0001.jpg",
  "Turbo C++.png",
  "Types of Cyber Security.png",
  "VECTOR AI_page-0001.jpg",
  "Visual Studio Online.png",
  "WITH PYTHON_page-0001.jpg",
  "Workshop kumaraguru cloud computing__page-0001.jpg",
];

const buildPublicUrl = (fileName) =>
  `/Certificates/${encodeURIComponent(fileName)}`;

const toTitle = (fileName) => {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");
  return withoutExt.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
};

// Manual mapping: filename -> { title, category } based on Gemini content analysis
const manualCertificateMapping = {
  // 🤖 AI & Machine Learning
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

  // ☁️ Cloud Computing
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

  // 📊 Data Science & Analytics
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

  // 🛡️ Cybersecurity
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

  // 💻 Web Development & APIs
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

  // ⌨️ Programming (C, C++, Python)
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

  // ⚙️ DevOps, IoT & Automation
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

  // 📱 Mobile, Design & Blockchain
  "Design App.png": { title: "Design App", category: "Mobile & App Design" },
  "Bitcon for Beginners.png": {
    title: "Bitcoin for Beginners",
    category: "Blockchain",
  },

  // 🏆 Competitions & Internships
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

  // 🤝 Soft Skills & Volunteering
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

  // 🏅 Badges & Memberships
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

const CATEGORY_ORDER_NEW = [
  "AI & Machine Learning",
  "Cloud Computing",
  "Data Science & Analytics",
  "Cybersecurity",
  "Web Development & APIs",
  "Programming",
  "DevOps, IoT & Automation",
  "Blockchain",
  "Mobile & App Design",
  "Competitions",
  "Internships",
  "Soft Skills",
  "Volunteering",
  "Software Testing",
  "Certifications & Tools",
  "Badges & Memberships",
];

const getManualMapping = (fileName) =>
  manualCertificateMapping[fileName] || null;

const categorizeTitle = (title = "") => {
  const t = title.toLowerCase();
  if (/(data|analytics|sql|database|lakehouse|delta)/.test(t))
    return "Data & Analytics";
  if (
    /[\b](ai|ml|machine learning|tensorflow|vector|copilot|generative|deep learning|llm)[\b]/.test(
      t,
    )
  )
    return "AI/ML";
  if (/(cloud|azure|aws|fabric)/.test(t)) return "Cloud";
  if (/(security|hacking|cyber|firewall|network)/.test(t)) return "Security";
  if (/(html|css|javascript|postman|web|ui|react|api)/.test(t))
    return "Web & API";
  if (
    /(python|c\+\+|c programming|loops|programming|coding|backend|java|tensorflow)/.test(
      t,
    )
  )
    return "Programming";
  if (/(devops|tools|automation|git|github|docker|postman)/.test(t))
    return "DevOps/Tools";
  if (/(iot|raspberry|arduino|industry 4\.0|automation)/.test(t))
    return "IoT/Hardware";
  if (/(design|ui design|product)/.test(t)) return "Product/Design";
  if (/(badge|pledge|commitment|certificate|achievement)/.test(t))
    return "Badges & Achievements";
  if (/(professionalism|speaking|behaviour|behavior|road safety|human)/.test(t))
    return "Soft Skills";
  return "Other";
};

const labelForCategory = {
  "AI & Machine Learning": "AI & Machine Learning",
  "Cloud Computing": "Cloud Computing",
  "Data Science & Analytics": "Data Science & Analytics",
  Cybersecurity: "Cybersecurity",
  "Web Development & APIs": "Web Development & APIs",
  Programming: "Programming",
  "DevOps, IoT & Automation": "DevOps, IoT & Automation",
  Blockchain: "Blockchain",
  "Mobile & App Design": "Mobile & App Design",
  Competitions: "Competitions",
  Internships: "Internships",
  "Soft Skills": "Soft Skills",
  Volunteering: "Volunteering",
  "Software Testing": "Software Testing",
  "Certifications & Tools": "Certifications & Tools",
  "Badges & Memberships": "Badges & Memberships",
};

const ensureCategory = (item) =>
  item.category || categorizeTitle(item.title || item.name || "");

const withFallbackData = fallbackFiles.map((file, index) => {
  const lower = file.toLowerCase();
  const isPdf = lower.endsWith(".pdf");
  const url = buildPublicUrl(file);
  const manual = getManualMapping(file);
  const title = manual?.title || toTitle(file) || `Certificate ${index + 1}`;
  const category = manual?.category || categorizeTitle(title);
  return {
    id: `fallback-${index}`,
    title,
    provider: "Certificate",
    category,
    type: isPdf ? "pdf" : "image",
    link: url,
    image: isPdf ? "" : url,
  };
});

export const CertificatesSection = () => {
  const [certificates, setCertificates] = useState(withFallbackData);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [isLiveData, setIsLiveData] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const openPreview = (cert) => setPreviewCert(cert);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError("");
      try {
        const payload = await fetchStaticOrLive({
          name: "certificates",
          liveUrl: "/api/portfolio-data?type=certificates",
          fallbackEmpty: withFallbackData,
        });
        const usedFallback = payload === withFallbackData;
        const data = Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload)
            ? payload
            : [];
        console.info("[CertificatesSection] Using dataset", data.length);
        if (Array.isArray(data) && data.length) {
          setIsLiveData(!usedFallback);
          const normalized = data.map((item, idx) => {
            const lowerImage = (item.image || item.url || "").toLowerCase();
            const type =
              item.type || (lowerImage.endsWith(".pdf") ? "pdf" : "image");
            const title = item.title || item.name || `Certificate ${idx + 1}`;
            const version =
              (item.updatedAt &&
                (item.updatedAt.seconds || item.updatedAt._seconds)) ||
              (item.createdAt &&
                (item.createdAt.seconds || item.createdAt._seconds)) ||
              Math.floor(Date.now() / 1000);

            const bust = (url) => {
              if (!url) return "";
              if (url.startsWith("http"))
                return `${url}${url.includes("?") ? "&" : "?"}v=${version}`;
              return url;
            };

            return {
              id: item.id || item.slug || `cert-${idx}`,
              title,
              provider: item.provider || item.issuer || "Certificate",
              category: ensureCategory({ ...item, title }),
              type,
              image:
                type === "pdf"
                  ? item.preview || ""
                  : bust(item.image || item.url || ""),
              link: bust(item.link || item.url || item.image || ""),
              featured: Boolean(item.featured),
            };
          });
          setCertificates(normalized);
        } else {
          setError("Showing fallback certificates");
          console.warn("[CertificatesSection] Empty data; using fallback list");
          setCertificates(withFallbackData);
          setIsLiveData(false);
        }
      } catch (err) {
        console.error("Certificate fetch failed", err);
        setError("Showing fallback certificates");
        console.warn("[CertificatesSection] Error; using fallback list");
        setCertificates(withFallbackData);
        setIsLiveData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filters = useMemo(() => {
    // Show the full curated list so categories are visible even if empty
    return ["all", ...CATEGORY_ORDER_NEW];
  }, []);

  const filteredCertificates = useMemo(() => {
    if (activeFilter === "all") return certificates;
    return certificates.filter((cert) => ensureCategory(cert) === activeFilter);
  }, [certificates, activeFilter]);

  const featuredFromData = filteredCertificates.filter((c) => c.featured);
  const featured = (
    featuredFromData.length ? featuredFromData : filteredCertificates
  ).slice(0, 4);

  const displayedCertificates = showAll
    ? filteredCertificates
    : filteredCertificates.slice(0, 6);

  const badgeForType = (type) => {
    if (type === "pdf")
      return "bg-amber-500/15 text-amber-600 border border-amber-500/30";
    return "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30";
  };

  const CardMedia = ({ cert }) => {
    if (cert.type === "pdf" || !cert.image) {
      return (
        <div className="h-48 w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary border-b border-border">
          <FileText className="w-10 h-10 mb-3" />
          <p className="text-sm font-medium">PDF Certificate</p>
        </div>
      );
    }

    return (
      <div className="h-48 w-full overflow-hidden bg-muted">
        <img
          src={cert.image}
          alt={cert.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  };

  return (
    <section
      id="certificates"
      className="relative py-20 md:py-28 bg-gradient-to-br from-background via-background to-primary/5"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Certifications
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full border ${isLiveData
                  ? "border-emerald-400 text-emerald-400 bg-emerald-400/10"
                  : "border-amber-400 text-amber-400 bg-amber-400/10"
                }`}
            >
              {isLiveData ? "Live" : "Fallback"}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Certificates & Badges
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Verified achievements and learning milestones across cloud, AI/ML,
            security, and more.
          </p>
        </motion.div>

        {/* Desktop: Horizontal filter buttons */}
        <div className="hidden sm:flex flex-wrap justify-center gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-2 ${activeFilter === filter
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
            >
              <Filter className="w-4 h-4" />
              {filter === "all" ? "All" : labelForCategory[filter] || filter}
            </button>
          ))}
        </div>

        {/* Mobile: Dropdown filter */}
        <div className="sm:hidden mb-10 relative max-w-xs mx-auto">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="w-full px-5 py-3 rounded-xl text-sm font-medium border bg-background text-foreground border-border flex items-center justify-between gap-2 hover:border-primary transition-all"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {activeFilter === "all" ? "All Certificates" : labelForCategory[activeFilter] || activeFilter}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${
              isFilterDropdownOpen ? "rotate-180" : ""
            }`} />
          </button>
          {isFilterDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-card border border-border shadow-lg z-50 max-h-80 overflow-y-auto">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`w-full px-5 py-3 text-left text-sm transition-colors ${
                    activeFilter === filter
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {filter === "all" ? "All Certificates" : labelForCategory[filter] || filter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Featured carousel */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Featured</h3>
            <span className="text-sm text-muted-foreground">
              First {Math.min(featured.length, 4)} items
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
            <AnimatePresence mode="popLayout">
              {featured.map((cert) => (
                <motion.div
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="min-w-[260px] max-w-[260px] bg-card border border-primary/60 rounded-xl shadow-[0_0_18px_rgba(168,85,247,0.35)] hover:shadow-[0_0_26px_rgba(168,85,247,0.55)] transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => openPreview(cert)}
                >
                  <CardMedia cert={cert} />
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground line-clamp-2">
                          {cert.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {cert.provider}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full font-medium ${badgeForType(cert.type)}`}
                      >
                        {cert.type === "pdf" ? "PDF" : "Image"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={cert.link || cert.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(cert);
                        }}
                        className="inline-flex items-center justify-center gap-2 text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-border hover:border-primary transition bg-background/80"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full flex justify-center py-10">
              <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          {!loading && filteredCertificates.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No certificates to display yet.
            </div>
          )}

          {!loading &&
            displayedCertificates.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => openPreview(cert)}
              >
                <CardMedia cert={cert} />
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-lg text-foreground line-clamp-2">
                        {cert.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {cert.provider}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-1 rounded-full font-medium ${badgeForType(cert.type)}`}
                    >
                      {cert.type === "pdf" ? "PDF" : "Image"}
                    </span>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <a
                      href={cert.link || cert.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreview(cert);
                      }}
                      className="inline-flex items-center justify-center gap-2 text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-border hover:border-primary transition bg-background/80"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {!loading && filteredCertificates.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-primary to-purple-500 text-primary-foreground shadow-lg shadow-primary/30 border border-primary/70 hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              <Sparkles className="w-4 h-4" />
              {showAll ? "Show fewer certificates" : "See more certificates"}
            </button>
          </div>
        )}

        <AnimatePresence>
          {previewCert && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewCert(null)}
            >
              <motion.div
                className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/80 border border-border hover:border-primary transition"
                  onClick={() => setPreviewCert(null)}
                  aria-label="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>

                {previewCert.image ? (
                  <div className="w-full max-h-[70vh] bg-muted flex items-center justify-center overflow-auto">
                    <img
                      src={previewCert.image}
                      alt={previewCert.title}
                      className="object-contain max-h-[70vh] w-full"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[40vh] bg-muted flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <FileText className="w-10 h-10" />
                    <p>No image preview available. Open the file to view.</p>
                    <a
                      href={previewCert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open file
                    </a>
                  </div>
                )}

                <div className="p-4 border-t border-border bg-background/90">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-lg text-foreground">
                        {previewCert.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {previewCert.provider}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={previewCert.link || previewCert.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </a>
                      <button
                        onClick={() => setPreviewCert(null)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary"
                      >
                        <X className="w-4 h-4" />
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

/* eslint-env node */
import { adminDb } from './api/firebase-admin.js';

// Seed function for initial data
async function seedFirestore() {
  try {
    console.log('🌱 Seeding Firestore with initial data...');

    // Check if projects already exist to prevent duplicates
    const existingProjects = await adminDb.collection('projects').limit(1).get();
    if (!existingProjects.empty) {
      console.log('⚠️  Data already exists! Run cleanup-duplicates.js first if you want to re-seed.');
      console.log('💡 To force re-seed, delete all collections in Firebase Console first.');
      process.exit(0);
    }

    // Seed hero content
    const heroData = {
      name: "Gokul A",
      title: "Full-Stack Developer",
      headline: "I'm Gokul A",
      subheadline: "I build AI-powered web applications that solve real-world problems.",
      availability: "Available Immediately for Full-Stack Developer roles",
      primaryCtaText: "View Case Studies",
      primaryCtaLink: "#projects",
      secondaryCtaText: "View Projects",
      secondaryCtaLink: "#projects",
      resumeUrl: "/gokul-resume.pdf",
      achievements: [
        { number: "0", label: "Years Experience", suffix: "+" },
        { number: "8", label: "Projects Completed", suffix: "+" },
        { number: "0", label: "Happy Clients", suffix: "" }
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
        "console.log('🚀 Let's build something exceptional together!');"
      ]
    };

    console.log('📝 Writing hero content...');
    await adminDb.collection('content').doc('hero').set(heroData);
    console.log('✅ Hero content seeded successfully');

    // Seed all projects
    const projects = [
      {
        id: 1,
        title: "Shopverse",
        category: "E-commerce",
        description: "Full-featured e-commerce platform with product catalog, shopping cart, user authentication, and order management.",
        image: "/projects/project1.png",
        video: "/projects/videos/shopverse-demo.mp4",
        tags: ["React", "Tailwind CSS", "Firebase", "Chart.js", "Axios"],
        demoUrl: "https://shopverse-theta.vercel.app/",
        githubUrl: "#",
        featured: true,
        accentColor: "from-purple-500 to-indigo-600",
        status: "Live",
        highlights: ["Product catalog", "Shopping cart", "User authentication", "Order tracking"],
        created_at: new Date()
      },
      {
        id: 2,
        title: "Weather Forecasting System",
        category: "Web Application",
        description: "Real-time weather forecasting application with location-based weather data and forecasts using OpenWeather API.",
        image: "/projects/project2.png",
        video: "/projects/videos/weather-demo.mp4",
        tags: ["React", "OpenWeather API", "JavaScript", "CSS"],
        demoUrl: "https://gokulweatherforecasting.netlify.app/",
        githubUrl: "#",
        featured: true,
        accentColor: "from-blue-500 to-cyan-600",
        status: "Live",
        highlights: ["Real-time weather data", "Location search", "5-day forecast", "Responsive design"],
        created_at: new Date()
      },
      {
        id: 3,
        title: "G&M Restaurant Booking",
        category: "Restaurant Management",
        description: "Comprehensive restaurant booking system with table reservation, food ordering, and room booking features.",
        image: "/projects/project3.png",
        video: "/projects/videos/gm-demo.mp4",
        tags: ["React", "TypeScript", "Node.js", "Express"],
        demoUrl: "#",
        githubUrl: "#",
        accentColor: "from-amber-500 to-orange-600",
        status: "In Development",
        highlights: ["Table reservation", "Food ordering", "Room booking", "Admin dashboard"],
        created_at: new Date()
      },
      {
        id: 4,
        title: "Komato - Zomato Clone",
        category: "Food Tech",
        description: "Restaurant discovery and food ordering platform inspired by Zomato with modern UI/UX.",
        image: "/projects/project4.png",
        video: "/projects/videos/komato-demo.mp4",
        tags: ["HTML", "CSS", "JavaScript"],
        demoUrl: "#",
        githubUrl: "#",
        accentColor: "from-rose-500 to-pink-600",
        status: "In Development",
        highlights: ["Restaurant listings", "Search functionality", "User authentication", "Responsive design"],
        created_at: new Date()
      },
      {
        id: 5,
        title: "Recipe Descriptor",
        category: "Food & Recipe",
        description: "Recipe discovery platform featuring North and South Indian cuisines with detailed categorization.",
        image: "/projects/project5.png",
        video: "/projects/videos/recipe-demo.mp4",
        tags: ["HTML", "CSS", "JavaScript"],
        demoUrl: "#",
        githubUrl: "#",
        accentColor: "from-violet-500 to-purple-600",
        status: "In Development",
        highlights: ["Recipe categories", "Cuisine separation", "Detailed instructions", "Image gallery"],
        created_at: new Date()
      },
      {
        id: 6,
        title: "Car Parking IoT System",
        category: "IoT Application",
        description: "Smart parking management system with entry/exit tracking, billing, and payment integration.",
        image: "/projects/project6.png",
        video: "/projects/videos/parking-demo.mp4",
        tags: ["HTML", "CSS", "JavaScript", "IoT", "Python"],
        demoUrl: "#",
        githubUrl: "#",
        accentColor: "from-orange-500 to-red-600",
        status: "In Development",
        highlights: ["Entry/Exit tracking", "Automated billing", "Payment processing", "Real-time updates"],
        created_at: new Date()
      },
      {
        id: 7,
        title: "Parallax Car Website",
        category: "Web Design",
        description: "Modern parallax scrolling website showcasing automotive design with smooth animations.",
        image: "/projects/project7.png",
        video: "/projects/videos/car-demo.mp4",
        tags: ["HTML", "CSS", "JavaScript", "Parallax"],
        demoUrl: "https://car-parallax.netlify.app/",
        githubUrl: "#",
        featured: false,
        accentColor: "from-emerald-500 to-teal-600",
        status: "Live",
        highlights: ["Parallax scrolling", "Smooth animations", "Responsive design", "Modern UI"],
        created_at: new Date()
      },
      {
        id: 8,
        title: "Kanban Board",
        category: "Project Management",
        description: "Frontend Kanban board application built with React for intuitive task management and workflow organization.",
        image: "/projects/project8.png",
        video: "/projects/videos/kanban-demo.mp4",
        tags: ["React", "JavaScript", "CSS", "Drag & Drop"],
        demoUrl: "https://kanbanmern.netlify.app/",
        githubUrl: "#",
        featured: true,
        accentColor: "from-green-500 to-emerald-600",
        status: "Live",
        highlights: ["Drag & Drop", "Task management", "Local storage", "Responsive design"],
        created_at: new Date()
      }
    ];

    console.log('📝 Writing projects to Firestore...');
    for (const project of projects) {
      await adminDb.collection('projects').add(project);
    }
    console.log(`✅ ${projects.length} projects seeded successfully`);

    // Seed About content
    const aboutData = {
      bio: "I'm Gokul A, a Computer Science Engineering student passionate about AI, cloud computing, and full-stack development. I love transforming ideas into impactful digital solutions.",
      experience: "Fresh graduate with hands-on experience building 8+ projects using modern technologies. I specialize in full-stack development, AI integration, and creating scalable web applications.",
      education: "Bachelor of Engineering in Computer Science & Engineering",
      personalSummary: "I believe technology should be built with purpose. My approach focuses on writing clean, scalable code and continuously learning new technologies."
    };

    console.log('📝 Writing about content...');
    await adminDb.collection('content').doc('about').set(aboutData);
    console.log('✅ About content seeded successfully');

    // Seed Skills
    const skills = [
      // Frontend
      { name: "HTML5", category: "frontend", level: 90, createdAt: new Date() },
      { name: "CSS3", category: "frontend", level: 80, createdAt: new Date() },
      { name: "JavaScript", category: "frontend", level: 70, createdAt: new Date() },
      { name: "React", category: "frontend", level: 75, createdAt: new Date() },
      { name: "Tailwind CSS", category: "frontend", level: 85, createdAt: new Date() },
      // Backend
      { name: "Java", category: "backend", level: 70, createdAt: new Date() },
      { name: "SQL", category: "backend", level: 60, createdAt: new Date() },
      { name: "MySQL", category: "backend", level: 65, createdAt: new Date() },
      { name: "MongoDB", category: "backend", level: 60, createdAt: new Date() },
      { name: "Python", category: "backend", level: 65, createdAt: new Date() },
      { name: "Spring Boot", category: "backend", level: 65, createdAt: new Date() },
      { name: "Flask", category: "backend", level: 60, createdAt: new Date() },
      // Tools
      { name: "Git", category: "tools", level: 80, createdAt: new Date() },
      { name: "GitHub", category: "tools", level: 85, createdAt: new Date() },
      { name: "Docker", category: "tools", level: 55, createdAt: new Date() },
      { name: "Firebase", category: "tools", level: 70, createdAt: new Date() },
      { name: "VS Code", category: "tools", level: 90, createdAt: new Date() }
    ];

    console.log('📝 Writing skills...');
    for (const skill of skills) {
      await adminDb.collection('skills').add(skill);
    }
    console.log(`✅ ${skills.length} skills seeded successfully`);

    // Seed Approach content
    const approachData = {
      title: "My Development Approach",
      description: "I follow a systematic, user-centric approach to building web applications that are not just functional but also beautiful and performant.",
      steps: [
        { step: 1, title: "Discovery", description: "Understanding requirements, goals, and user needs" },
        { step: 2, title: "Planning", description: "Creating architecture and technical specifications" },
        { step: 3, title: "Design", description: "Crafting intuitive UI/UX with attention to detail" },
        { step: 4, title: "Development", description: "Writing clean, scalable, and maintainable code" },
        { step: 5, title: "Testing", description: "Ensuring quality through rigorous testing" },
        { step: 6, title: "Deployment", description: "Launching and monitoring the final product" }
      ]
    };

    console.log('📝 Writing approach content...');
    await adminDb.collection('content').doc('approach').set(approachData);
    console.log('✅ Approach content seeded successfully');

    // Seed Testimonials
    const testimonials = [
      {
        name: "Alex Johnson",
        role: "Product Director at TechCorp",
        content: "Working with Gokul was seamless. Not only did they deliver a full-stack solution ahead of schedule, but they also communicated clearly throughout.",
        rating: 5,
        image: "/testimonials/alex-johnson.png",
        createdAt: new Date()
      },
      {
        name: "Maria Chen",
        role: "Senior UX Designer at DesignHub",
        content: "I've reviewed hundreds of portfolios, and his work is truly exceptional. The way animations guide attention while maintaining performance is masterful.",
        rating: 5,
        image: "/testimonials/maria-chen.png",
        createdAt: new Date()
      },
      {
        name: "David Wilson",
        role: "CTO at Startup Ventures",
        content: "From wireframes to deployment, Gokul owned the entire stack with confidence and creativity. The final product is fast, reliable, and looks incredible.",
        rating: 5,
        image: "/testimonials/David Wilson.png",
        createdAt: new Date()
      }
    ];

    console.log('📝 Writing testimonials...');
    for (const testimonial of testimonials) {
      await adminDb.collection('testimonials').add(testimonial);
    }
    console.log(`✅ ${testimonials.length} testimonials seeded successfully`);

    // Seed Contact content
    const contactData = {
      email: "gokulanbalagan1112@gmail.com",
      phone: "+91-9876543210",
      location: "India",
      linkedin: "https://www.linkedin.com/in/gokulanbalagan1112/",
      github: "https://github.com/Gokul1111-cmd",
      twitter: "https://twitter.com"
    };

    console.log('📝 Writing contact content...');
    await adminDb.collection('content').doc('contact').set(contactData);
    console.log('✅ Contact content seeded successfully');

    console.log('🎉 Firestore seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

seedFirestore();

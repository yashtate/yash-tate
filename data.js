// Edit this file to update the website content without touching the design.
// For images, place files inside /assets and update the path here.

const portfolioData = {
  name: "Yash J. Tate",
  title: "Mechanical Engineering Student · Baja SAE Founder · Powertrain & Advanced Manufacturing",
  location: "Austin, Texas",
  email: "yashtate@utexas.edu",
  phone: "(512) 765-1236",
  linkedin: "https://www.linkedin.com/in/yash-tate-430890273/",
  github: "#",
  resume: "assets/Yash-Tate-Resume.pdf",

  heroImages: [
    "assets/hero-1.jpg",
    "assets/hero-2.jpg"
  ],

  intro:
    "I build mechanical systems with an automotive and motorsport mindset: lightweight, testable, manufacturable, and made to survive real use. My work spans Baja SAE powertrain design, additive manufacturing research, robotic fabrication, combat robotics, and 3D printed battery manufacturing.",

  stats: [
    { value: "200+", label: "Members scaled in UT Longhorn Baja Racing" },
    { value: "3.73", label: "Mechanical Engineering GPA at UT Austin" },
    { value: "~8 lb", label: "Vehicle mass reduction through Baja trade studies" },
    { value: "~25%", label: "Material waste reduction in additive manufacturing research" }
  ],

  skills: [
    "SolidWorks", "CATIA V5/V6", "Autodesk Fusion 360", "MATLAB/Simulink",
    "ANSYS FEA/CFD", "Python", "VBA", "GD&T ASME Y14.5",
    "DFMEA/PFMEA", "Manual Fabrication", "Jig & Fixture Design",
    "Rapid Prototyping", "SLA/FDM 3D Printing", "Root Cause Analysis",
    "Technical Documentation", "Vendor Relations", "Project Budgeting",
    "Cross-functional Leadership"
  ],

  experience: [
    {
      role: "Captain & Founder",
      org: "UT Longhorn Baja Racing",
      time: "Dec 2024 - Present",
      detail: "Co-founded UT Austin’s Baja SAE chapter, scaled the organization to 200+ members, and directed team operations, recruitment, and official SAE competition registration."
    },
    {
      role: "Lead Powertrain Engineer",
      org: "UT Longhorn Baja Racing",
      time: "Apr 2025 - Present",
      detail: "Designed powertrain components in SolidWorks, created assembly procedures and DFMEA-informed documentation, validated countermeasures for failure modes, and reduced vehicle mass by about 8 lb through trade studies."
    },
    {
      role: "Undergraduate Researcher",
      org: "UT SiDi Manufacturing Lab",
      time: "Jan 2025 - Present",
      detail: "Prototyped robotic arm end-effectors and print bed components, analyzed print path geometry and process parameters, and helped reduce material waste by about 25%."
    },
    {
      role: "Engineering Intern",
      org: "Material Hybrid Manufacturing",
      time: "Summer Internship",
      detail: "Worked on 3D printer systems used for advanced battery printing and supported hands-on development work around additive manufacturing hardware."
    }
  ],

  projects: [
    {
      number: "01",
      category: "Baja SAE · Powertrain",
      title: "Off-Road Race Car Powertrain Design",
      date: "2025 - Present",
      image: "assets/baja-powertrain.jpg",
      summary: "Designed and documented powertrain components for UT Longhorn Baja Racing with an emphasis on mass reduction, failure-mode validation, assembly repeatability, and competition readiness.",
      highlights: ["SolidWorks design", "DFMEA-informed documentation", "Trade studies", "~8 lb mass reduction"]
    },
    {
      number: "02",
      category: "Automotive · Personal Build",
      title: "Compact Car Solo Camping Build",
      date: "Personal Project",
      image: "assets/camping-build.jpg",
      summary: "Built a modular setup to enable solo camping inside a compact car, balancing comfort, storage, removability, and daily-driver usability.",
      highlights: ["Packaging", "Modular layout", "Human factors", "Compact vehicle design"]
    },
    {
      number: "03",
      category: "Advanced Manufacturing · Batteries",
      title: "3D Printed Battery Manufacturing Internship",
      date: "Material Hybrid Manufacturing",
      image: "assets/material-printer.jpg",
      summary: "Supported work on additive manufacturing hardware used to print batteries, connecting mechanical design, process development, and real production constraints.",
      highlights: ["3D printer systems", "Battery printing", "Prototype hardware", "Manufacturing process support"]
    },
    {
      number: "04",
      category: "Research · Robotic Additive Manufacturing",
      title: "Scissor Lift Print Bed & Swarm Manufacturing",
      date: "UT Research",
      image: "assets/robotic-arms.jpg",
      summary: "Contributed to campus research involving robotic arms in additive manufacturing, including scissor lift bed concepts, end-effectors, print path geometry, and process documentation.",
      highlights: ["Robotic arms", "End-effectors", "Print bed design", "~25% material waste reduction"]
    }
  ],

  education: {
    school: "The University of Texas at Austin",
    degree: "B.S. Mechanical Engineering · Business Foundations Minor",
    graduation: "Expected Dec 2027",
    gpa: "3.73",
    coursework: ["Thermodynamics", "Mechanics of Solids", "Combustion Engine Processes", "Engineering Design"]
  },

  recommendations: [
    {
      name: "Recommendation Letter 01",
      description: "Add a PDF recommendation letter in /assets and update this link.",
      link: "assets/recommendation-1.pdf"
    },
    {
      name: "Recommendation Letter 02",
      description: "Add another letter, professor note, or employer recommendation.",
      link: "assets/recommendation-2.pdf"
    }
  ],

  gallery: [
    { image: "assets/gallery-1.jpg", caption: "Baja build photo placeholder" },
    { image: "assets/gallery-2.jpg", caption: "Manufacturing / shop photo placeholder" },
    { image: "assets/gallery-3.jpg", caption: "Research / robotics photo placeholder" }
  ]
};

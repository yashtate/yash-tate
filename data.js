// Edit this file to update the website without touching the design.
// Add images to /assets and update the file paths below.

const portfolioData = {
  name: "Yash J. Tate",
  email: "yashtate@utexas.edu",
  phone: "(512) 765-1236",
  linkedin: "https://www.linkedin.com/in/yash-tate-430890273/",
  github: "#",
  resume: "assets/Yash-Tate-Resume.pdf",
  heroImage: "assets/hero-yash.jpg",

  stats: [
    { value: "200+", label: "Baja SAE members" },
    { value: "3.73", label: "UT Austin GPA" },
    { value: "~8 lb", label: "vehicle mass reduction" },
    { value: "~25%", label: "less material waste" }
  ],

  skills: [
    "SolidWorks", "CATIA V5/V6", "Fusion 360", "MATLAB/Simulink", "ANSYS FEA/CFD",
    "Python", "VBA", "GD&T", "DFMEA/PFMEA", "FEA", "Jig & Fixture Design",
    "Manual Fabrication", "SLA/FDM Printing", "Rapid Prototyping", "Root Cause Analysis",
    "Technical Documentation", "Vendor Relations", "Project Budgeting", "Team Leadership"
  ],

  education: {
    school: "The University of Texas at Austin",
    degree: "B.S. Mechanical Engineering · Business Foundations Minor",
    graduation: "Expected Dec 2027",
    gpa: "3.73",
    coursework: ["Thermodynamics", "Mechanics of Solids", "Combustion Engine Processes", "Engineering Design"]
  },

  projects: [
    {
      title: "Baja SAE Powertrain Design",
      category: "Motorsport · Powertrain",
      image: "assets/baja-powertrain.jpg",
      short: "Powertrain design, failure-mode validation, mass reduction, and race-ready documentation for UT Longhorn Baja Racing.",
      details: [
        "Designed powertrain components in SolidWorks and supported assembly procedures for UT Longhorn Baja Racing.",
        "Created DFMEA-informed documentation and validated countermeasures for identified failure modes.",
        "Ran trade studies that reduced total vehicle mass by about 8 lb, improving acceleration potential and packaging efficiency.",
        "Focused on serviceability, manufacturability, repeatability, and competition readiness."
      ],
      tags: ["SolidWorks", "DFMEA", "Powertrain", "Baja SAE", "Mass reduction"]
    },
    {
      title: "Compact Car Camping Build",
      category: "Automotive · Personal Build",
      image: "assets/camping-build.jpg",
      short: "A removable compact-car solo camping setup designed around packaging, comfort, and daily-driver practicality.",
      details: [
        "Built a way to solo camp inside a compact car without turning the vehicle into a permanent camper.",
        "Focused on packaging, sleeping layout, storage access, weight, removability, and real-world usability.",
        "The project blends automotive packaging, human factors, fabrication, and practical design constraints."
      ],
      tags: ["Automotive packaging", "Fabrication", "Modular design", "Human factors"]
    },
    {
      title: "3D Printed Battery Manufacturing",
      category: "Internship · Material Hybrid Manufacturing",
      image: "assets/material-printer.jpg",
      short: "Internship work supporting 3D printer hardware used for advanced battery manufacturing.",
      details: [
        "Interned at Material Hybrid Manufacturing and worked on printer systems used to print batteries.",
        "Supported hardware-focused development where mechanical design, manufacturing process control, and real production constraints meet.",
        "Built experience around advanced manufacturing equipment, prototyping, and additive manufacturing workflows."
      ],
      tags: ["3D printing", "Battery manufacturing", "Hardware", "Process development"]
    },
    {
      title: "Robotic Additive Manufacturing Research",
      category: "UT Research · Advanced Manufacturing",
      image: "assets/robotic-arms.jpg",
      short: "Research involving scissor-lift print bed concepts, robotic arm end-effectors, and swarm manufacturing.",
      details: [
        "Prototyped and modeled robotic arm end-effectors and print bed components in the UT SiDi Manufacturing Lab.",
        "Worked on scissor lift bed concepts and robotic-arm additive manufacturing research.",
        "Analyzed print path geometry and process parameters, helping reduce material waste by about 25%.",
        "Documented processes and investigated new additive manufacturing technologies to reduce per-part cost."
      ],
      tags: ["Robotic arms", "Print bed design", "End-effectors", "Additive manufacturing"]
    }
  ],

  experience: [
    {
      role: "Captain & Founder",
      org: "UT Longhorn Baja Racing",
      time: "Dec 2024 - Present",
      detail: "Co-founded UT Austin’s Baja SAE chapter and scaled the organization to 200+ members."
    },
    {
      role: "Lead Powertrain Engineer",
      org: "UT Longhorn Baja Racing",
      time: "Apr 2025 - Present",
      detail: "Designed powertrain systems, validated countermeasures, and documented assembly and failure-mode work."
    },
    {
      role: "Undergraduate Researcher",
      org: "UT SiDi Manufacturing Lab",
      time: "Jan 2025 - Present",
      detail: "Worked on robotic arm additive manufacturing, print bed components, and process optimization."
    },
    {
      role: "Engineering Intern",
      org: "Material Hybrid Manufacturing",
      time: "Summer Internship",
      detail: "Supported 3D printer hardware development for battery printing applications."
    }
  ],

  recommendations: [
    { name: "Recommendation Letter 01", description: "Upload a PDF letter to /assets and update this path.", link: "assets/recommendation-1.pdf" },
    { name: "Recommendation Letter 02", description: "Add another professor, employer, or mentor letter here.", link: "assets/recommendation-2.pdf" }
  ],

  gallery: [
    { image: "assets/gallery-1.jpg", caption: "Baja build photo" },
    { image: "assets/gallery-2.jpg", caption: "Manufacturing or shop photo" },
    { image: "assets/gallery-3.jpg", caption: "Research or robotics photo" }
  ]
};

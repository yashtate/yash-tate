const projects = {
  "baja-powertrain": {
    meta: "UT Longhorn Baja Racing / Dec 2024 - Present",
    title: "Baja SAE Powertrain Design",
    summary:
      "Co-founded UT Austin's Baja SAE chapter and led powertrain work for an international SAE competition vehicle.",
    details: [
      ["Role", "Captain, founder, and lead powertrain engineer for UT Longhorn Baja Racing."],
      ["Engineering", "Designed powertrain components in SolidWorks and authored assembly procedures."],
      ["Validation", "Used DFMEA-informed documentation, root-cause analysis, and confirmation testing for 4+ failure modes."],
      ["Impact", "Reduced total vehicle mass by about 8 lb through trade studies, improving acceleration potential."]
    ]
  },
  "material-hybrid": {
    meta: "Material Hybrid Manufacturing / Internship",
    title: "3D Printed Battery Manufacturing",
    summary:
      "Internship work on advanced 3D printing systems used to print battery-related hardware and materials.",
    details: [
      ["Focus", "Supported printer development and manufacturing workflow improvements."],
      ["Domain", "Advanced manufacturing, additive processes, materials, and battery-focused hardware."],
      ["Link", "Company website: material.inc"],
      ["Portfolio Note", "Add approved photos or deeper technical details here after confidentiality review."]
    ]
  },
  "camping-build": {
    meta: "Personal Engineering Build",
    title: "Compact Car Solo Camping System",
    summary:
      "A low-profile build that turns a compact car into a solo camping setup with practical storage, sleep, and pack-in constraints.",
    details: [
      ["Challenge", "Create a livable camp system without losing the daily-driver function of a compact car."],
      ["Engineering", "Balanced packaging, load paths, removable components, access, and fast setup."],
      ["Fabrication", "Built around simple materials, repeatable cuts, field repairability, and real use constraints."],
      ["Next", "Add build photos, CAD sketches, and a parts list to turn this into a full case study."]
    ]
  },
  "sidi-lab": {
    meta: "UT SiDi Manufacturing Lab / Jan 2025 - Present",
    title: "Scissor-Lift Print Bed & Swarm Manufacturing",
    summary:
      "Campus research on robotic arm additive manufacturing, print beds, end-effectors, and automated manufacturing systems.",
    details: [
      ["Hardware", "Prototyped and 3D modeled robotic arm end-effectors and print-bed components."],
      ["Automation", "Investigated swarm manufacturing concepts using robotic arms in additive manufacturing."],
      ["Analysis", "Studied print path geometry and process parameters to reduce material waste by about 25%."],
      ["Documentation", "Led process documentation and evaluated new additive technologies for lower per-part cost."]
    ]
  },
  "combat-robot": {
    meta: "Experimental Division / Aug 2024 - Dec 2024",
    title: "$100 Combat Robot",
    summary:
      "Designed and tested a competition-constrained combat robot that finished 7th in a 24-team event.",
    details: [
      ["Constraint", "Designed around a $100 budget and competition limits."],
      ["Testing", "Built procedures for structural and dynamic loading."],
      ["Iteration", "Investigated failures and implemented countermeasures."],
      ["Result", "Improved structural robustness by about 20% and presented findings for the next design cycle."]
    ]
  }
};

const root = document.documentElement;
const glow = document.querySelector(".cursor-glow");
const dialog = document.querySelector("#projectDialog");
const closeDialog = document.querySelector(".close-dialog");
const title = document.querySelector("#projectTitle");
const meta = document.querySelector("#projectMeta");
const summary = document.querySelector("#projectSummary");
const details = document.querySelector("#projectDetails");
const parallaxItems = document.querySelectorAll(".hero-media, .metric, .gallery-tile");

window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--x", `${event.clientX}px`);
  root.style.setProperty("--y", `${event.clientY}px`);
  if (glow) glow.style.opacity = "1";
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY;
    root.style.setProperty("--scroll", `${scrollY * 0.04}px`);

    parallaxItems.forEach((item, index) => {
      const speed = index % 2 === 0 ? 0.018 : -0.012;
      item.style.setProperty("--lift", `${scrollY * speed}px`);
    });
  },
  { passive: true }
);

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projects[button.dataset.project];
    if (!project) return;

    meta.textContent = project.meta;
    title.textContent = project.title;
    summary.textContent = project.summary;
    details.innerHTML = project.details
      .map(([label, text]) => `<div class="detail-card"><strong>${label}</strong><span>${text}</span></div>`)
      .join("");

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  });
});

closeDialog.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const isInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;

  if (!isInDialog) dialog.close();
});

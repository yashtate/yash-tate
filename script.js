const $ = (selector) => document.querySelector(selector);

function img(src, alt) {
  return `<img src="${src}" alt="${alt}" onerror="this.style.opacity=.18; this.alt='Add image: ${src}'" />`;
}

function render() {
  const d = portfolioData;
  $("#name").textContent = d.name;
  $("#heroImage").src = d.heroImage;
  $("#resumeLink").href = d.resume;
  $("#emailLink").href = `mailto:${d.email}`;
  $("#linkedinLink").href = d.linkedin;
  $("#githubLink").href = d.github;
  $("#year").textContent = new Date().getFullYear();

  const marquee = [...d.skills, ...d.skills];
  $("#skillMarquee").innerHTML = marquee.map(s => `<span>${s}</span>`).join("");

  $("#quickStats").innerHTML = d.stats.map(s => `
    <article class="stat"><strong>${s.value}</strong><span>${s.label}</span></article>
  `).join("");

  $("#education").innerHTML = `
    <p><strong>${d.education.school}</strong></p>
    <p>${d.education.degree}</p>
    <p><strong>Expected graduation:</strong> ${d.education.graduation}</p>
    <p><strong>GPA:</strong> ${d.education.gpa}</p>
    <p><strong>Coursework:</strong> ${d.education.coursework.join(", ")}</p>
  `;

  $("#projectGrid").innerHTML = d.projects.map((p, i) => `
    <article class="project-card" data-project="${i}">
      ${img(p.image, p.title)}
      <div class="project-body">
        <div class="project-meta">${p.category}</div>
        <h3>${p.title}</h3>
        <p>${p.short}</p>
        <div class="tags">${p.tags.slice(0,4).map(t => `<span>${t}</span>`).join("")}</div>
        <div class="open-hint">Open project →</div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => openProject(d.projects[Number(card.dataset.project)]));
  });

  $("#experienceList").innerHTML = d.experience.map(e => `
    <article class="timeline-item">
      <small>${e.time}</small>
      <h3>${e.role}</h3>
      <p><strong>${e.org}</strong></p>
      <p>${e.detail}</p>
    </article>
  `).join("");

  $("#skills").innerHTML = d.skills.map(s => `<span>${s}</span>`).join("");

  $("#recommendationsList").innerHTML = d.recommendations.map(r => `
    <article class="letter-card">
      <h3>${r.name}</h3>
      <p>${r.description}</p>
      <a href="${r.link}" target="_blank">Open letter →</a>
    </article>
  `).join("");

  $("#galleryGrid").innerHTML = d.gallery.map(g => `
    <article class="gallery-item">${img(g.image, g.caption)}<p>${g.caption}</p></article>
  `).join("");
}

function openProject(project) {
  const modal = $("#projectModal");
  $("#modalContent").innerHTML = `
    <img class="modal-hero" src="${project.image}" alt="${project.title}" onerror="this.style.display='none'" />
    <div class="modal-inner">
      <p class="eyebrow">${project.category}</p>
      <h3>${project.title}</h3>
      <div class="tags">${project.tags.map(t => `<span>${t}</span>`).join("")}</div>
      <ul>${project.details.map(d => `<li>${d}</li>`).join("")}</ul>
    </div>
  `;
  modal.showModal();
}

$(".modal-close").addEventListener("click", () => $("#projectModal").close());
$("#projectModal").addEventListener("click", (e) => { if (e.target.id === "projectModal") e.target.close(); });

window.addEventListener("mousemove", (e) => {
  const glow = $(".cursor-glow");
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: .12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
render();

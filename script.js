const $ = (selector) => document.querySelector(selector);

function setText(selector, text) {
  const el = $(selector);
  if (el) el.textContent = text;
}

function imageWithFallback(src, alt) {
  return `<img src="${src}" alt="${alt}" onerror="this.style.opacity=.25; this.alt='Add image: ${src}'" />`;
}

function render() {
  const d = portfolioData;

  setText("#name", d.name);
  setText("#title", d.title);
  setText("#intro", d.intro);
  $("#resumeLink").href = d.resume;
  $("#heroImage").src = d.heroImages[0];
  $("#emailLink").href = `mailto:${d.email}`;
  $("#linkedinLink").href = d.linkedin;
  $("#githubLink").href = d.github;
  setText("#year", new Date().getFullYear());

  const marqueeItems = [...d.skills, ...d.skills];
  $("#skillMarquee").innerHTML = marqueeItems.map(skill => `<span>${skill}</span>`).join("");

  $("#stats").innerHTML = d.stats.map(stat => `
    <article class="stat">
      <strong>${stat.value}</strong>
      <span>${stat.label}</span>
    </article>
  `).join("");

  $("#education").innerHTML = `
    <p><strong>${d.education.school}</strong></p>
    <p>${d.education.degree}</p>
    <p><strong>Expected graduation:</strong> ${d.education.graduation}</p>
    <p><strong>GPA:</strong> ${d.education.gpa}</p>
    <p><strong>Relevant coursework:</strong> ${d.education.coursework.join(", ")}</p>
  `;

  $("#projectGrid").innerHTML = d.projects.map(project => `
    <article class="project-card">
      <div class="project-image">${imageWithFallback(project.image, project.title)}</div>
      <div class="project-content">
        <div class="project-meta">
          <span>${project.number} · ${project.category}</span>
          <span>${project.date}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="tags">${project.highlights.map(item => `<span>${item}</span>`).join("")}</div>
      </div>
    </article>
  `).join("");

  $("#experienceList").innerHTML = d.experience.map(item => `
    <article class="timeline-item">
      <small>${item.time}</small>
      <h3>${item.role}</h3>
      <p><strong>${item.org}</strong></p>
      <p>${item.detail}</p>
    </article>
  `).join("");

  $("#skills").innerHTML = d.skills.map(skill => `<span>${skill}</span>`).join("");

  $("#recommendationsList").innerHTML = d.recommendations.map(letter => `
    <article class="letter-card">
      <h3>${letter.name}</h3>
      <p>${letter.description}</p>
      <a href="${letter.link}" target="_blank">Open letter →</a>
    </article>
  `).join("");

  $("#galleryGrid").innerHTML = d.gallery.map(item => `
    <article class="gallery-item">
      ${imageWithFallback(item.image, item.caption)}
      <p>${item.caption}</p>
    </article>
  `).join("");
}

$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

render();

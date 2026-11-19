const skills = document.querySelector(".skills");
if (skills) {
  const control = skills.querySelector(".motion");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const configure = () => {
    skills.classList.toggle("ready", !motion.matches);
    control.hidden = motion.matches;
  };
  configure();
  motion.addEventListener("change", configure);
  control.addEventListener("click", () => {
    const paused = skills.classList.toggle("paused");
    control.setAttribute("aria-pressed", String(paused));
    control.querySelector(".motion-word").textContent = paused ? "Resume" : "Pause";
  });
}

const viewer = document.getElementById("viewer");
if (viewer && typeof viewer.showModal === "function") {
  const photo = document.getElementById("viewer-image");
  const caption = document.getElementById("viewer-caption");
  let opener = null;
  document.querySelectorAll(".zoom-photo").forEach(link => {
    link.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      photo.src = link.href;
      photo.alt = link.querySelector("img").alt;
      caption.textContent = link.closest("figure").querySelector("figcaption").textContent;
      viewer.showModal();
    });
  });
  document.getElementById("viewer-close").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", event => {
    if (event.target !== viewer) return;
    const box = viewer.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) viewer.close();
  });
  viewer.addEventListener("close", () => opener?.focus());
}

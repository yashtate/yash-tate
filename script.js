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
  const links = Array.from(document.querySelectorAll(".zoom-photo"));
  const previous = document.getElementById("viewer-prev");
  const next = document.getElementById("viewer-next");
  const openerGroup = previous.parentElement;
  openerGroup.hidden = links.length < 2;
  let current = 0;
  let opener = null;
  function show(index) {
    current = (index + links.length) % links.length;
    const link = links[current];
    photo.src = link.href;
    photo.alt = link.querySelector("img").alt;
    caption.textContent = link.closest("figure").querySelector("figcaption").textContent;
  }
  links.forEach((link, index) => {
    link.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      show(index);
      viewer.showModal();
    });
  });
  previous.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  viewer.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      show(current + (event.key === "ArrowRight" ? 1 : -1));
    }
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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("entered");
        observer.unobserve(entry.target);
      }
    }
  });
  const revealSections = () => {
    observer.disconnect();
    if (reducedMotion.matches) return;
    const selectors = ".section-title, .project-card, .metrics, .case-body h2, .about-copy h3, .home-gallery h2, .field-grid figure";
    document.querySelectorAll(selectors).forEach(element => {
      if (!element.classList.contains("entered")) observer.observe(element);
    });
  };
  revealSections();
  reducedMotion.addEventListener("change", revealSections);
}

const halo = document.querySelector(".cursor-halo");
if (halo) {
  const pointerMode = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)");
  let frame = 0;
  let x = 0, y = 0, interactive = false;

  function paint() {
    frame = 0;
    halo.style.transform = `translate3d(${x}px,${y}px,0)`;
    halo.classList.toggle("over-link", interactive);
    halo.classList.add("visible");
  }
  function clear() {
    cancelAnimationFrame(frame);
    frame = 0;
    halo.classList.remove("visible", "over-link");
  }
  function follow(event) {
    if (event.pointerType !== "mouse") {
      clear();
      return;
    }
    x = event.clientX;
    y = event.clientY;
    interactive = Boolean(event.target.closest?.("a, button, summary"));
    if (!frame) frame = requestAnimationFrame(paint);
  }
  function configurePointer() {
    if (pointerMode.matches) {
      window.addEventListener("pointermove", follow, {passive: true});
      document.documentElement.addEventListener("pointerleave", clear);
      window.addEventListener("blur", clear);
    } else {
      window.removeEventListener("pointermove", follow);
      document.documentElement.removeEventListener("pointerleave", clear);
      window.removeEventListener("blur", clear);
      clear();
    }
  }
  configurePointer();
  pointerMode.addEventListener("change", configurePointer);
}

// A few mobile browsers download an embedded PDF instead of displaying it.
if (navigator.pdfViewerEnabled === false) {
  document.querySelectorAll(".document-frame object[type='application/pdf']").forEach(embed => {
    const preview = embed.querySelector(".document-fallback");
    if (preview) embed.replaceWith(preview);
  });
}

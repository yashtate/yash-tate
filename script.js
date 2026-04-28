const root = document.documentElement;
const glow = document.querySelector(".cursor-glow");
const parallaxItems = document.querySelectorAll(".hero-media, .metric, .gallery-tile");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  if (!window.location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
});

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

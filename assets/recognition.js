import { recognition, recognitionCategories } from "./recognition-data.js";
function bilingual(element, en, id) {
  for (const [language, value] of [
    ["en", en],
    ["id", id],
  ]) {
    const span = document.createElement("span");
    span.className = `lang-${language}`;
    span.textContent = value;
    element.append(span);
  }
  return element;
}
function arrow() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 20 20");
  icon.setAttribute("width", "12");
  icon.setAttribute("height", "12");
  icon.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4 16 16 4M4 4h12v12");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  icon.append(path);
  return icon;
}
export function renderRecognition() {
  const section = document.querySelector("#recognition"),
    container = document.querySelector("#recognition-cards");
  section.hidden = !recognition.length;
  container.replaceChildren();
  initPublisherMotion(container);
  for (const category of recognitionCategories) {
    const group = document.createElement("section");
    group.className = "recognition-group";
    group.setAttribute("aria-labelledby", `recognition-${category.id}`);
    const heading = bilingual(
      document.createElement("h3"),
      category.en,
      category.idLabel,
    );
    heading.id = `recognition-${category.id}`;
    heading.className = "recognition-group-heading";
    group.append(heading);
    if (category.id === "awards") {
      const note = bilingual(
        document.createElement("p"),
        "The Forbes India profile and D Globalist listing document the same DGEMS 2024 Select 200 recognition.",
        "Profil Forbes India dan daftar D Globalist mendokumentasikan pengakuan DGEMS 2024 Select 200 yang sama.",
      );
      note.className = "recognition-group-note";
      group.append(note);
    }
    const grid = document.createElement("div");
    grid.className = "recognition-grid";
    for (const entry of recognition.filter((e) => e.category === category.id)) {
      const card = document.createElement("article");
      card.className = "recognition-card";
      if (entry.recognitionId) card.dataset.recognitionId = entry.recognitionId;
      const badge = bilingual(
        document.createElement("p"),
        category.en,
        category.idLabel,
      );
      badge.className = "recognition-category";
      const publisher = document.createElement("p");
      publisher.className = "recognition-publisher";
      publisher.textContent = entry.publisher;
      const title = bilingual(
        document.createElement("h4"),
        entry.title,
        entry.titleId,
      );
      card.append(badge, publisher, title);
      if (entry.recipient) {
        const recipient = bilingual(
          document.createElement("p"),
          `Recipient: ${entry.recipient}`,
          `Penerima: ${entry.recipient}`,
        );
        recipient.className = "recognition-recipient";
        card.append(recipient);
      }
      const link = document.createElement("a");
      link.href = entry.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const en =
        entry.type === "PDF"
          ? "View profile (PDF)"
          : category.id === "press"
            ? "Read press release"
            : category.id === "awards"
              ? "View recognition"
              : "Read coverage";
      const id =
        entry.type === "PDF"
          ? "Lihat profil (PDF)"
          : category.id === "press"
            ? "Baca siaran pers"
            : category.id === "awards"
              ? "Lihat pengakuan"
              : "Baca liputan";
      bilingual(link, en, id);
      link.append(arrow());
      link.setAttribute(
        "aria-label",
        `${entry.title} — ${entry.publisher}${entry.type === "PDF" ? " (PDF)" : ""}`,
      );
      card.append(link);
      grid.append(card);
    }
    group.append(grid);
    container.append(group);
  }
}

let cleanupPublisherMotion = () => {};
function initPublisherMotion(container) {
  cleanupPublisherMotion();
  const bar = document.createElement("div");
  bar.className = "recognition-motion";
  const viewport = document.createElement("div");
  viewport.className = "recognition-marquee";
  const track = document.createElement("div");
  track.className = "recognition-marquee-track";
  track.id = "recognition-publisher-track";
  track.setAttribute("aria-hidden", "true");
  const publishers = [...new Set(recognition.map((entry) => entry.publisher))];
  for (let copy = 0; copy < 2; copy++) {
    const group = document.createElement("div");
    group.className = "recognition-marquee-group";
    for (const name of publishers) {
      const item = document.createElement("span");
      item.textContent = name;
      group.append(item);
    }
    track.append(group);
  }
  viewport.append(track);
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "recognition-motion-toggle";
  toggle.setAttribute("aria-controls", track.id);
  bar.append(viewport, toggle);
  container.before(bar);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let manuallyPaused = false,
    visible = false;
  function update() {
    const paused = manuallyPaused || motion.matches;
    bar.classList.toggle("is-reduced", motion.matches);
    bar.classList.toggle("is-running", !paused && visible && !document.hidden);
    toggle.disabled = motion.matches;
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.replaceChildren();
    bilingual(
      toggle,
      motion.matches ? "Motion off" : paused ? "Play motion" : "Pause motion",
      motion.matches
        ? "Gerakan nonaktif"
        : paused
          ? "Putar gerakan"
          : "Jeda gerakan",
    );
  }
  toggle.addEventListener("click", () => {
    manuallyPaused = !manuallyPaused;
    bar.classList.toggle("is-resuming", !manuallyPaused);
    update();
  });
  toggle.addEventListener("blur", () => bar.classList.remove("is-resuming"));
  motion.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      update();
    },
    { threshold: 0 },
  );
  observer.observe(bar);
  cleanupPublisherMotion = () => {
    observer.disconnect();
    motion.removeEventListener("change", update);
    document.removeEventListener("visibilitychange", update);
    bar.remove();
  };
  update();
}

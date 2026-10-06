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

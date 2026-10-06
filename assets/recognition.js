import { recognition } from "./recognition-data.js";
/** Pending entries are shown only by an explicit call from the local design QA preview. */
export function renderRecognition({ preview = false } = {}) {
  const section = document.querySelector("#recognition");
  const grid = document.querySelector("#recognition-cards");
  const entries = recognition.filter(
    (item) =>
      preview ||
      (item.status === "provided" && item.source?.url) ||
      (item.status === "verified" && item.source?.url && item.source?.quote),
  );
  section.hidden = !entries.length;
  grid.replaceChildren();
  for (const entry of entries) {
    const card = document.createElement("article");
    card.className = "recognition-card";
    const category = document.createElement("p");
    category.className = "recognition-category";
    for (const [language, value] of [
      ["en", entry.category],
      ["id", entry.categoryId || entry.category],
    ]) {
      const label = document.createElement("span");
      label.className = `lang-${language}`;
      label.textContent = value;
      category.append(label);
    }
    const name = document.createElement("h3");
    name.textContent = entry.name;
    const title = document.createElement("p");
    title.className = "recognition-title";
    for (const [language, value] of [
      ["en", entry.title],
      ["id", entry.titleId],
    ]) {
      const span = document.createElement("span");
      span.className = `lang-${language}`;
      span.textContent = value;
      title.append(span);
    }
    card.append(category, name, title);
    if (entry.status === "verified" || entry.status === "provided") {
      const link = document.createElement("a");
      link.href = entry.source.url;
      link.target = "_blank";
      link.rel = "noopener";
      for (const [language, value] of [
        [
          "en",
          entry.status === "provided" ? "Read the article" : "Read the source",
        ],
        ["id", entry.status === "provided" ? "Baca artikel" : "Baca sumber"],
      ]) {
        const label = document.createElement("span");
        label.className = `lang-${language}`;
        label.textContent = value;
        link.append(label);
      }
      const icon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      icon.setAttribute("viewBox", "0 0 20 20");
      icon.setAttribute("width", "12");
      icon.setAttribute("height", "12");
      icon.setAttribute("aria-hidden", "true");
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute("d", "M4 16 16 4M4 4h12v12");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.5");
      icon.append(path);
      link.append(icon);
      card.append(link);
    } else {
      const note = document.createElement("small");
      note.textContent = "Design preview · claim awaiting verification";
      card.append(note);
    }
    grid.append(card);
  }
}

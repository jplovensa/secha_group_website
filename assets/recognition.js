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
    category.textContent = entry.category;
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
      link.textContent =
        entry.status === "provided"
          ? "Read the article ↗"
          : "Read the source ↗";
      card.append(link);
    } else {
      const note = document.createElement("small");
      note.textContent = "Design preview · claim awaiting verification";
      card.append(note);
    }
    grid.append(card);
  }
}

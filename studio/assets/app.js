import { initOpening } from "../../assets/opening.js";

import { initShowroom } from "./showroom.js";
import { initModal } from "./modal.js";
import { initBrief } from "./brief.js";
const modal = initModal();
let realScenes,
  cameraIndex = 0,
  currentMaterial;
const scenes = {
  camera(index) {
    cameraIndex = index;
    realScenes?.camera(index);
  },
  material(value) {
    currentMaterial = value;
    realScenes?.material(value);
  },
};
let loadingScenes = false;
async function loadScenes() {
  if (loadingScenes || !document.querySelector("#opening").hidden) return;
  loadingScenes = true;
  try {
    const module = await import("./scenes.js");
    realScenes = module.initScenes();
    realScenes.camera(cameraIndex);
    if (currentMaterial) realScenes.material(currentMaterial);
  } catch {
    document
      .querySelectorAll("#moodboard-canvas,#vignette-canvas")
      .forEach((e) => {
        e.textContent =
          "Preview unavailable. You can still choose your materials.";
      });
  }
}
const observer = new IntersectionObserver(
  (entries) => {
    if (entries.some((e) => e.isIntersecting)) loadScenes();
  },
  { rootMargin: "100px" },
);
observer.observe(document.querySelector("#moodboards"));
observer.observe(document.querySelector("#finishing-studio"));
document.addEventListener("secha:introclosed", () => {
  if (
    ["#moodboards", "#finishing-studio"].some((selector) => {
      const r = document.querySelector(selector).getBoundingClientRect();
      return r.top < innerHeight + 100 && r.bottom > -100;
    })
  )
    loadScenes();
});
const showroom = initShowroom(scenes, modal.openModal);
const brief = initBrief(showroom.getSelections);
const actions = { ...modal, ...showroom, ...brief };
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;
  const action = actions[trigger.dataset.action];
  if (typeof action !== "function") return;
  const args = trigger.dataset.args
    ? trigger.dataset.args
        .split("|")
        .map((v) => (/^\d+$/.test(v) ? Number(v) : v))
    : [];
  action(...args);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") showroom.closeCart();
  const target = event.target.closest('[role="button"][data-action]');
  if (target && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    target.click();
  }
});

document.querySelector("#studio-year").textContent = new Date().getFullYear();
initOpening();

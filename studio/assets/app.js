import { initScenes } from "./scenes.js";
import { initShowroom } from "./showroom.js";
import { initModal } from "./modal.js";
import { initBrief } from "./brief.js";
const modal = initModal();
const scenes = initScenes();
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

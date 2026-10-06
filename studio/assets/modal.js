import { MODAL_DATA } from "./content.js";
export function initModal() {
  const modal = document.querySelector("#global-modal");
  let previousFocus;
  let locked = [];
  function closeModal() {
    if (modal.inert) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.inert = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    locked.forEach((e) => (e.inert = false));
    previousFocus?.focus();
  }
  function openModal(value) {
    const data = typeof value === "string" ? MODAL_DATA[value] : value;
    if (!data) return;
    previousFocus = document.activeElement;
    document.querySelector("#modal-subtitle").textContent = data.subtitle;
    document.querySelector("#modal-title").textContent = data.title;
    document.querySelector("#modal-body").innerHTML = data.body;
    modal.inert = false;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
    locked = [...document.body.children].filter(
      (e) => e !== modal && e.tagName !== "SCRIPT" && !e.inert,
    );
    locked.forEach((e) => (e.inert = true));
    modal.querySelector("button").focus();
  }
  document.addEventListener("keydown", (event) => {
    if (modal.inert) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "Tab") {
      const items = [...modal.querySelectorAll("button,a,input")].filter(
        (e) => e.getClientRects().length,
      );
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
        event.preventDefault();
        items[0].focus();
      }
    }
  });
  return { openModal, closeModal };
}

import { PRICING_MATRIX } from "./data.js";
export const BRIEF_CHOICES = {
  purpose: ["My home", "Investment property"],
  style: ["Cozy & Functional", "Modern & Minimal", "Bold & Expressive"],
  size: ["Small", "Medium", "Large"],
  tier: ["Lite", "Pro", "Premium"],
};
const STEP_KEYS = ["purpose", "style", "size", "tier"];
export function estimate(size, tier) {
  return PRICING_MATRIX[size]?.[tier] ?? null;
}
export function canReview(state) {
  return STEP_KEYS.every((key) => BRIEF_CHOICES[key].includes(state[key]));
}
export function enquiryUrl(state, selections = "") {
  const text = `Hello SECHA Studio+, I'd like to discuss an interior design project.\nPurpose: ${state.purpose || "To discuss"}\nDesign direction: ${state.style || state.feeling || "To discuss"}\nDaily rhythm: ${state.rhythm || "To discuss"}\nRoom: ${state.size}\nPackage: ${state.tier}\nListed design estimate: ${estimate(state.size, state.tier)}\nMaterial shortlist: ${selections || "To discuss"}\nPlease confirm scope, availability, and final pricing.`;
  return `https://wa.me/6282174072041?text=${encodeURIComponent(text)}`;
}
export function initBrief(getSelections) {
  const initial = () => ({
    step: 1,
    purpose: "",
    style: "",
    size: "Small",
    tier: "Pro",
  });
  let state = initial();
  const container = document.querySelector("#onboarding-container");
  const indicator = document.querySelector("#onboarding-indicator");
  const choice = (key, value, label = value) =>
    `<button type="button" data-action="handleOnboardSelect" data-args="${key}|${value}" aria-pressed="${state[key] === value}" class="studio-choice p-6 border text-left font-medium text-sm ${state[key] === value ? "border-white bg-white text-black" : "border-zinc-600 text-zinc-300 hover:border-white"}">${label.replaceAll("&", "&amp;")}</button>`;
  const button = (step, label) =>
    `<button type="button" data-action="nextOnboardStep" data-args="${step}" class="px-5 py-3 border border-zinc-600 text-xs font-medium">${label}</button>`;
  function render(focus = false) {
    const names = [
      "Your purpose",
      "Your direction",
      "Your room",
      "Your package",
      "Your brief",
    ];
    indicator.textContent = `${String(state.step).padStart(2, "0")} / 05 — ${names[state.step - 1]}`;
    let html = "";
    if (state.step === 1)
      html = `<h2 class="mb-6">What are you designing for?</h2><div class="grid gap-3">${BRIEF_CHOICES.purpose.map((v) => choice("purpose", v)).join("")}</div>`;
    if (state.step === 2)
      html = `<h2 class="mb-6">How should your space feel?</h2><div class="grid gap-3">${BRIEF_CHOICES.style.map((v) => choice("style", v)).join("")}</div><div class="mt-6">${button(1, "Back")}</div>`;
    if (state.step === 3)
      html = `<h2 class="mb-6">How large is your room?</h2><p class="text-zinc-400 text-sm mb-5">Choose the closest size. For larger or multiple rooms, discuss a tailored scope with the studio.</p><div class="grid gap-3">${BRIEF_CHOICES.size.map((v) => choice("size", v, `${v} (${v === "Small" ? "≤ 10" : v === "Medium" ? "11–18" : "19–30"} m²)`)).join("")}</div><div class="mt-6 flex gap-3">${button(2, "Back")}${button(4, "Continue")}</div>`;
    if (state.step === 4)
      html = `<h2 class="mb-6">Choose your design scope.</h2><div class="grid gap-3">${BRIEF_CHOICES.tier.map((v) => choice("tier", v)).join("")}</div><p class="text-2xl font-medium mt-6" aria-live="polite">${estimate(state.size, state.tier)}</p><p class="text-xs text-zinc-400 mt-2">${state.size} room / Design estimate, subject to final scope.</p><div class="flex gap-3 mt-6">${button(3, "Back")}${button(5, "Review my brief")}</div>`;
    if (state.step === 5)
      html = `<h2 class="mb-6">A clear first conversation.</h2><dl class="grid gap-4 border border-zinc-600 p-5"><div><dt class="text-zinc-400 text-xs">PURPOSE / DIRECTION</dt><dd id="brief-direction"></dd></div><div><dt class="text-zinc-400 text-xs">ROOM / PACKAGE</dt><dd>${state.size} / ${state.tier}</dd></div><div><dt class="text-zinc-400 text-xs">DESIGN ESTIMATE</dt><dd>${estimate(state.size, state.tier)}</dd></div><div><dt class="text-zinc-400 text-xs">MATERIAL SHORTLIST</dt><dd id="brief-materials"></dd></div></dl><p class="text-zinc-400 text-xs my-5">WhatsApp opens with your brief ready to review. You choose when to send it. Final scope, availability, and fees are agreed directly with the studio.</p><a id="studio-enquiry" target="_blank" rel="noopener" class="inline-flex px-5 py-4 bg-white text-black font-medium text-xs">Discuss my project on WhatsApp</a><div class="flex gap-3 mt-5">${button(4, "Back")}<button type="button" data-action="resetBrief" class="px-5 py-3 border border-zinc-600 text-xs">Start again</button></div>`;
    container.innerHTML = html;
    if (state.step === 5) {
      document.querySelector("#brief-direction").textContent =
        `${state.purpose} / ${state.style}`;
      document.querySelector("#brief-materials").textContent =
        getSelections() || "To discuss";
      document.querySelector("#studio-enquiry").href = enquiryUrl(
        state,
        getSelections(),
      );
    }
    const heading = container.querySelector("h2");
    heading.tabIndex = -1;
    if (focus) heading.focus({ preventScroll: true });
  }
  function handleOnboardSelect(key, value) {
    if (!BRIEF_CHOICES[key]?.includes(value)) return;
    state[key] = value;
    if (key === "purpose") state.step = 2;
    if (key === "style") state.step = 3;
    render(key === "purpose" || key === "style");
  }
  function nextOnboardStep(value) {
    const step = Number(value);
    if (!Number.isInteger(step) || step < 1 || step > 5) return;
    for (let i = 0; i < Math.min(step - 1, 4); i++) {
      if (!BRIEF_CHOICES[STEP_KEYS[i]].includes(state[STEP_KEYS[i]])) {
        state.step = i + 1;
        render(true);
        return;
      }
    }
    state.step = step;
    render(true);
  }
  function scrollToBrief() {
    document.querySelector("#onboarding").scrollIntoView({ behavior: "auto" });
  }
  function selectTier(tier) {
    if (!BRIEF_CHOICES.tier.includes(tier)) return;
    state.tier = tier;
    state.step = canReview(state) ? 4 : 1;
    render(true);
    scrollToBrief();
  }
  function beginBrief(purpose) {
    if (!BRIEF_CHOICES.purpose.includes(purpose)) return;
    state.purpose = purpose;
    state.step = 2;
    render(true);
    scrollToBrief();
  }
  function resetBrief() {
    state = initial();
    render(true);
  }
  document.addEventListener("studio:selectionschange", () => {
    if (state.step === 5) render();
  });
  render();
  return {
    handleOnboardSelect,
    nextOnboardStep,
    selectTier,
    beginBrief,
    resetBrief,
  };
}

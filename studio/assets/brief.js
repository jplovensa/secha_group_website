import { PRICING_MATRIX } from "./data.js";
export function estimate(size, tier) {
  return PRICING_MATRIX[size]?.[tier] ?? null;
}
export function enquiryUrl(state, selections = "") {
  const text = `Hello SECHA Studio+, I'd like to discuss an interior design project.\nFeeling: ${state.feeling || "To discuss"}\nDaily rhythm: ${state.rhythm || "To discuss"}\nRoom: ${state.size}\nPackage: ${state.tier}\nListed design estimate: ${estimate(state.size, state.tier)}\nMaterial shortlist: ${selections || "To discuss"}\nPlease confirm scope, availability, and final pricing.`;
  return `https://wa.me/6282174072041?text=${encodeURIComponent(text)}`;
}
export function initBrief(getSelections) {
  const state = {
    step: 1,
    feeling: "",
    rhythm: "",
    size: "Small",
    tier: "Pro",
  };
  const container = document.querySelector("#onboarding-container");
  const indicator = document.querySelector("#onboarding-indicator");
  const choice = (key, value, label = value) =>
    `<button type="button" data-action="handleOnboardSelect" data-args="${key}|${value}" aria-pressed="${state[key] === value}" class="studio-choice p-6 border text-left uppercase font-bold text-sm ${state[key] === value ? "border-white bg-white text-black" : "border-zinc-700 text-zinc-300 hover:border-white"}">${label}</button>`;
  const button = (step, label) =>
    `<button type="button" data-action="nextOnboardStep" data-args="${step}" class="px-6 py-4 border border-zinc-600 text-sm uppercase font-bold">${label}</button>`;
  function render(focus = false) {
    indicator.textContent = `Your design brief / Step ${state.step} of 5`;
    let html = "";
    if (state.step === 1)
      html = `<h2 class="font-bold mb-8">How should your home feel?</h2><div class="grid gap-4">${["A Deep, Calming Breath", "An Embrace of Warmth", "A Surge of Inspiration"].map((v) => choice("feeling", v)).join("")}</div>`;
    if (state.step === 2)
      html = `<h2 class="font-bold mb-8">What is your daily rhythm?</h2><div class="grid gap-4">${["Quiet Stillness & Natural Light", "Connection and Gathering", "Movement, Coffee, and Flow"].map((v) => choice("rhythm", v)).join("")}</div><div class="mt-8">${button(1, "Back")}</div>`;
    if (state.step === 3) {
      const warm =
        state.feeling.includes("Warmth") || state.rhythm.includes("Connection");
      html = `<p class="text-zinc-400 mb-4">A suggested design direction</p><h2 class="font-bold mb-6">${warm ? "Audina — The Soul of Space" : "Daffa — The Architect of Form"}</h2><p class="text-zinc-400 mb-8">Based on your preferences. Designer availability and your final match are confirmed in consultation.</p><div class="flex gap-4">${button(2, "Back")}${button(4, "Build my brief")}</div>`;
    }
    if (state.step === 4)
      html = `<h2 class="font-bold mb-8">Define your room and design package.</h2><p class="text-zinc-400 mb-3">Room size</p><div class="grid md:grid-cols-3 gap-4">${["Small", "Medium", "Large"].map((v) => choice("size", v, `${v} (${v === "Small" ? "≤10" : v === "Medium" ? "11–18" : "19–30"} m²)`)).join("")}</div><p class="text-zinc-400 mt-8 mb-3">Design package</p><div class="grid md:grid-cols-3 gap-4">${["Lite", "Pro", "Premium"].map((v) => choice("tier", v)).join("")}</div><p class="text-3xl font-bold mt-8" aria-live="polite">${estimate(state.size, state.tier)}</p><p class="text-xs text-zinc-400 mt-3">Listed design estimate. Scope and final fees are confirmed with the studio.</p><div class="flex flex-wrap gap-4 mt-8">${button(3, "Back")}${button(5, "Review brief")}</div>`;
    if (state.step === 5)
      html = `<h2 class="font-bold mb-8">Your next chapter starts here.</h2><dl class="grid gap-5 border border-zinc-700 p-6"><div><dt class="text-zinc-400 text-xs">ROOM / PACKAGE</dt><dd>${state.size} / ${state.tier}</dd></div><div><dt class="text-zinc-400 text-xs">DESIGN ESTIMATE</dt><dd>${estimate(state.size, state.tier)}</dd></div><div><dt class="text-zinc-400 text-xs">MATERIAL SHORTLIST</dt><dd id="brief-materials"></dd></div></dl><p class="text-zinc-400 text-sm my-6">Open WhatsApp to send your brief to the studio. No payment is taken, no booking is confirmed, and your message is sent only when you choose Send in WhatsApp.</p><a id="studio-enquiry" target="_blank" rel="noopener" class="inline-flex px-6 py-4 bg-white text-black font-bold text-sm">Discuss my project on WhatsApp</a><div class="flex gap-4 mt-6">${button(4, "Back")}${button(1, "Start again")}</div>`;
    container.innerHTML = html;
    if (state.step === 5) {
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
    const allowed = {
      feeling: [
        "A Deep, Calming Breath",
        "An Embrace of Warmth",
        "A Surge of Inspiration",
      ],
      rhythm: [
        "Quiet Stillness & Natural Light",
        "Connection and Gathering",
        "Movement, Coffee, and Flow",
      ],
      size: ["Small", "Medium", "Large"],
      tier: ["Lite", "Pro", "Premium"],
    };
    if (!allowed[key]?.includes(value)) return;
    state[key] = value;
    if (key === "feeling") state.step = 2;
    if (key === "rhythm") state.step = 3;
    render(key === "feeling" || key === "rhythm");
  }
  function nextOnboardStep(value) {
    const step = Number(value);
    if (!Number.isInteger(step) || step < 1 || step > 5) return;
    if (step === 1) {
      state.feeling = "";
      state.rhythm = "";
    }
    state.step = step;
    render(true);
  }
  function selectTier(tier) {
    if (!["Lite", "Pro", "Premium"].includes(tier)) return;
    state.tier = tier;
    state.step = 4;
    render(true);
    document.querySelector("#onboarding").scrollIntoView({ behavior: "auto" });
  }
  render();
  return { handleOnboardSelect, nextOnboardStep, selectTier };
}

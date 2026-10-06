import { calculateLoan, fundingPlan } from "./loan-model.js";
const copy = {
  en: {
    title: "Build your renovation plan.",
    eyebrow: "RENOVATION QUEST",
    steps: ["Choose your goal", "Balance the budget", "Explore repayments"],
    goal: "What would you like to improve?",
    goals: [
      "Kitchen refresh",
      "Cozy living space",
      "Bathroom upgrade",
      "Whole-home plan",
    ],
    budget: "Renovation budget",
    own: "Your own funds",
    loan: "Illustrative loan amount",
    month: "Repayment term",
    rate: "Example annual interest (% p.a.)",
    fees: "Bank/admin fee (%)",
    service: "SECHA service fee (2%)",
    admin: "Bank/admin fee",
    monthly: "monthly equivalent",
    method: "Interest calculation",
    flat: "Flat interest",
    reducing: "Reducing balance",
    assumptions:
      "Editable example assumptions — not Amar Bank rates or an offer.",
    next: "Continue",
    back: "Back",
    review: "Review my plan",
    payment: "Estimated monthly payment",
    interest: "Estimated total interest",
    total: "Total repayment + upfront fees",
    gap: "Remaining budget gap",
    surplus: "Funding above your budget",
    covered: "Budget covered by your plan",
    complete: "Your plan is mapped.",
    ready: "A planning milestone, not a loan approval.",
    continue: "Explore the bank application",
    restart: "Start a new plan",
    disclaimer:
      "Illustration only. Loan eligibility, actual interest, fees, available terms, and approval are determined by Amar Bank. Calculator range: IDR 20–500 million. SECHA service fee: 2% one-time; bank/admin fee: adjustable, initially 0%. Fees are assumed paid upfront, not financed. Insurance is excluded; insurance and early repayment terms are subject to the financing partner.",
    error: "Please enter valid amounts and assumptions.",
    goalRequired: "Choose a renovation goal to continue.",
    months: "months",
    milestone: "Planning checkpoint",
    noLoan:
      "Your own funds cover this plan. You can continue without borrowing.",
    note: "Try a shorter term or a smaller loan to compare the total cost.",
  },
  id: {
    title: "Susun rencana renovasi Anda.",
    eyebrow: "MISI RENOVASI",
    steps: ["Pilih tujuan", "Seimbangkan anggaran", "Jelajahi cicilan"],
    goal: "Apa yang ingin Anda tingkatkan?",
    goals: [
      "Pembaruan dapur",
      "Ruang keluarga nyaman",
      "Peningkatan kamar mandi",
      "Rencana seluruh rumah",
    ],
    budget: "Anggaran renovasi",
    own: "Dana pribadi Anda",
    loan: "Jumlah pinjaman ilustratif",
    month: "Jangka waktu",
    rate: "Contoh bunga tahunan (% p.a.)",
    fees: "Biaya bank/admin (%)",
    service: "Biaya layanan SECHA (2%)",
    admin: "Biaya bank/admin",
    monthly: "setara bulanan",
    method: "Perhitungan bunga",
    flat: "Bunga flat",
    reducing: "Saldo menurun",
    assumptions:
      "Asumsi contoh dapat diubah — bukan bunga atau penawaran Amar Bank.",
    next: "Lanjut",
    back: "Kembali",
    review: "Tinjau rencana",
    payment: "Perkiraan cicilan bulanan",
    interest: "Perkiraan total bunga",
    total: "Total pembayaran + biaya di muka",
    gap: "Kekurangan anggaran",
    surplus: "Pendanaan melebihi anggaran",
    covered: "Anggaran tercakup dalam rencana",
    complete: "Rencana Anda telah dipetakan.",
    ready: "Tahap perencanaan, bukan persetujuan pinjaman.",
    continue: "Jelajahi pengajuan bank",
    restart: "Buat rencana baru",
    disclaimer:
      "Hanya ilustrasi. Kelayakan, bunga aktual, biaya, pilihan jangka waktu, dan persetujuan ditentukan Amar Bank. Rentang kalkulator: Rp20–500 juta. Biaya layanan SECHA: 2% sekali bayar; biaya bank/admin dapat diubah, awalnya 0%. Biaya diasumsikan dibayar di muka, bukan dibiayai. Asuransi tidak termasuk; ketentuan asuransi dan pelunasan awal mengikuti mitra pembiayaan.",
    error: "Masukkan jumlah dan asumsi yang valid.",
    goalRequired: "Pilih tujuan renovasi untuk melanjutkan.",
    months: "bulan",
    milestone: "Tahap perencanaan",
    noLoan:
      "Dana pribadi Anda mencakup rencana ini. Anda dapat melanjutkan tanpa pinjaman.",
    note: "Coba jangka waktu lebih pendek atau pinjaman lebih kecil untuk membandingkan total biaya.",
  },
};
export function initSimulator(onContinue) {
  const modal = document.querySelector("#loan-simulator");
  const body = modal.querySelector("#simulator-content");
  const progress = modal.querySelector("#simulator-progress");
  const title = modal.querySelector("#simulator-title");
  const status = modal.querySelector("#simulator-status");
  let state,
    previousFocus,
    locked = [];
  const language = () => (document.documentElement.lang === "id" ? "id" : "en");
  const money = (value) =>
    new Intl.NumberFormat(language() === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  const t = () => copy[language()];
  function reset() {
    state = {
      step: 1,
      goal: null,
      budget: 30000000,
      ownFunds: 10000000,
      principal: 20000000,
      months: 12,
      annualRate: 12,
      adminRate: 0,
      method: "reducing",
    };
  }
  function close() {
    modal.hidden = true;
    modal.inert = true;
    document.body.classList.remove("modal-open");
    locked.forEach(({ element, inert }) => (element.inert = inert));
    previousFocus?.focus({ preventScroll: true });
  }
  function open(trigger) {
    reset();
    previousFocus = trigger;
    locked = [...document.body.children]
      .filter((e) => e !== modal && e.tagName !== "SCRIPT")
      .map((element) => ({ element, inert: element.inert }));
    locked.forEach(({ element }) => (element.inert = true));
    modal.hidden = false;
    modal.inert = false;
    document.body.classList.add("modal-open");
    render();
    modal.querySelector("[data-close-simulator]").focus();
  }
  const input = (key, label, min, max, step) =>
    `<label class="sim-field" for="sim-${key}"><span>${label}</span><input id="sim-${key}" data-sim-field="${key}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${state[key]}"></label>`;
  function summary() {
    const c = t(),
      serviceFee = state.principal * 0.02,
      adminFee = (state.principal * state.adminRate) / 100,
      loan = calculateLoan({
        ...state,
        monthlyRate: state.annualRate / 12,
        fees: serviceFee + adminFee,
      }),
      plan = fundingPlan(state.budget, state.ownFunds, state.principal);
    return `<div class="sim-result"><span>${c.payment}</span><strong id="sim-payment">${money(loan.payment)}</strong><p>${state.months} ${c.months} / ${state.annualRate}% p.a. / ${Number((state.annualRate / 12).toFixed(3))}% ${c.monthly}<br>${state.method === "flat" ? c.flat : c.reducing}</p></div><dl class="sim-breakdown"><div><dt>${c.interest}</dt><dd>${money(loan.interest)}</dd></div><div><dt>${c.service}</dt><dd>${money(serviceFee)}</dd></div><div><dt>${c.admin}</dt><dd>${money(adminFee)}</dd></div><div><dt>${c.total}</dt><dd>${money(loan.total)}</dd></div><div><dt>${plan.gap ? c.gap : plan.surplus ? c.surplus : c.covered}</dt><dd>${plan.gap || plan.surplus ? money(plan.gap || plan.surplus) : "100%"}</dd></div></dl><p class="sim-tip">${state.principal === 0 ? c.noLoan : c.note}</p>`;
  }
  function render(focus = false) {
    const c = t();
    title.textContent = c.title;
    modal.querySelector("#simulator-eyebrow").textContent = c.eyebrow;
    modal
      .querySelector("[data-close-simulator]")
      .setAttribute(
        "aria-label",
        language() === "id" ? "Tutup simulasi" : "Close simulation",
      );
    progress.innerHTML = c.steps
      .map(
        (label, i) =>
          `<li class="${state.step > i + 1 ? "is-complete" : state.step === i + 1 ? "is-current" : ""}" ${state.step === i + 1 ? 'aria-current="step"' : ""}><span>${i + 1}</span>${label}</li>`,
      )
      .join("");
    status.textContent = "";
    let html = "";
    if (state.step === 1)
      html = `<p class="sim-step-label">01 / ${c.milestone}</p><h3 tabindex="-1">${c.goal}</h3><div class="sim-goals">${c.goals.map((goal, i) => `<button data-goal="${i}" aria-pressed="${state.goal === i}">${goal}</button>`).join("")}</div><button class="solid-link" data-sim-next>${c.next}</button>`;
    if (state.step === 2) {
      const plan = fundingPlan(state.budget, state.ownFunds, state.principal);
      html = `<p class="sim-step-label">02 / ${c.milestone}</p><h3 tabindex="-1">${c.steps[1]}</h3><div class="sim-fields">${input("budget", c.budget, 1000000, 1000000000, 1000000)}${input("ownFunds", c.own, 0, 1000000000, 500000)}${input("principal", c.loan, 20000000, 500000000, 500000)}</div><div class="sim-coverage"><label for="sim-coverage">${c.covered}</label><progress id="sim-coverage" max="100" value="${Math.round(plan.coverage * 100)}"></progress><p id="sim-gap">${plan.gap ? `${c.gap}: ${money(plan.gap)}` : plan.surplus ? `${c.surplus}: ${money(plan.surplus)}` : c.covered + " / 100%"}</p></div><div class="sim-actions"><button class="outline-link" data-sim-back>${c.back}</button><button class="solid-link" data-sim-next>${c.next}</button></div>`;
    }
    if (state.step === 3)
      html = `<p class="sim-step-label">03 / ${c.milestone}</p><h3 tabindex="-1">${c.steps[2]}</h3><label class="sim-field" for="sim-months"><span>${c.month}</span><select id="sim-months" data-sim-field="months">${[6, 12, 18, 24, 36].map((m) => `<option value="${m}" ${state.months === m ? "selected" : ""}>${m} ${c.months}</option>`).join("")}</select></label><details class="sim-assumptions"><summary>${c.assumptions}</summary><div class="sim-fields">${input("annualRate", c.rate, 0, 120, 0.01)}${input("adminRate", c.fees, 0, 100, 0.01)}<label class="sim-field" for="sim-method"><span>${c.method}</span><select id="sim-method" data-sim-field="method"><option value="flat" ${state.method === "flat" ? "selected" : ""}>${c.flat}</option><option value="reducing" ${state.method === "reducing" ? "selected" : ""}>${c.reducing}</option></select></label></div></details><div id="sim-summary" aria-live="polite">${summary()}</div><div class="sim-actions"><button class="outline-link" data-sim-back>${c.back}</button><button class="solid-link" data-sim-next>${c.review}</button></div>`;
    if (state.step === 4)
      html = `<p class="sim-step-label">${c.milestone} / 03 OF 03</p><h3 tabindex="-1">${c.complete}</h3><p class="sim-context">${c.goals[state.goal]} / ${c.ready}</p>${summary()}<div class="sim-actions"><button class="outline-link" data-sim-back>${c.back}</button><button class="solid-link" data-sim-continue>${c.continue}</button></div><button class="text-button sim-restart" data-sim-reset>${c.restart}</button>`;
    body.innerHTML = html;
    modal.querySelector("#simulator-disclaimer").textContent = c.disclaimer;
    if (focus) body.querySelector("h3").focus({ preventScroll: true });
  }
  function valid() {
    const inputs = [...body.querySelectorAll("input,select")];
    let okay = true;
    for (const field of inputs) {
      const good = field.checkValidity() && field.value !== "";
      field.setAttribute("aria-invalid", String(!good));
      if (!good) {
        okay = false;
      }
    }
    if (!okay) {
      status.textContent = t().error;
      const invalid = inputs.find((e) => e.getAttribute("aria-invalid") === "true");
      const details = invalid?.closest("details");
      if (details) details.open = true;
      invalid?.focus();
    }
    return okay;
  }
  body.addEventListener("input", (event) => {
    const field = event.target.closest("[data-sim-field]");
    if (!field) return;
    if (!field.checkValidity() || field.value === "") {
      field.setAttribute("aria-invalid", "true");
      return;
    }
    field.removeAttribute("aria-invalid");
    status.textContent = "";
    const key = field.dataset.simField;
    state[key] = key === "method" ? field.value : Number(field.value);
    if (state.step === 2) {
      const plan = fundingPlan(state.budget, state.ownFunds, state.principal);
      body.querySelector("progress").value = Math.round(plan.coverage * 100);
      body.querySelector("#sim-gap").textContent = plan.gap
        ? `${t().gap}: ${money(plan.gap)}`
        : plan.surplus
          ? `${t().surplus}: ${money(plan.surplus)}`
          : t().covered + " / 100%";
    }
    if (state.step === 3)
      body.querySelector("#sim-summary").innerHTML = summary();
  });
  body.addEventListener("click", (event) => {
    const goal = event.target.closest("[data-goal]");
    if (goal) {
      state.goal = Number(goal.dataset.goal);
      body
        .querySelectorAll("[data-goal]")
        .forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(Number(b.dataset.goal) === state.goal),
          ),
        );
      status.textContent = "";
    }
    if (event.target.closest("[data-sim-next]")) {
      if (state.step === 1 && state.goal === null) {
        status.textContent = t().goalRequired;
        return;
      }
      if (valid()) {
        state.step++;
        render(true);
      }
    }
    if (event.target.closest("[data-sim-back]")) {
      state.step--;
      render(true);
    }
    if (event.target.closest("[data-sim-reset]")) {
      reset();
      render(true);
    }
    if (event.target.closest("[data-sim-continue]")) {
      const trigger = previousFocus;
      close();
      onContinue(trigger);
    }
  });
  document.querySelectorAll("[data-open-simulator]").forEach((trigger) =>
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("#menu-toggle")?.getAttribute("aria-expanded") ===
        "true" && document.querySelector("#menu-toggle").click();
      open(trigger);
    }),
  );
  modal
    .querySelectorAll("[data-close-simulator]")
    .forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "Tab") {
      const items = [
        ...modal.querySelectorAll("button,input,select,summary"),
      ].filter((e) => e.getClientRects().length);
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items.at(-1).focus();
      }
      if (!event.shiftKey && document.activeElement === items.at(-1)) {
        event.preventDefault();
        items[0].focus();
      }
    }
  });
  return {
    refresh() {
      if (!modal.hidden) render();
    },
  };
}

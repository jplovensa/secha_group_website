import {
  questions,
  styleProfile,
  styleLeadPayload,
} from "./style-dna-model.js";
import { styleLeadEndpoint } from "./lead-config.js";
const copy = {
  en: {
    title: "Discover your Style DNA.",
    eyebrow: "SECHA STYLE DNA",
    question: "Question",
    of: "of",
    next: "Next question",
    result: "Reveal my style",
    back: "Back",
    close: "Close Style DNA",
    pick: "Choose the option that feels most like you.",
    balanced: "Balanced preference · your first choice sets the direction",
    resultTitle: "A home that feels like you.",
    recommendations: "Your furniture starting points",
    note: "A playful guide to your design preferences, not a psychological assessment. Mixed answers are shown as balanced; the first answer in each pair sets the signature.",
    leadTitle: "Bring your style to life.",
    leadCopy:
      "Share your details and ask SECHA to help turn this direction into a furniture plan.",
    name: "Full name",
    phone: "Phone number",
    location: "Project location",
    consent:
      "I agree that SECHA may use these details and my quiz preferences to contact me about my furniture project.",
    submit: "Send my style brief",
    sending: "Sending your brief…",
    sent: "Your brief was received.",
    sentCopy: "Thank you. SECHA has your style signature and contact details.",
    error:
      "Receipt could not be confirmed. Your details are still here so you can retry.",
    invalid:
      "Please complete your name, a valid phone number, project location, and contact consent.",
    unavailable:
      "Online lead submission is not available yet. You can keep exploring your style or contact SECHA directly.",
    privacy:
      "Details are sent only when you submit with consent. They are cleared from this page when you close the quiz.",
    restart: "Retake the quiz",
    contact: "Contact SECHA",
    selected: "Your choice",
  },
  id: {
    title: "Temukan Style DNA Anda.",
    eyebrow: "SECHA STYLE DNA",
    question: "Pertanyaan",
    of: "dari",
    next: "Pertanyaan berikutnya",
    result: "Lihat gaya saya",
    back: "Kembali",
    close: "Tutup Style DNA",
    pick: "Pilih yang paling sesuai dengan diri Anda.",
    balanced: "Preferensi seimbang · pilihan pertama menentukan arah",
    resultTitle: "Rumah yang terasa seperti Anda.",
    recommendations: "Titik awal furnitur Anda",
    note: "Panduan preferensi desain yang menyenangkan, bukan penilaian psikologis. Jawaban berbeda ditandai seimbang; jawaban pertama dalam setiap pasangan menentukan gaya.",
    leadTitle: "Wujudkan gaya Anda.",
    leadCopy:
      "Bagikan data Anda dan minta SECHA mengubah arah ini menjadi rencana furnitur.",
    name: "Nama lengkap",
    phone: "Nomor telepon",
    location: "Lokasi proyek",
    consent:
      "Saya setuju SECHA menggunakan data dan preferensi kuis ini untuk menghubungi saya terkait proyek furnitur.",
    submit: "Kirim brief gaya saya",
    sending: "Mengirim brief Anda…",
    sent: "Brief Anda telah diterima.",
    sentCopy: "Terima kasih. SECHA telah menerima gaya dan data kontak Anda.",
    error:
      "Penerimaan brief belum dapat dikonfirmasi. Data masih tersedia untuk dicoba kembali.",
    invalid:
      "Lengkapi nama, nomor telepon yang valid, lokasi proyek, dan persetujuan kontak.",
    unavailable:
      "Pengiriman lead online belum tersedia. Anda dapat menjelajahi gaya atau menghubungi SECHA langsung.",
    privacy:
      "Data dikirim hanya saat Anda mengirim dengan persetujuan. Data dihapus dari halaman saat kuis ditutup.",
    restart: "Ulangi kuis",
    contact: "Hubungi SECHA",
    selected: "Pilihan Anda",
  },
};
export function initStyleDNA() {
  const dialog = document.querySelector("#style-dna-modal"),
    body = dialog.querySelector("#dna-body"),
    progress = dialog.querySelector("#dna-progress"),
    status = dialog.querySelector("#dna-status");
  let answers = Array(questions.length).fill(null),
    step = 0,
    previousFocus,
    controller,
    sending = false,
    requestVersion = 0,
    sent = false,
    contacts = { name: "", phone: "", location: "", consent: false };
  const lang = () => (document.documentElement.lang === "id" ? "id" : "en"),
    t = () => copy[lang()];
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function reset() {
    answers = Array(questions.length).fill(null);
    step = 0;
    contacts = { name: "", phone: "", location: "", consent: false };
    sent = false;
    status.textContent = "";
  }
  function render(focus = false) {
    const c = t();
    dialog.querySelector("#dna-title").textContent = c.title;
    dialog
      .querySelector("[data-close-dna]")
      .setAttribute("aria-label", c.close);
    progress.value = Math.min(step, questions.length);
    progress.setAttribute("aria-label", `${Math.min(step + 1, 8)} ${c.of} 8`);
    if (step < questions.length) {
      const q = questions[step];
      body.innerHTML = `<p class="dna-step">${c.question} ${step + 1} ${c.of} ${questions.length}</p><h3 tabindex="-1">${q[lang()]}</h3><img class="dna-question-image" src="${q.image}" alt="" width="1200" height="675"><div class="dna-options">${q.options.map((option, i) => `<button type="button" data-dna-answer="${i}" aria-pressed="${answers[step] === i}"><strong>${option[lang()][0]}</strong><span>${option[lang()][1]}</span></button>`).join("")}</div><div class="dna-actions"><button class="outline-link" type="button" data-dna-back ${step === 0 ? "hidden" : ""}>${c.back}</button><button class="solid-link" type="button" data-dna-next ${answers[step] === null ? "disabled" : ""}>${step === 7 ? c.result : c.next}</button></div>`;
    } else {
      const profile = styleProfile(answers, lang());
      body.innerHTML = `<p class="dna-step">${c.resultTitle}</p><div class="dna-result"><span>${profile.code}</span><h3 tabindex="-1">${profile.name}</h3><div class="dna-traits">${profile.dimensions.map((d) => `<div><strong>${d.label}</strong>${d.balanced ? `<small>${c.balanced}</small>` : ""}</div>`).join("")}</div></div><h4>${c.recommendations}</h4><ul class="dna-recommendations">${profile.dimensions.map((d) => `<li>${d.recommendation}</li>`).join("")}</ul><p class="dna-note">${c.note}</p>${
        sent
          ? `<div class="dna-success" role="status"><h4>${c.sent}</h4><p>${c.sentCopy}</p></div>`
          : `<form id="dna-lead-form" novalidate><h4>${c.leadTitle}</h4><p class="dna-note">${c.leadCopy}</p><div class="dna-fields">${[
              ["name", c.name, "text", "name"],
              ["phone", c.phone, "tel", "tel"],
              ["location", c.location, "text", "address-level2"],
            ]
              .map(
                ([key, label, type, autocomplete]) =>
                  `<label class="sim-field" for="dna-${key}"><span>${label}</span><input id="dna-${key}" name="${key}" type="${type}" autocomplete="${autocomplete}" required maxlength="120" minlength="${key === "phone" ? 7 : 2}" value="${escape(contacts[key])}"></label>`,
              )
              .join(
                "",
              )}</div><label class="dna-consent"><input type="checkbox" name="consent" required ${contacts.consent ? "checked" : ""}><span>${c.consent}</span></label><button class="solid-link" type="submit" ${!styleLeadEndpoint || sending ? "disabled" : ""}>${sending ? c.sending : c.submit}</button><p class="dna-note">${styleLeadEndpoint ? c.privacy : c.unavailable}</p>${!styleLeadEndpoint ? `<a class="text-button" href="#contact" data-dna-contact>${c.contact}</a>` : ""}</form>`
      }<div class="dna-actions"><button class="outline-link" data-dna-back type="button">${c.back}</button><button class="text-button" data-dna-restart type="button">${c.restart}</button></div>`;
    }
    if (focus) body.querySelector("h3").focus({ preventScroll: true });
  }
  function close() {
    dialog.close();
  }
  dialog.addEventListener("close", () => {
    requestVersion++;
    controller?.abort();
    sending = false;
    reset();
    body.replaceChildren();
    document.body.classList.remove("modal-open");
    previousFocus?.focus({ preventScroll: true });
  });
  dialog.querySelector("[data-close-dna]").addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      close();
  });
  document.querySelectorAll("[data-open-dna]").forEach((trigger) =>
    trigger.addEventListener("click", () => {
      previousFocus = trigger.closest("#mobile-nav")
        ? document.querySelector("#menu-toggle")
        : trigger;
      reset();
      render();
      dialog.showModal();
      document.body.classList.add("modal-open");
    }),
  );
  body.addEventListener("input", (event) => {
    const key = event.target.name;
    if (key in contacts) {
      contacts[key] =
        key === "consent" ? event.target.checked : event.target.value;
      event.target.removeAttribute("aria-invalid");
      status.textContent = "";
    }
  });
  body.addEventListener("click", (event) => {
    const answer = event.target.closest("[data-dna-answer]");
    if (answer) {
      answers[step] = Number(answer.dataset.dnaAnswer);
      body
        .querySelectorAll("[data-dna-answer]")
        .forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(Number(b.dataset.dnaAnswer) === answers[step]),
          ),
        );
      body.querySelector("[data-dna-next]").disabled = false;
    }
    if (event.target.closest("[data-dna-next]") && answers[step] !== null) {
      step++;
      status.textContent = "";
      render(true);
      dialog.scrollTop = 0;
    }
    if (event.target.closest("[data-dna-back]") && !sending) {
      step--;
      sent = false;
      status.textContent = "";
      render(true);
      dialog.scrollTop = 0;
    }
    if (event.target.closest("[data-dna-restart]") && !sending) {
      reset();
      render(true);
      dialog.scrollTop = 0;
    }
    if (event.target.closest("[data-dna-contact]")) close();
  });
  body.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending || !styleLeadEndpoint) return;
    const form = event.target;
    let payload;
    try {
      payload = styleLeadPayload(contacts, answers, lang());
      if (!form.checkValidity()) throw Error("Invalid");
    } catch {
      status.textContent = t().invalid;
      form
        .querySelectorAll("input")
        .forEach((input) =>
          input.setAttribute("aria-invalid", String(!input.checkValidity())),
        );
      form.querySelector(":invalid")?.focus();
      return;
    }
    sending = true;
    controller = new AbortController();
    const requestController = controller;
    const version = ++requestVersion;
    const timer = setTimeout(() => requestController.abort(), 15000);
    status.textContent = t().sending;
    form.querySelector("button[type=submit]").disabled = true;
    try {
      const response = await fetch(styleLeadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: requestController.signal,
      });
      if (version !== requestVersion) return;
      if (!response.ok) throw Error("Submission failed");
      sent = true;
      contacts = { name: "", phone: "", location: "", consent: false };
      status.textContent = "";
      render(true);
    } catch {
      if (version !== requestVersion) return;
      status.textContent = t().error;
      form.querySelector("button[type=submit]").disabled = false;
    } finally {
      clearTimeout(timer);
      if (version === requestVersion) sending = false;
    }
  });
  return {
    refresh() {
      if (dialog.open && !sending) render();
    },
  };
}

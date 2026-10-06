import { translations, getLanguage } from "./i18n.js";
const BANK_URL =
  "https://embedded-banking.amarbank.co.id/?client_id=ebf-sechahome-web";
export function createApplicationUrl(reference, language) {
  const url = new URL(BANK_URL);
  url.searchParams.set("tagging_id", "SECHA_AMARBANK_2026");
  url.searchParams.set("lead_id", reference);
  url.searchParams.set("utm_source", "secha_home");
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", "amarbank_renovation_financing_2026");
  url.searchParams.set("utm_content", `lead_preform_${language}`);
  return url.href;
}
export function validPhone(value) {
  return (
    /^[+\d\s().-]+$/.test(value) &&
    value.replace(/\D/g, "").length >= 7 &&
    value.replace(/\D/g, "").length <= 16
  );
}
export function initFinancing(navigation) {
  const modal = document.querySelector("#preform");
  const form = document.querySelector("#lead-form");
  const formView = document.querySelector("#preform-form-view");
  const successView = document.querySelector("#preform-success-view");
  const status = document.querySelector("#form-status");
  const fields = [...form.querySelectorAll("input")];
  const link = document.querySelector("#amar-application-link");
  const output = document.querySelector("#lead-id-output");
  const copy = document.querySelector("#copy-lead-id");
  const background = [
    document.querySelector(".site-header"),
    document.querySelector("main"),
    document.querySelector("footer"),
    document.querySelector(".skip-link"),
  ];
  let previousFocus;
  let reference = "";
  function reset() {
    form.reset();
    fields.forEach((input) => {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
    });
    status.textContent = "";
    formView.hidden = false;
    successView.hidden = true;
    reference = "";
    output.textContent = "—";
    link.href = BANK_URL;
    copy.textContent = translations[getLanguage()].copy;
  }
  function close() {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.inert = true;
    document.body.classList.remove("modal-open");
    background.forEach((element) => (element.inert = false));
    reset();
    previousFocus?.focus();
  }
  function open(trigger) {
    previousFocus = trigger;
    navigation.close();
    modal.inert = false;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    background.forEach((element) => (element.inert = true));
    fields[0].focus();
  }
  document.querySelectorAll("[data-open-preform]").forEach((trigger) =>
    trigger.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      open(trigger);
    }),
  );
  modal
    .querySelectorAll("[data-close-preform]")
    .forEach((trigger) => trigger.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "Tab") {
      const focusable = [...modal.querySelectorAll("button,a,input")].filter(
        (element) => element.getClientRects().length,
      );
      const first = focusable[0],
        last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  fields.forEach((input) =>
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      status.textContent = "";
    }),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const validity = [
      fields[0].value.trim().length >= 2,
      validPhone(fields[1].value.trim()),
      fields[2].value.trim().length >= 2,
    ];
    fields.forEach((input, index) => {
      input.classList.toggle("is-invalid", !validity[index]);
      input.setAttribute("aria-invalid", String(!validity[index]));
    });
    const failed = validity.indexOf(false);
    if (failed !== -1) {
      status.textContent =
        translations[getLanguage()][
          ["invalidName", "invalidPhone", "invalidLocation"][failed]
        ];
      fields[failed].focus();
      return;
    }
    reference = `SCHA-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    output.textContent = reference;
    link.href = createApplicationUrl(reference, getLanguage());
    formView.hidden = true;
    successView.hidden = false;
    link.focus();
  });
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(reference);
      copy.textContent = translations[getLanguage()].copied;
    } catch {
      const range = document.createRange();
      range.selectNodeContents(output);
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
  document.querySelector("#preform-reset").addEventListener("click", () => {
    reset();
    fields[0].focus();
  });
  return {
    open,
    refresh() {
      if (reference) link.href = createApplicationUrl(reference, getLanguage());
    },
  };
}

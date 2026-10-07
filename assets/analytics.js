import { analyticsConfig } from "./analytics-config.js";
import { getLanguage } from "./i18n.js";

export const BANNER_CLICK_EVENT = "amar_bank_banner_click";

export function analyticsPageUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? `${url.origin}${url.pathname}` : "";
  } catch {
    return "";
  }
}

export function initBannerAnalytics() {
  const id = analyticsConfig.measurementId.trim();
  if (!/^G-[A-Z0-9]{4,}$/.test(id)) return false;
  if (document.getElementById("secha-ga4")) return true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  // Disable Enhanced Measurement
  // in the GA4 stream: automatic outbound tracking would capture bank URLs.
  window.gtag("config", id, {
    send_page_view: true,
    page_location: analyticsPageUrl(window.location.href),
    page_referrer: analyticsPageUrl(document.referrer),
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  document.querySelectorAll('.amar-banner[data-placement="banner"]').forEach((banner) => {
    const record = (event) => {
      if (event.type === "click" && event.button !== 0) return;
      if (event.type === "auxclick" && event.button !== 1) return;
      // Do not include href, phoneNumber, the SECHA identifier or form fields.
      window.gtag("event", BANNER_CLICK_EVENT, {
        send_to: id,
        placement: "amar_bank_banner",
        language: getLanguage(),
        interaction: event.type === "auxclick" ? "middle_click" : event.detail === 0 ? "keyboard" : "click",
        value: 1,
        transport_type: "beacon",
      });
    };
    banner.addEventListener("click", record);
    banner.addEventListener("auxclick", record);
  });

  const script = document.createElement("script");
  script.id = "secha-ga4";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(script);
  return true;
}

/** Reusable inline video dialog with a bounded automatic intro and explicit replay. */
export function initOpening() {
  const opening = document.querySelector("#opening");
  if (!opening) return;
  const video = opening.querySelector("video");
  const closeButton = opening.querySelector("#opening-skip");
  const playButton = opening.querySelector("#opening-play");
  const seek = opening.querySelector("#opening-seek");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const stage = opening.querySelector("#opening-stage");
  const progress = opening.querySelector("#opening-progress");
  const stages = {
    en: ["Set the foundation", "Bring comfort together", "Complete the room"],
    id: ["Susun fondasi", "Satukan kenyamanan", "Lengkapi ruang"],
  };
  let active = false,
    automatic = false,
    previousFocus,
    locked = [],
    startupTimer,
    playbackTimer;
  const lang = () => (document.documentElement.lang === "id" ? "id" : "en");
  function clearTimers() {
    clearTimeout(startupTimer);
    clearTimeout(playbackTimer);
  }
  function sync() {
    const ratio =
      Number.isFinite(video.duration) && video.duration > 0
        ? Math.min(video.currentTime / video.duration, 1)
        : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (seek) seek.value = String(Math.round(ratio * 100));
    if (stage)
      stage.textContent =
        stages[lang()][ratio < 0.33 ? 0 : ratio < 0.67 ? 1 : 2];
    if (playButton)
      playButton.textContent = video.ended
        ? lang() === "id"
          ? "Putar ulang"
          : "Replay"
        : video.paused
          ? lang() === "id"
            ? "Putar"
            : "Play"
          : lang() === "id"
            ? "Jeda"
            : "Pause";
  }
  function close() {
    if (!active) return;
    active = false;
    clearTimers();
    video.pause();
    opening.hidden = true;
    document.body.classList.remove("intro-open");
    locked.forEach(({ element, inert }) => (element.inert = inert));
    if (automatic) {
      try {
        sessionStorage.setItem("secha_intro_seen", "1");
      } catch {}
    }
    if (opening.contains(document.activeElement))
      previousFocus?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent("secha:introclosed"));
  }
  function attemptPlay() {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    try {
      const result = video.play();
      result?.catch(() => {
        if (!active) return;
        if (automatic) close();
        else {
          sync();
          stage.textContent =
            lang() === "id"
              ? "Ketuk Putar untuk melanjutkan."
              : "Tap Play to continue.";
        }
      });
    } catch {
      if (automatic) close();
    }
  }
  function begin(auto = false) {
    if (active) return;
    automatic = auto;
    previousFocus = document.activeElement;
    locked = [...document.body.children]
      .filter((e) => e !== opening && e.tagName !== "SCRIPT")
      .map((element) => ({ element, inert: element.inert }));
    active = true;
    opening.hidden = false;
    document.body.classList.add("intro-open");
    locked.forEach(({ element }) => (element.inert = true));
    try {
      video.currentTime = 0;
    } catch {}
    video.preload = "auto";
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("muted", "");
    if (auto) {
      startupTimer = setTimeout(close, 2500);
      closeButton.focus({ preventScroll: true });
    } else playButton?.focus({ preventScroll: true });
    sync();
    attemptPlay();
  }
  video.addEventListener("playing", () => {
    if (!active) return;
    clearTimeout(startupTimer);
    sync();
    if (automatic) {
      clearTimeout(playbackTimer);
      playbackTimer = setTimeout(close, 8000);
    }
  });
  video.addEventListener("timeupdate", sync);
  video.addEventListener("pause", sync);
  video.addEventListener("ended", () => {
    sync();
    if (automatic) close();
  });
  video.addEventListener("error", () => {
    if (automatic) close();
    else if (active)
      stage.textContent =
        lang() === "id"
          ? "Video tidak tersedia. Silakan tutup."
          : "Video unavailable. You can close this window.";
  });
  video.querySelector("source")?.addEventListener("error", () => {
    if (automatic) close();
  });
  playButton?.addEventListener("click", () => {
    automatic = false;
    clearTimers();
    if (video.ended) {
      video.currentTime = 0;
      attemptPlay();
    } else if (video.paused) attemptPlay();
    else video.pause();
    sync();
  });
  seek?.addEventListener("input", () => {
    automatic = false;
    clearTimers();
    if (Number.isFinite(video.duration) && video.duration > 0)
      video.currentTime = (Number(seek.value) / 100) * video.duration;
    sync();
  });
  closeButton.addEventListener("click", close);
  document
    .querySelectorAll("[data-replay-opening]")
    .forEach((button) => button.addEventListener("click", () => begin(false)));
  document.addEventListener("keydown", (event) => {
    if (!active) return;
    if (event.key === "Escape") close();
    if (event.key === "Tab") {
      const items = [...opening.querySelectorAll("button,input")].filter(
        (e) => e.getClientRects().length,
      );
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
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && active) {
      if (automatic) close();
      else {
        video.pause();
        sync();
      }
    }
  });
  window.addEventListener("pagehide", close);
  motion.addEventListener("change", (event) => {
    if (event.matches && automatic) close();
  });
  let seen = false;
  try {
    seen = Boolean(sessionStorage.getItem("secha_intro_seen"));
  } catch {}
  if (!seen && !motion.matches && !navigator.connection?.saveData) begin(true);
  return { replay: () => begin(false), close };
}

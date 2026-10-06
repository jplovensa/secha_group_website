/** User-initiated playback keeps the showcase download out of initial page loading. */
export function initFeaturedWork() {
  const video = document.querySelector("#featured-work-video");
  const button = document.querySelector("#featured-work-play");
  const status = document.querySelector("#featured-work-status");
  if (!video || !button) return;
  video.controls = false;
  button.hidden = false;
  let starting = false;
  button.addEventListener("click", async () => {
    if (starting) return;
    starting = true;
    button.disabled = true;
    status.textContent = "";
    video.controls = true;
    try {
      await video.play();
      button.hidden = true;
    } catch {
      status.textContent =
        document.documentElement.lang === "id"
          ? "Video belum dapat diputar. Coba lagi atau gunakan kontrol video."
          : "Video could not start. Try again or use the video controls.";
      button.hidden = false;
    } finally {
      starting = false;
      button.disabled = false;
    }
  });
  video.addEventListener("playing", () => {
    button.hidden = true;
    status.textContent = "";
  });
}

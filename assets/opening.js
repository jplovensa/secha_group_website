/** A skippable room-assembly film; content never depends on successful playback. */
export function initOpening() {
  const opening = document.querySelector('#opening');
  if (!opening) return;
  const video = opening.querySelector('video');
  const skip = opening.querySelector('#opening-skip');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || navigator.connection?.saveData) return;
  try { if (sessionStorage.getItem('secha_intro_seen')) return; } catch {}
  const background = [...document.body.children]
    .filter(element => element !== opening && element.tagName !== 'SCRIPT')
    .map(element => ({ element, inert: element.inert }));
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const stage = opening.querySelector('#opening-stage');
  const progress = opening.querySelector('#opening-progress');
  const stages = {
    en: ['Set the foundation', 'Bring comfort together', 'Complete the room'],
    id: ['Susun fondasi', 'Satukan kenyamanan', 'Lengkapi ruang'],
  };
  let timer;
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    controller.abort();
    video.pause();
    opening.hidden = true;
    document.body.classList.remove('intro-open');
    background.forEach(({ element, inert }) => { element.inert = inert; });
    try { sessionStorage.setItem('secha_intro_seen', '1'); } catch {}
    if (opening.contains(document.activeElement)) {
      document.querySelector('.brand, #navbar > a')?.focus({ preventScroll: true });
    }
  }
  function update() {
    const fraction = Number.isFinite(video.duration) && video.duration > 0
      ? Math.min(video.currentTime / video.duration, 1) : 0;
    if (progress) progress.style.transform = `scaleX(${fraction})`;
    if (stage) stage.textContent = stages[document.documentElement.lang === 'id' ? 'id' : 'en'][fraction < .33 ? 0 : fraction < .67 ? 1 : 2];
  }
  opening.hidden = false;
  background.forEach(({ element }) => { element.inert = true; });
  document.body.classList.add('intro-open');
  skip.focus({ preventScroll: true });
  skip.addEventListener('click', finish, options);
  video.addEventListener('ended', finish, options);
  video.addEventListener('error', finish, options);
  video.querySelector('source').addEventListener('error', finish, options);
  video.addEventListener('timeupdate', update, options);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') finish();
    if (event.key === 'Tab') { event.preventDefault(); skip.focus(); }
  }, options);
  motion.addEventListener('change', event => { if (event.matches) finish(); }, options);
  update();
  timer = setTimeout(finish, 7000);
  video.play()?.catch(finish);
}

/** A short, skippable first-visit film. The page never depends on video playback. */
export function initOpening() {
  const opening = document.querySelector('#opening');
  const video = document.querySelector('#opening-video');
  const skip = document.querySelector('#opening-skip');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || navigator.connection?.saveData) return;
  try { if (sessionStorage.getItem('secha_intro_seen')) return; } catch {}
  const background = [...document.body.children].filter(element => element !== opening && element.tagName !== 'SCRIPT');
  let timer;
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    video.pause();
    opening.hidden = true;
    document.body.classList.remove('intro-open');
    background.forEach(element => element.inert = false);
    try { sessionStorage.setItem('secha_intro_seen', '1'); } catch {}
    if (opening.contains(document.activeElement)) document.querySelector('.brand').focus({ preventScroll: true });
  }
  opening.hidden = false;
  background.forEach(element => element.inert = true);
  document.body.classList.add('intro-open');
  skip.focus({ preventScroll: true });
  skip.addEventListener('click', finish);
  video.addEventListener('ended', finish, { once: true });
  video.addEventListener('error', finish, { once: true });
  video.querySelector('source').addEventListener('error', finish, { once: true });
  document.addEventListener('keydown', event => {
    if (done) return;
    if (event.key === 'Escape') finish();
    if (event.key === 'Tab') { event.preventDefault(); skip.focus(); }
  });
  motion.addEventListener('change', event => { if (event.matches) finish(); });
  timer = setTimeout(finish, 6000);
  video.play()?.catch(finish);
}

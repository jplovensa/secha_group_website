import { translations, getLanguage } from './i18n.js';
export function initNavigation() {
  const toggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#mobile-nav');
  const breakpoint = matchMedia('(max-width: 850px)');
  let open = false;
  function refresh() {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', translations[getLanguage()][open ? 'menuClose' : 'menuOpen']);
    nav.setAttribute('aria-hidden', String(!open));
    nav.inert = !open;
  }
  function close() { open = false; refresh(); }
  toggle.addEventListener('click', () => { open = !open; refresh(); });
  nav.querySelectorAll('a,button').forEach(item => item.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) { close(); toggle.focus(); }
    if (event.key === 'Tab' && open) {
      const items = [toggle, ...nav.querySelectorAll('a,button')];
      const index = items.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); items.at(-1).focus(); }
      else if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); toggle.focus(); }
    }
  });
  breakpoint.addEventListener('change', () => { if (!breakpoint.matches) close(); });
  refresh();
  return { close, refresh };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsPageUrl, initBannerAnalytics, BANNER_CLICK_EVENT, BANNER_IMPRESSION_EVENT } from '../assets/analytics.js';

test('analytics page and referrer URLs omit phone, identifier and fragment values', () => {
  assert.equal(
    analyticsPageUrl('https://www.sechahome.com/?phoneNumber=081234567890&id_identifier=SCHA-test#private'),
    'https://www.sechahome.com/'
  );
  assert.equal(
    analyticsPageUrl('https://embedded-banking.amarbank.co.id/apply?phoneNumber=081234567890'),
    'https://embedded-banking.amarbank.co.id/apply'
  );
});

test('absent, invalid and non-web referrers are not sent to analytics', () => {
  for (const value of ['', 'invalid', 'javascript:alert(1)', 'mailto:user@example.com']) {
    assert.equal(analyticsPageUrl(value), '');
  }
});

test('GA4 config, viewable impressions and clicks collect safe data once initialized', () => {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const events = [], listeners = {}, visibilityListeners = new Set(), timers = new Map();
  let callback, observed, disconnected = false, script, timerId = 0;
  const banner = { addEventListener: (name, fn) => { listeners[name] = fn; } };
  globalThis.window = {
    location: { href: 'https://www.sechahome.com/?phoneNumber=081234567890#secret' },
    gtag: (...args) => events.push(args),
    setTimeout: (fn) => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: (id) => timers.delete(id),
    IntersectionObserver: class {
      constructor(fn, options) { callback = fn; assert.deepEqual(options.threshold, [0, 0.5]); }
      observe(element) { observed = element; }
      disconnect() { disconnected = true; }
    },
  };
  globalThis.document = {
    body: { dataset: { lang: 'en' } }, visibilityState: 'visible',
    referrer: 'https://example.com/?private=value',
    getElementById: () => script,
    querySelectorAll: () => [banner],
    addEventListener: (_, fn) => visibilityListeners.add(fn),
    removeEventListener: (_, fn) => visibilityListeners.delete(fn),
    createElement: () => ({}), head: { append: (element) => { script = element; } },
  };
  const intersect = (ratio) => callback([{ target: banner, isIntersecting: ratio > 0, intersectionRatio: ratio }]);
  const visibility = (state) => {
    document.visibilityState = state;
    for (const fn of visibilityListeners) fn();
  };
  const tick = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); };
  try {
    assert.equal(initBannerAnalytics(), true);
    assert.equal(initBannerAnalytics(), true);
    assert.equal(events.filter(([type]) => type === 'config').length, 1);
    const config = events.find(([type]) => type === 'config')[2];
    assert.equal(config.send_page_view, true);
    assert.equal(config.page_location, 'https://www.sechahome.com/');
    assert.equal(config.page_referrer, 'https://example.com/');
    assert.equal(observed, banner);
    intersect(0.49); assert.equal(timers.size, 0);
    intersect(0.5); assert.equal(timers.size, 1);
    intersect(0); tick();
    assert.equal(events.filter(([, name]) => name === BANNER_IMPRESSION_EVENT).length, 0);
    intersect(1); visibility('hidden'); tick();
    assert.equal(events.filter(([, name]) => name === BANNER_IMPRESSION_EVENT).length, 0);
    visibility('visible'); tick();
    assert.equal(events.filter(([, name]) => name === BANNER_IMPRESSION_EVENT).length, 1);
    assert.equal(disconnected, true);
    assert.equal(visibilityListeners.size, 0);
    listeners.click({ type: 'click', button: 2 });
    listeners.auxclick({ type: 'auxclick', button: 2 });
    listeners.click({ type: 'click', button: 0, detail: 1 });
    listeners.click({ type: 'click', button: 0, detail: 0 });
    listeners.auxclick({ type: 'auxclick', button: 1 });
    const clicks = events.filter(([, name]) => name === BANNER_CLICK_EVENT);
    assert.deepEqual(clicks.map(([, , params]) => params.interaction), ['click', 'keyboard', 'middle_click']);
    for (const [, , params] of events.filter(([type]) => type === 'event')) {
      assert.deepEqual(Object.keys(params).sort(),
        ['send_to', 'placement', 'language', 'value', 'transport_type', ...(params.interaction ? ['interaction'] : [])].sort());
      assert.equal(params.value, 1);
    }
  } finally {
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
});

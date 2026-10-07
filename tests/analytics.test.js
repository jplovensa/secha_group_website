import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsPageUrl } from '../assets/analytics.js';

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

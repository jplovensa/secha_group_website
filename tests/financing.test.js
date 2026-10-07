import test from 'node:test';
import assert from 'node:assert/strict';
import { createApplicationUrl, validPhone } from '../assets/financing.js';
test('bank handoff preserves client and reference without personal details', () => {
  const url = new URL(createApplicationUrl('SCHA-test', 'id'));
  assert.equal(url.origin, 'https://embedded-banking.amarbank.co.id');
  assert.equal(url.searchParams.get('client_id'), 'ebf-sechahome-web');
  assert.equal(url.searchParams.get('id_identifier'), 'SCHA-test');
  assert.equal(url.searchParams.has('lead_id'), false);
  assert.equal(url.searchParams.get('utm_content'), 'lead_preform_id');
  for (const key of ['name','phone','phoneNumber','location']) assert.equal(url.searchParams.has(key), false);
});
test('phone validation accepts common formats and rejects text or invalid lengths', () => {
  for (const value of ['0812 3456 7890', '+62 (821) 7407-2041']) assert.equal(validPhone(value), true);
  for (const value of ['abc08123456789','123','12345678901234567','']) assert.equal(validPhone(value), false);
});
test('bank handoff includes the entered phone number with safe query encoding', () => {
  const phone = '+62 (821) 7407-2041';
  const url = new URL(createApplicationUrl('SCHA-test', 'en', phone));
  assert.equal(url.searchParams.get('client_id'), 'ebf-sechahome-web');
  assert.equal(url.searchParams.get('phoneNumber'), phone);
  assert.equal(url.searchParams.get('id_identifier'), 'SCHA-test');
  assert.equal(url.searchParams.get('utm_content'), 'lead_preform_en');
  for (const key of ['name', 'location', 'phone', 'lead_id']) assert.equal(url.searchParams.has(key), false);
});

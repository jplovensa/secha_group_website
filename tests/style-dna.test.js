import test from "node:test";
import assert from "node:assert/strict";
import { styleProfile, styleLeadPayload } from "../assets/style-dna-model.js";
test("all sixteen design signatures are reachable with four independent preference pairs", () => {
  const codes = new Set();
  for (let i = 0; i < 16; i++) {
    const choices = [0, 1, 2, 3].map((bit) => (i >> bit) & 1);
    const profile = styleProfile([...choices, ...choices]);
    codes.add(profile.code);
    assert.equal(profile.dimensions.length, 4);
    assert.ok(profile.dimensions.every((d) => !d.balanced));
  }
  assert.equal(codes.size, 16);
});
test("mixed preferences are disclosed as balanced with the first answer setting direction", () => {
  const p = styleProfile([0, 0, 0, 0, 1, 1, 1, 1]);
  assert.equal(p.code, "WSMQ");
  assert.ok(p.dimensions.every((d) => d.balanced));
  assert.equal(
    styleProfile(Array(8).fill(1), "id").name,
    "Si Tuan Rumah Ekspresif",
  );
  assert.throws(() => styleProfile([0, 1]), RangeError);
  assert.throws(() => styleProfile(Array(8).fill(2)), RangeError);
});
test("lead payload requires valid contact details and explicit consent and retains preferences", () => {
  const contact = {
    name: "Ayu & family",
    phone: "+62 812 3456 7890",
    location: "Jakarta Selatan",
    consent: true,
  };
  const payload = styleLeadPayload(contact, Array(8).fill(0), "id");
  assert.equal(payload.source, "secha_style_dna");
  assert.equal(payload.styleCode, "WSMQ");
  assert.equal(payload.name, contact.name);
  assert.equal(payload.language, "id");
  assert.equal(payload.consent, true);
  assert.equal(payload.recommendations.length, 4);
  assert.throws(
    () => styleLeadPayload({ ...contact, consent: false }, Array(8).fill(0)),
    RangeError,
  );
  assert.throws(
    () => styleLeadPayload({ ...contact, phone: "invalid" }, Array(8).fill(0)),
    RangeError,
  );
});

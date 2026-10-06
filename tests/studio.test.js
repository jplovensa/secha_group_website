import test from 'node:test';
import assert from 'node:assert/strict';
import { estimate,enquiryUrl } from '../studio/assets/brief.js';
test('Studio pricing responds to room size and design tier',()=>{
 assert.equal(estimate('Small','Lite'),'IDR 1,000,000');
 assert.equal(estimate('Large','Premium'),'IDR 7,800,000');
 assert.equal(estimate('Invalid','Pro'),null);
});
test('Studio enquiry includes selected brief and safely encodes text',()=>{
 const url=new URL(enquiryUrl({size:'Medium',tier:'Pro',feeling:'Warmth & calm',rhythm:'Gathering'},'The Nomad: Boucle Linen'));
 assert.equal(url.origin,'https://wa.me');
 assert.equal(url.pathname,'/6282174072041');
 const text=url.searchParams.get('text');
 assert.match(text,/Warmth & calm/);assert.match(text,/IDR 3,600,000/);assert.match(text,/The Nomad: Boucle Linen/);
 assert.match(text,/Please confirm scope/);
});

test('brief review requires a valid purpose, style, room and package', async () => {
 const { canReview } = await import('../studio/assets/brief.js');
 assert.equal(canReview({purpose:'My home',style:'Cozy & Functional',size:'Small',tier:'Lite'}),true);
 assert.equal(canReview({purpose:'',style:'Cozy & Functional',size:'Small',tier:'Lite'}),false);
 assert.equal(canReview({purpose:'My home',style:'Invalid',size:'Small',tier:'Lite'}),false);
});

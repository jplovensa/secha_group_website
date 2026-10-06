# Local redesign review

Reference: supplied `secha-proptech-tests/desktop-home.png`. This is an intentional redesign using the supplied brand and assets, rather than a pixel-for-pixel clone.

Local Chromium screenshots inspected at 1440 × 1000 and 390 × 844. The visual review confirms a shorter editorial hero, balanced photography, simpler service and project hierarchy, preserved bilingual content, and removal of the public brand specification section.

Local functional checks: language persistence, mobile menu, validation, reference handoff, clear-on-close, keyboard containment, local assets, browser errors, and overflow across five viewport widths.

Cloud Product Design verification remains unavailable because this session has no cloud browser or Sites tools. The user approved local screenshots and local browser testing as the fallback.

Final result for local fallback: passed. Cloud workflow: blocked by unavailable tools. External bank application behavior remains unverified.

## Inter and opening film revision

Local Chromium confirms MP4 playback, natural completion, skip, once-per-session behavior, reduced-motion bypass, Inter on all visible text elements, and the Studio+ subdomain link. Desktop and mobile screenshots refreshed. Typography was resized for Inter's wider proportions. The subsequent Studio+ change uses a same-host /studio/ folder instead of the subdomain; no DNS change is required.

## Studio+ folder route

The supplied Studio+ page is retained as a distinct dark, Inter-based design. Local screenshots inspected at 1440×1000 and 390×844. Local browser checks pass for the studio folder route, modal keyboard handling, moodboard changes, material selection, shortlist updates, pricing tiers, questionnaire, WhatsApp brief contents, main-site link, and overflow at 320, 390, 768, and 1440px. Static deployment needs the whole repository, including `studio/` and shared `assets/`.

Payment inputs and fabricated success were replaced with an explicit enquiry; no payment or booking is claimed. Runtime CDN scripts, Google Fonts, third-party images, the fake loading screen, and the custom cursor were removed. 3D work pauses outside the viewport; WebGL fallback preserves the selection workflow.

Local result: passed. Live domain deployment: not performed.

## Room-assembly intro revision

A five-second assembly film replaces the earlier chair video. It assembles sofa modules, a stone coffee table, and oak shelving over the SECHA cream background. Playback-linked phases and progress are shared across both home and Studio+. Skip, Escape, media-failure fallback, natural completion, session behavior, and reduced-motion checks passed locally; the original page interaction suite still passes.

The requested The Makeover sequence rebuild is blocked: the reference URL returned a network proxy CONNECT 403. No reference screenshots were captured, so no comparison or completed redesign is claimed. See `studio/reference-sequence.md` for the continuation scope.

## Studio+ customer journey rebuild — latest revision

Intentional SECHA redesign using the supplied architecture photos and Inter. Local desktop and mobile screenshots inspected. The page now prioritizes purpose, examples, design scope, delivery, and enquiry; the 3D showroom is optional further exploration.

Verified locally: two actual 3D canvas renderers; all photos load; direction modals; duplicate-free material shortlist and removal; keyboard containment; five-step brief and reset; size/tier pricing; final WhatsApp brief; native FAQs; and no overflow at 320, 390, 768, 1024, and 1440px. Five unit tests cover estimates, safe enquiry encoding, and complete brief requirements, alongside the main financing tests. The shared intro's playback, skip, completion, reduced-motion, and failure checks pass.

Latest local result: passed. Reference comparison remains unavailable because The Makeover website could not be accessed. The user authorized proceeding with a SECHA redesign and pushing it. Live deployment is distinct from the Git push and is not claimed here.

## Mobile playback, financing quest, and media revision

The shared intro now supports manual replay, pause, seek, and replay after completion. Automatic loading has bounded recovery from blocked playback, failed media, or a stalled play promise; the content's original inert state is restored. Studio defers WebGL loading until the showroom approaches the viewport and the intro has closed. Local dev serving now supports byte ranges for video seeking.

Chromium mobile emulation verified natural autoplay completion, manual pause/seek/resume/end/replay, Escape, restored content, blocked and stalled autoplay, missing media, and lazy Studio canvases. Simulator checks cover goal gating, financing lower-bound validation, owner-provided default annual rate and reducing-balance method, service/admin fee display, term changes, bank-reference modal handoff, and overflow at 320/390/768/1440px. Nine unit tests pass. These checks do not constitute physical iPhone/Safari testing.

Media includes the owner-provided SpotNews link. Five specific recognition cards have a labelled local design preview and remain pending/publicly hidden. Neither the article nor the named accolade sources could be fetched because the network proxy returned CONNECT 403. The domain configuration draft is saved but requires review/save/publish to activate.

## Standalone loan simulator menu

The loan simulator is now an independent desktop/mobile menu action. Completing it closes the planning dialog without opening the bank reference form. Amar Bank banner and financing CTAs open the separate bank reference form; the extra bank logo/card beneath the banner is removed. Mobile simulator closure restores focus to the visible menu toggle.

Nine unit tests pass. Chromium verified these independent flows, mobile menu closing and focus restoration, removed logo/card, and no document overflow at 320/390/900/1024/1440px, with zero browser errors.

## Style DNA and repeat intro

Removed the session marker from automatic intro playback: root and Studio+ attempt the film on every page load/refresh, including tabs with the former marker already set. Reduced-motion/Save-Data and stalled-playback recovery still apply.

Style DNA adds a responsive home-page section and desktop/mobile menu dialog. Eight visual questions span four paired dimensions, giving 16 signatures with furniture recommendations. Results precede contact collection. Mixed answers are explicitly marked balanced; the first paired answer breaks a tie. This is presented as a design preference game, not an MBTI or psychological diagnosis.

Twelve unit tests pass. Chromium checked both-page reload playback, answer gating and back/edit, result scoring, bilingual text, native modal/focus behavior, contact escaping/clearing, and no page/dialog overflow at 320/390/768/900/1024/1440px. A local mock endpoint checked consent gating, JSON payload, confirmed HTTP success, and failure/retry without losing contact fields. No actual leads were sent during testing.

The owner selected endpoint delivery rather than WhatsApp. The endpoint URL, request contract, and CORS support remain required. The frontend adapter and form are built; production submission stays disabled until configured. No real lead capture or endpoint integration is claimed yet. A pending endpoint message is shown instead of false success.

## Featured Work and section spacing

Added the owner-supplied GSIH/MCC showcase with both logo references, a poster, and user-initiated inline playback. The 51.093-second 4K HEVC upload (15,660,855 bytes) is committed only as a 720p H.264/AAC fast-start MP4 (5,957,446 bytes). Web logos are about 48KB and the poster about 134KB. Audio and full duration are retained; no original video is committed.

Found that the `.section-pad` class used by Media and Style DNA had no CSS definition. Added consistent desktop/mobile section padding, relaxed heading leading, and increased quiz progress/divider clearance. Media links now use an SVG icon instead of an unsupported font glyph, and the live media card labels support English/Indonesian.

Twelve unit tests pass. Chromium verified zero showcase video requests before Watch, actual native playback, duration, seeking, logo decoding, section and title-to-divider clearances, Style DNA modal clearance, and no overflow at 320/390/768/1024/1440px. Desktop and mobile preview screenshots inspected.

## Compact transparent project branding

Reviewed the uploaded GSIH/MCC proposal as a visual reference. Its branding is compact and sits directly on the page background. Reduced the Featured Work logo block from a 650px image inside a white padded panel to a 340px desktop / 300px tablet / 260px mobile transparent asset, aligned to the content edge. Removed the white panel and its padding. The uploaded proposal remains a reference document and is not published as site content.

Verified true alpha transparency in the replacement WebP (transparent corner pixels), successful browser decoding, transparent container with zero padding, compact display widths, and no page overflow at 320/390/768/1440px. Mobile preview inspected against the proposal's restrained branding treatment. The replacement web asset is approximately 186KiB.

## Heritage meets tech concept panel

Added a bilingual design concept beside the Featured Work logos, stacking below them on mobile. The copy is grounded in the uploaded GSIH/MCC proposal: lightweight EPS partitions and hard-coated seating/stage modules (pages 2–5), Candi Badut ornament CNC-cut from EPS with LED backlighting (page 3), media walls and planned utilities (pages 4–5), and modular conference furniture (page 8). It is labelled as the proposal's concept and does not assert verified installed specifications.

Chromium verified desktop side-by-side placement, mobile stacking, three principles, English/Indonesian copy, image decoding, no page overflow at 320/390/768/1024/1440px, and zero browser errors. Desktop preview inspected. No financial logic or lead-delivery changes were made.

## Owner-supplied Media & Recognition catalogue

Replaced provisional media entries with eleven exact owner-supplied publisher/title/URL records, grouped into Media Coverage, Awards & Recognition, and Press Releases. The supplied labels are now card headings; publisher and category remain visible. Forbes is marked PDF; the D Globalist `4311a1a2_page=4` parameter is preserved. Forbes/D Globalist share one DGEMS identifier and a visible explanation that they document the same recognition. Women’s Tabloid/APAC Insider identify Josephine Petra Lovensa as recipient. Press-release sources remain explicitly labelled.

Chromium verified eleven cards across the three categories, counts 3/4/4, exact D Globalist parameter, PDF labelling, both CEO recipient labels, DGEMS explanation, press labels, Indonesian presentation, no overflow at 320/390/768/900/1024/1440px, and zero browser errors. External pages were not fetched or independently verified in this change.

## Compact media layout and publisher motion

Media & Recognition now uses three compact editorial columns on desktop and stacked categories on mobile, retaining all eleven full source titles and their publication/award/press classifications. Reduced headings, padding, list-row heights, and category gaps replace the large fixed-height card grids.

A decorative, seamless publisher strip adds slow continuous motion. Its repeated visual names are hidden from assistive technology; the source cards remain the accessible catalogue. A bilingual pause/play control is available. Motion pauses on hover, keyboard focus, offscreen visibility, and hidden tabs; reduced-motion preferences show a static wrapped list and disable animation. Re-rendering cleans up prior observers and listeners.

Chromium checked visible movement, manual pause/resume, hover/focus pause, live reduced-motion changes, safe re-rendering, all eleven cards, compact desktop height, six widths (320/390/768/900/1024/1440px), and zero browser errors. Existing media acceptance checks also verify exact source labels/URLs, the PDF, CEO recipients, press-release labels, and the D Globalist parameter.

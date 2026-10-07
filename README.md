# SECHA

A responsive, bilingual renovation website rebuilt from the supplied SECHA archive. Uses local fonts and images, semantic HTML, CSS, and native JavaScript modules. No production server dependencies. Studio+ utility CSS is compiled and committed for static deployment.

## Develop

Requires Python 3 and Node.js 20+ for tests.

```sh
npm run dev
npm test
```

The development server listens on port 4173 and supports HTTP byte ranges for native video seeking. Stop it with Ctrl+C. Serve the repository root with any static web host, including GitHub Pages. Relative asset paths work under a repository subpath. ES modules require HTTP serving rather than opening the HTML file directly.

## Structure

- `index.html`: bilingual page content and semantic structure.
- `assets/styles.css`: responsive layout, brand tokens, and interaction states.
- `assets/i18n.js`: translations and persisted language preference.
- `assets/navigation.js`: responsive menu and keyboard interaction.
- `assets/financing.js`: form validation, accessible modal, and bank handoff.
- `assets/app.js`: module initialization.
- `tests/financing.test.js`: phone validation and bank URL contract.

## Financing behavior

The form validates contact details in memory and creates a reference. It does **not** save contact details to local storage, submit them to a SECHA backend, or create a bank application. After successful validation, the entered phone number is included as `phoneNumber` in the external bank URL alongside the randomized `id_identifier` and campaign parameters. The visitor explicitly opens that link to share the phone number and reference with Amar Bank. Name and location remain in the tab. Closing or resetting the modal clears the phone number from the form and both bank links. Bank-side support for the reference parameters and application approval were not verified. A real lead capture service is needed if SECHA should receive enquiries.

Amar Bank's [landing-page documentation](https://docs-embedded.amarbank.co.id/banking-widget/website/banking-landing-page), as supplied by the owner, specifies mandatory `client_id` and optional `phoneNumber` and `id_identifier`. The production URL keeps `client_id=ebf-sechahome-web`. JavaScript assigns a unique SECHA enquiry reference to `id_identifier` for both the banner (including opening it in a new tab) and the application link. This uses a full random UUID, remains consistent through the current form submission and language changes, and regenerates on form reset or page reload. It is an anonymous enquiry identifier, not a stored customer account ID. The unsupported `lead_id` alias is removed. The validated, trimmed phone input is included as `phoneNumber` after form submission, preserving the entered format and encoding it safely. Language changes preserve that phone value and identifier. No name or location is included in the URL. Before submission and after reset, the optional phone parameter is omitted. The static HTML fallback keeps the approved client-only URL, valid because `id_identifier` is optional. Successful bank-side attribution has not been verified.

The supplied bank artwork, destination, WhatsApp number, and email were retained as source content. Studio+ now links to `studio/`, served alongside the main page. Confirm these business details before production release. No instructions from the archive's YAML logs were executed.

## Validation

Two automated unit tests pass. Chromium checks passed for EN/ID persistence, mobile navigation, invalid/valid form states, privacy reset, modal keyboard focus, local image requests, browser errors, and horizontal overflow at 320, 390, 768, 1024, and 1440 px. Local screenshot previews are available for review; the site has not been pushed or deployed.

## Opening film and typography

All editable website typography uses self-hosted Inter. Text embedded in the supplied bank banner remains part of its image artwork.

`assets/video/furniture-assembly.mp4` is a five-second, silent H.264 film showing a modular sofa, stone coffee table, and oak shelving assembling into a complete room. It plays once per tab session, with Skip and Escape controls, a seven-second maximum wait, and immediate bypass for reduced motion or data-saving preferences. Playback failures reveal the site. No JavaScript means the intro stays hidden.

To reproduce the video, install Blender and FFmpeg and run from the repository root:

```sh
blender -b -t 2 -P tools/render-preloader.py -- /tmp/secha-frames
ffmpeg -y -f lavfi -i 'color=c=0xf4efe4:s=960x540:r=24:d=5' -framerate 24 -i /tmp/secha-frames/%04d.png -filter_complex '[0:v][1:v]overlay=shortest=1,format=yuv420p' -c:v libx264 -preset medium -crf 22 -movflags +faststart assets/video/furniture-assembly.mp4
ffmpeg -y -f lavfi -i 'color=c=0xf4efe4:s=960x540:r=24' -i /tmp/secha-frames/0110.png -filter_complex '[0:v][1:v]overlay=shortest=1' -frames:v 1 assets/video/furniture-assembly-poster.jpg
```

Studio+ uses a same-host folder route, `/studio/`, rather than a subdomain. No separate DNS record, hosting service, or rewrite rule is required when the existing host serves `studio/index.html`.

## Studio+ from its own repository

The published Studio+ app comes from the public repository [jplovensa/sechastudio-](https://github.com/jplovensa/sechastudio-), branch `main`. The old `studio/` source is retained for reference; it is not the app deployed by the combined workflow. Only `studio/integration.css` is used from that folder, to keep all interface fonts in Inter.

`.github/workflows/pages.yml` resolves an exact Studio+ commit, checks it out, installs its locked dependencies, builds its CSS, and runs both repositories' logic tests. `tools/prepare-site.py` packages its runtime files under `/studio/` alongside the main site. It adds SECHA's self-hosted fonts and a home link without modifying the independent repository. The deployed `studio/source.json` records the source commit. Development tools, tests and node_modules are excluded from the artifact.

Main-site pushes and manual workflow runs publish the combined site. An hourly scheduled check publishes when the Studio+ source changes; a cache marker is written only after successful publication. GitHub can delay scheduled runs and disables schedules in inactive public repositories after 60 days. Use Actions → Publish SECHA website → Run workflow for an immediate sync. A direct push to Studio+ does not instantly trigger this repository's workflow.

The existing host serves both routes:

- Home: `https://sechahome.com/`
- Studio+: `https://sechahome.com/studio/`

No separate subdomain, DNS record, hosting service or paid hosting plan is required for the folder route. In Settings → Pages, the main repository's source must be **GitHub Actions**. Existing custom-domain and DNS configuration must already point to this site; a push alone does not verify live publication. For another static host, deploy the generated `_site/` directory rather than the repository root.

### Vercel hosting

`www.sechahome.com` responds through Vercel. `vercel.json` selects a static build using `bash tools/build-site.sh` and publishes `_site/`. This build checks out the public Studio+ `main` branch in a temporary folder, builds/tests both apps, and packages them together. The Vercel project must be connected to `jplovensa/secha_group_website`, production branch `main`, with the repository root as its Root Directory. No SPA rewrite should replace `/studio/` with the home page.

Vercel builds on main-repository pushes. Studio+-only pushes require a Vercel redeploy (with build cache disabled if its source is unchanged) or a configured Vercel Deploy Hook; the GitHub Pages hourly sync does not redeploy Vercel. No Vercel credential or deploy-hook URL is stored in this repository. Domain/project access is needed to verify the live deployment and configure an automatic Vercel trigger.

For a combined local preview:

```sh
# Clone the independent public repository beside this checkout, if absent.
git clone https://github.com/jplovensa/sechastudio-.git ../sechastudio-integration
(cd ../sechastudio-integration && npm ci && npm run build && npm test)
npm test
python3 tools/prepare-site.py --studio-source ../sechastudio-integration
(cd _site && python3 ../tools/dev-server.py --port 4175)
# Open http://127.0.0.1:4175/studio/
```

The new app retains its own catalogue, room configurations, cart, opening film and WhatsApp order-request flow. It has no payment or order-storage backend. Future Studio+ changes belong in its repository; deployment integration changes belong here. The home page's Style DNA endpoint remains a separate configuration.

## Replayable intro and renovation planning

The opening film has play/pause, seek, and footer replay controls on both pages and runs on each full page load. Its automatic run releases the page after a 2.5-second startup failure or an 8-second playback stall. Reduced-motion and Save-Data skip the automatic intro. Manual replay stays open for playback control. Studio WebGL loads when a showroom section approaches the viewport, after the intro closes.

`assets/loan-model.js` contains independent flat-interest and reducing-balance calculations. The guided simulator uses editable **example** assumptions (12% p.a. / 1% monthly equivalent, reducing balance, 2% one-time SECHA service fee, 0% adjustable bank/admin fee, 12 months); financing input spans IDR 20–500 million. These are owner-provided calculator defaults, not confirmed Amar Bank terms. Insurance is excluded; insurance and early repayment follow the financing partner. Fees are paid upfront and excluded from the monthly payment. No old rate table was found in the uploaded site files. The simulator opens from its own desktop/mobile Loan Simulator menu item and finishes independently. The Amar Bank banner and financing CTAs open the separate reference form and bank handoff. The simulator does not submit an application or provide an approval.

The Media & Recognition section uses the owner-provided publication catalogue across Media Coverage, Awards & Recognition, and Press Releases. Cards preserve supplied titles, publishers, and exact URLs; Forbes is identified as PDF. Forbes India and D Globalist share one DGEMS recognition identifier, while CEO awards name Josephine Petra Lovensa. See [research/recognition.md](research/recognition.md) for source provenance.

## Style DNA quiz and lead delivery

The home page has a Style DNA section and desktop/mobile menu action. Eight paired questions produce one of 16 design signatures across palette, form, expression, and room use. It is a furniture preference game, not a psychological test. For mixed pairs, the first response sets the signature and the result explicitly marks that dimension as balanced. The result appears before contact collection.

Lead capture requires a public browser-safe endpoint in `assets/lead-config.js`. The endpoint is currently unset while the owner supplies its URL/contract. Submission is disabled until configured; the result remains usable. Never add a private API key to frontend source. The initial adapter expects a JSON POST, a successful HTTP 2xx response, and CORS permission for the deployed site origin. Configure the adapter to the actual endpoint contract before enabling it.

The proposed JSON payload contains `source: "secha_style_dna"`, `name`, `phone`, `location`, explicit `consent`, `language`, `styleCode`, `styleName`, `answers` (eight 0/1 values), `preferences` (labels and balanced flags), and `recommendations`. No contact data is stored in browser storage. Closing the modal clears the contact inputs; failed submission retains details for retry. No lead is reported received before a successful endpoint response. Use the endpoint's own validation, abuse protection, retention controls, and server-side credentials.

The home opening film attempts automatic playback on every full page load/refresh. The separately maintained Studio+ app has its own replayable opening film. Reduced-motion and Save-Data preferences still skip automatic playback; media errors and autoplay restrictions still release the page safely. Manual replay remains available.

## Featured Work showcase

`assets/video/gsih-mcc-showcase.mp4` is the supplied GSIH/MCC film converted from 3840×2160 HEVC to 1280×720 H.264 (8-bit YUV420p) with AAC stereo audio and fast-start MP4. Duration is preserved at 51.093 seconds. Output: 5,957,446 bytes, compared with 15,660,855 bytes for the uploaded source (62% smaller and comfortably below GitHub's 100 MiB file limit). Only the compressed film, a lightweight poster, and the prepared web logo asset are committed.

The Featured Work section uses an explicit Watch button and `preload="none"`; the movie is requested after a visitor chooses to watch. Native controls then provide pause, seek, volume, and fullscreen. Without JavaScript, native controls remain available. The poster and both supplied logo references are displayed with the project. Project branding uses a compact transparent asset directly on the section background, following the uploaded proposal's restrained logo treatment. Shared `.section-pad` spacing gives Media and Style DNA headings breathing room above dividers, with 100px desktop / 65px mobile section padding.

## Private Amar Bank banner click report (GA4)

`assets/analytics-config.js` holds the owner-supplied public GA4 Web stream measurement ID, `G-0923E992Z4`. Tracking is configured for this stream; clearing the ID disables script loading and event queuing. The independent `assets/analytics-bootstrap.js` head module initializes the Google tag even if an unrelated application module fails. A page view is sent on each home-page load so GA4 can detect active collection, alongside the custom banner counter. Page location and referrer exclude query strings and fragments.

Create an account/property at https://analytics.google.com/ using the owner's Google account. Set the reporting timezone to Asia/Jakarta and currency to IDR, choose a Web data stream with URL `https://www.sechahome.com`, and copy its Measurement ID (`G-…`). **Turn off Enhanced Measurement in this stream before connecting it.** Automatic outbound-link measurement would otherwise send the bank URL, which can contain a phone number and enquiry identifier. The custom event deliberately sends neither.

Set `measurementId` in `assets/analytics-config.js` to that public ID and push to `main`; Vercel deploys the integration. Never place passwords, service-account credentials or a Measurement Protocol API secret in this file. The owner must create the property and grant any account access through Google directly.

The private event is `amar_bank_banner_click`. It counts each left click (including Ctrl/Cmd-click), keyboard activation and middle click; right-click menu openings, page views and other financing CTAs do not count. Every activation has `value: 1`, `placement: amar_bank_banner`, the current `language` and interaction type. GA4's Event count is the total activations, not unique visitors. Name, phone, bank URL and SECHA reference are excluded from the custom event. The initial page view is separate and does not increase the banner-click count. Loading or blocking analytics does not prevent the existing banner/form journey.

Verify in GA4 Realtime after deployment, then use Reports → Engagement → Events and filter by `amar_bank_banner_click`. If those reports are absent in the chosen GA4 report collection, use Explore: dimension **Event name**, metric **Event count**, filter **Event name exactly matches amar_bank_banner_click**. Standard reports can take 24–48 hours to populate; counts are subject to analytics blockers. Marking this click as a key event is optional; it is not a completed bank application.

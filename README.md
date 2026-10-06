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

The form validates contact details in memory and creates a reference. It does **not** submit contact details to SECHA or Amar Bank, save them to local storage, or create an application. Details are cleared when the modal closes. Only a reference and campaign parameters are included in the external bank URL; the visitor explicitly opens the application with the success-state link. Bank-side support for the reference parameters and application approval were not verified. A real lead capture service is needed if SECHA should receive enquiries.

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

## Studio+ on the same domain

The Studio+ upload is refactored into `studio/index.html` and small modules for data, modal content, showroom scenes, selections, and the design brief. All fonts and imagery are local. Three.js 0.128.0 is vendored with its MIT license. The page keeps working if WebGL is unavailable.

Deploy the complete repository root to the host already serving `sechahome.com`. The routes are:

- Home: `https://sechahome.com/`
- Studio+: `https://sechahome.com/studio/`

`studio/` links use relative paths so the same files also work under a GitHub Pages repository path. Existing domain ownership, DNS, HTTPS, and live deployment are not configured or verified by adding this folder. No subdomain or separate host is needed.

For CSS development, run `npm ci` and `npm run build:studio`. Tailwind 3.4.17 is pinned in the lockfile; deployment uses the committed `studio/assets/utilities.css`, so it requires no runtime CDN or build service.

Studio+ prices are retained from the upload and are estimates pending studio confirmation. There is no payment processing or lead-submission endpoint. The final questionnaire step opens a WhatsApp brief containing room size, package, preferences, and shortlisted materials. The visitor chooses whether to send the message.

## GitHub Pages publication

`.github/workflows/pages.yml` tests and publishes the committed static website on pushes to `main`. In repository Settings → Pages, the source must be **GitHub Actions**. The artifact contains only the public pages and their assets. Utility CSS is already compiled; no installation or third-party CDN is needed on the runner.

The workflow's deployment result supplies the live URL. A custom domain such as `sechahome.com` requires that domain to be mapped to this repository's Pages site with matching DNS. The `/studio/` folder needs no extra mapping once the parent site is hosted. Do not assume domain configuration or deployment success from a Git push alone.

The room-assembly intro is shared between home and Studio+ and plays once across both pages in a tab session. Its phase labels and progress follow video playback. Background inert states are preserved when it closes.

## Studio+ customer journey rebuild

Studio+ now uses the same navy, ivory, bronze, and self-hosted Inter system as SECHA. The page moves through home/property purpose, design examples, package scope and fees, delivery process, optional material exploration, a project brief, and FAQs.

The five-step brief collects purpose → design direction → room size → design package → review. Package buttons preserve the full journey rather than skip essential choices. The material shortlist updates the final WhatsApp brief; it supports replacement and removal without duplicate entries. Dialogs and shortlist drawers trap keyboard focus and restore it on close.

The user requested https://www.themakeover.my/ as a sequence reference. The site was inaccessible due to the environment network policy, so this revision uses a SECHA-specific customer journey and does not claim to reproduce that site's observed sequence. No reference content or screenshots were fabricated.

## Replayable intro and renovation planning

The opening film has play/pause, seek, and footer replay controls on both pages. Its automatic run releases the page after a 2.5-second startup failure or an 8-second playback stall. Reduced-motion and Save-Data skip the automatic intro. Manual replay stays open for playback control. Studio WebGL loads when a showroom section approaches the viewport, after the intro closes.

`assets/loan-model.js` contains independent flat-interest and reducing-balance calculations. The guided simulator uses editable **example** assumptions (12% p.a. / 1% monthly equivalent, reducing balance, 2% one-time SECHA service fee, 0% adjustable bank/admin fee, 12 months); financing input spans IDR 20–500 million. These are owner-provided calculator defaults, not confirmed Amar Bank terms. Insurance is excluded; insurance and early repayment follow the financing partner. Fees are paid upfront and excluded from the monthly payment. No old rate table was found in the uploaded site files. The simulator passes users to the existing reference form and bank handoff; it does not submit an application or provide an approval.

The media section links to the owner-provided SpotNews article. Specific recognition cards are built but held from public display until independently sourced. See [research/recognition.md](research/recognition.md) for the research blocker and verification requirements.

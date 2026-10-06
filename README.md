# SECHA

A responsive, bilingual renovation website rebuilt from the supplied SECHA archive. Uses local fonts and images, semantic HTML, CSS, and native JavaScript modules. No production server dependencies. Studio+ utility CSS is compiled and committed for static deployment.

## Develop

Requires Python 3 and Node.js 20+ for tests.

```sh
npm run dev
npm test
```

The development server listens on port 4173. Stop it with Ctrl+C. Serve the repository root with any static web host, including GitHub Pages. Relative asset paths work under a repository subpath. ES modules require HTTP serving rather than opening the HTML file directly.

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

`assets/video/furniture-assembly.mp4` is a four-second, silent H.264 film showing the modular assembly of an oak lounge chair. It plays once per tab session, with Skip and Escape controls, a six-second maximum wait, and immediate bypass for reduced motion or data-saving preferences. Playback failures reveal the site. No JavaScript means the intro stays hidden.

To reproduce the video, install Blender and FFmpeg and run from the repository root:

```sh
blender -b -t 2 -P tools/render-preloader.py -- /tmp/secha-frames
ffmpeg -y -framerate 24 -i /tmp/secha-frames/%04d.png -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart assets/video/furniture-assembly.mp4
ffmpeg -y -i /tmp/secha-frames/0086.png -frames:v 1 assets/video/furniture-assembly-poster.jpg
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

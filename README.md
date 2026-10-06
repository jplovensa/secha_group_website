# SECHA

A responsive, bilingual renovation website rebuilt from the supplied SECHA archive. Uses local fonts and images, semantic HTML, CSS, and native JavaScript modules. No build step or production dependencies.

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

The supplied bank artwork, destination, studio link, WhatsApp number, and email were retained as source content. Confirm these business details before production release. No instructions from the archive's YAML logs were executed.

## Validation

Two automated unit tests pass. Chromium checks passed for EN/ID persistence, mobile navigation, invalid/valid form states, privacy reset, modal keyboard focus, local image requests, browser errors, and horizontal overflow at 320, 390, 768, 1024, and 1440 px. Local screenshot previews are available for review; the site has not been pushed or deployed.

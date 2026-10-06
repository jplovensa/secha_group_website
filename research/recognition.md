# Recognition verification queue

The requested search skill is not installed. Direct internet research on 2026-10-06 was blocked by the environment proxy (CONNECT 403), including Google, Forbes India, and Antler. Host additions have been saved to the environment configuration draft; they must be applied to enable research. No external recognition source has been verified in this change. The owner supplied https://getspotnews.com/biz/1091; that article also returned CONNECT 403. Its domain is now saved in the draft. The live media section may link to the owner-provided article without attributing specific accolades to it.

The owner supplied the following leads. These are not independent evidence:

| Lead | Required evidence before publication |
| --- | --- |
| Forbes India / D Globalist / Select 200 | Exact article/selection URL, year, company identity, and exact award/program name |
| Startup Studio Indonesia | Official cohort listing and year; confirm participation rather than investment |
| Antler | Official portfolio listing or announcement supporting the backing claim |
| Startupbootcamp | Official portfolio/cohort listing and program/year |
| BonBillo | Official company/cohort/investment announcement and relationship |

`assets/recognition-data.js` keeps these entries pending. The owner-provided SpotNews article appears as a media link. Specific accolade cards remain hidden until an entry has `status: 'verified'` and a source containing `url` and an exact supporting `quote`. Preserve a citation's verified relationship and year in the card copy. A publisher homepage alone is not evidence.

The local screenshot preview invokes `renderRecognition({preview: true})` through browser QA and labels every card as awaiting verification. This is not enabled by a public URL or query parameter.

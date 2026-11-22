# BNB Review Journal

Company-owned evidence review resource published by My BnB Accelerator, LLC.
It is not an independent rating service. Fictional packets do not represent
customer reviews, property observations or verified operating results.

Build and routing gate:
`node scripts/build.mjs && node scripts/verify-canonical-routing.mjs`

Validate with `node scripts/test-models.mjs`,
`node scripts/test-balloon-illustration.mjs`,
`python3 scripts/review-articles.py`,
`python3 scripts/test-collections.py`,
`python3 scripts/test-specificity-collection.py`,
`python3 scripts/test-all-collections.py`, and `python3 scripts/validate.py`.

## Canonical topic collections

The site publishes 67 canonical pages: six original base pages, forty evidence
question owners, twenty method references and the library hub. All 1,600 original
case explanations are preserved inside the forty topic owners. Each topic varies
forty evidence conditions around one fictional fact packet; these are not forty
independent observations. No standalone workbook pages remain in the sitemap.
All 3,200 former workbook URL forms permanently redirect to matching case anchors.

Each topic has forty isolated case worksheets and a separate parent worksheet:
1,640 worksheet scopes in total. Every case retains its former local-save path;
the parent keeps its original topic path. Entries are read only when the visitor
presses Load saved entries. There is no automatic storage read or transmission.
Export, print, save, load and reset apply to the selected worksheet. A status
marked reviewed is the visitor's selection, not independent verification.

Sources live in `content/catalog.json`, `content/page-articles/*.json`,
`content/topic-dossiers.json` and `content/core-guides.json`. The reviewed cohort
of thirty-eight newly collected topics is explicit in
`content/collection-cohort.json`; future topics are not automatically included.
The two earlier nightly-rate and review-specificity renderers are preserved.

When editing source case articles, run
`python3 scripts/review-articles.py --approve` and repeat the release checks.
Approval is an automated content/evidence/arithmetic fingerprint review, not
independent professional verification. The build rejects changed fingerprints.

Generated `public/library` and `public/workbooks` folders are ignored in Git and
rebuilt from committed sources. Original base pages and browser assets are tracked.
Publish through GitHub main and verify the canonical origin separately; a green
build alone does not prove the live content matches. Search Console submissions,
Google discovery, indexing and rankings are separate states.

Custom domains remain deferred. See DEPLOYMENT.md. Google indexing is not guaranteed.

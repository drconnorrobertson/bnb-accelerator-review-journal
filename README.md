# BNB Review Journal

Independent static resource project for My BnB Accelerator, LLC.

Build: `node scripts/build.mjs`

Validate: `node scripts/test-models.mjs` and `python3 scripts/validate.py`

Catalog: `content/catalog.json`. Site configuration: `content/site.json`. Edit source catalogs rather than generated routes. Node only; no dependencies or installation required. Vercel runs the same build from main.

Search policy: every content page is index eligible and included in sitemap.xml. The 1,600 developed hypothetical cases each have a standalone answer, worked evidence or arithmetic, interpretation, next steps and an editable worksheet. Fictional teaching packets are clearly disclosed and do not represent customer results. Google indexing is not guaranteed.

Article sources: content/page-articles/*.json and, for evidence sites, content/topic-dossiers.json. Run `python3 scripts/review-articles.py --approve` after editing articles, then build and validate. Approval records automated content, evidence/arithmetic and similarity checks. The build verifies each content fingerprint before publishing index,follow. This is not independent professional verification.

Generated folders `public/library` and `public/workbooks` are intentionally ignored in Git and rebuilt on every deployment. Original core pages and shared browser assets are tracked. Sources and reports are outside the public output.

Original core-guide articles live in `content/core-guides.json` and render only on their matching existing topic pages. The balloon-balance example uses a separately checked amortization calculation. After changing that illustration or its renderer, run `node scripts/test-balloon-illustration.mjs`, then build and run the full validator. Preserve the fictional-example and source-scope disclosures.

Custom domains remain deferred. Set SITE_ORIGIN or change content/site.json when connecting the chosen host, and migrate canonical URLs on the existing base pages in the same commit. See DEPLOYMENT.md.

## Nightly-rate case collection

The nightly-rate topic groups its forty fictional evidence conditions on one
canonical guide. All source case articles and their approved fingerprints remain
in `content/page-articles/nightly-rate-average.json`. Each case has its own
expandable section and isolated editable checklist. Exact permanent redirects
map both slash forms of each former workbook URL to its case anchor. Other
topics continue to publish their existing standalone workbooks.

The collection retains the original local-save key for every worksheet. Entries
are read only when the visitor presses Load saved entries; there is no automatic
local-storage read or transmission. The new parent checklist keeps the original
parent URL's save key as well. Export and print controls apply to one checklist.

After building, run `python3 scripts/test-collections.py` in addition to the
existing model, source-article and site validators. It checks all forty original
explanations against the embedded text, forty-one unique worksheet scopes and
legacy save paths, label/ID integrity, and all eighty explicit redirect rules.
A generated sitemap has 1,587 canonical pages; 1,600 source cases still exist
(1,520 standalone and eighty in two collections). These automated checks do not
establish that Google has indexed a page or judged its search value.


## Review-specificity case collection

The existing original source-to-claim guide now collects all forty fictional
review-specificity evidence conditions on its canonical topic page. Its original
core guide and every full case explanation are preserved. These are variations
around one fictional feedback packet, not forty customer experiences. No new
customer quotations, financial outcomes or ratings are supplied.

Each example has an isolated editable checklist and retains its former local
save path. The parent retains its own original path. Filtering and old case
URLs open the matching example; all eighty former URL forms permanently redirect
directly to the corresponding anchor. The nightly-rate collection and its
runtime assets remain unchanged.

Run `python3 scripts/test-specificity-collection.py` as well as the existing
nightly-rate collection tests. Together they check eighty preserved articles and
eighty-two worksheet scopes. The source case count stays 1,600; 1,520 remain
standalone and eighty are collected. The 1,587 sitemap entries establish the
published canonical population, not Google's indexed population.

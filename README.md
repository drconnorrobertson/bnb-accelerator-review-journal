# BNB Review Journal

Independent static resource project for My BnB Accelerator, LLC.

Build: `node scripts/build.mjs`

Validate: `node scripts/test-models.mjs` and `python3 scripts/validate.py`

Catalog: `content/catalog.json`. Site configuration: `content/site.json`. Edit source catalogs rather than generated routes. Node only; no dependencies or installation required. Vercel runs the same build from main.

Search policy: every content page is index eligible and included in sitemap.xml. The 1,600 developed hypothetical cases each have a standalone answer, worked evidence or arithmetic, interpretation, next steps and an editable worksheet. Fictional teaching packets are clearly disclosed and do not represent customer results. Google indexing is not guaranteed.

Article sources: content/page-articles/*.json and, for evidence sites, content/topic-dossiers.json. Run `python3 scripts/review-articles.py --approve` after editing articles, then build and validate. Approval records automated content, evidence/arithmetic and similarity checks. The build verifies each content fingerprint before publishing index,follow. This is not independent professional verification.

Generated folders `public/library` and `public/workbooks` are intentionally ignored in Git and rebuilt on every deployment. Original core pages and shared browser assets are tracked. Sources and reports are outside the public output.

Custom domains remain deferred. Set SITE_ORIGIN or change content/site.json when connecting the chosen host, and migrate canonical URLs on the existing base pages in the same commit. See DEPLOYMENT.md.

# BNB Review Journal

Independent static resource project for My BnB Accelerator, LLC.

Build: `node scripts/build.mjs`

Validate: `node scripts/test-models.mjs` and `python3 scripts/validate.py`

Catalog: `content/catalog.json`. Site configuration: `content/site.json`. Edit source catalogs rather than generated routes. Node only; no dependencies or installation required. Vercel runs the same build from main.

Search policy: core guides and references are indexable; the 1,600 hypothetical example workspaces use noindex,follow and are excluded from the search sitemap. They remain navigable and functional. No invented customer reviews, property records or verified financial outcomes.

Generated folders `public/library` and `public/workbooks` are intentionally ignored in Git and rebuilt on every deployment. Original core pages and shared browser assets are tracked. Sources and reports are outside the public output.

Custom domains remain deferred. Set SITE_ORIGIN or change content/site.json when connecting the chosen host, and migrate canonical URLs on the existing base pages in the same commit. See DEPLOYMENT.md.

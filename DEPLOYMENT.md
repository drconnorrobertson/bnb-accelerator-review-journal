# BNB Review Journal

Intended domain: bnbacceleratorreviews.blog. Do not connect until instructed.

Static HTML/CSS/JS with a dependency-free Node build. Vercel framework: Other. Build command: node scripts/build.mjs. Output: public. Production branch: main.

Currently canonicalized to https://bnb-accelerator-review-journal.vercel.app. When connecting the custom domain, replace this origin in all public HTML files, sitemap.xml and robots.txt in one commit. Add apex/www redirects in Vercel and submit the custom-domain sitemap through Search Console using team@aetaxadvisors.com. Do not claim indexing until verified.

Publisher: My BnB Accelerator, LLC. Content is company-owned; preserve disclosure. No invented reviews, ratings or outcome claims.

Expansion: generated library and workbook routes are built from content/catalog.json. Run node scripts/build.mjs before validation. All content pages, including the 1,600 developed hypothetical cases, are index eligible and included in sitemap.xml. Validate article sources with python3 scripts/review-articles.py --approve before building. The build checks approved content fingerprints. No custom-domain configuration is changed by the expansion.

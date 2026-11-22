# BNB Review Journal publication

Production branch: GitHub main. Canonical origin:
https://bnb-accelerator-review-journal.vercel.app.
Intended custom domain bnbacceleratorreviews.blog remains deferred; do not connect
it until instructed. This release does not change domain or account access.

The committed hosting configuration runs:
`node scripts/build.mjs && node scripts/verify-canonical-routing.mjs`
Output directory: `public`. There are no package installation dependencies.

Publish source changes through GitHub, check the exact commit's build status,
then verify canonical-origin content and redirects against the local build.
Generated library/workbook directories are ignored in Git. Sources and the
tracked sitemap are committed; generated owners are rebuilt on publication.

The current sitemap has 67 canonical owners. All 1,600 fictional case articles
and 1,640 editable worksheets are embedded in forty topic collections. Former
workbook URLs redirect to their matching cases and are excluded from the sitemap.
Follow the README validation commands before publishing changes.

Use Google Search Console directly in the browser with team@aetaxadvisors.com.
Submit changed sitemap content only after live verification. Record submission,
discovery, indexing and rankings separately. A processed sitemap is not proof of
indexing. Preserve company-publisher and fictional-example disclosures.

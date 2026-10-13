# How to upload this bundle (SEO implementation, 13 Oct 2026)

1. GitHub -> indevastudio/indevastudio -> Add file -> Upload files.
2. Drag in the CONTENTS of this folder (keep folders: assets/, services/, locations/, insights/, scripts/, .github/).
   If the uploader drops the hidden `.github` folder, create `.github/workflows/seo-build.yml` by hand
   (Add file -> Create new file, paste the contents of the file in this bundle).
3. Commit to main. Then in Vercel confirm a new deployment finished, and purge Cloudflare's cache
   (Caching -> Configuration -> Purge Everything).
4. Optional clean-up in GitHub: delete the old root copies `seo-apply.cjs` and `seo-build.yml`
   (they now live in scripts/ and .github/workflows/ and are excluded from the deploy either way).
5. Check: /about shows "we don't have a legacy…" as its heading; /services/residential-interior-design,
   /locations/narela and /sitemap.xml (173 URLs) load.

Full details: SEO_IMPLEMENTATION_REPORT.md

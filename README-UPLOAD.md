# Yash Tate’s engineering portfolio

The site uses static HTML and CSS. To preview it from the repository root, run `python3 -m http.server 4173` and open `http://localhost:4173`.

## Update content

- Edit `index.html` to update the RLL internship, homepage introductions, project cards or contact links.
- Place new photos in `assets/`. The homepage marks the places to replace the portrait and add RLL or dyno photos. Update each image’s alternative text and dimensions when replacing it.
- To add a project, copy an existing project HTML page, update the title, introduction and sections, then link to it from Selected projects. Use relative paths so the same files work under the GitHub Pages repository path.
- Replace `Yash-Tate-Resume.pdf` in the repository root to update the résumé links across the site.

## Publish

This repository’s GitHub Pages workflow runs on pushes to `main`. Preview changes on a separate branch, then merge them to `main` when ready. Check the Pages workflow under **Actions** for the deployment result.

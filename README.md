# Yash Tate’s engineering portfolio

Static HTML, CSS, and JavaScript for [the portfolio](https://yashtate.github.io/yash-tate/). The homepage, projects index, Baja team page, résumé, and published case studies work with JavaScript disabled. JavaScript adds the skills animation control, section entrances, a desktop cursor highlight, and an image viewer. Motion follows the visitor’s reduced-motion setting.

## Preview and build

Serve the repository root with `python3 -m http.server 8000` and open `http://localhost:8000/`. Previewing the checked-in site only requires a static server.

For content edits, install Python 3.11 or newer and Pandoc 2.17 or newer. Then run from the repository root:

```sh
python3 .portfolio/build.py
```

The command writes HTML and the sitemap into the repository root. Commit both your content edits and the rebuilt files. The existing GitHub Pages workflow publishes the static files when you push to `main`. Its deployment status appears under **Actions → Deploy static content to Pages**.

## Edit the site

| Content | File or directory |
| --- | --- |
| Name, incoming RLL role, dates, education, contact links, skills and production URL | `.portfolio/profile.json` |
| Photos, alt text, native dimensions, responsive variants and captions | `.portfolio/media.json` and `assets/` |
| Portrait | `assets/yash-tate.webp`, cropped from the existing `hero-yash-tate.jpeg` |
| Résumé web view | `.portfolio/templates/resume.html` |
| Résumé download | `Yash-Tate-Resume.pdf` |
| Homepage, team story, shared navigation and footer | `.portfolio/templates/`; navigation links are generated in `.portfolio/build.py` |
| Combined Baja SAE powertrain and gearbox case study and other project placeholders | `.portfolio/projects/*.md` |
| Shared layout and interactions | `styles.css`, `script.js` |

Set `SITE_URL` when building for a different public address. For example, `SITE_URL=https://example.com/ python3 .portfolio/build.py` updates canonical links, share URLs, and the sitemap together. Page and asset links stay relative for GitHub project Pages.

## Fill in another project

Open a named Markdown draft in `.portfolio/projects/` or copy `_template.md` to a new file. The filename becomes its public URL after publication. Fill in the TOML fields between the `+++` lines, then write under the Markdown headings. Delete any section you do not need.

Use `{{figure:cad}}` on its own line to insert a captioned, expandable figure from the media catalog. To add an image, put the file in `assets/`, add its entry to the catalog, and use the entry key in the Markdown or `hero` field. Set `featured = true` on exactly one published project. Set `draft = false` and rebuild when a case study is ready.

The index lists draft titles under **Case studies in preparation**. The draft text is excluded from the generated pages. The former gearbox page goes to the mount section in the powertrain case study. The four pre-existing non-Baja project URLs take readers to the corresponding index listing while those projects are drafts. The source repository itself is public, so keep confidential notes and images outside it.

## Content still to supply

- **Other projects** — The go-kart, battery manufacturing, SiDi lab, camping system, and combat robot have individual draft files. Add your contribution, a cleared photo or CAD view, and the design, fabrication, or test evidence you want recruiters to see.
- **Gearbox mount** — Add mount-specific CAD, the selected mount position and clearance, and fit-up or test results when available. The combined case study’s final section identifies the mount as in design and shows the earlier competition vehicle for context.
- **RLL** — The current entry covers the incoming May–August 2027 appointment and anticipated scope from the supplied résumé. Update the status and add approved accomplishments after the work takes place.
- **Optional technical detail** — The powertrain page distinguishes simulated results and test observations. If you want to publish more detail, supply the load case, baseline mass, or temperature measurements that support it.

The portrait and CAD come from the original portfolio. The Baja gallery uses the supplied team photos. The dark workshop background is decorative artwork.

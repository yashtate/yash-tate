# Yash J. Tate Portfolio Website

A GitHub Pages-ready portfolio website inspired by bold editorial portfolio layouts, customized for automotive, motorsport, Baja SAE, and advanced manufacturing work.

## How to edit content

Most text lives in:

```txt
data.js
```

Edit that file to update:
- Name, title, intro
- Skills
- Projects
- Experience
- Recommendation letters
- Gallery items
- Hero image paths

## How to add images

1. Put your image inside the `assets` folder.
2. Update the image path in `data.js`.

Example:

```js
image: "assets/my-baja-photo.jpg"
```

Hero photos are controlled here:

```js
heroImages: [
  "assets/hero-1.jpg",
  "assets/hero-2.jpg"
]
```

## How to add your resume

Place your resume PDF in:

```txt
assets/Yash-Tate-Resume.pdf
```

or update this line in `data.js`:

```js
resume: "assets/Yash-Tate-Resume.pdf"
```

## GitHub Pages deployment

1. Create a new GitHub repository.
2. Upload all files in this folder.
3. Go to `Settings > Pages`.
4. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Save.

Your site will publish at:

```txt
https://YOUR-GITHUB-USERNAME.github.io/REPO-NAME/
```

## Files

- `index.html` = page structure
- `style.css` = visual design
- `script.js` = renders content from data
- `data.js` = easy content editing file
- `assets/` = images, resume, recommendation letters

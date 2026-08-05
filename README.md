# Elevate Sharm Website

The public website for [elevate-sharm.com](https://elevate-sharm.com), hosted on Netlify and deployed from the `main` branch of this repository.

## Technology

- Static HTML, CSS, and JavaScript
- Netlify hosting, redirects, and form handling
- Decap CMS under `/admin/`
- YAML content in `data/`

## Project structure

```text
index.html                    Public homepage
extra-tuition.html            Legacy page, currently redirected
assets/css/style.css          Site styles and responsive layouts
assets/js/main.js             Navigation, disclosures, and form behavior
assets/js/bubble-motion.mjs   Cursor-attraction motion
data/homepage.yml             Editable homepage copy
data/footer.yml               Editable footer details
admin/config.yml              CMS content configuration
netlify.toml                  Netlify redirects and deployment settings
tests/                        Node contract and motion tests
```

## Local preview

From the repository root:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173/`. A web server is required because the page loads YAML content and JavaScript modules.

## Tests

Run the complete test suite with:

```powershell
node --test tests/site-contract.test.mjs tests/bubble-motion.test.mjs
```

## Publishing

Netlify publishes the production site when changes reach the repository's `main` branch. The homepage should not be uploaded as a ZIP because that bypasses the normal Git history and deployment workflow.

The private campus visit form is named `campus-visit`. Netlify detects it from `index.html`, stores submissions in the site's Forms area, and can send notifications configured in Netlify.

## Content editing

The homepage and footer copy are configured in `data/homepage.yml` and `data/footer.yml`. Their matching CMS fields are in `admin/config.yml`. Structural, style, animation, and behavior changes still require code edits.

## AP/SAT extra tuition page

The `/extra-tuition` and `/extra-tuition.html` routes are temporarily redirected to the homepage in `netlify.toml`. To restore that service later, remove those two forced redirect blocks and review `extra-tuition.html` before publishing.

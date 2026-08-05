# Elevate Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public Elevate homepage with the approved concise “Living Curriculum” design, preserve the School Portal and Netlify form workflow, temporarily hide AP/SAT extra tuition, and deploy the verified result to `elevate-sharm.com`.

**Architecture:** Keep the site as semantic static HTML, CSS, YAML content, and vanilla JavaScript on Netlify. Critical copy remains in HTML as an SEO/accessibility fallback; `data/homepage.yml` may overwrite it after loading. Isolate the cursor-attraction math in a small ES module so its direction and travel caps can be tested without a browser.

**Tech Stack:** HTML5, CSS, vanilla JavaScript/ES modules, YAML via the existing js-yaml CDN, Node.js built-in test runner, Netlify Forms, Netlify redirects, Decap/Netlify CMS.

---

## File map

- Create `data/homepage.yml`: one active content model for hero, benefits, process, and visit copy.
- Create `assets/js/bubble-motion.mjs`: pure attraction calculation and animation controller.
- Create `tests/site-contract.test.mjs`: static page, CMS, form, redirect, and accessibility contracts.
- Create `tests/bubble-motion.test.mjs`: direction, cap, and zero-distance unit tests.
- Replace `index.html`: semantic four-section homepage with static Netlify form fields.
- Replace `assets/css/style.css`: approved visual system, responsive rules, focus states, and reduced-motion behavior.
- Replace `assets/js/main.js`: menu, YAML hydration, bubble disclosure, process disclosure, and form submission.
- Replace `admin/config.yml`: correct `data/` paths and expose only active content.
- Modify `data/footer.yml`: update the copyright year while retaining sourced contact/location details.
- Modify `netlify.toml`: forced temporary AP/SAT redirects before the SPA fallback.
- Modify `README.md`: document the actual repository structure and editing/deployment workflow.
- Do not modify `extra-tuition.html`; retain it for later restoration.

### Task 1: Create the active homepage content model and repair CMS paths

**Files:**
- Create: `data/homepage.yml`
- Replace: `admin/config.yml:1-198`
- Modify: `data/footer.yml:1-29`
- Create: `tests/site-contract.test.mjs`

- [ ] **Step 1: Write the failing content/CMS contract**

Create `tests/site-contract.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage content model and CMS use the real data directory', async () => {
  const [homepage, cms] = await Promise.all([
    read('data/homepage.yml'),
    read('admin/config.yml'),
  ]);

  assert.match(homepage, /heading: "A high school built around your child\."/);
  assert.match(homepage, /We help every student work toward a strong GPA\./);
  assert.match(homepage, /primary_cta: "Book a private visit"/);
  assert.match(cms, /file: "data\/homepage\.yml"/);
  assert.doesNotMatch(cms, /file: "_data\//);
});
```

- [ ] **Step 2: Run the contract and verify it fails**

Run: `node --test --test-name-pattern="homepage content model" tests/site-contract.test.mjs`  
Expected: FAIL because `data/homepage.yml` does not exist.

- [ ] **Step 3: Create the approved content model**

Create `data/homepage.yml` with this exact structure and copy:

```yaml
seo:
  title: "Elevate High School | American Diploma in Sharm El Sheikh"
  description: "A personal Grades 9–12 high school experience in Sharm El Sheikh with small classes, close guidance, and an accredited US diploma."
hero:
  kicker: "Admissions open · Grades 9–12"
  heading: "A high school built around your child."
  supporting: "Small classes. Personal guidance. A fully accredited US diploma in Sharm El Sheikh."
  primary_cta: "Book a private visit"
  secondary_cta: "Discover Elevate"
  proof_points:
    - "US diploma"
    - "Grades 9–12"
    - "Small groups"
    - "Sharm campus"
  topics:
    - key: "interests"
      label: "Interests"
      title: "Start with the student"
      text: "We begin with your child’s strengths, interests and future goals."
    - key: "curriculum"
      label: "Curriculum"
      title: "Shape the right programme"
      text: "A flexible American curriculum becomes a clear, personal learning plan."
    - key: "guidance"
      label: "Guidance"
      title: "Never just a number"
      text: "Small groups and close mentoring keep every student seen and supported."
    - key: "future"
      label: "Future"
      title: "Move forward with confidence"
      text: "Diploma credits, SAT focus and university planning stay connected. We help every student work toward a strong GPA."
benefits:
  eyebrow: "Why parents choose Elevate"
  heading: "The best of both worlds."
  items:
    - title: "Personal attention"
      text: "Small groups. Teachers who know every student."
    - title: "Flexible learning"
      text: "A path shaped around strengths and goals."
    - title: "Recognised diploma"
      text: "An accredited US programme through Bridgeway."
process:
  eyebrow: "How Elevate works"
  heading: "Simple. Personal. Focused."
  steps:
    - title: "We meet your child"
      text: "We listen to their strengths, needs and future goals."
    - title: "We build their plan"
      text: "Subjects and credits become one clear personal plan."
    - title: "We guide them forward"
      text: "Teachers and mentors keep progress moving."
visit:
  eyebrow: "See Elevate for yourself"
  heading: "Come and meet us."
  text: "A short private visit is the easiest way to understand whether Elevate is right for your child."
  form_heading: "Book a private campus visit"
  submit_text: "Request a visit"
  tuition_guide_text: "Send me the current tuition guide"
```

- [ ] **Step 4: Replace the CMS configuration**

Replace `admin/config.yml` with:

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "assets/images"
public_folder: "/assets/images"

collections:
  - name: "pages"
    label: "Pages"
    files:
      - name: "homepage"
        label: "Homepage"
        file: "data/homepage.yml"
        fields:
          - label: "SEO"
            name: "seo"
            widget: "object"
            fields:
              - { label: "Page title", name: "title", widget: "string" }
              - { label: "Description", name: "description", widget: "text" }
          - label: "Hero"
            name: "hero"
            widget: "object"
            fields:
              - { label: "Kicker", name: "kicker", widget: "string" }
              - { label: "Heading", name: "heading", widget: "string" }
              - { label: "Supporting line", name: "supporting", widget: "text" }
              - { label: "Primary action", name: "primary_cta", widget: "string" }
              - { label: "Secondary action", name: "secondary_cta", widget: "string" }
              - label: "Proof points"
                name: "proof_points"
                widget: "list"
                field: { label: "Point", name: "point", widget: "string" }
              - label: "Interactive topics"
                name: "topics"
                widget: "list"
                fields:
                  - { label: "Key", name: "key", widget: "select", options: ["interests", "curriculum", "guidance", "future"] }
                  - { label: "Label", name: "label", widget: "string" }
                  - { label: "Expanded title", name: "title", widget: "string" }
                  - { label: "Expanded explanation", name: "text", widget: "text" }
          - label: "Benefits"
            name: "benefits"
            widget: "object"
            fields:
              - { label: "Eyebrow", name: "eyebrow", widget: "string" }
              - { label: "Heading", name: "heading", widget: "string" }
              - label: "Items"
                name: "items"
                widget: "list"
                fields:
                  - { label: "Title", name: "title", widget: "string" }
                  - { label: "Text", name: "text", widget: "text" }
          - label: "Process"
            name: "process"
            widget: "object"
            fields:
              - { label: "Eyebrow", name: "eyebrow", widget: "string" }
              - { label: "Heading", name: "heading", widget: "string" }
              - label: "Steps"
                name: "steps"
                widget: "list"
                fields:
                  - { label: "Title", name: "title", widget: "string" }
                  - { label: "Explanation", name: "text", widget: "text" }
          - label: "Visit"
            name: "visit"
            widget: "object"
            fields:
              - { label: "Eyebrow", name: "eyebrow", widget: "string" }
              - { label: "Heading", name: "heading", widget: "string" }
              - { label: "Supporting line", name: "text", widget: "text" }
              - { label: "Form heading", name: "form_heading", widget: "string" }
              - { label: "Submit button", name: "submit_text", widget: "string" }
              - { label: "Tuition guide option", name: "tuition_guide_text", widget: "string" }
      - name: "footer"
        label: "Footer and contact"
        file: "data/footer.yml"
        fields:
          - label: "Footer sections"
            name: "sections"
            widget: "list"
            fields:
              - { label: "Section title", name: "title", widget: "string" }
              - label: "Content"
                name: "content"
                widget: "list"
                fields:
                  - { label: "Text", name: "text", widget: "string" }
                  - { label: "Link", name: "link", widget: "string", required: false }
          - label: "Location"
            name: "location"
            widget: "object"
            fields:
              - { label: "Latitude", name: "latitude", widget: "number", value_type: "float" }
              - { label: "Longitude", name: "longitude", widget: "number", value_type: "float" }
              - { label: "Zoom", name: "zoom", widget: "number", value_type: "int" }
          - { label: "Copyright", name: "copyright", widget: "string" }
```

- [ ] **Step 5: Update the footer year**

Change `© 2025 Elevate Learning Center, Sharm El-Sheikh` to `© 2026 Elevate Learning Center, Sharm El-Sheikh`; retain `info@elevate-sharm.com`, `+20 1157925051`, the Hadaba location, and partnership links unchanged.

- [ ] **Step 6: Run the focused and complete contracts**

Run: `node --test tests/site-contract.test.mjs`  
Expected: PASS, 1 test.

- [ ] **Step 7: Commit the content/CMS unit**

```powershell
git add -- data/homepage.yml admin/config.yml data/footer.yml tests/site-contract.test.mjs
git commit -m "Add concise homepage content model"
```

### Task 2: Make AP/SAT extra tuition temporarily unavailable

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `netlify.toml:1-23`

- [ ] **Step 1: Add the failing redirect-order contract**

Append:

```js
test('extra tuition routes redirect before the catch-all', async () => {
  const config = await read('netlify.toml');
  const shortRoute = config.indexOf('from = "/extra-tuition"');
  const htmlRoute = config.indexOf('from = "/extra-tuition.html"');
  const catchAll = config.indexOf('from = "/*"');

  assert.ok(shortRoute >= 0);
  assert.ok(htmlRoute >= 0);
  assert.ok(shortRoute < catchAll);
  assert.ok(htmlRoute < catchAll);
  assert.match(config, /status = 302[\s\S]*force = true/);
});
```

- [ ] **Step 2: Run it and verify failure**

Run: `node --test --test-name-pattern="extra tuition routes" tests/site-contract.test.mjs`  
Expected: FAIL because neither explicit route exists.

- [ ] **Step 3: Add forced redirects above the catch-all**

Insert immediately before the existing `/*` redirect:

```toml
[[redirects]]
  from = "/extra-tuition"
  to = "/"
  status = 302
  force = true

[[redirects]]
  from = "/extra-tuition.html"
  to = "/"
  status = 302
  force = true
```

- [ ] **Step 4: Run tests and commit**

Run: `node --test tests/site-contract.test.mjs`  
Expected: PASS, 2 tests.

```powershell
git add -- netlify.toml tests/site-contract.test.mjs
git commit -m "Temporarily redirect extra tuition pages"
```

### Task 3: Replace the homepage with the approved semantic four-section structure

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Replace: `index.html:1-546`

- [ ] **Step 1: Add failing homepage/form/accessibility contracts**

Append:

```js
test('homepage exposes the approved concise structure and no extra tuition link', async () => {
  const html = await read('index.html');
  for (const id of ['hero', 'why-elevate', 'how-it-works', 'visit']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /A high school built around <span>your child\.<\/span>/);
  assert.match(html, /We help every student work toward a strong GPA\./);
  assert.match(html, /href="https:\/\/portal\.elevate-sharm\.com\/login"/);
  assert.match(html, /assets\/images\/Elevate%20Logo\.png/);
  assert.doesNotMatch(html, /href="(?:\.\/)?extra-tuition\.html"/);
  assert.doesNotMatch(html, /Tap the bubbles to learn more/i);
  assert.doesNotMatch(html, /85,000|1,715|September 2025|HarvardX/);
});

test('private visit form is statically detectable by Netlify', async () => {
  const html = await read('index.html');
  assert.match(html, /<form[^>]+name="campus-visit"[^>]+data-netlify="true"/);
  assert.match(html, /name="form-name" value="campus-visit"/);
  for (const name of ['parent-name', 'contact', 'student-grade', 'tuition-guide']) {
    assert.match(html, new RegExp(`name="${name}"`));
  }
});

test('bubble disclosures expose keyboard and assistive-technology hooks', async () => {
  const html = await read('index.html');
  assert.equal((html.match(/class="topic-bubble/g) || []).length, 4);
  assert.equal((html.match(/class="topic-bubble[^"]*"[^>]+aria-expanded="false"/g) || []).length, 4);
  assert.match(html, /id="topic-popover"[^>]+aria-hidden="true"/);
  assert.match(html, /aria-label="Close explanation"/);
});
```

- [ ] **Step 2: Run the new contracts and verify failure**

Run: `node --test tests/site-contract.test.mjs`  
Expected: 3 new tests FAIL against the old homepage.

- [ ] **Step 3: Replace `index.html`**

Create a complete semantic document with:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Elevate High School | American Diploma in Sharm El Sheikh</title>
  <meta name="description" content="A personal Grades 9–12 high school experience in Sharm El Sheikh with small classes, close guidance, and an accredited US diploma.">
  <link rel="stylesheet" href="assets/css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js" defer></script>
  <script type="module" src="assets/js/main.js"></script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <nav class="site-nav container" aria-label="Main navigation">
      <a class="brand" href="#hero" aria-label="Elevate home"><span class="brand-mark" aria-hidden="true"></span><span>ELEVATE</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links"><span></span><span></span><span></span><span class="sr-only">Menu</span></button>
      <div class="nav-links" id="nav-links">
        <a href="#why-elevate">Why Elevate</a><a href="#how-it-works">How it works</a><a href="#visit">Visit us</a>
        <a class="portal-link" href="https://portal.elevate-sharm.com/login">School portal <span aria-hidden="true">↗</span></a>
      </div>
    </nav>
  </header>
  <main id="main-content">
    <section class="hero" id="hero">
      <div class="hero-copy">
        <p class="eyebrow" id="hero-kicker">Admissions open · Grades 9–12</p>
        <h1 id="hero-heading">A high school built around <span>your child.</span></h1>
        <p class="hero-support" id="hero-support">Small classes. Personal guidance. A fully accredited US diploma in Sharm El Sheikh.</p>
        <div class="hero-actions"><a class="button primary" href="#visit"><span id="hero-primary-label">Book a private visit</span> <span aria-hidden="true">→</span></a><a class="button secondary" id="hero-secondary-label" href="#why-elevate">Discover Elevate</a></div>
      </div>
      <div class="bubble-system" aria-label="Explore how Elevate supports your child">
        <div class="bubble-orbit" aria-hidden="true"></div><div class="bubble-orbit orbit-two" aria-hidden="true"></div>
        <button class="topic-bubble interests" type="button" data-topic="interests" data-title="Start with the student" data-text="We begin with your child’s strengths, interests and future goals." data-limit="14" data-ease="0.032" data-phase="0" aria-expanded="false" aria-controls="topic-popover">Interests</button>
        <button class="topic-bubble curriculum" type="button" data-topic="curriculum" data-title="Shape the right programme" data-text="A flexible American curriculum becomes a clear, personal learning plan." data-limit="20" data-ease="0.026" data-phase="1.7" aria-expanded="false" aria-controls="topic-popover">Curriculum</button>
        <button class="topic-bubble guidance" type="button" data-topic="guidance" data-title="Never just a number" data-text="Small groups and close mentoring keep every student seen and supported." data-limit="13" data-ease="0.038" data-phase="3.1" aria-expanded="false" aria-controls="topic-popover">Guidance</button>
        <button class="topic-bubble future" type="button" data-topic="future" data-title="Move forward with confidence" data-text="Diploma credits, SAT focus and university planning stay connected. We help every student work toward a strong GPA." data-limit="18" data-ease="0.029" data-phase="4.5" aria-expanded="false" aria-controls="topic-popover">Future</button>
        <div class="bubble-core" data-limit="12" data-ease="0.024" data-phase="5.8" aria-hidden="true">YOUR<br>CHILD</div>
        <aside class="topic-popover" id="topic-popover" aria-live="polite" aria-hidden="true"><span class="popover-accent" aria-hidden="true"></span><p class="popover-label">Explore Elevate</p><h2 id="popover-title">Start with the student</h2><p id="popover-text">We begin with your child’s strengths, interests and future goals.</p><button class="popover-close" type="button" aria-label="Close explanation">×</button></aside>
      </div>
      <div class="proof-points" id="proof-points"><span>US diploma</span><span>Grades 9–12</span><span>Small groups</span><span>Sharm campus</span></div>
    </section>
    <section class="benefits section" id="why-elevate"><div class="container"><p class="section-eyebrow">Why parents choose Elevate</p><h2>The best of both worlds.</h2><div class="benefit-grid"><article class="benefit blue"><span>01</span><h3>Personal attention</h3><p>Small groups. Teachers who know every student.</p></article><article class="benefit coral"><span>02</span><h3>Flexible learning</h3><p>A path shaped around strengths and goals.</p></article><article class="benefit aqua"><span>03</span><h3>Recognised diploma</h3><p>An accredited US programme through Bridgeway.</p></article></div></div></section>
    <section class="process section" id="how-it-works"><div class="container"><p class="section-eyebrow">How Elevate works</p><h2>Simple. Personal. Focused.</h2><div class="process-grid"><button class="process-step" type="button" data-detail="We listen to their strengths, needs and future goals." aria-expanded="false"><span>01</span><strong>We meet your child</strong></button><span class="process-arrow" aria-hidden="true">→</span><button class="process-step" type="button" data-detail="Subjects and credits become one clear personal plan." aria-expanded="false"><span>02</span><strong>We build their plan</strong></button><span class="process-arrow" aria-hidden="true">→</span><button class="process-step" type="button" data-detail="Teachers and mentors keep progress moving." aria-expanded="false"><span>03</span><strong>We guide them forward</strong></button></div><p class="process-detail" id="process-detail" aria-live="polite"></p></div></section>
    <section class="visit section" id="visit"><div class="container visit-layout"><div><p class="section-eyebrow">See Elevate for yourself</p><h2>Come and meet us.</h2><p>A short private visit is the easiest way to understand whether Elevate is right for your child.</p></div><form class="visit-form" name="campus-visit" method="POST" data-netlify="true"><input type="hidden" name="form-name" value="campus-visit"><h3>Book a private campus visit</h3><label>Parent name<input name="parent-name" autocomplete="name" required></label><label>Phone or email<input name="contact" required></label><label class="full">Student’s current grade<select name="student-grade" required><option value="">Select grade</option><option>Grade 8</option><option>Grade 9</option><option>Grade 10</option><option>Grade 11</option><option>Grade 12</option></select></label><label class="check full"><input type="checkbox" name="tuition-guide" value="yes"> <span id="tuition-guide-label">Send me the current tuition guide</span></label><button class="button primary full" type="submit"><span id="visit-submit-label">Request a visit</span> <span aria-hidden="true">→</span></button><p class="form-status full" aria-live="polite"></p></form></div></section>
  </main>
  <footer class="site-footer"><div class="container footer-layout"><img class="footer-logo" src="assets/images/Elevate%20Logo.png" alt="Elevate"><div><a href="mailto:info@elevate-sharm.com">info@elevate-sharm.com</a><a href="tel:+201157925051">+20 1157925051</a><span>French School, Hadaba</span><a href="https://portal.elevate-sharm.com/login">Portal ↗</a></div><small>© 2026 Elevate Learning Center. All Rights Reserved.</small></div></footer>
</body>
</html>
```

Retain the existing Meta Pixel block unchanged immediately before `</head>`. Do not include the Netlify Identity widget on the public page; `/admin/` retains its own authentication scripts.

- [ ] **Step 4: Run contracts and commit**

Run: `node --test tests/site-contract.test.mjs`  
Expected: PASS, 5 tests.

```powershell
git add -- index.html tests/site-contract.test.mjs
git commit -m "Build concise semantic homepage"
```

### Task 4: Implement and unit-test per-bubble cursor attraction

**Files:**
- Create: `tests/bubble-motion.test.mjs`
- Create: `assets/js/bubble-motion.mjs`

- [ ] **Step 1: Write failing motion unit tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAttraction } from '../assets/js/bubble-motion.mjs';

test('each result points from its own origin toward the pointer', () => {
  const left = calculateAttraction({ originX: 100, originY: 100, pointerX: 300, pointerY: 50, limit: 14 });
  const right = calculateAttraction({ originX: 400, originY: 100, pointerX: 300, pointerY: 50, limit: 20 });
  assert.ok(left.x > 0 && left.y < 0);
  assert.ok(right.x < 0 && right.y < 0);
});

test('travel never exceeds the bubble limit', () => {
  const result = calculateAttraction({ originX: 0, originY: 0, pointerX: 1000, pointerY: 1000, limit: 12 });
  assert.ok(Math.hypot(result.x, result.y) <= 12.000001);
});

test('zero distance produces no movement', () => {
  assert.deepEqual(calculateAttraction({ originX: 5, originY: 5, pointerX: 5, pointerY: 5, limit: 20 }), { x: 0, y: 0 });
});
```

- [ ] **Step 2: Run and verify module-not-found failure**

Run: `node --test tests/bubble-motion.test.mjs`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement the pure calculation and animation controller**

Create `assets/js/bubble-motion.mjs`:

```js
export function calculateAttraction({ originX, originY, pointerX, pointerY, limit, divisor = 14 }) {
  const dx = pointerX - originX;
  const dy = pointerY - originY;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return { x: 0, y: 0 };
  const travel = Math.min(limit, distance / divisor);
  return { x: (dx / distance) * travel, y: (dy / distance) * travel };
}

export function createBubbleMotion(surface, elements, { reducedMotion = false } = {}) {
  if (reducedMotion || !surface || elements.length === 0) return () => {};
  const state = elements.map((element) => ({ element, limit:Number(element.dataset.limit), ease:Number(element.dataset.ease), phase:Number(element.dataset.phase), targetX:0, targetY:0, x:0, y:0, renderX:0, renderY:0 }));
  let frame = 0;
  let running = true;
  let visible = true;

  const point = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    for (const bubble of state) {
      const rect = bubble.element.getBoundingClientRect();
      const result = calculateAttraction({ originX:rect.left + rect.width / 2 - bubble.renderX, originY:rect.top + rect.height / 2 - bubble.renderY, pointerX:event.clientX, pointerY:event.clientY, limit:bubble.limit });
      bubble.targetX = result.x; bubble.targetY = result.y;
    }
  };
  const reset = () => state.forEach((bubble) => { bubble.targetX = 0; bubble.targetY = 0; });
  const draw = (time) => {
    if (!running || !visible) return;
    for (const bubble of state) {
      bubble.x += (bubble.targetX - bubble.x) * bubble.ease;
      bubble.y += (bubble.targetY - bubble.y) * bubble.ease;
      bubble.renderX = bubble.x;
      bubble.renderY = bubble.y + Math.sin(time / 1900 + bubble.phase) * 2.2;
      bubble.element.style.setProperty('--bubble-x', `${bubble.renderX.toFixed(2)}px`);
      bubble.element.style.setProperty('--bubble-y', `${bubble.renderY.toFixed(2)}px`);
    }
    frame = requestAnimationFrame(draw);
  };
  surface.addEventListener('pointermove', point);
  surface.addEventListener('pointerleave', reset);
  const observer = 'IntersectionObserver' in globalThis ? new IntersectionObserver(([entry]) => {
    const nextVisible = entry?.isIntersecting ?? true;
    if (nextVisible && !visible) { visible = true; frame = requestAnimationFrame(draw); }
    if (!nextVisible) visible = false;
  }) : null;
  observer?.observe(surface);
  frame = requestAnimationFrame(draw);
  return () => { running = false; cancelAnimationFrame(frame); observer?.disconnect(); surface.removeEventListener('pointermove', point); surface.removeEventListener('pointerleave', reset); };
}
```

- [ ] **Step 4: Run tests and commit**

Run: `node --test tests/bubble-motion.test.mjs`  
Expected: PASS, 3 tests.

```powershell
git add -- assets/js/bubble-motion.mjs tests/bubble-motion.test.mjs
git commit -m "Add bounded cursor attraction"
```

### Task 5: Implement homepage behavior and graceful content hydration

**Files:**
- Replace: `assets/js/main.js:1-166`
- Modify: `tests/site-contract.test.mjs`

- [ ] **Step 1: Add a failing JavaScript behavior contract**

Append:

```js
test('homepage script includes disclosures, YAML fallback handling, and Netlify submission states', async () => {
  const script = await read('assets/js/main.js');
  assert.match(script, /createBubbleMotion/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(script, /event\.key === 'Escape'/);
  assert.match(script, /fetch\('data\/homepage\.yml'/);
  assert.match(script, /new URLSearchParams\(new FormData\(form\)\)/);
  assert.match(script, /We could not send your request/);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --test-name-pattern="homepage script" tests/site-contract.test.mjs`  
Expected: FAIL against the old script.

- [ ] **Step 3: Replace `assets/js/main.js`**

Implement these named functions and call them from `DOMContentLoaded`:

```js
import { createBubbleMotion } from './bubble-motion.mjs';

const topicColours = { interests:'#2f68df', curriculum:'#ff8d72', guidance:'#42bfd1', future:'#d7ad42' };
let topicContent = {
  interests:{ title:'Start with the student', text:'We begin with your child’s strengths, interests and future goals.' },
  curriculum:{ title:'Shape the right programme', text:'A flexible American curriculum becomes a clear, personal learning plan.' },
  guidance:{ title:'Never just a number', text:'Small groups and close mentoring keep every student seen and supported.' },
  future:{ title:'Move forward with confidence', text:'Diploma credits, SAT focus and university planning stay connected. We help every student work toward a strong GPA.' },
};

function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  const setOpen = (open) => { links.classList.toggle('open', open); toggle.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', (event) => { if (!event.target.closest('.site-nav')) setOpen(false); });
}

function initTopicDisclosures() {
  const buttons = [...document.querySelectorAll('.topic-bubble')];
  const popover = document.querySelector('#topic-popover');
  const title = document.querySelector('#popover-title');
  const text = document.querySelector('#popover-text');
  const accent = popover?.querySelector('.popover-accent');
  const closeButton = popover?.querySelector('.popover-close');
  let active = null;
  if (!popover || !title || !text || !accent) return;
  const close = () => {
    active = null;
    buttons.forEach((button) => { button.classList.remove('active'); button.style.opacity = '1'; button.setAttribute('aria-expanded', 'false'); });
    popover.classList.remove('open'); popover.setAttribute('aria-hidden', 'true');
  };
  buttons.forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.topic;
    if (active === key) { close(); return; }
    active = key;
    buttons.forEach((item) => { const selected = item === button; item.classList.toggle('active', selected); item.style.opacity = selected ? '1' : '.62'; item.setAttribute('aria-expanded', String(selected)); });
    title.textContent = topicContent[key].title; text.textContent = topicContent[key].text; accent.style.background = topicColours[key];
    popover.classList.add('open'); popover.setAttribute('aria-hidden', 'false');
  }));
  closeButton?.addEventListener('click', close);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && active) close(); });
}

function initProcessDisclosures() {
  const steps = [...document.querySelectorAll('.process-step')];
  const detail = document.querySelector('#process-detail');
  if (!detail) return;
  steps.forEach((step) => step.addEventListener('click', () => {
    const opening = step.getAttribute('aria-expanded') !== 'true';
    steps.forEach((item) => item.setAttribute('aria-expanded', 'false'));
    step.setAttribute('aria-expanded', String(opening));
    detail.textContent = opening ? step.dataset.detail : '';
  }));
}

function initMotion() {
  return createBubbleMotion(document.querySelector('.hero'), [...document.querySelectorAll('.topic-bubble, .bubble-core')], {
    reducedMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches,
  });
}

const setText = (selector, value) => { const element = document.querySelector(selector); if (element && value) element.textContent = value; };

async function hydrateContent() {
  try {
    const response = await fetch('data/homepage.yml', { cache:'no-cache' });
    if (!response.ok || !window.jsyaml) throw new Error(`Homepage content unavailable (${response.status})`);
    const data = window.jsyaml.load(await response.text());
    document.title = data.seo?.title || document.title;
    if (data.seo?.description) document.querySelector('meta[name="description"]')?.setAttribute('content', data.seo.description);
    setText('#hero-kicker', data.hero?.kicker);
    setText('#hero-support', data.hero?.supporting);
    setText('#hero-primary-label', data.hero?.primary_cta);
    setText('#hero-secondary-label', data.hero?.secondary_cta);
    const heading = document.querySelector('#hero-heading');
    if (heading && data.hero?.heading) {
      const emphasis = 'your child.';
      const start = data.hero.heading.endsWith(emphasis) ? data.hero.heading.slice(0, -emphasis.length) : data.hero.heading;
      heading.replaceChildren(document.createTextNode(start));
      if (start !== data.hero.heading) { const span = document.createElement('span'); span.textContent = emphasis; heading.append(span); }
    }
    document.querySelectorAll('#proof-points span').forEach((item, index) => { if (data.hero?.proof_points?.[index]) item.textContent = data.hero.proof_points[index]; });
    data.hero?.topics?.forEach((topic) => { const button = document.querySelector(`[data-topic="${topic.key}"]`); if (button) button.textContent = topic.label; topicContent[topic.key] = { title:topic.title, text:topic.text }; });
    setText('.benefits .section-eyebrow', data.benefits?.eyebrow); setText('.benefits h2', data.benefits?.heading);
    const benefits = document.querySelectorAll('.benefit');
    data.benefits?.items?.forEach((item, index) => { benefits[index]?.querySelector('h3')?.replaceChildren(item.title); benefits[index]?.querySelector('p')?.replaceChildren(item.text); });
    setText('.process .section-eyebrow', data.process?.eyebrow); setText('.process h2', data.process?.heading);
    const processSteps = document.querySelectorAll('.process-step');
    data.process?.steps?.forEach((item, index) => { processSteps[index]?.querySelector('strong')?.replaceChildren(item.title); if (processSteps[index]) processSteps[index].dataset.detail = item.text; });
    setText('.visit .section-eyebrow', data.visit?.eyebrow); setText('.visit h2', data.visit?.heading); setText('.visit-layout > div > p:last-child', data.visit?.text); setText('.visit-form h3', data.visit?.form_heading); setText('#visit-submit-label', data.visit?.submit_text); setText('#tuition-guide-label', data.visit?.tuition_guide_text);
  } catch (error) {
    console.warn('Homepage content fallback is active.', error);
  }
}

function initVisitForm() {
  const form = document.querySelector('.visit-form');
  const status = form?.querySelector('.form-status');
  const submit = form?.querySelector('button[type="submit"]');
  if (!form || !status || !submit) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true; status.textContent = 'Sending your request…'; status.className = 'form-status full sending';
    try {
      const response = await fetch('/', { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body:new URLSearchParams(new FormData(form)).toString() });
      if (!response.ok) throw new Error(`Form submission failed (${response.status})`);
      form.reset(); status.textContent = 'Thank you. We will contact you to arrange your private visit.'; status.className = 'form-status full success';
    } catch (error) {
      console.error(error); status.textContent = 'We could not send your request. Please try again or contact us directly.'; status.className = 'form-status full error';
    } finally {
      submit.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMenu(); initTopicDisclosures(); initProcessDisclosures(); initMotion(); initVisitForm(); hydrateContent();
});
```

- [ ] **Step 4: Run syntax and contract checks**

Run: `node --check assets/js/main.js`  
Expected: no output, exit 0.

Run: `node --test tests/site-contract.test.mjs tests/bubble-motion.test.mjs`  
Expected: PASS, 9 tests.

- [ ] **Step 5: Commit behavior**

```powershell
git add -- assets/js/main.js tests/site-contract.test.mjs
git commit -m "Add accessible homepage interactions"
```

### Task 6: Apply the approved responsive visual system

**Files:**
- Replace: `assets/css/style.css:1-878`
- Modify: `tests/site-contract.test.mjs`

- [ ] **Step 1: Add a failing CSS contract**

Append:

```js
test('styles include the approved palette, motion composition, mobile layout, and reduced motion', async () => {
  const css = await read('assets/css/style.css');
  for (const token of ['--navy: #122a55', '--blue: #2f68df', '--coral: #ffb79b', '--aqua: #82dfe9', '--gold: #f0cb6a']) assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(css, /translate:\s*var\(--bubble-x\) var\(--bubble-y\)/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.topic-bubble:focus-visible/);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --test-name-pattern="styles include" tests/site-contract.test.mjs`  
Expected: FAIL against the old stylesheet.

- [ ] **Step 3: Replace the stylesheet**

Replace `assets/css/style.css` with the following complete visual system:

```css
:root {
  --navy: #122a55;
  --ink: #183362;
  --blue: #2f68df;
  --coral: #ffb79b;
  --aqua: #82dfe9;
  --gold: #f0cb6a;
  --muted: #637087;
  --line: #dce4ef;
  --paper: #ffffff;
  --soft-blue: #e4efff;
  --soft-coral: #fff0e9;
  --soft-aqua: #e5fafd;
  --shadow: 0 24px 58px rgba(38,88,191,.18);
}
*,*::before,*::after { box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { margin:0; color:var(--ink); background:var(--paper); font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; line-height:1.5; }
a { color:inherit; }
button,input,select { font:inherit; }
button { color:inherit; }
.container { width:min(1180px,calc(100% - 48px)); margin-inline:auto; }
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
.skip-link { position:fixed; z-index:100; left:16px; top:12px; translate:0 -150%; padding:10px 14px; border-radius:999px; color:white; background:var(--navy); }
.skip-link:focus { translate:0; }
.site-header { position:sticky; z-index:50; top:0; border-bottom:1px solid rgba(26,71,148,.08); background:rgba(251,253,255,.9); backdrop-filter:blur(18px); }
.site-nav { min-height:68px; display:flex; align-items:center; justify-content:space-between; }
.brand { display:flex; align-items:center; gap:10px; color:var(--navy); text-decoration:none; font-size:1.05rem; font-weight:950; letter-spacing:-.055em; }
.brand-mark { width:24px; height:24px; position:relative; }
.brand-mark::before { content:""; position:absolute; left:4px; top:5px; width:14px; height:14px; border-left:4px solid var(--blue); border-top:4px solid var(--blue); rotate:45deg; }
.nav-links { display:flex; align-items:center; gap:28px; color:#69778e; font-size:.86rem; font-weight:750; }
.nav-links a { text-decoration:none; }
.nav-links a:not(.portal-link):hover { color:var(--blue); }
.portal-link { padding:10px 15px; border-radius:999px; color:white; background:var(--navy); }
.menu-toggle { display:none; width:44px; height:44px; border:0; background:transparent; cursor:pointer; }
.menu-toggle > span:not(.sr-only) { display:block; width:22px; height:2px; margin:5px auto; background:var(--navy); transition:transform .2s ease,opacity .2s ease; }
.hero { min-height:620px; position:relative; overflow:hidden; display:grid; grid-template-columns:minmax(0,620px) minmax(360px,500px); justify-content:center; align-items:center; gap:clamp(24px,4vw,72px); padding:clamp(58px,7vw,92px) max(24px,calc((100vw - 1180px)/2)) 76px; background:radial-gradient(circle at 81% 21%,rgba(116,174,255,.25),transparent 27%),radial-gradient(circle at 96% 82%,rgba(255,164,130,.2),transparent 23%),linear-gradient(145deg,#fbfdff,#eff6ff 58%,#fff8f1); }
.hero::after { content:""; position:absolute; inset:0; opacity:.3; pointer-events:none; background-image:radial-gradient(rgba(37,84,169,.2) .7px,transparent .7px); background-size:18px 18px; mask-image:linear-gradient(90deg,transparent 32%,black); }
.hero-copy { position:relative; z-index:5; }
.eyebrow,.section-eyebrow { margin:0; color:var(--blue); font-size:.76rem; font-weight:900; letter-spacing:.13em; text-transform:uppercase; }
.eyebrow { display:flex; align-items:center; gap:10px; }
.eyebrow::before { content:""; width:7px; height:7px; border-radius:50%; background:#63dce9; box-shadow:0 0 0 5px rgba(99,220,233,.15); }
.hero h1 { max-width:650px; margin:20px 0 18px; color:var(--navy); font-size:clamp(3rem,5.4vw,5.2rem); line-height:.96; letter-spacing:-.065em; }
.hero h1 span { color:var(--blue); }
.hero-support { max-width:600px; margin:0; color:#5e6c83; font-size:clamp(1rem,1.5vw,1.18rem); line-height:1.65; }
.hero-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:30px; }
.button { min-height:46px; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:0 20px; border:1px solid #cbd7e8; border-radius:999px; text-decoration:none; font-weight:850; cursor:pointer; transition:translate .2s ease,box-shadow .2s ease; }
.button:hover { translate:0 -2px; }
.button.primary { color:white; border-color:var(--blue); background:var(--blue); box-shadow:0 12px 28px rgba(47,102,220,.23); }
.button.secondary { color:#1b3769; background:rgba(255,255,255,.68); }
.bubble-system { width:min(100%,430px); height:390px; position:relative; z-index:6; justify-self:center; }
.bubble-orbit { position:absolute; left:50%; top:46%; width:310px; height:300px; translate:-50% -50%; rotate:-13deg; border:1px solid rgba(47,104,223,.18); border-radius:48% 52% 44% 56%; animation:orbit 9s ease-in-out infinite; pointer-events:none; }
.bubble-orbit.orbit-two { width:240px; height:250px; rotate:25deg; border-color:rgba(255,145,115,.18); animation-duration:11s; animation-direction:reverse; }
.topic-bubble,.bubble-core { --bubble-x:0px; --bubble-y:0px; translate:var(--bubble-x) var(--bubble-y); will-change:translate; }
.bubble-core { position:absolute; left:50%; top:46%; width:112px; height:112px; transform:translate(-50%,-50%) rotate(-5deg); display:grid; place-items:center; text-align:center; border-radius:30px; color:white; background:linear-gradient(145deg,#316be4,#688eec); font-size:.78rem; line-height:1.25; font-weight:950; box-shadow:0 24px 58px rgba(38,88,191,.28); animation:core 5s ease-in-out infinite; }
.bubble-core::after { content:""; position:absolute; inset:12px; border:1px solid rgba(255,255,255,.31); border-radius:20px; }
.topic-bubble { appearance:none; position:absolute; width:98px; height:86px; padding:13px; display:flex; align-items:flex-end; border:1px solid rgba(255,255,255,.76); border-radius:23px; text-align:left; font-size:.72rem; font-weight:950; box-shadow:0 15px 38px rgba(31,72,141,.14); cursor:pointer; transition:transform .25s ease,box-shadow .25s ease,opacity .25s ease; }
.topic-bubble::before { content:"+"; position:absolute; top:10px; right:11px; width:20px; height:20px; display:grid; place-items:center; border-radius:50%; background:rgba(255,255,255,.55); font-size:.9rem; font-weight:500; }
.topic-bubble.active::before { content:"×"; }
.topic-bubble:hover,.topic-bubble:focus-visible { transform:translateY(-5px) scale(1.04) !important; outline:3px solid rgba(47,104,223,.22); outline-offset:3px; box-shadow:0 22px 46px rgba(31,72,141,.2); }
.topic-bubble.active { transform:scale(1.08) !important; outline:3px solid rgba(47,104,223,.22); outline-offset:3px; box-shadow:0 24px 52px rgba(31,72,141,.23); }
.topic-bubble.interests { left:2px; top:23px; color:#194e9f; background:linear-gradient(145deg,#e5f1ff,#94bcff); rotate:-8deg; }
.topic-bubble.curriculum { right:0; top:42px; color:#8d453e; background:linear-gradient(145deg,#fff2eb,#ffb79b); rotate:8deg; }
.topic-bubble.guidance { left:24px; bottom:53px; color:#1e6573; background:linear-gradient(145deg,#e9fcff,#82dfe9); rotate:10deg; }
.topic-bubble.future { right:28px; bottom:40px; color:#735c1c; background:linear-gradient(145deg,#fff8da,#f0cb6a); rotate:-7deg; }
.topic-popover { position:absolute; z-index:20; left:50%; bottom:-12px; width:min(310px,90%); min-height:112px; transform:translate(-50%,12px) scale(.94); opacity:0; pointer-events:none; padding:18px 20px 18px 23px; border:1px solid rgba(255,255,255,.9); border-radius:25px; background:rgba(255,255,255,.92); box-shadow:0 28px 70px rgba(18,50,108,.2); backdrop-filter:blur(18px); transition:opacity .28s ease,transform .28s ease; }
.topic-popover.open { opacity:1; transform:translate(-50%,0) scale(1); pointer-events:auto; }
.popover-accent { position:absolute; left:0; top:18px; bottom:18px; width:4px; border-radius:0 999px 999px 0; background:var(--blue); }
.popover-label { margin:0; color:#6c7b92; font-size:.66rem; font-weight:900; letter-spacing:.13em; text-transform:uppercase; }
.topic-popover h2 { margin:5px 30px 5px 0; color:var(--ink); font-size:1.05rem; }
.topic-popover > p:last-of-type { margin:0; color:#5f6e85; font-size:.82rem; line-height:1.5; }
.popover-close { position:absolute; right:11px; top:11px; width:32px; height:32px; border:0; border-radius:50%; background:#edf2f8; cursor:pointer; }
.proof-points { position:absolute; z-index:7; left:max(24px,calc((100vw - 1180px)/2)); bottom:24px; display:flex; flex-wrap:wrap; gap:8px; }
.proof-points span { padding:8px 11px; border:1px solid rgba(38,84,160,.1); border-radius:999px; color:#314765; background:rgba(255,255,255,.7); font-size:.72rem; font-weight:850; backdrop-filter:blur(10px); }
.section { padding:clamp(64px,8vw,100px) 0; }
.section h2 { margin:10px 0 0; color:var(--navy); font-size:clamp(2.1rem,4vw,3.8rem); line-height:1; letter-spacing:-.05em; }
.benefit-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-top:34px; }
.benefit { min-height:190px; position:relative; overflow:hidden; padding:25px; border-radius:24px; transition:translate .25s ease; }
.benefit:hover { translate:0 -5px; }
.benefit::after { content:""; position:absolute; width:90px; height:90px; right:-22px; top:-24px; border-radius:50%; background:rgba(255,255,255,.36); }
.benefit.blue { background:var(--soft-blue); }.benefit.coral { background:var(--soft-coral); }.benefit.aqua { background:var(--soft-aqua); }
.benefit > span { font-size:.75rem; font-weight:900; opacity:.55; }
.benefit h3 { margin:58px 0 8px; color:var(--ink); font-size:1.25rem; }
.benefit p { margin:0; color:var(--muted); }
.process { position:relative; overflow:hidden; color:white; background:#112a57; }
.process::after { content:""; position:absolute; width:360px; height:360px; right:-140px; top:-170px; border:1px solid rgba(121,223,233,.18); border-radius:44% 56% 50% 50%; rotate:18deg; }
.process .section-eyebrow { color:#76deea; }.process h2 { color:white; }
.process-grid { position:relative; z-index:2; display:grid; grid-template-columns:1fr auto 1fr auto 1fr; align-items:center; gap:18px; margin-top:38px; }
.process-step { min-height:130px; padding:22px; border:1px solid rgba(255,255,255,.12); border-radius:20px; color:white; background:rgba(255,255,255,.08); text-align:left; cursor:pointer; }
.process-step span { display:block; margin-bottom:20px; color:#75deea; font-size:.75rem; font-weight:900; }
.process-step strong { font-size:1.05rem; }.process-step[aria-expanded="true"] { border-color:#75deea; background:rgba(117,222,234,.12); }
.process-arrow { color:#79dfe9; font-size:1.4rem; animation:arrowPulse 2s ease-in-out infinite; }
.process-detail { min-height:1.6em; margin:24px 0 0; color:#c4d1e3; }
.visit { background:linear-gradient(145deg,#f8fbff,#fff8f2); }
.visit-layout { display:grid; grid-template-columns:1fr .9fr; gap:clamp(34px,6vw,80px); align-items:center; }
.visit-layout > div > p:last-child { max-width:560px; color:var(--muted); font-size:1.05rem; }
.visit-form { display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:28px; border:1px solid #e1e7f0; border-radius:24px; background:white; box-shadow:0 18px 45px rgba(27,66,133,.11); }
.visit-form h3,.visit-form .full { grid-column:1 / -1; }
.visit-form h3 { margin:0 0 4px; color:#15305e; }
.visit-form label { display:grid; gap:6px; color:#52617a; font-size:.82rem; font-weight:750; }
.visit-form input:not([type="checkbox"]),.visit-form select { width:100%; min-height:46px; padding:0 12px; border:1px solid #dce3ed; border-radius:10px; color:#31415e; background:#f8fafc; outline:none; }
.visit-form input:focus,.visit-form select:focus { border-color:#6d96e9; box-shadow:0 0 0 3px rgba(47,102,220,.1); }
.visit-form .check { display:flex; align-items:center; gap:8px; font-weight:600; }.visit-form .check input { width:18px; height:18px; accent-color:var(--blue); }
.form-status { min-height:1.5em; margin:0; text-align:center; font-size:.82rem; }.form-status.success { color:#187343; }.form-status.error { color:#a13838; }
.site-footer { padding:32px 0; color:#aebbd0; background:#091a39; }
.footer-layout { display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:28px; }
.footer-logo { width:96px; height:auto; }.footer-layout > div { display:flex; justify-content:center; flex-wrap:wrap; gap:18px; }.footer-layout a { color:inherit; text-decoration:none; }
@keyframes orbit { 50% { rotate:-4deg; scale:1.03; } }
@keyframes core { 50% { transform:translate(-50%,-55%) rotate(0); } }
@keyframes arrowPulse { 0%,100% { opacity:.45; translate:-2px 0; } 50% { opacity:1; translate:3px 0; } }
@media (max-width:820px) {
  .container { width:min(calc(100% - 36px),680px); }
  .menu-toggle { display:block; }
  .nav-links { position:absolute; left:18px; right:18px; top:60px; display:none; flex-direction:column; align-items:stretch; gap:4px; padding:14px; border:1px solid var(--line); border-radius:18px; background:white; box-shadow:var(--shadow); }
  .nav-links.open { display:flex; }.nav-links a { min-height:44px; display:flex; align-items:center; padding:0 12px; }
  .hero { grid-template-columns:1fr; gap:16px; padding:58px 24px 36px; }
  .hero h1 { font-size:clamp(3rem,12vw,4.8rem); }.bubble-system { height:385px; margin-inline:auto; }
  .proof-points { position:relative; left:auto; bottom:auto; grid-column:1; margin-top:-20px; }
  .benefit-grid,.process-grid { grid-template-columns:1fr; }
  .benefit { min-height:150px; }.benefit h3 { margin-top:35px; }.process-arrow { rotate:90deg; text-align:center; }
  .visit-layout { grid-template-columns:1fr; }.footer-layout { grid-template-columns:1fr; text-align:center; }.footer-layout > div { justify-content:center; }
}
@media (max-width:520px) {
  .hero { padding-inline:18px; }.hero-actions { align-items:stretch; flex-direction:column; }.button { width:100%; }
  .bubble-system { height:360px; scale:.9; margin-block:-8px; }.visit-form { grid-template-columns:1fr; padding:20px; }.visit-form h3,.visit-form .full { grid-column:auto; }
}
@media (prefers-reduced-motion:reduce) { *,*::before,*::after { scroll-behavior:auto !important; animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; } }
```

- [ ] **Step 4: Run all static checks**

Run: `node --test tests/site-contract.test.mjs tests/bubble-motion.test.mjs`  
Expected: PASS, 10 tests.

Run: `git diff --check`  
Expected: no output.

- [ ] **Step 5: Commit the visual system**

```powershell
git add -- assets/css/style.css tests/site-contract.test.mjs
git commit -m "Apply Living Curriculum visual system"
```

### Task 7: Update documentation and perform integrated browser verification

**Files:**
- Modify: `README.md:1-135`

- [ ] **Step 1: Rewrite the README around the real structure**

Document `data/` rather than `_data/`, the single `homepage.yml`, `/admin/`, `campus-visit` form submissions, local serving, test command, main-branch Netlify deployment, and reversible extra-tuition redirects. Remove the outdated drag-and-drop ZIP instructions and “everything is editable” claim.

- [ ] **Step 2: Run the local verification server**

Run from the repository root:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173/` in the in-app browser.

- [ ] **Step 3: Verify desktop behavior**

Check at a desktop width:

- Header anchors reach all three destinations and the Portal link resolves to the correct URL.
- Each topic opens the correct short text; a second click and Escape close it.
- With the cursor between bubbles, bubbles on opposite sides travel in opposite horizontal directions toward it.
- Interests/Curriculum/Guidance/Future/core never exceed 14/20/13/18/12 px.
- The GPA sentence ends the Future explanation.
- No helper sentence, fee amount, AP/SAT navigation link, HarvardX copy, or 2025 intake copy appears.
- Blank form submission triggers browser validation; populated preview submission produces a controlled local failure without clearing values.
- Browser console has no uncaught errors.

- [ ] **Step 4: Verify responsive and accessible behavior**

Check 390×844, 768×1024, and 1440×900 layouts. Confirm no horizontal scrolling, readable heading wrapping, visible bubbles on phone, 44 px controls, keyboard focus order, Enter/Space activation, Escape close, and stacked form fields. Emulate reduced motion and confirm pointer following and ambient animation stop while all disclosures remain clickable.

- [ ] **Step 5: Run final local checks and commit**

```powershell
node --check assets/js/main.js
node --check assets/js/bubble-motion.mjs
node --test tests/site-contract.test.mjs tests/bubble-motion.test.mjs
git diff --check
git status --short
```

Expected: syntax checks exit 0; all 10 tests pass; diff check is empty; only intentional README changes are uncommitted.

```powershell
git add -- README.md
git commit -m "Document homepage editing and deployment"
```

### Task 8: Review, merge, deploy, and verify production

**Files:**
- Review all changes relative to `main`
- No new source file unless a verified defect requires a focused fix and test

- [ ] **Step 1: Review the branch against the approved specification**

Run:

```powershell
git status --short
git log --oneline main..HEAD
git diff --stat main...HEAD
git diff --check main...HEAD
node --test tests/site-contract.test.mjs tests/bubble-motion.test.mjs
```

Expected: clean worktree, intentional commit series, no whitespace errors, all tests pass.

- [ ] **Step 2: Push the reviewed feature branch**

```powershell
git push -u origin codex/homepage-redesign
```

Expected: GitHub accepts the branch and returns its remote tracking reference.

- [ ] **Step 3: Fast-forward `main` and trigger Netlify**

In the primary repository worktree:

```powershell
git switch main
git pull --ff-only origin main
git merge --ff-only codex/homepage-redesign
git push origin main
```

Expected: `origin/main` advances to the final verified commit. If GitHub reports branch protection, open a pull request from `codex/homepage-redesign` to `main`, wait for required checks, merge it through GitHub, and confirm the resulting `main` commit matches the reviewed branch tree.

- [ ] **Step 4: Monitor the Netlify production deploy**

In the signed-in Netlify project, wait for the `main` deploy matching the new Git commit to reach **Published**. If it fails, inspect the deploy log, make the smallest tested correction on the feature branch, merge it, and wait for the replacement deploy.

- [ ] **Step 5: Verify public URLs and redirects**

Check:

- `https://elevate-sharm.com/` returns 200 and shows the new heading.
- `https://www.elevate-sharm.com/` resolves to the same production site.
- `/extra-tuition` and `/extra-tuition.html` return a 302 to `/`.
- The School Portal link points to `https://portal.elevate-sharm.com/login`.
- Desktop and phone screenshots match the approved structure.

- [ ] **Step 6: Verify one real Netlify form capture**

Submit `Parent name: Codex deployment test`, `Phone or email: codex-test@example.com`, and `Grade 9`, then confirm a new `campus-visit` entry appears in Netlify Forms. Record it as test data in the handoff so it is not mistaken for a real enquiry.

- [ ] **Step 7: Report deployment completion**

Provide the production URL, deployed commit, test results, Netlify deploy state, form-capture confirmation, redirect results, and any reversible follow-up recommendation. Do not claim completion until the published production page has been checked directly.

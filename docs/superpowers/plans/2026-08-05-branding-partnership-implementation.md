# Elevate Branding Partnership Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a two-peak Elevate header mark and a concise, accessible Bridgeway Academy partnership strip to the public homepage.

**Architecture:** Keep the static homepage architecture unchanged. Extend the existing CSS-drawn brand mark with a second pseudo-element, add one semantic partnership section between the hero and benefits, and store Bridgeway's official SVG wordmark as a local site asset so the homepage does not depend on a third-party image request.

**Tech Stack:** Static HTML, CSS, SVG, Node.js built-in test runner, Netlify continuous deployment

---

## File map

- Create `assets/images/bridgeway-academy.svg`: local copy of the official Bridgeway Academy header wordmark.
- Modify `index.html`: add the partnership strip and reference the local official asset.
- Modify `assets/css/style.css`: draw two header peaks and style responsive partnership presentation.
- Modify `tests/site-contract.test.mjs`: enforce the branding and accessibility contract.

### Task 1: Add the public-branding contract

**Files:**
- Modify: `tests/site-contract.test.mjs`

- [ ] **Step 1: Write the failing test**

Append:

```js
test('header has two peaks and homepage presents the Bridgeway partnership accessibly', async () => {
  const [html, css, logo] = await Promise.all([
    read('index.html'),
    read('assets/css/style.css'),
    read('assets/images/bridgeway-academy.svg'),
  ]);

  assert.match(css, /\.brand-mark::before,\.brand-mark::after/);
  assert.match(css, /\.brand-mark::after/);
  assert.match(html, /class="partner-strip"/);
  assert.match(html, /href="https:\/\/homeschoolacademy\.com\/"/);
  assert.match(html, /src="assets\/images\/bridgeway-academy\.svg"/);
  assert.match(html, /alt="Bridgeway Academy"/);
  assert.match(html, />Academic partner</);
  assert.match(logo, /<svg[^>]+viewBox="0 0 175 45"/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test --test-name-pattern="header has two peaks" tests/site-contract.test.mjs
```

Expected: FAIL because `assets/images/bridgeway-academy.svg` does not exist.

- [ ] **Step 3: Commit the failing contract**

```powershell
git add -- tests/site-contract.test.mjs
git commit -m "Test partnership branding contract"
```

### Task 2: Add the official Bridgeway wordmark asset

**Files:**
- Create: `assets/images/bridgeway-academy.svg`

- [ ] **Step 1: Verify the official source before copying**

Open `https://homeschoolacademy.com/`, confirm that it is the current destination of `bridgewayacademy.com`, and identify the header SVG with `viewBox="0 0 175 45"` and the `logo-bridgewayacademy` identifier.

- [ ] **Step 2: Create the local SVG asset**

Use `apply_patch` to add `assets/images/bridgeway-academy.svg`. Copy the complete 175×45 Bridgeway Academy header SVG from the official page without redrawing, changing paths, or adding Elevate styling inside the asset. Add this XML declaration before the copied SVG:

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

The root must remain:

```xml
<svg width="175" height="45" viewBox="0 0 175 45" fill="none" xmlns="http://www.w3.org/2000/svg">
```

- [ ] **Step 3: Validate the SVG as text**

Run:

```powershell
Select-String -Path assets/images/bridgeway-academy.svg -Pattern '<svg width="175" height="45" viewBox="0 0 175 45"'
```

Expected: one match.

- [ ] **Step 4: Re-run the focused test**

Run:

```powershell
node --test --test-name-pattern="header has two peaks" tests/site-contract.test.mjs
```

Expected: FAIL because `index.html` and the two-peak CSS are not implemented yet.

### Task 3: Implement the two-peak mark and partnership strip

**Files:**
- Modify: `index.html`
- Modify: `assets/css/style.css`
- Create: `assets/images/bridgeway-academy.svg`
- Test: `tests/site-contract.test.mjs`

- [ ] **Step 1: Add the semantic partnership section**

Insert this immediately after the closing `</section>` for `#hero` and before `#why-elevate`:

```html
    <section class="partner-strip" aria-label="Academic partnership">
      <a class="partner-link" href="https://homeschoolacademy.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Bridgeway Academy, Elevate's academic partner">
        <span class="partner-label">Academic partner</span>
        <img src="assets/images/bridgeway-academy.svg" alt="Bridgeway Academy" width="175" height="45">
      </a>
    </section>
```

- [ ] **Step 2: Replace the one-peak CSS with the two-peak rules**

Replace the existing `.brand-mark` block with:

```css
.brand-mark { width:34px; height:24px; position:relative; flex:0 0 34px; }
.brand-mark::before,.brand-mark::after { content:""; position:absolute; width:13px; height:13px; border-left:4px solid var(--blue); border-top:4px solid var(--blue); rotate:45deg; }
.brand-mark::before { left:2px; top:7px; }
.brand-mark::after { left:15px; top:3px; }
```

- [ ] **Step 3: Add partnership styles before `.section`**

```css
.partner-strip { min-height:76px; display:flex; align-items:center; justify-content:center; padding:14px 24px; border-top:1px solid rgba(26,71,148,.08); border-bottom:1px solid rgba(26,71,148,.08); background:white; }
.partner-link { display:flex; align-items:center; justify-content:center; gap:18px; color:var(--ink); text-decoration:none; }
.partner-label { color:#7a8799; font-size:.7rem; font-weight:900; letter-spacing:.13em; text-transform:uppercase; }
.partner-link img { width:150px; height:auto; display:block; color:var(--navy); }
.partner-link:hover img { opacity:.78; }
.partner-link:focus-visible { outline:3px solid rgba(47,104,223,.35); outline-offset:6px; border-radius:8px; }
```

- [ ] **Step 4: Add the mobile adjustment inside `@media (max-width: 520px)`**

```css
  .partner-strip { min-height:68px; padding-inline:18px; }
  .partner-link { gap:12px; }
  .partner-link img { width:128px; }
  .partner-label { font-size:.62rem; }
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```powershell
node --test --test-name-pattern="header has two peaks" tests/site-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Run the complete automated verification**

Run:

```powershell
node --test tests/site-contract.test.mjs tests/bubble-motion.test.mjs
node --check assets/js/main.js
git diff --check
```

Expected: all tests pass, JavaScript syntax check exits 0, and `git diff --check` reports no errors.

- [ ] **Step 7: Commit the implementation**

```powershell
git add -- assets/images/bridgeway-academy.svg index.html assets/css/style.css tests/site-contract.test.mjs
git commit -m "Add partnership branding to homepage"
```

### Task 4: Browser verification and production deployment

**Files:**
- Verify: `index.html`
- Verify: `assets/css/style.css`
- Verify: `assets/images/bridgeway-academy.svg`

- [ ] **Step 1: Start a local static server**

Run from the repository root:

```powershell
python -m http.server 4173
```

Expected: the homepage is available at `http://localhost:4173/`.

- [ ] **Step 2: Verify desktop presentation**

Confirm at 1280px width:

- both blue peaks are visible and do not overlap `ELEVATE`
- the partnership strip sits between hero and benefits
- Bridgeway's wordmark is crisp and proportionate
- the partnership link has a visible keyboard focus ring
- existing bubble and navigation interactions still work

- [ ] **Step 3: Verify mobile presentation**

Confirm at 390px width:

- the two-peak mark fits beside `ELEVATE`
- the mobile menu still opens and closes
- the partnership label and logo fit on one line without horizontal scrolling

- [ ] **Step 4: Push the verified commit**

```powershell
git push origin main
```

Expected: GitHub accepts the new `main` commit and Netlify starts automatic publishing.

- [ ] **Step 5: Verify production**

Open `https://elevate-sharm.com/` and confirm the new mark, partnership strip, official link, existing campus-visit form, and the two AP/SAT redirects. Confirm Netlify shows the exact pushed commit as Published.


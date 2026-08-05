# Original Header Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the custom header peak mark with the same original Elevate logo image used in the footer, presented legibly on a compact navy backing.

**Architecture:** Reuse the existing static PNG asset in the header rather than creating another brand asset. Keep the current brand link and accessibility label, and use a dedicated `.header-logo` rule for responsive sizing and its navy presentation surface.

**Tech Stack:** Static HTML, CSS, Node.js built-in test runner

---

### Task 1: Replace the header brand treatment

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `index.html`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Write the failing header-logo contract test**

Replace the existing `header brand mark renders two peaks` test with:

```js
test('header reuses the original Elevate logo from the footer', async () => {
  const html = await read('index.html');
  const css = await read('assets/css/style.css');
  assert.match(html, /<a class="brand"[^>]*aria-label="Elevate home"[^>]*>\s*<img class="header-logo" src="assets\/images\/Elevate%20Logo\.png" alt="">\s*<\/a>/);
  assert.doesNotMatch(html, /class="brand-mark"/);
  assert.match(css, /\.brand\s*\{[^}]*background:var\(--navy\);/);
  assert.match(css, /\.header-logo\s*\{[^}]*width:clamp\(86px,9vw,104px\);[^}]*height:auto;/);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
node --test --test-name-pattern="header reuses the original Elevate logo" tests/site-contract.test.mjs
```

Expected: FAIL because the header still contains `.brand-mark` and separate `ELEVATE` text.

- [ ] **Step 3: Replace the header markup**

In `index.html`, replace the contents of the existing brand link with:

```html
<img class="header-logo" src="assets/images/Elevate%20Logo.png" alt="">
```

Keep the link's `class`, `href`, and `aria-label` unchanged.

- [ ] **Step 4: Replace the custom peak CSS**

Remove the `.brand-mark`, `.brand-mark::before`, and `.brand-mark::after` rules. Replace the existing `.brand` rule with:

```css
.brand { display:flex; align-items:center; padding:5px 10px; border-radius:12px; background:var(--navy); text-decoration:none; }
.header-logo { display:block; width:clamp(86px,9vw,104px); height:auto; }
```

This makes the original white-and-blue logo readable without changing the light header or navigation.

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

```powershell
node --test --test-name-pattern="header reuses the original Elevate logo" tests/site-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Run complete verification**

Run:

```powershell
node --test tests/site-contract.test.mjs tests/bubble-motion.test.mjs
node --check assets/js/main.js
git diff --check
```

Expected: 12 tests pass, the syntax check exits successfully, and the diff check reports no errors.

- [ ] **Step 7: Commit the implementation**

```powershell
git add -- index.html assets/css/style.css tests/site-contract.test.mjs
git commit -m "Use original Elevate logo in header"
```

### Task 2: Deploy and verify production

**Files:**
- No additional files

- [ ] **Step 1: Merge the verified implementation into `main`**

Use a fast-forward merge from the isolated feature branch, then rerun the complete verification commands from Task 1, Step 6 on `main`.

- [ ] **Step 2: Push `main` to GitHub**

```powershell
git push origin main
```

Expected: GitHub accepts the new commit and Netlify begins the connected deployment.

- [ ] **Step 3: Verify production**

Fetch `https://elevate-sharm.com/` and `https://elevate-sharm.com/assets/css/style.css` with cache-busting query parameters. Confirm the public HTML contains the `.header-logo` image using `assets/images/Elevate%20Logo.png`, the custom `.brand-mark` markup is absent, and the public CSS contains the navy `.brand` surface and responsive `.header-logo` dimensions.

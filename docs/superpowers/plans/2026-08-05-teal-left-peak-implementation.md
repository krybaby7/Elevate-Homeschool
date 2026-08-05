# Teal Left Peak Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the left Elevate header peak to the existing aqua/teal palette color while keeping the right peak blue.

**Architecture:** Preserve the existing pseudo-element geometry. Add a contract assertion for each peak's border colors, then override only `.brand-mark::before` to use `var(--aqua)`.

**Tech Stack:** CSS, Node.js built-in test runner, GitHub, Netlify

---

### Task 1: Add and satisfy the two-tone peak contract

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Add the failing assertion**

Extend `header brand mark renders two peaks` with:

```js
assert.match(css, /\.brand-mark::before\s*\{[^}]*border-left-color:var\(--aqua\);[^}]*border-top-color:var\(--aqua\);/);
assert.match(css, /\.brand-mark::after\s*\{[^}]*left:15px;[^}]*top:3px;/);
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
node --test --test-name-pattern="header brand mark renders two peaks" tests/site-contract.test.mjs
```

Expected: FAIL because the left peak still inherits `var(--blue)`.

- [ ] **Step 3: Implement the teal left peak**

Replace the existing left-peak rule with:

```css
.brand-mark::before { left:2px; top:7px; border-left-color:var(--aqua); border-top-color:var(--aqua); }
```

Keep `.brand-mark::after` unchanged.

- [ ] **Step 4: Verify GREEN and run the full suite**

```powershell
node --test --test-name-pattern="header brand mark renders two peaks" tests/site-contract.test.mjs
node --test tests/site-contract.test.mjs tests/bubble-motion.test.mjs
node --check assets/js/main.js
git diff --check
```

Expected: focused test passes, all 12 tests pass, and syntax/diff checks exit 0.

- [ ] **Step 5: Commit and deploy**

```powershell
git add -- tests/site-contract.test.mjs assets/css/style.css
git commit -m "Color left brand peak teal"
git push origin main
```

Expected: Netlify publishes the pushed commit. Verify `https://elevate-sharm.com/` computes the left peak border color as `rgb(130, 223, 233)` and the right peak as `rgb(47, 104, 223)`.

# Elevate Homepage Redesign Design

**Date:** 2026-08-05  
**Status:** Approved by the user for implementation and deployment
**Production site:** `https://elevate-sharm.com`  
**Repository:** `krybaby7/Elevate-Homeschool`

## 1. Objective

Replace the existing Elevate homepage with a concise, modern admissions experience for parents considering the full-time Grades 9–12 programme.

The page must communicate the essential idea in very simple English, create curiosity, and lead parents toward booking a private campus visit. It should feel innovative and future-ready while remaining warm, personal, and easy to understand for parents who may not be native English speakers.

## 2. Success criteria

- A parent can understand what Elevate is from the first screen.
- The page contains four focused content sections, plus a compact header and footer.
- The visual design feels abstract, modern, and distinctive without relying on a Sharm landscape.
- The main action is **Book a private visit**.
- Optional detail is revealed through interaction instead of being shown as long paragraphs.
- The School Portal remains easy to reach.
- Exact tuition fees are not published; parents may request the current tuition guide.
- The AP/SAT extra-tuition offer is temporarily unavailable and absent from public navigation.
- The result works well on phones, supports keyboard use, and respects reduced-motion settings.

## 3. Audience and communication principles

Primary audience: parents of prospective Grades 9–12 students in Sharm El Sheikh, including many non-native English speakers.

Content rules:

- Prefer short sentences and familiar words.
- Express one idea at a time.
- Avoid long institutional descriptions on the homepage.
- Avoid outdated 2025 intake language and exact fee figures.
- Avoid absolute outcome guarantees. GPA messaging will be supportive, not contractual.
- Do not foreground “homeschool” or “online school” language; present Elevate as a supported physical high-school experience in Sharm.

## 4. Page structure

### 4.1 Header

The compact header contains:

- Elevate logo/wordmark
- Why Elevate
- How it works
- Visit us
- School Portal, visually distinguished and linking to `https://portal.elevate-sharm.com/login`

The AP/SAT extra-tuition link is removed.

### 4.2 Hero: the promise

Approved core copy:

- Kicker: **Admissions open · Grades 9–12**
- Heading: **A high school built around your child.**
- Supporting line: **Small classes. Personal guidance. A fully accredited US diploma in Sharm El Sheikh.**
- Primary action: **Book a private visit**
- Secondary action: **Discover Elevate**
- Compact proof points: **US diploma**, **Grades 9–12**, **Small groups**, **Sharm campus**

The right side contains the abstract “Living Curriculum” bubble system centred on **YOUR CHILD**. There is no “Tap the bubbles to learn more” helper sentence; the plus signs and affordances should make discovery intuitive.

### 4.3 Why parents choose Elevate

Heading: **The best of both worlds.**

Three short benefits:

1. **Personal attention** — Small groups. Teachers who know every student.
2. **Flexible learning** — A path shaped around strengths and goals.
3. **Recognised diploma** — An accredited US programme through Bridgeway.

### 4.4 How Elevate works

Heading: **Simple. Personal. Focused.**

Three steps:

1. **We meet your child**
2. **We build their plan**
3. **We guide them forward**

Each step may reveal one short optional explanation on tap/click. The closed state remains visually concise.

### 4.5 Private visit

Heading: **Come and meet us.**

Supporting line: **A short private visit is the easiest way to understand whether Elevate is right for your child.**

The compact Netlify form contains:

- Parent name
- Phone or email
- Student’s current grade
- Optional request for the current tuition guide
- Submit action: **Request a visit**

No exact tuition amount appears on the homepage.

### 4.6 Footer

Use a compact footer with only current, source-backed school contact/location details, the School Portal link, and copyright information. It must not introduce another marketing section.

## 5. Interactive bubble system

### 5.1 Bubble content

| Bubble | Expanded title | Expanded explanation |
| --- | --- | --- |
| Interests | Start with the student | We begin with your child’s strengths, interests and future goals. |
| Curriculum | Shape the right programme | A flexible American curriculum becomes a clear, personal learning plan. |
| Guidance | Never just a number | Small groups and close mentoring keep every student seen and supported. |
| Future | Move forward with confidence | Diploma credits, SAT focus and university planning stay connected. We help every student work toward a strong GPA. |

Only one explanation is open at a time. Selecting an open bubble closes it; a close control and Escape key also close it. The selected bubble comes forward while the others recede slightly.

### 5.2 Cursor motion

On pointer-capable desktop devices, each bubble calculates its own vector toward the cursor from its own resting centre. This means different bubbles can move in different directions at the same moment. The central **YOUR CHILD** bubble follows as well.

Approved movement limits:

- Interests: 14 px
- Curriculum: 20 px
- Guidance: 13 px
- Future: 18 px
- YOUR CHILD: 12 px

Movement uses slow easing and a very small ambient drift. It must never interfere with clicking, cause layout shift, or make the labels difficult to read. Pointer following is disabled for touch input and when reduced motion is requested.

## 6. Visual system

Direction: **Living Curriculum**.

- Abstract modular forms rather than photographic scenery.
- Light, airy canvas with deep academic blue as the anchor.
- Supporting coral, aqua, pale blue, and restrained gold accents.
- Rounded but purposeful geometry; premium rather than childish.
- Generous whitespace, strong hierarchy, and very little copy.
- Motion is gentle and responsive, not decorative spectacle.
- Mobile layout stacks content cleanly and keeps primary actions near the top.

The existing Elevate logo remains. Existing Sharm landscape imagery is not required on the homepage.

## 7. Technical approach

Keep the existing lightweight hosting model:

- Semantic HTML in `index.html`
- Responsive CSS in `assets/css/style.css`
- Vanilla JavaScript in `assets/js/main.js`
- Netlify static hosting and Netlify Forms
- No framework, package manager, build step, or heavy animation library

The redesign should replace obsolete homepage markup and behavior rather than layering additional styles over the old design.

Use `requestAnimationFrame` for cursor motion, with motion paused when the hero is not visible. Prefer CSS custom properties/transforms so movement composes safely with hover and selected states.

## 8. Content and CMS

Consolidate active homepage copy into a clear `data/homepage.yml` structure and keep meaningful HTML fallbacks so the essential content remains visible if YAML loading fails.

Update `admin/config.yml` to reference `data/` rather than the currently nonexistent `_data/` paths. The CMS should expose only useful public content fields; fine-grained animation constants remain in code.

Legacy YAML files may remain during the transition if needed for safe rollback, but the new homepage must have one unambiguous active source for its copy.

## 9. Forms and data flow

The visit form fields must exist statically in `index.html` so Netlify detects them during deployment. Submission data flows to the existing Netlify site account; no new database is introduced.

Behavior:

1. Parent submits the form.
2. The page validates required fields clearly.
3. A successful submission shows a warm confirmation without losing the page context.
4. A failed submission preserves entered values and shows a concise retry message.

The implementation must verify that submissions appear in Netlify before production is considered complete.

## 10. AP/SAT temporary unavailability

- Remove all homepage and header links to `extra-tuition.html`.
- Remove AP/SAT extra-tuition marketing from the new homepage and metadata.
- Retain `extra-tuition.html` in the repository for easy future restoration.
- Add a forced temporary Netlify redirect from `/extra-tuition` and `/extra-tuition.html` to the homepage before the global catch-all redirect.

This is reversible when the service is ready to relaunch.

## 11. Accessibility and graceful degradation

- All interactive topic bubbles are real buttons with clear focus states.
- Use `aria-expanded`, an associated explanation region, and polite announcements where helpful.
- Escape closes an open explanation.
- Click/tap works without pointer-follow motion.
- `prefers-reduced-motion: reduce` removes pointer following and nonessential animation.
- Text and controls meet readable contrast and touch-target expectations.
- If JavaScript fails, the core promise, benefits, process, visit form, and contact details remain available.
- Avoid motion on small touch devices; do not emulate hover behavior on phones.

## 12. SEO and performance

- Update page title, description, and keywords around Elevate’s Grades 9–12 American high-school programme in Sharm El Sheikh.
- Remove outdated AP/HarvardX-heavy metadata and 2025 intake references.
- Keep critical text in HTML for indexing.
- Use no new external image or animation payloads.
- Preserve the current Meta Pixel unless testing shows it causes an error.

## 13. Verification and deployment

Before deployment:

- Validate HTML, CSS, and JavaScript syntax.
- Test desktop and mobile layouts at representative widths.
- Test bubble click, keyboard, Escape, touch, cursor direction, range, and reduced-motion behavior.
- Test header navigation, section links, and School Portal destination.
- Test the private-visit form’s validation, success, error, and Netlify capture.
- Confirm both extra-tuition URLs redirect to the homepage.
- Check for console errors and obvious performance regressions.

Deployment path:

1. Implement and verify on `codex/homepage-redesign`.
2. Review the final diff against this specification.
3. Merge the verified work to `main` and push to GitHub.
4. Monitor the Netlify production deploy.
5. Verify `https://elevate-sharm.com`, `https://www.elevate-sharm.com`, the School Portal link, form capture, and temporary AP/SAT redirects.

## 14. Out of scope

- Redesigning the School Portal
- Building a native iOS or Android application
- Publishing new tuition figures
- Relaunching the AP/SAT extra-tuition service
- Migrating away from Netlify
- Rebuilding the site in a JavaScript framework

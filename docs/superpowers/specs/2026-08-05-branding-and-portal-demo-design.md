# Elevate Branding and Portal Demo Data Design

**Date:** 2026-08-05  
**Status:** Approved design  
**Scope:** Public website branding and a small set of live, clearly fictional portal records

## Goals

1. Evolve the compact Elevate header mark from one peak to two peaks without replacing the wordmark or changing the navigation layout.
2. Make the Bridgeway Academy relationship visible on the homepage without adding a text-heavy section.
3. Make the school portal useful for a short colleague demonstration with a third teacher and a small, coherent set of mock records.

## Public website design

### Two-peak Elevate mark

The CSS-drawn mark beside `ELEVATE` will use two staggered blue peaks. The second peak will sit slightly higher and to the right of the first, preserving the abstract mountain/forward-motion character of the existing mark. The wordmark, header height, navigation spacing, and mobile menu behavior will remain unchanged.

### Bridgeway partnership strip

A compact white trust strip will sit between the hero and the benefits section. It will contain:

- the short label `Academic partner`
- Bridgeway Academy's official logo or official wordmark asset
- a link to Bridgeway Academy's current official website

The strip will be deliberately concise, visually quieter than the hero, and responsive on small screens. It will not introduce claims beyond the partnership wording already used by Elevate. The existing `Recognised diploma` benefit will remain unchanged.

### Accessibility and resilience

- The partner logo will have useful alternative text.
- The link will have an accessible name that describes the destination.
- Layout will remain readable if the image cannot load.
- Focus styles will match the site's existing interaction treatment.

## Portal demo-data design

The records will be created through the portal's existing administrator controls so they behave like normal portal data. Existing Adam and Sally accounts and all existing records will remain untouched.

### Teacher

- Name: `Ashley`
- Email: `ashley@elevate-sharm.com`
- Role: teacher

### Demo family

- Parent: `Daniel Carter (Demo Parent)`
- Parent email: `demo.parent@elevate-sharm.com`
- Student: `Maya Carter (Demo Student)`
- Grade: 10

The generated usernames and temporary passwords will be captured for the school owner after account creation. They will not be committed to Git.

### Courses and enrolment

1. `English 10`
   - Subject: English
   - Teacher: Sally
   - Student: Maya Carter (Demo Student)
2. `Algebra II`
   - Subject: Mathematics
   - Teacher: Ashley
   - Student: Maya Carter (Demo Student)

### Supporting demo records

- One whole-school welcome announcement for the 2026–27 school year.
- One English assignment in `English 10`.
- One mathematics assignment in `Algebra II`.
- One Grade 10 family-orientation calendar event.

Assignments will use short, obviously educational prompts and future dates suitable for the August 2026 portal view. The calendar event will be visible to the whole school unless the portal offers a reliable Grade 10 audience control.

### Explicit exclusions

- No changes to Adam or Sally's accounts or passwords.
- No mock payment or tuition records.
- No mock private messages.
- No Bridgeway checklist submissions.
- No uploads containing personal or confidential data.

## Data flow and sequencing

1. Add Ashley so she is available in course teacher selectors.
2. Create the demo family so the student is available for enrolment.
3. Create both courses and enrol the demo student.
4. Add the announcement, assignments, and calendar event.
5. Verify dashboard totals and each affected portal section.
6. Update the public website in Git, run automated checks, push `main`, and verify Netlify production.

## Error handling

- Before creating each portal record, confirm that a record with the same identifying name or email does not already exist.
- After every creation, verify the portal's success state before continuing to dependent records.
- If a creation partially succeeds, stop and reconcile the visible records instead of submitting the same form again.
- Preserve and report any generated credentials once; never commit them to the website repository.
- If the official Bridgeway asset cannot be used reliably, use a text wordmark treatment and do not invent or redraw its trademark.

## Verification

### Public website

- Automated contract tests cover the two-peak mark hooks, partnership strip, official destination link, alternative text, and responsive styling.
- Local browser verification covers desktop and mobile layout and keyboard focus.
- Production verification confirms the deployed homepage returns successfully and displays the new mark and partnership strip.

### Portal

- Teachers list contains Adam, Sally, and Ashley.
- Families list contains the one fictional family.
- English 10 is assigned to Sally; Algebra II is assigned to Ashley.
- Maya is enrolled in both courses.
- The announcement, two assignments, and calendar event are visible in their intended sections.
- Existing accounts, payments, messages, and Bridgeway queue remain unchanged.

# Elevate Portal Demo Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Populate the live Elevate portal with one third teacher and a small, coherent set of clearly fictional records for colleague demonstrations.

**Architecture:** Use the portal's existing authenticated administrator forms so every mock record exercises real application behavior. Create records in dependency order—teacher and family first, then courses and enrolment, then content—and verify each success state before proceeding to prevent duplicates.

**Tech Stack:** Next.js portal UI, existing portal authentication and server actions, live portal database

---

## Demo dataset

| Type | Record |
|---|---|
| Teacher | Ashley — `ashley@elevate-sharm.com` |
| Parent | Daniel Carter (Demo Parent) — `demo.parent@elevate-sharm.com` |
| Student | Maya Carter (Demo Student) — Grade 10 |
| Course | English 10 — English — Sally |
| Course | Algebra II — Mathematics — Ashley |
| Announcement | Welcome to Elevate — 2026–27 |
| Assignment | Personal Narrative: A Turning Point — English 10 — due 2026-08-20 15:00 |
| Assignment | Quadratic Functions Review — Algebra II — due 2026-08-22 15:00 |
| Event | Grade 10 Family Orientation — 2026-08-12 17:00–18:00 |

### Task 1: Establish a duplicate-safe baseline

**Portal pages:**
- Inspect: `/dashboard`
- Inspect: `/dashboard/people`
- Inspect: `/dashboard/courses`
- Inspect: `/dashboard/announcements`
- Inspect: `/dashboard/assignments`
- Inspect: `/dashboard/calendar`

- [ ] **Step 1: Record baseline dashboard totals**

Record the visible counts for students, parents, courses, announcements, submissions to grade, and Bridgeway queue.

- [ ] **Step 2: Check unique teacher and family identifiers**

On `/dashboard/people`, verify that none of these already exists:

```text
Ashley
ashley@elevate-sharm.com
Daniel Carter (Demo Parent)
demo.parent@elevate-sharm.com
Maya Carter (Demo Student)
```

Expected: no matching teacher or family. If a match exists, do not submit that creation form; inspect the existing record and continue only with missing dependent records.

- [ ] **Step 3: Check course and content titles**

Verify that the following names do not already exist:

```text
English 10
Algebra II
Welcome to Elevate — 2026–27
Personal Narrative: A Turning Point
Quadratic Functions Review
Grade 10 Family Orientation
```

Expected: no duplicates.

### Task 2: Create Ashley's teacher account

**Portal page:**
- Modify live data through: `/dashboard/people`

- [ ] **Step 1: Fill the Add teacher form**

```text
Name: Ashley
Email: ashley@elevate-sharm.com
```

- [ ] **Step 2: Submit `Add teacher` once**

Expected: a success state appears and the Teachers list contains Ashley with the supplied email.

- [ ] **Step 3: Capture generated credentials privately**

Record Ashley's generated username or email login and temporary password for the final handoff. Do not place credentials in Git, the design document, or the implementation plan.

- [ ] **Step 4: Verify existing teachers**

Expected: Adam and Sally remain listed and unchanged; Ashley is the third teacher.

### Task 3: Create the fictional family

**Portal page:**
- Modify live data through: `/dashboard/people`

- [ ] **Step 1: Fill Add a family or student**

```text
Parent name: Daniel Carter (Demo Parent)
Parent email: demo.parent@elevate-sharm.com
Student name: Maya Carter (Demo Student)
Grade: Grade 10
```

- [ ] **Step 2: Submit `Create accounts` once**

Expected: a success state displays generated parent/student credentials and the family appears in the Families list.

- [ ] **Step 3: Capture generated credentials privately**

Record the parent and student login identifiers and temporary passwords for the final handoff. Do not commit them to Git.

- [ ] **Step 4: Verify family data**

Expected: Daniel is the parent, Maya is the Grade 10 student, and only one demo family was created.

### Task 4: Create and populate the two courses

**Portal pages:**
- Modify live data through: `/dashboard/courses`
- Modify enrolment through each newly created course detail page

- [ ] **Step 1: Create English 10**

```text
Course name: English 10
Subject area: English
Teacher: Sally
```

Submit `Create course` once and verify the course card or detail page names Sally as teacher.

- [ ] **Step 2: Create Algebra II**

```text
Course name: Algebra II
Subject area: Mathematics
Teacher: Ashley
```

Submit `Create course` once and verify the course card or detail page names Ashley as teacher.

- [ ] **Step 3: Enrol Maya in English 10**

Open the English 10 detail page, choose `Maya Carter (Demo Student)` in the enrolment control, submit once, and verify Maya appears in the course roster.

- [ ] **Step 4: Enrol Maya in Algebra II**

Open the Algebra II detail page, choose `Maya Carter (Demo Student)` in the enrolment control, submit once, and verify Maya appears in the course roster.

- [ ] **Step 5: Cross-check assignments prerequisites**

Open `/dashboard/assignments/new` and verify that both `English 10` and `Algebra II` now appear in the Course selector.

### Task 5: Add the whole-school announcement

**Portal page:**
- Modify live data through: `/dashboard/announcements/new`

- [ ] **Step 1: Fill the announcement form**

```text
Title: Welcome to Elevate — 2026–27
Announcement: We are excited to welcome students and families to a new school year. Please check the portal for course updates, assignments and upcoming events.
Who is this for?: Everyone
```

- [ ] **Step 2: Post once and verify**

Submit `Post announcement` once. Expected: the announcement appears on `/dashboard/announcements` with the exact title and whole-school audience.

### Task 6: Add one assignment per course

**Portal page:**
- Modify live data through: `/dashboard/assignments/new`

- [ ] **Step 1: Create the English assignment**

```text
Title: Personal Narrative: A Turning Point
Course: English 10
Instructions: Write 500–700 words about an experience that changed how you see yourself or the world. Include a clear beginning, middle and end, then proofread before submitting.
Due date & time: 2026-08-20 15:00
Attachment: none
```

Submit `Give assignment` once and verify it appears in the assignments list for English 10.

- [ ] **Step 2: Create the mathematics assignment**

```text
Title: Quadratic Functions Review
Course: Algebra II
Instructions: Complete problems 1–12 on quadratic graphs and equations. Show each step and check your final answers.
Due date & time: 2026-08-22 15:00
Attachment: none
```

Submit `Give assignment` once and verify it appears in the assignments list for Algebra II.

### Task 7: Add the orientation calendar event

**Portal page:**
- Modify live data through: `/dashboard/calendar`

- [ ] **Step 1: Fill the event form**

```text
Title: Grade 10 Family Orientation
Starts: 2026-08-12 17:00
Ends: 2026-08-12 18:00
Details: Meet the teachers, review the Grade 10 learning plan and ask questions about the school year.
Who is this for?: Whole school
```

- [ ] **Step 2: Submit `Add event` once**

Expected: the event appears on August 12 and in the August 2026 event list with the exact start/end times.

### Task 8: Verify the coherent portal demo

**Portal pages:**
- Verify: `/dashboard`
- Verify: `/dashboard/people`
- Verify: `/dashboard/courses`
- Verify: `/dashboard/announcements`
- Verify: `/dashboard/assignments`
- Verify: `/dashboard/calendar`
- Verify unchanged: `/dashboard/payments`, `/dashboard/messages`, `/dashboard/bridgeway`

- [ ] **Step 1: Verify people and totals**

Expected:

```text
Teachers: Adam, Sally, Ashley
Parents: 1
Students: 1
Demo family: Daniel Carter (Demo Parent) + Maya Carter (Demo Student), Grade 10
```

- [ ] **Step 2: Verify academic relationships**

Expected:

```text
English 10 → Sally → Maya
Algebra II → Ashley → Maya
```

- [ ] **Step 3: Verify supporting records**

Expected: one welcome announcement, two assignments with the specified courses and dates, and one orientation event on August 12.

- [ ] **Step 4: Verify excluded areas remain unchanged**

Compare payments, messages, and Bridgeway queue with the baseline. Expected: no new records or changed counts.

- [ ] **Step 5: Prepare the private handoff**

Report the created records and generated Ashley/parent/student credentials directly to the authorized user. Label every generated account as demo data and recommend changing temporary passwords before any real use.

# Persistent Keyboard Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adapt the one-page portfolio into a developer showcase with one persistent interactive Three.js keyboard, scroll-driven scenes, projects, and contact.

**Architecture:** Keep the existing Next.js App Router, React, TypeScript, Tailwind, and direct Three.js setup. A client-side `KeyboardWorld` owns one full-screen renderer and shares the active key state with the page, project mascot, and overlay; DOM sections remain semantic and scrollable above the canvas.

**Tech Stack:** Next.js 16.4.5, React 19, TypeScript, Tailwind CSS 4, Three.js 0.187. No R3F, Drei, GSAP, Framer Motion, Lenis, or backend.

**Spec:** `docs/superpowers/specs/2026-11-08-portfolio-design.md`

## Global Constraints

- Keep a single static-exportable page with Home, Skills, Projects, Contact, and Footer.
- Keep all profile, skill, project, contact, and social content in local data files.
- Use one persistent WebGL canvas; cap DPR and honor reduced motion.
- Preserve ordinary scrolling, readable HTML content, keyboard access, and mobile tap interactions.
- Do not invent real project URLs, email addresses, social profiles, certifications, or skill claims.

## Review Focus

- WebGL unavailable: semantic content and project/contact controls remain usable.
- Touch scroll and key taps: vertical page scroll remains possible and tapping a key releases cleanly.
- Reduced motion: keyboard stays in its section pose without continuous idle motion.
- Long skill labels, names, and project descriptions: remain visible and do not overflow.
- Empty external links: do not render misleading active links.

## Tasks

### Task 1: Local portfolio content and semantic sections

**Files:** Create `app/data/portfolio.ts`; modify `app/page.tsx` and `README.md`.

- [x] Move editable profile, 25 skills, four sample project cards, contact email, and social labels into local data.
- [x] Replace Achievement with Projects and Contact; keep Home, Skills, Projects, Contact navigation.
- [x] Keep unknown demo, GitHub, and social URLs empty and render those controls as unavailable until configured.
- [x] Update README with the existing Next.js run commands and data edit locations.

### Task 2: Persistent 3D keyboard

**Files:** Create `app/components/keyboard-world.tsx`; remove `app/components/skills-scene.tsx`; modify `app/page.tsx` and `app/globals.css`.

- [x] Render one fixed full-viewport Three.js canvas behind all sections.
- [x] Build a 5×5 keyboard case and keycaps from the 25 local skill entries, using local canvas textures for logo-like marks.
- [x] Cap pixel ratio at 1.5, use low-power rendering, stars, soft case shadow, and cleanup resources.
- [x] Progressively create keycaps and show a short progress overlay until the scene is ready.

### Task 3: Keyboard interactions and scroll poses

**Files:** Modify `app/components/keyboard-world.tsx`; create `app/components/bongo-cat.tsx`.

- [x] Interpolate keyboard position, rotation, and scale between Home, Skills, Projects, and Contact from native scroll position.
- [x] Add hover lift/glow, pointer and touch press/release, spring-like return, and hotkeys from local skill data.
- [x] Show the active technology and short playful line in a left-side overlay while a key is held.
- [x] Add a cursor-following sticker on desktop and a small bongo-cat SVG in Projects whose paws react to key presses.
- [x] Disable continuous idle movement when reduced motion is requested; keep interaction available.

### Task 4: Projects carousel and Contact form

**Files:** Create `app/components/projects-carousel.tsx` and `app/components/contact-form.tsx`; modify page and styles.

- [x] Add four project cards with thumbnails, tags, and optional demo/source links; one active card is emphasized.
- [x] Add previous/next controls and touch-friendly horizontal navigation.
- [x] Add required name/email/message validation and a mailto-based send flow with loading and draft-open status.
- [x] Add footer social icon labels, enabling links only when real URLs are supplied.

### Task 5: Responsive styling and verification

**Files:** Modify `app/globals.css`, `README.md`, and the design spec.

- [x] Style the near-black scene, large uppercase type, section reveals, fixed canvas layering, project carousel, form, and footer.
- [x] Provide responsive layouts and preserve `prefers-reduced-motion` support.
- [x] Run `npm run build`; static export completes successfully.
- [x] Run `npm run lint`; no lint errors remain. Visual browser inspection was unavailable in this turn.

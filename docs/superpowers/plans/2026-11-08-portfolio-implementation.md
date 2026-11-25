# One-Page Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the starter page with a responsive Indonesian portfolio containing Home, Skills, Achievement, and Project sections, with a real Three.js skill scene.

**Architecture:** Keep page content and section navigation as semantic, statically rendered React markup. Isolate Three.js renderer setup, animation, selection, and cleanup in one client component, with an accessible HTML skill list as its fallback and content equivalent. Store editable portfolio placeholders in one local data module.

**Tech Stack:** Next.js 16.4.5 App Router, React 19, TypeScript, Tailwind CSS 4 via PostCSS, Three.js, Webpack.

**Spec:** `docs/superpowers/specs/2026-11-08-portfolio-design.md`

## Global Constraints

- One page with Home, Skills, Achievement, and Project navigation anchors.
- Use an actual Three.js scene for colored technology keycaps.
- Render static content; keep only WebGL interaction in a client component.
- Use replaceable placeholders; do not invent biography, skills, certificates, project details, or destination URLs.
- Include HTML content/fallback for skills, keyboard-accessible navigation, resize handling, WebGL cleanup, and reduced-motion support.
- Prefer the smallest suitable dependency set; do not use external 3D assets.

## Review Focus

- WebGL unavailable: the skill names and page navigation remain usable through HTML fallback.
- Narrow viewport: keycaps and surrounding sections stay readable without horizontal overflow.
- Long skill lists: all names remain available outside the canvas, even if the scene scales down.
- Reduced motion enabled: no continuous scene animation or auto-rotation runs.
- Component unmount or resize: the renderer resizes correctly and disposes scene resources and listeners.

---

### Task 1: Set up page content and static portfolio data

**Files:**
- Create: `app/portfolio-data.ts`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `next.config.ts`

**Interfaces:**
- `app/portfolio-data.ts` exports typed `profile`, `skills`, `achievements`, and `projects` constants.
- Each skill has `id`, `label`, `color`, and optional `description`; each achievement and project has stable `id` and editable placeholder fields. Project URLs remain absent until real URLs are supplied.
- `app/page.tsx` renders the four anchored sections and a semantic skills list.

- [x] Replace starter content with semantic Indonesian portfolio sections, nav anchors (`#home`, `#skills`, `#achievement`, `#project`), and a footer.
- [x] Put all placeholder copy and sample entries in `app/portfolio-data.ts`; leave all outbound URLs unset.
- [x] Set page metadata and document language to Indonesian.
- [x] Replace starter styles with responsive dark portfolio styling, visible focus states, anchor scroll offsets, and reduced-motion CSS.
- [x] Configure Next.js static export with Webpack and the documented Tailwind PostCSS plugin.
- [x] Keep all section content in the page markup, ensure each navbar anchor targets a section, and omit invented outbound links.

### Task 2: Build the Three.js skills scene

**Files:**
- Create: `app/components/skills-scene.tsx`
- Modify: `app/page.tsx`
- Modify: `package.json` and lockfile
- Modify: `app/globals.css` only if scene-specific responsive styles are needed

**Interfaces:**
- `SkillsScene({ skills }: { skills: Skill[] })` is a client component consuming the `Skill` type from `app/portfolio-data.ts`.
- Renders a canvas scene plus a semantic HTML list and selected-skill detail.

- [x] Add the `three` runtime dependency and its TypeScript types if required by the installed version.
- [x] Initialize a Three.js scene, camera, renderer, lights, and colored beveled keycap meshes in `useEffect`; embed the canvas beside the semantic skill list from Task 1.
- [x] Support pointer drag to rotate and pointer selection to show the selected skill label/optional description; ensure touch works through pointer events.
- [x] Add resize handling, reduced-motion behavior, WebGL failure fallback, and full disposal of listeners, geometries, materials, and renderer on unmount.
- [x] Keep skill labels, selection, and optional detail available in HTML so the canvas is not the only way to access skill content.

### Task 3: Integrate and refine the portfolio page

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/components/skills-scene.tsx` as needed

**Interfaces:**
- Page sections consume the local data constants from Task 1.
- Skills section embeds `SkillsScene` from Task 2 and retains the semantic skill list regardless of canvas support.

- [x] Tune spacing, section rhythm, responsive layout, typography, and card styles to keep the 3D skills feature central while maintaining readable content.
- [x] Confirm navbar anchors reach the correct sections and fixed/sticky navigation does not cover headings.
- [x] Keep desktop and mobile layouts readable, keyboard navigation visible, and reduced-motion behavior consistent with the spec.

## Execution rulings

- Ruling: use Webpack for development and production scripts, remove the custom Tailwind Turbopack loader, and use the standard Tailwind PostCSS plugin. Turbopack's CSS worker exited with code 0 both with the original loader and with the standard PostCSS plugin; Webpack compiled the same application successfully. This trades Turbopack speed for a working, documented build path.
- Ruling: disable Cache Components and Partial Prefetching for this static export. Webpack completed compilation, TypeScript, and static page generation, then Next.js rejected the config with `PPR cannot be enabled in export mode`; these features were already enabled by the starter and are not needed for a static portfolio.

## Build result

`npm run build` passed with Webpack and generated the static site in `out/`. No separate test suite, lint command, or browser visual review was run.

### Follow-up: Replace the Home card with a 3D portrait

**Files:**
- Create: `app/components/portrait-scene.tsx`
- Add: `public/profile-photo.png` (user-provided image, unchanged)
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- `PortraitScene({ name }: { name: string })` renders an accessible image fallback and a Three.js portrait card.

- [x] Use the original portrait as a texture on a rounded Three.js frame, with drag-based tilt from the pointer/touch start position.
- [x] Keep the source image accessible through `next/image` when WebGL is unavailable.
- [x] Resize and dispose the renderer, texture, geometry, material, and pointer listeners on unmount.

**Ruling:** Keep the photo unchanged and add depth through the frame, perspective, lighting, and pointer tilt; no depth-map or face-editing workflow is needed for the requested effect.

**Build:** `npm run build` passed after the drag-origin correction; `out/index.html` and `out/profile-photo.png` were generated. No browser visual review was run.

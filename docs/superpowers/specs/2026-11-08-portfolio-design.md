# Portfolio Website Design

## Intent

Build a static, one-page Next.js portfolio for an internship applicant. The site itself should demonstrate care and frontend ability through its design and implementation, without exaggerated claims about the applicant.

## Goals

- Present About, Skills, Projects, and Achievements sections in a clear page flow.
- Match the supplied reference's dark canvas, large Skills heading, and colorful 3D technology-key arrangement.
- Make skill keys interactive by click and keyboard, with a short hint and a visible selected state.
- Work on mobile and desktop, with readable contrast and keyboard-accessible controls.
- Keep the implementation small and static.

## Non-goals

- No backend, database, CMS, contact form, or dynamic data fetching.
- No WebGL scene, Three.js, or additional animation library.
- No invented biography, project details, certificates, or skill proficiency claims.

## Constraints and content

- Use the existing project setup if present; current workspace appears empty, so the implementation may need a minimal Next.js scaffold.
- Personal details and portfolio entries are not yet provided. Use clearly marked editable placeholders in a small local data structure.
- Preserve the intent of the reference rather than copying unrelated text or branding from it.

## Approaches

1. **Flat 2D skill grid:** simplest and lightest, but does not capture the reference's defining visual.
2. **CSS 3D skill keys (chosen):** uses CSS transforms and native buttons to suggest raised keycaps, with a small click/keyboard interaction. It stays lightweight and avoids a 3D dependency.
3. **Three.js scene:** gives full 3D camera and lighting control, but adds substantial code and runtime weight for one portfolio section.

The chosen approach is CSS 3D skill keys in an otherwise straightforward one-page layout.

## Proposed page

- **Navigation:** compact links to About, Skills, Projects, and Achievements.
- **About:** concise introduction with editable name, study/program, and internship-interest placeholders.
- **Skills:** dark section with colorful raised keycaps labeled by technology. Selecting a key reveals a short editable description; keyboard input can select a matching key.
- **Projects:** simple cards with editable title, summary, technologies, and optional project link.
- **Achievements:** compact certificate/achievement entries with editable title, issuer, and year.
- **Footer:** minimal contact or profile links, left as placeholders until supplied.

## Implementation calls left to the builder

- Reuse the installed Next.js version and styling setup where available.
- Prefer semantic HTML, CSS, and small client-side state only for the skill selection.
- Do not add dependencies unless the project already includes a needed one.
- Use responsive CSS and reduced-motion preferences for any transitions.

## Approval

Awaiting user approval before implementation.

# Aditia — Developer Portfolio

One-page developer portfolio built with Next.js, React, TypeScript, Tailwind CSS, and a persistent Three.js keyboard scene.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js. Create a static export with `npm run build`; the exported site is written to `out/`.

## Edit the content

Update `app/data/portfolio.ts` to change the profile name, role, introduction, contact email, keyboard technologies and key shortcuts, sample projects, and social URLs. The included projects are examples. Demo, GitHub, and social links are intentionally inactive until real URLs are added.

Keyboard layout and interaction are in `app/components/keyboard-world.tsx`. The projects carousel, contact form, and typing cat live in `app/components/`.

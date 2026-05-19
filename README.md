# Leo Rossetti — Portfolio

Personal developer portfolio. Design-heavy, dark aesthetic, built as a single-page Next.js site.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Motion · GSAP · Lenis · Three.js / React Three Fiber

**Package manager:** [bun](https://bun.sh).

## Getting started

```bash
bun install
bun run dev
```


## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the dev server (Turbopack) |
| `bun run build` | Production build |
| `bun run start` | Run the production build |
| `bun run lint` | ESLint |
| `bun run format` | Prettier — write |
| `bun run format:check` | Prettier — check |

## Project layout

```
app/               Next.js App Router entry, root layout, global styles
components/
  animation/       SmoothScrollProvider, RevealOnScroll
  layout/          Navbar, Footer, CustomCursor
  sections/        (Phase 2+) Hero, About, Services, Projects, Experience, Contact
  three/           (Phase 2) React Three Fiber scene
  ui/              shadcn/ui primitives
lib/
  data/            Typed portfolio data (nav, stack, projects, services, ...)
  motion.ts        Shared motion variants
  utils.ts         cn() helper
```

## Deploy

Target: [Vercel](https://vercel.com). First-party Next.js support, zero-config.

aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
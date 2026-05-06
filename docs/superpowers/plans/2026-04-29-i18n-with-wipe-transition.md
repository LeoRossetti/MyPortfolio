# i18n with Horizontal Wipe Transition — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add English/Portuguese internationalization to the portfolio with a Pokémon-style horizontal-wipe transition between locales.

**Architecture:** Locale-prefixed App Router routes (`/` for English canonical, `/pt` for Portuguese), hand-rolled typed dictionary loaded server-side, client-side wipe overlay coupled to `router.push()` at full cover. No third-party i18n library.

**Tech Stack:** Next.js 16.2.4 App Router, React 19, TypeScript, Motion (already installed), Tailwind v4. Verification via `tsc --noEmit`, `npm run lint`, and manual dev-server visual checks (this codebase has no test suite — adding one is out of scope).

**Source spec:** `docs/superpowers/specs/2026-04-29-i18n-with-wipe-transition-design.md`

---

## File Structure

### Created

| File | Responsibility |
|------|----------------|
| `lib/i18n/config.ts` | Supported locales constant, default locale |
| `lib/i18n/types.ts` | `Locale` type, `Dictionary` type derived from `en.ts` |
| `lib/i18n/dictionaries/en.ts` | English copy — full dictionary, single source of truth for shape |
| `lib/i18n/dictionaries/pt.ts` | Portuguese copy — same shape (placeholder English strings in Phase 1, real PT in Phase 3) |
| `lib/i18n/get-dictionary.ts` | Server util: `getDictionary(locale)` returns the dictionary for a locale |
| `proxy.ts` | Locale routing — rewrites `/` to `en` internally; in Phase 3, also reads `NEXT_LOCALE` cookie for return-visit redirect. **Note:** Next 16 renamed `middleware.ts` → `proxy.ts`; export is `proxy` not `middleware`. |
| `app/[locale]/layout.tsx` | Locale-aware layout: sets `<html lang>`, calls `generateMetadata`, fetches the dictionary, renders Navbar/Footer |
| `app/[locale]/page.tsx` | Section composition (was `app/page.tsx`) |
| `app/[locale]/not-found.tsx` | Locale-aware 404 |
| `components/animation/LocaleTransition.tsx` | Fixed wipe overlay, state machine, listens for `start-transition` events |
| `components/site/LocaleToggle.tsx` | Segmented `EN \| PT` pill |
| `lib/hooks/use-current-locale.ts` | Client hook reading current locale from URL |

### Modified

| File | What changes |
|------|--------------|
| `app/layout.tsx` | Strip `<html>`/`<body>` (move to `[locale]/layout.tsx`), keep only fonts and analytics that don't need locale; mount `LocaleTransition` here |
| `app/page.tsx` | **Delete** (content moves to `app/[locale]/page.tsx`) |
| `lib/data/hero.ts` | Strip copy fields; keep terminal-line *structure* with key references |
| `lib/data/projects.ts` | Strip `title`/`description`; keep `id`, `tech`, `status`, `links`, `colSpan` |
| `lib/data/services.ts` | Strip `title`/`pitch`; keep `id`, `icon`, `tech`, `colSpan` |
| `lib/data/experience.ts` | Strip `role`/`summary`/`highlights`; keep `id`, `company`, `start`, `end`, `location`, `tech`, `url` |
| `lib/data/stack.ts` | Strip `aboutCopy` and `stackCategoryLabel` (move to dictionary) |
| `lib/data/nav.ts` | Strip `label` from `navSections`; keep `id` only. Move `siteConfig.tagline` to dictionary. |
| `components/sections/Hero.tsx` | Accept `dict` prop |
| `components/sections/StackStrip.tsx` | Accept `aria-label` from dict |
| `components/sections/About.tsx` | Accept `dict` prop |
| `components/sections/Services.tsx` | Accept `dict` prop |
| `components/sections/Projects.tsx` | Accept `dict` prop |
| `components/sections/Experience.tsx` | Accept `dict` prop |
| `components/sections/Contact.tsx` | Accept `dict` prop |
| `components/layout/Navbar.tsx` | Accept `dict` prop, mount `LocaleToggle` |
| `components/layout/Footer.tsx` | Accept `dict` prop |
| `components/reactbits/StaggeredMenu.tsx` | Render an extra `LocaleToggle` row above the social list (or expose a `headerExtra` prop) |
| `app/sitemap.ts` | Emit both `/` and `/pt` with hreflang annotations |
| `app/opengraph-image.tsx` | Locale-aware (Phase 3) |
| `app/robots.ts` | Verify; likely no change |

---

## Phase 1 — Routing + dictionaries

**Stop point:** End of Task 9. Both `/` and `/pt` render with English content (PT placeholder), no toggle, no transition. Confirm visually before Phase 2.

---

### Task 1: Verify Next.js 16 i18n & proxy docs (✅ done by controller)

**Findings already verified — Phase 1 controller dispatched a research subagent against `node_modules/next/dist/docs/` and confirmed:**

1. **Renamed: `middleware.ts` → `proxy.ts`.** Export name is `proxy`, not `middleware`. File lives at the project root (alongside `next.config.ts`). Source: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:11`.
2. **Async params:** In App Router pages and layouts, `params` is a `Promise<{...}>`. Use `const { locale } = await params`. Source: `dynamic-routes.md:18-26`.
3. **`generateStaticParams`** returns `[{ locale: 'en' }, { locale: 'pt' }]` shape (unchanged).
4. **`headers()` from `next/headers` is async** — `const hdrs = await headers()`. Source: `headers.md:6,12`.
5. **`generateMetadata` async params** — same Promise pattern as pages: `params: Promise<{ locale: string }>`.
6. **`config.matcher`** array shape — unchanged from earlier versions.
7. **`NextResponse.next({ request: { headers } })` and `NextResponse.rewrite(url, { request: { headers } })`** both supported for forwarding modified request headers downstream. Source: `next-response.md:141-157`, `proxy.md:392-397`.

This task is therefore already complete. The plan code blocks reflect the verified API. Proceed to Task 2.

---

### Task 2: i18n config and types

**Files:**
- Create: `lib/i18n/config.ts`
- Create: `lib/i18n/types.ts`

- [ ] **Step 1: Write `lib/i18n/config.ts`**

```ts
export const locales = ["en", "pt"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
```

- [ ] **Step 2: Write `lib/i18n/types.ts`**

```ts
import type { Locale } from "./config";
import type en from "./dictionaries/en";

/**
 * The shape of every dictionary, derived from the English one.
 * Adding a key to en.ts forces pt.ts to add it too — the build fails
 * otherwise.
 */
export type Dictionary = typeof en;

export type { Locale };
```

This file imports from `en.ts` which doesn't exist yet — it'll resolve in Task 3. TypeScript will error here until then; that's fine.

- [ ] **Step 3: Type-check (will fail until Task 3)**

```bash
npx tsc --noEmit
```

Expected: failure on the `./dictionaries/en` import. This is OK; we proceed to Task 3.

- [ ] **Step 4: No commit yet** — bundle commit at end of Task 5.

---

### Task 3: English dictionary

**Files:**
- Create: `lib/i18n/dictionaries/en.ts`

This is the single source of truth for the dictionary shape. Every key here must have a matching key in `pt.ts`.

- [ ] **Step 1: Write `lib/i18n/dictionaries/en.ts`**

```ts
const en = {
  meta: {
    title: "Leo Rossetti — Full-stack Developer",
    titleTemplate: "%s · Leo Rossetti",
    description:
      "Full-stack developer. Ships products, not prototypes. TypeScript, React, Next.js, React Native, Node.js, Python, C#.",
    ogTitle: "Leo Rossetti — Full-stack Developer",
    ogDescription: "Full-stack developer. Ships products, not prototypes.",
  },
  locale: {
    ariaLabel: "Language",
    en: "EN",
    pt: "PT",
  },
  nav: {
    portfolio: "portfolio",
    home: "Home",
    about: "About",
    work: "Work",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
    goTo: "Go to",
  },
  hero: {
    eyebrow: "Full-stack developer",
    name: "Leo Rossetti",
    taglineLead: "Full-stack developer.",
    tagline: "Ships products, not prototypes.",
    scrollHint: "scroll ↓",
    cta: {
      primary: "View work",
      secondary: "Get in touch",
    },
    terminal: {
      whoami: "whoami",
      whoamiOutput: "leo.rossetti --role=fullstack --location=remote",
      stackList: "stack --list",
      stackOutput: "[typescript, react, next.js, react-native, node, python, c#]",
      current: "current",
      currentOutput: "shipping next.js + react native",
    },
  },
  stackStrip: {
    ariaLabel: "Technology stack",
  },
  about: {
    eyebrow: "// about",
    heading: "Hi, I'm Leo.",
    paragraphLeadFrom: "A full-stack developer from",
    paragraphCountry: "Brazil",
    paragraphTail:
      ", three years into the craft. I like shipping whole products end-to-end — the data model, the backend, the UI, the polish — not just prototypes.",
    status: "Remote · always shipping",
  },
  services: {
    eyebrow: "// work",
    headingLead: "What I",
    headingAccent: "work on",
    subheading:
      "A few overlapping lanes — most of my projects blend web, mobile, and a little design engineering.",
    items: {
      "full-stack-web": {
        title: "Full-Stack Web",
        pitch:
          "Next.js apps with real backends, auth, and deploy pipelines. Where most of my time goes.",
      },
      mobile: {
        title: "Mobile",
        pitch:
          "Cross-platform iOS/Android with the same JS/TS that powers the web side.",
      },
      backend: {
        title: "API & Backend",
        pitch:
          "Typed APIs, background jobs, and integrations. Meet the data where it lives — Node, Python, or .NET.",
      },
      "design-engineering": {
        title: "Design Engineering",
        pitch:
          "Motion-rich interfaces with Motion, GSAP, and Three.js. Interfaces that feel, not just look.",
      },
    },
  },
  projects: {
    eyebrow: "// projects",
    headingLead: "Shipped",
    headingAccent: "& shipping",
    subheading:
      "A small slice for now — more to come. Each tile links to source or a live demo when there is one.",
    items: {
      "yt-timestamp-saver": {
        title: "YouTube Timestamp Saver",
        description:
          "A browser extension that lets you save and organise timestamps inside YouTube videos. Cross-device sync, keyboard shortcuts, and quick-jump navigation.",
      },
      "next-1": {
        title: "In the works",
        description: "Next project — details soon.",
      },
      "next-2": {
        title: "In the works",
        description: "Next project — details soon.",
      },
      "next-3": {
        title: "In the works",
        description: "Next project — details soon.",
      },
    },
  },
  experience: {
    eyebrow: "// experience",
    headingLead: "Currently at",
    presentLabel: "Present",
    items: {
      dealfuel: {
        role: "Full-Stack Developer",
        summary:
          "Building and shipping production web + mobile features across the DealFuel product stack.",
        highlights: [
          "Owning features end-to-end across Next.js and React Native.",
          "Shipping TypeScript — frontend, backend, and the integrations that glue them together.",
          "Partnering with design to keep the UI consistent across platforms.",
        ],
      },
    },
  },
  contact: {
    eyebrow: "// contact",
    headingLead: "Say",
    headingAccent: "hi.",
    paragraph:
      "Questions, collaborations, or just want to chat about a stack? Any of these lands straight with me — I usually reply within a day.",
    channels: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
    copy: {
      action: "Copy email to clipboard",
      copied: "Email copied",
      toastSuccess: "Email copied to clipboard",
      toastError: "Couldn't copy — select and copy manually",
    },
  },
  footer: {
    ariaLabel: "Footer",
    rights: "All rights reserved",
    socials: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
  },
} as const;

export default en;
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS (the `lib/i18n/types.ts` import error from Task 2 should now resolve, since `en.ts` exports a default).

- [ ] **Step 3: No commit yet**

---

### Task 4: Portuguese dictionary placeholder

**Files:**
- Create: `lib/i18n/dictionaries/pt.ts`

In Phase 1 we only need the *shape* to match. Every string stays in English so `/pt` renders without breakage. Phase 3 (Task 14) replaces every English value with its Portuguese equivalent — no structural changes, only string contents.

- [ ] **Step 1: Create `pt.ts` as a structural duplicate of `en.ts`**

Concretely: take the entire object literal from `en.ts` (the value assigned to `const en`), paste it as the value of `const pt`, add the `Dictionary` type annotation, change the import line, and change the export. Every string value stays exactly as in `en.ts` — Phase 3 swaps them.

```ts
import type { Dictionary } from "../types";

const pt: Dictionary = {
  // PASTE the entire object literal from en.ts here, verbatim. Every key,
  // every value, every level of nesting. Strings stay English in Phase 1.
} as const;

export default pt;
```

The `Dictionary` type annotation enforces that `pt`'s shape matches `en`'s — TypeScript fails the build if any key is missing or wrongly typed. The `as const` is required so the literal types match `typeof en`.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS. If TypeScript complains about literal-type mismatches under `as const`, drop the type annotation and let `Dictionary` be enforced via `get-dictionary.ts` instead — but try this approach first.

- [ ] **Step 3: No commit yet**

---

### Task 5: get-dictionary server util + commit i18n scaffolding

**Files:**
- Create: `lib/i18n/get-dictionary.ts`
- Commit: i18n scaffolding so far

- [ ] **Step 1: Write `lib/i18n/get-dictionary.ts`**

```ts
import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaries = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  pt: () => import("./dictionaries/pt").then((m) => m.default),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/i18n/
git commit -m "Add i18n dictionary scaffolding (EN, PT placeholder)"
```

(Per the user's standing memory, propose this commit message and let Leo run `git commit` himself unless he overrides.)

---

### Task 6: Strip copy from data files

**Files:**
- Modify: `lib/data/hero.ts`
- Modify: `lib/data/projects.ts`
- Modify: `lib/data/services.ts`
- Modify: `lib/data/experience.ts`
- Modify: `lib/data/stack.ts`
- Modify: `lib/data/nav.ts`

Each data file loses its `*Copy` export and string literals; keeps only structural fields (slugs, ids, tech arrays, icons, hrefs, dates, colSpans).

- [ ] **Step 1: `lib/data/hero.ts`** — replace contents with:

```ts
export type TerminalLineKind = "command" | "output" | "blank";
export type TerminalLineKey =
  | "whoami"
  | "whoamiOutput"
  | "blank1"
  | "stackList"
  | "stackOutput"
  | "blank2"
  | "current"
  | "currentOutput";

export type TerminalLine =
  | { kind: "command"; prompt: string; key: TerminalLineKey }
  | { kind: "output"; key: TerminalLineKey; tone?: "default" | "muted" | "accent" }
  | { kind: "blank"; key: TerminalLineKey };

/** Structure only — actual text comes from `dict.hero.terminal` keyed by `key`. */
export const heroTerminalLines: TerminalLine[] = [
  { kind: "command", prompt: "~", key: "whoami" },
  { kind: "output", key: "whoamiOutput" },
  { kind: "blank", key: "blank1" },
  { kind: "command", prompt: "~", key: "stackList" },
  { kind: "output", tone: "accent", key: "stackOutput" },
  { kind: "blank", key: "blank2" },
  { kind: "command", prompt: "~", key: "current" },
  { kind: "output", tone: "accent", key: "currentOutput" },
];

export const heroCtaTargets = {
  primary: "#projects",
  secondary: "#contact",
} as const;
```

(`heroCopy` export removed.)

- [ ] **Step 2: `lib/data/projects.ts`** — replace contents with:

```ts
export type ProjectStatus = "live" | "in-progress" | "coming-soon";

export type ProjectLink = {
  labelKey: "github" | "demo" | "external";
  href: string;
  kind: "github" | "demo" | "external";
};

export type Project = {
  id: string;
  tech: string[];
  status: ProjectStatus;
  links?: ProjectLink[];
  media?: string;
  colSpan: string;
};

export const projects: Project[] = [
  {
    id: "yt-timestamp-saver",
    tech: ["TypeScript", "React", "Chrome Extension API"],
    status: "live",
    links: [
      { labelKey: "github", href: "https://github.com/LeoRossetti", kind: "github" },
    ],
    colSpan: "lg:col-span-8",
  },
  { id: "next-1", tech: ["TBA"], status: "in-progress", colSpan: "lg:col-span-4" },
  { id: "next-2", tech: ["TBA"], status: "coming-soon", colSpan: "lg:col-span-6" },
  { id: "next-3", tech: ["TBA"], status: "coming-soon", colSpan: "lg:col-span-6" },
];
```

(`projectsCopy` removed; `title`/`description` removed.)

- [ ] **Step 3: `lib/data/services.ts`** — replace contents with:

```ts
import type { LucideIcon } from "lucide-react";
import { Code, Smartphone, Server, Palette } from "lucide-react";

export type ServiceId =
  | "full-stack-web"
  | "mobile"
  | "backend"
  | "design-engineering";

export type Service = {
  id: ServiceId;
  icon: LucideIcon;
  tech: string[];
  colSpan: string;
};

export const services: Service[] = [
  {
    id: "full-stack-web",
    icon: Code,
    tech: ["React", "Next.js", "TypeScript", "Convex", "Clerk", "Tailwind"],
    colSpan: "lg:col-span-8",
  },
  { id: "mobile", icon: Smartphone, tech: ["React Native", "Expo"], colSpan: "lg:col-span-4" },
  { id: "backend", icon: Server, tech: ["Node.js", "Python", "C#"], colSpan: "lg:col-span-4" },
  {
    id: "design-engineering",
    icon: Palette,
    tech: ["Motion", "GSAP", "Three.js", "Shaders"],
    colSpan: "lg:col-span-8",
  },
];
```

- [ ] **Step 4: `lib/data/experience.ts`** — replace contents with:

```ts
export type ExperienceId = "dealfuel";

export type ExperienceEntry = {
  id: ExperienceId;
  company: string;
  start: string;
  end: string | "Present";
  location?: string;
  tech: string[];
  url?: string;
};

export const experience: ExperienceEntry[] = [
  {
    id: "dealfuel",
    company: "DealFuel",
    start: "2024",
    end: "Present",
    location: "Remote",
    tech: ["TypeScript", "React", "Next.js", "React Native", "Convex", "Clerk", "Node.js"],
    url: "https://roles.dealfuel.ai",
  },
];
```

- [ ] **Step 5: `lib/data/stack.ts`** — replace contents with:

```ts
export type StackCategory =
  | "languages"
  | "frontend"
  | "mobile"
  | "backend"
  | "tooling";

export type StackItem = {
  name: string;
  category: StackCategory;
};

export const stack: StackItem[] = [
  { name: "TypeScript", category: "languages" },
  { name: "Python", category: "languages" },
  { name: "C#", category: "languages" },
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Tailwind", category: "frontend" },
  { name: "React Native", category: "mobile" },
  { name: "Expo", category: "mobile" },
  { name: "Node.js", category: "backend" },
  { name: "Convex", category: "backend" },
  { name: "Clerk", category: "backend" },
];

/** Tech terms — NOT translated. Stay as proper-noun strings. */
export const values = ["clean code", "ships fast", "design-minded"] as const;
```

(`aboutCopy` and `stackCategoryLabel` removed; `values` kept since the About section uses it un-translated as identity tokens.)

- [ ] **Step 6: `lib/data/nav.ts`** — replace contents with:

```ts
export type NavSectionId =
  | "home"
  | "about"
  | "services"
  | "projects"
  | "experience"
  | "contact";

export type NavSection = { id: NavSectionId };

export const navSections: NavSection[] = [
  { id: "home" },
  { id: "about" },
  { id: "services" },
  { id: "projects" },
  { id: "experience" },
  { id: "contact" },
];

export const siteConfig = {
  name: "Leo Rossetti",
  email: "leo.francatto@gmail.com",
  socials: {
    github: "https://github.com/LeoRossetti",
    linkedin: "https://www.linkedin.com/in/leorossetti",
    gmail: "mailto:leo.francatto@gmail.com",
  },
} as const;
```

(`label` removed from each section; `tagline` moved to `dict.hero.tagline`.)

- [ ] **Step 7: Type-check (will fail — components still reference removed exports)**

```bash
npx tsc --noEmit
```

Expected: errors in `components/sections/*.tsx` referencing missing `*Copy` exports and `label`. These will be fixed in Task 8.

- [ ] **Step 8: No commit yet** — components still broken.

---

### Task 7: Create `[locale]` route segment

**Files:**
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`
- Create: `app/[locale]/not-found.tsx`
- Modify: `app/layout.tsx` (strip down to thin shell)
- Delete: `app/page.tsx`

- [ ] **Step 1: Move `app/page.tsx` to `app/[locale]/page.tsx`**

```bash
mv C:/Users/leofr/Documents/GitHub/MyPortfolio/app/page.tsx C:/Users/leofr/Documents/GitHub/MyPortfolio/app/[locale]/page.tsx
```

Then edit it to receive the dictionary and pass it down. Replace contents with:

```tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionDivider } from "@/components/layout/SectionDivider";
import { Hero } from "@/components/sections/Hero";
import { StackStrip } from "@/components/sections/StackStrip";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, locales } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  // Next.js 16 params are async (Promise). If your verification in Task 1
  // showed otherwise, drop the `await` and the Promise wrapper.
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const dict = await getDictionary(rawLocale);

  return (
    <>
      <Navbar dict={dict} />

      <main className="relative flex flex-1 flex-col">
        <Hero dict={dict} />
        <StackStrip dict={dict} />
        <About dict={dict} />
        <SectionDivider />
        <Services dict={dict} />
        <SectionDivider />
        <Projects dict={dict} />
        <SectionDivider />
        <Experience dict={dict} />
        <SectionDivider />
        <Contact dict={dict} />
      </main>

      <Footer dict={dict} />
    </>
  );
}
```

- [ ] **Step 2: Create `app/[locale]/layout.tsx`** with metadata + html lang:

```tsx
import type { Metadata, Viewport } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);

  return {
    title: { default: dict.meta.title, template: dict.meta.titleTemplate },
    description: dict.meta.description,
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: {
        en: "/",
        "pt-BR": "/pt",
      },
    },
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      type: "website",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      url: locale === "en" ? siteUrl : `${siteUrl}/${locale}`,
      siteName: "Leo Rossetti",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#171717",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  // The <html lang> attribute is set on the root <html> in app/layout.tsx
  // via a client-side effect tied to the URL — see Task 8. Server-rendered
  // html lang is injected via the lang attribute in this fragment via
  // suppressHydrationWarning on the root.
  return <>{children}</>;
}
```

**Note:** The `<html lang>` attribute is set in `app/layout.tsx` (the root). Since the root layout doesn't know the locale, we set a sensible default (`en`) on the server and patch it on the client via a small effect mounted in the locale layout. See Step 4 below.

- [ ] **Step 3: Create `app/[locale]/not-found.tsx`**:

```tsx
export default function LocaleNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <p className="font-mono text-sm">404 — not found</p>
    </main>
  );
}
```

- [ ] **Step 4: Rewrite `app/layout.tsx`** to a thin shell that reads the locale from the `x-locale` header set by `proxy.ts` (added in Task 9):

```tsx
import { headers } from "next/headers";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScrollProvider } from "@/components/animation/SmoothScrollProvider";
import { TerminalBoot } from "@/components/animation/TerminalBoot";
import { SiteBackdrop } from "@/components/layout/SiteBackdrop";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // proxy.ts sets x-locale on every request (see Task 9). If absent
  // (e.g. during build of a static asset), fall back to defaultLocale.
  const hdrs = await headers();
  const headerLocale = hdrs.get("x-locale");
  const locale = headerLocale && isLocale(headerLocale) ? headerLocale : defaultLocale;
  const htmlLang = locale === "pt" ? "pt-BR" : "en";

  return (
    <html
      lang={htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <SiteBackdrop />
        <SmoothScrollProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </TooltipProvider>
        </SmoothScrollProvider>
        <TerminalBoot />
        <ClickSpark />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

(The metadata and viewport exports moved to `app/[locale]/layout.tsx`. `headers()` returns a Promise in Next 15+ — that's why this layout is now `async`.)

- [ ] **Step 5: Type-check (still failing — section component props not yet wired)**

```bash
npx tsc --noEmit
```

Expected: errors on `dict={dict}` props that components don't yet accept. Fixed in Task 8.

- [ ] **Step 6: No commit yet**

---

### Task 8: Wire dictionary through every section component

**Files:**
- Modify: `components/sections/Hero.tsx`
- Modify: `components/sections/StackStrip.tsx`
- Modify: `components/sections/About.tsx`
- Modify: `components/sections/Services.tsx`
- Modify: `components/sections/Projects.tsx`
- Modify: `components/sections/Experience.tsx`
- Modify: `components/sections/Contact.tsx`
- Modify: `components/layout/Navbar.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `components/site/ProjectCard.tsx` (read project copy from dict)
- Modify: `components/site/PlaceholderProjectCard.tsx`
- Modify: `components/site/ServiceCard.tsx`
- Modify: `components/site/TimelineEntry.tsx`

Pattern: each component accepts a `dict: Dictionary` (or a sliced subtype) prop. Replace inline strings and `*Copy` references with `dict.<key>` lookups.

- [ ] **Step 1: `Hero.tsx` — accept dict, replace `heroCopy.tagline`** with `dict.hero.tagline`, `Full-stack developer.` literal with `dict.hero.taglineLead`, `scroll ↓` with `dict.hero.scrollHint`. Pass `dict.hero` to `TextType` for the `name` if needed (currently hardcoded "Leo Rossetti" which is a proper noun — keep hardcoded, but replace via `dict.hero.name` for cleanliness).

```tsx
"use client";
// ... existing imports ...
import type { Dictionary } from "@/lib/i18n/types";

type HeroProps = { dict: Dictionary };

export function Hero({ dict }: HeroProps) {
  // ... existing useRef/useScroll/useTransform code unchanged ...

  return (
    <section id="home" ref={heroRef} className="...">
      {/* backdrop unchanged */}
      <motion.div style={{ scale: contentScale, opacity: contentOpacity, y: contentY }} className="...">
        <TextType
          as="h1"
          text={dict.hero.name}
          /* ... rest unchanged ... */
        />
        <motion.p /* ... */>
          <span className="text-fg-primary">{dict.hero.taglineLead}</span>{" "}
          {dict.hero.tagline}
        </motion.p>
      </motion.div>
      <motion.div /* scroll affordance ... */>
        {dict.hero.scrollHint}
      </motion.div>
    </section>
  );
}
```

(Drop the `import { heroCopy } from "@/lib/data/hero";` line.)

- [ ] **Step 2: `StackStrip.tsx`** — accept dict, use `dict.stackStrip.ariaLabel`:

```tsx
type StackStripProps = { dict: Dictionary };

export function StackStrip({ dict }: StackStripProps) {
  return (
    <motion.section
      /* ... */
      aria-label={dict.stackStrip.ariaLabel}
      className="..."
    >
      <LogoLoop
        /* ... */
        ariaLabel={dict.stackStrip.ariaLabel}
      />
    </motion.section>
  );
}
```

- [ ] **Step 3: `About.tsx`** — accept dict, replace inline strings:

```tsx
type AboutProps = { dict: Dictionary };

export function About({ dict }: AboutProps) {
  // ... useRef/useScroll/useTransform unchanged ...

  return (
    <section id="about" ref={sectionRef} className="...">
      <motion.div /* ... */>
        <motion.p /* ... */>{dict.about.eyebrow}</motion.p>
        <motion.h2 /* ... */>{dict.about.heading}</motion.h2>
        <motion.p /* ... */>
          {dict.about.paragraphLeadFrom}{" "}
          <span className="text-fg-primary">{dict.about.paragraphCountry}</span>
          {dict.about.paragraphTail}
        </motion.p>
        <motion.p /* ... */>{dict.about.status}</motion.p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 4: `Services.tsx`** — accept dict; pass `dict.services.items[service.id]` into each `ServiceCard`:

```tsx
type ServicesProps = { dict: Dictionary };

export function Services({ dict }: ServicesProps) {
  const copy = dict.services;
  return (
    <section id="services" className="...">
      <motion.div /* ... */>
        <motion.p /* ... */>{copy.eyebrow}</motion.p>
        <motion.h2 /* ... */>
          <span className="text-fg-primary">{copy.headingLead} </span>
          <span className="...">{copy.headingAccent}</span>
        </motion.h2>
        <motion.p /* ... */>{copy.subheading}</motion.p>
      </motion.div>

      <motion.div /* grid ... */>
        {services.map((service) => (
          <ServiceCardItem
            key={service.id}
            service={service}
            copy={copy.items[service.id]}
          />
        ))}
      </motion.div>
    </section>
  );
}

function ServiceCardItem({
  service,
  copy,
}: {
  service: Service;
  copy: { title: string; pitch: string };
}) {
  // ... ref / scroll code unchanged ...
  return (
    <div ref={ref} className={service.colSpan}>
      <motion.div variants={fadeUp} style={{ scale, x }} className="h-full">
        <ServiceCard service={service} copy={copy} />
      </motion.div>
    </div>
  );
}
```

Then update `components/site/ServiceCard.tsx` to accept the `copy` prop and read `copy.title` / `copy.pitch` instead of `service.title` / `service.pitch`.

- [ ] **Step 5: `Projects.tsx`** — same pattern as Services:

```tsx
type ProjectsProps = { dict: Dictionary };

export function Projects({ dict }: ProjectsProps) {
  const copy = dict.projects;
  return (
    <section id="projects" className="...">
      <motion.div /* heading ... */>
        <motion.p /* ... */>{copy.eyebrow}</motion.p>
        <motion.h2 /* ... */>
          <span className="text-fg-primary">{copy.headingLead} </span>
          <span className="...">{copy.headingAccent}</span>
        </motion.h2>
        <motion.p /* ... */>{copy.subheading}</motion.p>
      </motion.div>

      <motion.div /* grid ... */>
        {projects.map((project) => (
          <ProjectCardItem
            key={project.id}
            project={project}
            copy={copy.items[project.id as keyof typeof copy.items]}
          />
        ))}
      </motion.div>
    </section>
  );
}
```

Update `ProjectCard.tsx` and `PlaceholderProjectCard.tsx` to accept `copy: { title: string; description: string }` and read from it.

- [ ] **Step 6: `Experience.tsx`** — accept dict; pass per-entry copy + `dict.experience.presentLabel` to `TimelineEntry`:

```tsx
type ExperienceProps = { dict: Dictionary };

export function Experience({ dict }: ExperienceProps) {
  const copy = dict.experience;
  return (
    <section id="experience" className="...">
      <motion.div /* ... */>
        <motion.p /* ... */>{copy.eyebrow}</motion.p>
        <motion.h2 /* ... */>
          <span className="text-fg-primary">{copy.headingLead} </span>
          <span className="...">DealFuel</span>
        </motion.h2>
      </motion.div>

      <div className="max-w-3xl space-y-12">
        {experience.map((entry, i) => (
          <TimelineEntry
            key={entry.id}
            entry={entry}
            entryCopy={copy.items[entry.id as keyof typeof copy.items]}
            presentLabel={copy.presentLabel}
            isCurrent={entry.end === "Present" && i === 0}
          />
        ))}
      </div>
    </section>
  );
}
```

Update `TimelineEntry.tsx` to read role/summary/highlights from `entryCopy`, and replace any literal "Present" with `presentLabel`.

- [ ] **Step 7: `Contact.tsx`** — accept dict; replace toast strings, aria-labels, channel labels:

```tsx
type ContactProps = { dict: Dictionary };

export function Contact({ dict }: ContactProps) {
  // ... useRef/useScroll/useTransform unchanged ...
  const copy = dict.contact;

  const channels: Channel[] = [
    {
      label: copy.channels.linkedin,
      href: siteConfig.socials.linkedin,
      handle: "/in/leorossetti",
      icon: LinkedinIcon,
      external: true,
    },
    {
      label: copy.channels.github,
      href: siteConfig.socials.github,
      handle: "@LeoRossetti",
      icon: GithubIcon,
      external: true,
    },
    {
      label: copy.channels.email,
      href: siteConfig.socials.gmail,
      handle: siteConfig.email,
      icon: Mail,
      external: false,
      copyable: siteConfig.email,
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="...">
      <motion.div /* ... */>
        <motion.p /* ... */>{copy.eyebrow}</motion.p>
        <motion.h2 /* ... */>
          <span className="text-fg-primary">{copy.headingLead} </span>
          <span className="...">{copy.headingAccent}</span>
        </motion.h2>
        <motion.p /* ... */>{copy.paragraph}</motion.p>
      </motion.div>

      <motion.div /* grid ... */>
        {channels.map(({ label, href, handle, icon: Icon, external, copyable }) => (
          <motion.a key={label} /* ... */>
            {/* ... unchanged structure ... */}
            {copyable ? (
              <CopyButton value={copyable} copy={copy.copy} />
            ) : (
              <span /* arrow icon ... */ />
            )}
            {/* ... */}
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

function CopyButton({
  value,
  copy,
}: {
  value: string;
  copy: { action: string; copied: string; toastSuccess: string; toastError: string };
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(copy.toastSuccess);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(copy.toastError);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? copy.copied : copy.action}
      className="..."
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}
```

- [ ] **Step 8: `Navbar.tsx`** — accept `dict`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { navSections, siteConfig } from "@/lib/data/nav";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import StaggeredMenu, { type StaggeredMenuItem } from "@/components/reactbits/StaggeredMenu";
import type { Dictionary } from "@/lib/i18n/types";

type NavbarProps = { dict: Dictionary };

export function Navbar({ dict }: NavbarProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return isMobile ? <MobileStaggeredNav dict={dict} /> : <DesktopNavbar dict={dict} />;
}

function DesktopNavbar({ dict }: { dict: Dictionary }) {
  // ... existing scroll/intersection code unchanged ...

  // Map nav id → translated label
  const labelFor = (id: string) =>
    (dict.nav as Record<string, string>)[id === "services" ? "work" : id] ?? id;

  return (
    <motion.header /* ... */>
      <div /* ... */>
        <a href="#home" /* ... */>
          <span className="text-fg-dim">{"// "}</span>{dict.nav.portfolio}
        </a>

        <ul className="flex items-center gap-7 font-mono">
          {navSections.slice(1).map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={handleNavClick(section.id)}
                className={cn(
                  "text-base transition-colors",
                  activeId === section.id ? "text-fg-primary" : "text-fg-muted hover:text-fg-primary",
                )}
              >
                {labelFor(section.id).toLowerCase()}
              </a>
            </li>
          ))}
          {/* LocaleToggle slot — wired in Phase 2 (Task 12). For now leave empty. */}
        </ul>
      </div>
    </motion.header>
  );
}

function MobileStaggeredNav({ dict }: { dict: Dictionary }) {
  const labelFor = (id: string) =>
    (dict.nav as Record<string, string>)[id === "services" ? "work" : id] ?? id;

  const items: StaggeredMenuItem[] = navSections.map((s) => ({
    label: labelFor(s.id),
    link: `#${s.id}`,
    ariaLabel: `${dict.nav.goTo} ${labelFor(s.id)}`,
  }));

  const socialItems = [
    { label: dict.footer.socials.linkedin, link: siteConfig.socials.linkedin },
    { label: dict.footer.socials.github, link: siteConfig.socials.github },
    { label: dict.footer.socials.email, link: siteConfig.socials.gmail },
  ];

  // ... rest unchanged ...
}
```

(Note the `services` → `work` mapping: `dict.nav.work` is the user-visible label for the section with id `services`. This avoids renaming the section anchor.)

- [ ] **Step 9: `Footer.tsx`** — accept dict:

```tsx
"use client";

import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { navSections, siteConfig } from "@/lib/data/nav";
import type { Dictionary } from "@/lib/i18n/types";

type FooterProps = { dict: Dictionary };

export function Footer({ dict }: FooterProps) {
  const year = new Date().getFullYear();
  const labelFor = (id: string) =>
    (dict.nav as Record<string, string>)[id === "services" ? "work" : id] ?? id;

  return (
    <footer className="bg-bg-base border-border-subtle border-t">
      <div className="...">
        <div className="...">
          <div>
            <p className="...">{siteConfig.name}</p>
            <p className="text-fg-dim mt-1 text-sm">
              © {year} · {dict.footer.rights}
            </p>
          </div>

          <nav aria-label={dict.footer.ariaLabel} className="...">
            {navSections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="...">
                {labelFor(section.id)}
              </a>
            ))}
          </nav>

          <ul className="-m-2 flex items-center">
            <li>
              <a /* linkedin */ aria-label={dict.footer.socials.linkedin} className="...">
                <LinkedinIcon className="size-5" />
              </a>
            </li>
            <li>
              <a /* github */ aria-label={dict.footer.socials.github} className="...">
                <GithubIcon className="size-5" />
              </a>
            </li>
            <li>
              <a /* email */ aria-label={dict.footer.socials.email} className="...">
                <Mail className="size-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 10: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS. If any errors remain, fix the specific component the error points to. Do not move on until clean.

- [ ] **Step 11: Run lint**

```bash
npm run lint
```

Expected: PASS or only known existing warnings. Fix new errors introduced by this task.

- [ ] **Step 12: No commit yet** — `proxy.ts` not in place; `/` will 404 because there is no `app/page.tsx` and no rewrite. Task 9 fixes this.

---

### Task 9: Add `proxy.ts`, verify Phase 1, commit

**Files:**
- Create: `proxy.ts` (at repo root, alongside `next.config.ts`)

> Next.js 16 renamed `middleware.ts` → `proxy.ts`. Same matcher config; the export must be named `proxy` (not `middleware`) and the file must be `proxy.ts`. Source: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.

- [ ] **Step 1: Write `proxy.ts`**

```ts
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Locale-prefixed routing (Next 16 proxy.ts — formerly middleware.ts).
 *
 * - "/" rewrites internally to "/{defaultLocale}" so the user-visible URL
 *   stays clean while the file system has app/[locale]/page.tsx.
 * - "/pt", "/pt/...", etc. pass through.
 * - Static files and Next internals (_next, api, public-file extensions) bypass.
 * - Sets `x-locale` request header so the root layout can render <html lang>
 *   server-side without a flash.
 *
 * Cookie-based redirect is wired in Phase 3 (Task 16).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Already locale-prefixed (e.g. /pt, /pt/whatever) → continue, but
  // forward x-locale so the root layout sees it.
  if (first && isLocale(first)) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", first);
    return NextResponse.next({ request: { headers } });
  }

  // No locale prefix → rewrite internally to defaultLocale.
  // E.g. "/" → "/en", "/anything" → "/en/anything".
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  const headers = new Headers(request.headers);
  headers.set("x-locale", defaultLocale);
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: [
    /**
     * Match every path except:
     *   - _next internals
     *   - api routes
     *   - static assets (anything with a file extension)
     */
    "/((?!_next/|api/|.*\\..*).*)",
  ],
};
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Start dev server**

```bash
npm run dev
```

- [ ] **Step 4: Manual verification — open `http://localhost:3000/`**

Verify:
- Page renders with all sections (Hero, StackStrip, About, Services, Projects, Experience, Contact, Footer).
- All copy reads in English exactly as before. No section is empty or shows raw keys like `dict.hero.tagline`.
- URL bar still shows `/` (not `/en`).
- View Source: `<html lang="en">`.
- DevTools Console: no React errors, no missing-key warnings.

- [ ] **Step 5: Manual verification — open `http://localhost:3000/pt`**

Verify:
- Page renders identically to `/` (PT dictionary is still placeholder English in Phase 1).
- URL bar shows `/pt`.
- View Source: `<html lang="pt-BR">` (set server-side from the `x-locale` header injected by `proxy.ts`).

- [ ] **Step 6: Manual verification — open `http://localhost:3000/xyz`**

Expected: 404 (the `notFound()` call in `[locale]/page.tsx` because `xyz` isn't a valid locale).

- [ ] **Step 7: Stop dev server, commit**

```bash
git add app/ components/ lib/ proxy.ts
git commit -m "Move site under [locale] route, wire dictionary through components"
```

**STOP — Phase 1 complete.** Confirm with Leo before proceeding to Phase 2.

---

## Phase 2 — Wipe transition + toggle

**Stop point:** End of Task 13. The toggle swaps `/` ↔ `/pt` with the wipe animation; `/pt` still shows English placeholder text (Phase 3 fills it in).

---

### Task 10: `LocaleTransition` overlay component

**Files:**
- Create: `components/animation/LocaleTransition.tsx`
- Create: `lib/hooks/use-locale-transition.ts` (event bus)

- [ ] **Step 1: Write the event bus `lib/hooks/use-locale-transition.ts`**

```ts
"use client";
import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";

const EVENT_NAME = "locale-transition:start";

export type StartTransitionDetail = { target: Locale };

export function dispatchLocaleTransition(target: Locale) {
  window.dispatchEvent(
    new CustomEvent<StartTransitionDetail>(EVENT_NAME, { detail: { target } }),
  );
}

export function useLocaleTransitionListener(
  handler: (detail: StartTransitionDetail) => void,
) {
  useEffect(() => {
    const onEvent = (e: Event) => {
      const ce = e as CustomEvent<StartTransitionDetail>;
      handler(ce.detail);
    };
    window.addEventListener(EVENT_NAME, onEvent);
    return () => window.removeEventListener(EVENT_NAME, onEvent);
  }, [handler]);
}
```

- [ ] **Step 2: Write `components/animation/LocaleTransition.tsx`**

```tsx
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  useLocaleTransitionListener,
  type StartTransitionDetail,
} from "@/lib/hooks/use-locale-transition";
import type { Locale } from "@/lib/i18n/config";

type Phase = "idle" | "running";

const TIMING = {
  enter: 0.3, // 300ms
  hold: 0.1,  // 100ms
  exit: 0.3,  // 300ms
} as const;

const EASING = [0.65, 0, 0.35, 1] as const;

export function LocaleTransition() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<Locale | null>(null);

  const start = useCallback(
    ({ target }: StartTransitionDetail) => {
      if (phase !== "idle") return;
      setTarget(target);
      setPhase("running");

      // Compute destination URL: "/pt" → /pt; "/" → /; for nested paths in
      // future (e.g. /projects/foo) this would prepend the locale; portfolio
      // is single-page so just toggle the prefix.
      const destination = target === "en" ? "/" : `/${target}`;

      // router.push fires at the "hold" midpoint so the new page is mounted
      // under the curtain. Total: enter (300ms) → push at 350ms (mid-hold)
      // → exit (300ms).
      const pushAt = (TIMING.enter + TIMING.hold / 2) * 1000;
      window.setTimeout(() => {
        router.push(destination);
      }, pushAt);

      const totalMs = (TIMING.enter + TIMING.hold + TIMING.exit) * 1000;
      window.setTimeout(() => {
        setPhase("idle");
        setTarget(null);
      }, totalMs);
    },
    [phase, router],
  );

  useLocaleTransitionListener(start);

  // Direction & colours
  // EN → PT: white panel, enter from left (-1), exit to right (+1), text "PT" black
  // PT → EN: black panel, enter from right (+1), exit to left (-1), text "EN" white
  const isToPt = target === "pt";
  const panelBg = isToPt ? "#ffffff" : "#000000";
  const textColor = isToPt ? "#000000" : "#ffffff";
  const code = isToPt ? "PT" : "EN";
  const enterFrom = isToPt ? "-100%" : "100%";
  const exitTo = isToPt ? "100%" : "-100%";

  if (reducedMotion && phase === "running") {
    return (
      <AnimatePresence>
        {phase === "running" && (
          <motion.div
            key="cross-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: panelBg,
            }}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {phase === "running" && (
        <motion.div
          key="curtain"
          aria-hidden
          initial={{ x: enterFrom }}
          animate={{
            x: ["0%", "0%", exitTo],
            transition: {
              times: [
                TIMING.enter / (TIMING.enter + TIMING.hold + TIMING.exit),
                (TIMING.enter + TIMING.hold) /
                  (TIMING.enter + TIMING.hold + TIMING.exit),
                1,
              ],
              duration: TIMING.enter + TIMING.hold + TIMING.exit,
              ease: EASING,
            },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: panelBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: textColor,
            fontFamily: "var(--font-geist-mono)",
            fontSize: "clamp(4rem, 12vw, 10rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              transition: {
                times: [0, 0.4, 0.7, 1],
                duration: TIMING.enter + TIMING.hold + TIMING.exit,
                ease: "linear",
              },
            }}
          >
            {code}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Mount `LocaleTransition` in `app/layout.tsx`**

Add the import and a single render at the bottom of `<body>`:

```tsx
import { LocaleTransition } from "@/components/animation/LocaleTransition";

// ... inside <body>, after <ClickSpark /> and before <Analytics /> ...
<LocaleTransition />
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: No commit yet** — toggle not wired (next task).

---

### Task 11: `LocaleToggle` component

**Files:**
- Create: `components/site/LocaleToggle.tsx`
- Create: `lib/hooks/use-current-locale.ts`

- [ ] **Step 1: Write `lib/hooks/use-current-locale.ts`**

```ts
"use client";
import { usePathname } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

export function useCurrentLocale(): Locale {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) return first;
  return defaultLocale;
}
```

- [ ] **Step 2: Write `components/site/LocaleToggle.tsx`**

```tsx
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { dispatchLocaleTransition } from "@/lib/hooks/use-locale-transition";
import { useCurrentLocale } from "@/lib/hooks/use-current-locale";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  ariaLabel: string;
  enLabel: string;
  ptLabel: string;
  /** Larger tap target for inside StaggeredMenu. */
  size?: "sm" | "lg";
};

export function LocaleToggle({ ariaLabel, enLabel, ptLabel, size = "sm" }: Props) {
  const current = useCurrentLocale();
  const router = useRouter();

  const switchTo = useCallback(
    (target: Locale) => {
      if (target === current) return;
      // Prefetch the destination to minimize the chance of a half-loaded
      // page when the curtain exits.
      router.prefetch(target === "en" ? "/" : `/${target}`);
      dispatchLocaleTransition(target);
    },
    [current, router],
  );

  const sizeClasses =
    size === "lg"
      ? "h-11 text-sm"
      : "h-8 text-xs";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex overflow-hidden rounded-full border border-border-subtle bg-bg-elevated/40 backdrop-blur",
        sizeClasses,
      )}
    >
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={current === "en"}
        className={cn(
          "px-3 font-mono uppercase tracking-[0.18em] transition-colors",
          current === "en"
            ? "bg-fg-primary text-bg-base"
            : "text-fg-muted hover:text-fg-primary",
        )}
      >
        {enLabel}
      </button>
      <span aria-hidden className="w-px bg-border-subtle" />
      <button
        type="button"
        onClick={() => switchTo("pt")}
        aria-pressed={current === "pt"}
        className={cn(
          "px-3 font-mono uppercase tracking-[0.18em] transition-colors",
          current === "pt"
            ? "bg-fg-primary text-bg-base"
            : "text-fg-muted hover:text-fg-primary",
        )}
      >
        {ptLabel}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 4: No commit yet** — wire-up next.

---

### Task 12: Mount `LocaleToggle` in Navbar and StaggeredMenu

**Files:**
- Modify: `components/layout/Navbar.tsx`
- Modify: `components/reactbits/StaggeredMenu.tsx` (or a wrapper)

- [ ] **Step 1: Add toggle to `DesktopNavbar`** — render after the section list:

```tsx
import { LocaleToggle } from "@/components/site/LocaleToggle";

// Inside DesktopNavbar's <ul> ... </ul>, replace the trailing comment slot
// with the toggle wrapped in an <li>:
<li className="ml-4">
  <LocaleToggle
    ariaLabel={dict.locale.ariaLabel}
    enLabel={dict.locale.en}
    ptLabel={dict.locale.pt}
  />
</li>
```

- [ ] **Step 2: Add toggle to `MobileStaggeredNav`**

The cleanest option: pass a render-prop / extra node to `StaggeredMenu` that renders below the menu items and above the social row. Inspect `components/reactbits/StaggeredMenu.tsx` to find the right insertion point. If `StaggeredMenu` doesn't already accept an `extras` prop, add one:

```tsx
// In StaggeredMenu.tsx, add to the props:
type StaggeredMenuProps = {
  // ... existing fields ...
  /** Optional node rendered between the menu items and socials. */
  extras?: React.ReactNode;
};

// Render `extras` in the appropriate place inside the panel layout.
```

Then in `MobileStaggeredNav`:

```tsx
<StaggeredMenu
  /* ... existing props ... */
  extras={
    <div className="px-6 pb-2">
      <LocaleToggle
        ariaLabel={dict.locale.ariaLabel}
        enLabel={dict.locale.en}
        ptLabel={dict.locale.pt}
        size="lg"
      />
    </div>
  }
/>
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 4: Lint**

```bash
npm run lint
```

Expected: PASS.

---

### Task 13: Verify Phase 2, commit

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Visual verification — desktop**

Open `http://localhost:3000/` in a desktop-width browser. Verify the toggle appears in the navbar (right side, after the section nav). Click `PT`. Expected:

- A **white** panel slides in from the **left** edge, covers the screen.
- A bold black `PT` appears centered, fades in over the cover phase.
- At ~350ms in, the URL changes to `/pt` (browser DevTools Network tab will show the navigation).
- The white panel slides out to the **right**, revealing the new page.
- Total time feels ≈ 700ms.
- The new page (`/pt`) renders without errors. Content is still in English (placeholder); that's expected.
- The toggle now shows `PT` filled and `EN` outlined.

Click `EN`. Expected:

- A **black** panel slides in from the **right**, covers screen.
- White `EN` text fades in.
- At mid-hold, URL changes to `/`.
- Panel slides out to the **left**.
- Returns to `/`, EN highlighted on toggle.

- [ ] **Step 3: Visual verification — mobile**

Open the page at a mobile width (Chrome DevTools device toolbar at < 768px). Open the StaggeredMenu. Verify the larger `EN | PT` pill appears between menu items and social icons. Tap `PT`. Same wipe, same URL change.

- [ ] **Step 4: Reduced-motion verification**

In Chrome DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion`" → "reduce". Click toggle. Expected: no horizontal movement, no `PT`/`EN` text, just a 200ms cross-fade with the panel colour. URL still changes correctly.

- [ ] **Step 5: Edge cases**

- Hammer-click the inactive side rapidly. Verify only one transition runs at a time (the dispatcher ignores re-entrant events while phase ≠ idle).
- Click the *active* side — should be a no-op (no transition).
- During a transition, navigation buttons (back/forward) should still work normally; the curtain doesn't trap focus.

If any of these fail, fix before committing.

- [ ] **Step 6: Stop dev server, commit**

```bash
git add components/ lib/i18n/ lib/hooks/ app/layout.tsx
git commit -m "Add EN/PT toggle and horizontal wipe transition"
```

**STOP — Phase 2 complete.** Confirm with Leo before proceeding to Phase 3.

---

## Phase 3 — Portuguese translations, metadata, cookie, sitemap

**Stop point:** Feature complete. Production-ready.

---

### Task 14: Draft Portuguese translations into `pt.ts`

**Files:**
- Modify: `lib/i18n/dictionaries/pt.ts`

Replace every English string with its Portuguese equivalent, preserving structure. **Tech terms stay English** (TypeScript, React, Next.js, Node.js, GSAP, Motion, etc.) per the spec. Keep proper nouns (Leo Rossetti, DealFuel, Brazil → Brasil, etc.) in their natural form.

- [ ] **Step 1: Replace `pt.ts` contents with the Portuguese dictionary**

```ts
import type { Dictionary } from "../types";

const pt: Dictionary = {
  meta: {
    title: "Leo Rossetti — Desenvolvedor Full-stack",
    titleTemplate: "%s · Leo Rossetti",
    description:
      "Desenvolvedor full-stack. Entrega produtos, não protótipos. TypeScript, React, Next.js, React Native, Node.js, Python, C#.",
    ogTitle: "Leo Rossetti — Desenvolvedor Full-stack",
    ogDescription: "Desenvolvedor full-stack. Entrega produtos, não protótipos.",
  },
  locale: {
    ariaLabel: "Idioma",
    en: "EN",
    pt: "PT",
  },
  nav: {
    portfolio: "portfolio",
    home: "Início",
    about: "Sobre",
    work: "Trabalho",
    projects: "Projetos",
    experience: "Experiência",
    contact: "Contato",
    goTo: "Ir para",
  },
  hero: {
    eyebrow: "Desenvolvedor full-stack",
    name: "Leo Rossetti",
    taglineLead: "Desenvolvedor full-stack.",
    tagline: "Entrega produtos, não protótipos.",
    scrollHint: "rolar ↓",
    cta: {
      primary: "Ver projetos",
      secondary: "Entrar em contato",
    },
    terminal: {
      whoami: "whoami",
      whoamiOutput: "leo.rossetti --role=fullstack --location=remote",
      stackList: "stack --list",
      stackOutput: "[typescript, react, next.js, react-native, node, python, c#]",
      current: "atual",
      currentOutput: "trabalhando com next.js + react native",
    },
  },
  stackStrip: {
    ariaLabel: "Stack de tecnologia",
  },
  about: {
    eyebrow: "// sobre",
    heading: "Olá, eu sou o Leo.",
    paragraphLeadFrom: "Desenvolvedor full-stack do",
    paragraphCountry: "Brasil",
    paragraphTail:
      ", há três anos no ofício. Gosto de entregar produtos completos do início ao fim — modelo de dados, backend, UI, polimento — não só protótipos.",
    status: "Remoto · sempre entregando",
  },
  services: {
    eyebrow: "// trabalho",
    headingLead: "No que eu",
    headingAccent: "trabalho",
    subheading:
      "Algumas frentes que se sobrepõem — a maioria dos meus projetos mistura web, mobile e um pouco de design engineering.",
    items: {
      "full-stack-web": {
        title: "Web Full-Stack",
        pitch:
          "Apps em Next.js com backend de verdade, autenticação e pipelines de deploy. É onde passo a maior parte do tempo.",
      },
      mobile: {
        title: "Mobile",
        pitch:
          "iOS/Android multiplataforma com o mesmo JS/TS que move o lado web.",
      },
      backend: {
        title: "API & Backend",
        pitch:
          "APIs tipadas, jobs em segundo plano e integrações. Encontro os dados onde eles vivem — Node, Python ou .NET.",
      },
      "design-engineering": {
        title: "Design Engineering",
        pitch:
          "Interfaces ricas em motion com Motion, GSAP e Three.js. Interfaces que sentem, não só aparentam.",
      },
    },
  },
  projects: {
    eyebrow: "// projetos",
    headingLead: "Entregues",
    headingAccent: "& em andamento",
    subheading:
      "Uma pequena amostra por enquanto — mais por vir. Cada bloco leva ao código ou a uma demo quando há.",
    items: {
      "yt-timestamp-saver": {
        title: "YouTube Timestamp Saver",
        description:
          "Uma extensão de navegador para salvar e organizar timestamps dentro de vídeos do YouTube. Sincronização entre dispositivos, atalhos de teclado e navegação rápida.",
      },
      "next-1": {
        title: "Em desenvolvimento",
        description: "Próximo projeto — detalhes em breve.",
      },
      "next-2": {
        title: "Em desenvolvimento",
        description: "Próximo projeto — detalhes em breve.",
      },
      "next-3": {
        title: "Em desenvolvimento",
        description: "Próximo projeto — detalhes em breve.",
      },
    },
  },
  experience: {
    eyebrow: "// experiência",
    headingLead: "Atualmente na",
    presentLabel: "Atual",
    items: {
      dealfuel: {
        role: "Desenvolvedor Full-Stack",
        summary:
          "Construindo e entregando funcionalidades web + mobile em produção dentro do stack da DealFuel.",
        highlights: [
          "Donos de funcionalidades de ponta a ponta entre Next.js e React Native.",
          "Entregando TypeScript — frontend, backend e as integrações que conectam tudo.",
          "Trabalhando junto com design para manter a UI consistente entre plataformas.",
        ],
      },
    },
  },
  contact: {
    eyebrow: "// contato",
    headingLead: "Manda",
    headingAccent: "um oi.",
    paragraph:
      "Dúvidas, colaborações ou só quer trocar ideia sobre stack? Qualquer um destes chega direto em mim — costumo responder em até um dia.",
    channels: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
    copy: {
      action: "Copiar email para a área de transferência",
      copied: "Email copiado",
      toastSuccess: "Email copiado para a área de transferência",
      toastError: "Não foi possível copiar — selecione e copie manualmente",
    },
  },
  footer: {
    ariaLabel: "Rodapé",
    rights: "Todos os direitos reservados",
    socials: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
  },
} as const;

export default pt;
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS. If `as const` causes literal-type clashes against `Dictionary`, drop the type annotation — `getDictionary` enforces it on consumption.

- [ ] **Step 3: Visual verification — `/pt`**

```bash
npm run dev
```

Open `http://localhost:3000/pt`. Verify every visible string is in Portuguese: hero tagline, navbar links, all section headings/paragraphs, contact channels, copy-button toast, footer rights. Toggle to `/`, verify English still renders correctly. Toggle back to `/pt`, verify the wipe still works.

- [ ] **Step 4: Stop dev server**

- [ ] **Step 5: No commit yet** — bundle with metadata changes.

---

### Task 15: Locale-aware OG image and sitemap

**Files:**
- Modify: `app/opengraph-image.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Inspect `app/opengraph-image.tsx`** to understand current implementation:

```bash
cat C:/Users/leofr/Documents/GitHub/MyPortfolio/app/opengraph-image.tsx
```

Move it to `app/[locale]/opengraph-image.tsx` and parameterize with locale:

```tsx
import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = await getDictionary(locale);

  // Reuse the exact JSX/styles the existing app/opengraph-image.tsx uses,
  // but replace any hardcoded title/subtitle with dict.meta.ogTitle and
  // dict.meta.ogDescription.
  return new ImageResponse(
    (
      <div
        style={{
          // Reproduce the existing layout. If the current opengraph-image.tsx
          // has a specific design, copy it here and substitute the strings.
          background: "#0a0a0a",
          color: "#fafafa",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>
          {dict.meta.ogTitle}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.7 }}>
          {dict.meta.ogDescription}
        </div>
      </div>
    ),
    size,
  );
}
```

(If the existing `opengraph-image.tsx` has a richer design — fonts, gradients, logo — preserve every element verbatim and only swap the string fields.)

- [ ] **Step 2: Update `app/sitemap.ts`**

Read current contents first:

```bash
cat C:/Users/leofr/Documents/GitHub/MyPortfolio/app/sitemap.ts
```

Then update to emit both URLs with hreflang annotations:

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/`,
          "pt-BR": `${siteUrl}/pt`,
        },
      },
    },
    {
      url: `${siteUrl}/pt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/`,
          "pt-BR": `${siteUrl}/pt`,
        },
      },
    },
  ];
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 4: No commit yet**

---

### Task 16: Cookie persistence in `proxy.ts`

**Files:**
- Modify: `proxy.ts`
- Modify: `components/site/LocaleToggle.tsx` (set the cookie on switch)

- [ ] **Step 1: Update `LocaleToggle` to write the cookie**

In `components/site/LocaleToggle.tsx`, modify `switchTo`:

```tsx
const switchTo = useCallback(
  (target: Locale) => {
    if (target === current) return;
    // Persist the choice for return visits. 1-year expiry, root path.
    document.cookie = `NEXT_LOCALE=${target}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    router.prefetch(target === "en" ? "/" : `/${target}`);
    dispatchLocaleTransition(target);
  },
  [current, router],
);
```

- [ ] **Step 2: Update `proxy.ts` to honour the cookie**

Replace the existing `proxy` function body with:

```ts
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Already locale-prefixed (e.g. /pt) → continue.
  if (first && isLocale(first)) {
    return NextResponse.next();
  }

  // Cookie-based redirect: only on root "/" — cookies don't affect deep links.
  if (pathname === "/") {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (cookieLocale && isLocale(cookieLocale) && cookieLocale !== defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${cookieLocale}`;
      return NextResponse.redirect(url, 307);
    }
  }

  // No locale prefix → rewrite internally to defaultLocale.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 4: Visual verification — cookie roundtrip**

```bash
npm run dev
```

1. Clear cookies for `localhost:3000`. Visit `/`. Expected: English page renders, no cookie set yet.
2. Click `PT`. Expected: wipe runs, lands on `/pt`. DevTools → Application → Cookies → see `NEXT_LOCALE=pt`.
3. Hard refresh `/`. Expected: 307 redirect to `/pt` (visible in DevTools Network tab as a chain `/` → `/pt`).
4. Click `EN`. Expected: wipe to `/`, cookie now `NEXT_LOCALE=en`.
5. Hard refresh `/`. Expected: stays on `/`, no redirect.
6. Test deep-link respect: visit `/pt` directly with cookie set to `en`. Expected: `/pt` renders (no redirect; deep links win over cookies).

- [ ] **Step 5: Stop dev server, commit Phase 3**

```bash
git add lib/i18n/dictionaries/pt.ts app/[locale]/opengraph-image.tsx app/sitemap.ts proxy.ts components/site/LocaleToggle.tsx
git commit -m "Translate site to Portuguese, add hreflang sitemap and locale cookie"
```

**STOP — Phase 3 complete.** Feature ready for Leo's review.

---

## Cross-cutting verifications (run before declaring done)

These should be done once the three phases are complete and committed.

- [ ] **Build passes**

```bash
npm run build
```

Expected: PASS. Inspect output for any new warnings.

- [ ] **Lint clean**

```bash
npm run lint
```

Expected: PASS, no new warnings.

- [ ] **Production preview**

```bash
npm run start
```

Click around `/` and `/pt`, run the toggle several times, check DevTools Network for any 404s or 500s.

- [ ] **Lighthouse / accessibility quick check**

Run a Lighthouse audit on both `/` and `/pt`. The `<html lang>` and hreflang annotations should make the i18n score green. Score should be ≥ what it was before.

- [ ] **OG preview**

Use https://www.opengraph.xyz/ (or similar) to fetch `/` and `/pt`. Verify the OG image renders the locale-correct strings, and `og:locale` reads `en_US` / `pt_BR` respectively.

---

## Self-review notes

This plan was self-reviewed against the spec. Coverage check:

- ✅ Locale-prefixed routes (Decision 1) — Tasks 6, 7, 9
- ✅ Hand-rolled i18n (Decision 2) — Tasks 2-5
- ✅ Wipe transition with colour flip (Decision 3) — Task 10
- ✅ ~700ms total animation (Decision 4) — Task 10 (TIMING constants)
- ✅ EN | PT pill in navbar + StaggeredMenu (Decision 5) — Tasks 11, 12
- ✅ No auto-redirect; cookie persistence (Decision 6) — Task 16
- ✅ Per-locale `<html lang>` — Task 7 (Step 4 note)
- ✅ Per-locale metadata, hreflang — Tasks 7, 15
- ✅ Locale-aware OG image — Task 15
- ✅ Reduced-motion fallback — Task 10
- ✅ Tech terms stay English — Task 14 (Portuguese dict respects this)
- ✅ Risk #2 (mid-transition double-clicks) — Task 10 (`if (phase !== "idle") return`)
- ✅ Risk #3 (slow router.push) — Task 11 (`router.prefetch` in `switchTo`)
- ✅ Phased delivery with stop points — explicit "STOP" markers at end of Phases 1, 2, 3.

Next.js 16 specifics verified during Task 1 (controller-side research):
- `middleware.ts` is renamed to `proxy.ts` (export `proxy`).
- `params` is `Promise<{...}>` — `await params` in pages/layouts/`generateMetadata`.
- `headers()` is async — `await headers()`.
- `NextResponse.next({ request: { headers } })` and `.rewrite(url, { request: { headers } })` both forward modified request headers downstream.
- Code blocks in this plan reflect the verified API.

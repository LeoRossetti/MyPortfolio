# i18n with horizontal wipe transition — design

**Date:** 2026-04-29
**Status:** Approved (design phase). Implementation plan pending.
**Author:** Leo Rossetti (with Claude as collaborator)

## Goal

Make the portfolio accessible to Brazilian Portuguese speakers (~half of Leo's audience), with a polished horizontal-wipe transition between English and Portuguese — visually inspired by the Pokémon TCG black-bolt ↔ white-flare expansion toggle on `tcg.pokemon.com`.

This is a personal-portfolio feature: discoverability and SEO for the `pt-BR` audience matter; auto-redirects and presumptive UX do not.

## Non-goals

- Auto-redirect on first visit based on `Accept-Language` (explicitly rejected).
- Third-party i18n libraries (`next-intl`, `next-i18next`, etc.) — overkill for two locales.
- Translating tech terms (TypeScript, React, Next.js, etc.).
- A subdomain-based locale split (e.g. `pt.leorossetti.com`).

## Decisions

| # | Decision | Reasoning |
|---|----------|-----------|
| 1 | **Locale-prefixed routes** — `/` for English (canonical), `/pt` for Portuguese. | Both locales indexed by Google with `hreflang`; shareable Portuguese link to Brazilian audience. Leo's caveat: revisit if URL routing feels weird in practice. |
| 2 | **Hand-rolled i18n** — no library; typed `Dictionary` object loaded server-side. | Two locales, one page; full control, zero runtime overhead. |
| 3 | **Wipe transition: Pokémon-style colour flip** — white panel L→R for `→ /pt` (black `PT` text), black panel R→L for `→ /` (white `EN` text). Mono font, dead-centre. | Matches reference; reinforces "state inversion" feel; uses existing monochrome palette. |
| 4 | **Total animation ~700ms** — 300ms enter, 100ms hold, 300ms exit. | Long enough to read the locale code, short enough not to feel blocking. Tunable post-build. |
| 5 | **Toggle = segmented `EN \| PT` pill** in navbar (desktop) and `StaggeredMenu` (mobile). | Discoverable on every page; reuses existing chip language. |
| 6 | **No auto-redirect; cookie-based persistence on return visit.** | Predictable URLs; no first-visit surprise; respects shared links. |

## Architecture

### Folder restructure

```
app/
  [locale]/
    layout.tsx         ← reads locale from params, sets <html lang>, provides dictionary
    page.tsx           ← what's currently app/page.tsx
  layout.tsx           ← thin shell: fonts, analytics, providers (no <html> here)
  not-found.tsx
lib/
  i18n/
    config.ts          ← supported locales = ['en', 'pt'], default = 'en'
    dictionaries/
      en.ts            ← all strings, typed as a single Dictionary
      pt.ts            ← same shape, Portuguese values (Claude drafts; Leo reviews)
    get-dictionary.ts  ← server util: import the locale's dictionary
    types.ts           ← Locale type, Dictionary type derived from en.ts
middleware.ts          ← rewrite/redirect to ensure every request has a locale
```

### URL mapping

- `/` is the canonical English root. No `/en` prefix in the URL.
- Middleware internally rewrites `/` to `/[locale]/` with locale=`en` so the file structure stays clean.
- `/pt` is a real URL prefix (visible to users, indexed by Google).
- This is the standard Next.js 16 App Router i18n pattern. **Implementation MUST verify the exact middleware shape against `node_modules/next/dist/docs/` before writing code** (per `AGENTS.md` — "this is NOT the Next.js you know").

### Translation flow

- Server-first. Dictionary is a plain TypeScript object loaded in `[locale]/layout.tsx`.
- Passed to client components via props (or via a thin `DictionaryProvider` for deeply nested trees — chosen during implementation based on prop-drilling depth).
- Keys are strongly typed: `Dictionary` type is derived from `en.ts`. TypeScript fails the build if `pt.ts` is missing keys.
- Dictionary key shape mirrors existing data structure: `dict.nav`, `dict.hero`, `dict.about`, `dict.experience`, `dict.projects`, `dict.services`, `dict.stack`, `dict.contact`, `dict.footer`, `dict.meta`.

### Data-layer split (option α — chosen)

`lib/data/*.ts` files split into:

- **Structural** (slug, image path, tech stack array, links, dates): stays in `lib/data/`.
- **Copy** (title, description, role, blurb): moves to `lib/i18n/dictionaries/{en,pt}.ts`, keyed by slug.

Concretely:

```ts
// lib/data/projects.ts — structure only
{ slug: 'youtube-timestamp-saver', tech: ['React Native', 'TypeScript'], href: '...' }

// lib/i18n/dictionaries/en.ts
projects: {
  'youtube-timestamp-saver': { title: 'YouTube Timestamp Saver', blurb: '...' }
}
```

Same shape in `pt.ts`. Section components receive structure + dictionary slice via props.

**Tech terms list** — stays English in both locales:
TypeScript, React, React Native, Next.js, Node.js, Convex, Clerk, Tailwind, GSAP, Motion, Vercel, Python, C#, and any framework / library / runtime name. Job titles translate the descriptor but keep the term ("full-stack developer" → "desenvolvedor full-stack").

## The wipe transition

### Component: `LocaleTransition`

Client component mounted in the root `app/layout.tsx`. Owns:

- A fixed-position `<div>` overlay covering the viewport, `z-index` above all content.
- A state machine: `idle` → `entering` → `holding` → `exiting` → `idle`.
- A small pub/sub: when the toggle is clicked, dispatches `start-transition` with the destination locale; the overlay listens and runs the sequence.
- Driven by Motion (already in the stack).

### Animation timeline (~700ms total)

```
0ms      300ms      400ms       700ms
│  enter  │  hold   │   exit    │
│ x=-100% │ x=0     │ x=+100%   │   (going to /pt)
│ → x=0   │         │           │
            ↑
       router.push() fires here
```

- **Enter (0–300ms)**: panel translates from off-screen into full coverage. Easing `[0.65, 0, 0.35, 1]` (smooth-out cubic). The `EN` / `PT` text fades in over the last 100ms.
- **Hold (300–400ms)**: 100ms pause at full cover. `router.push()` fires here. Next.js swaps the page underneath.
- **Exit (400–700ms)**: panel translates from full coverage to off-screen on the *opposite* side. Same easing.

### Direction & colour rules

| Going to | Panel colour | Text | Enter from | Exit to |
|----------|--------------|------|------------|---------|
| `/pt`    | white        | black `PT` | left | right |
| `/`      | black        | white `EN` | right | left |

### Reduced motion

If `prefers-reduced-motion: reduce`, the wipe is replaced by a 200ms cross-fade overlay (same colours, no horizontal movement, no centred text). `router.push()` fires at the cross-fade midpoint.

### Why a fixed overlay, not Next 16's View Transitions API

Next 16 has first-class View Transitions support. Considered and rejected for this case: VT requires the new and old DOMs to coexist briefly, which is heavier and harder to control for a horizontal wipe with centred text. A small fixed-overlay component gives pixel control and degrades gracefully.

## The toggle

### Visual

- Segmented pill, `EN | PT` in mono font (`--font-geist-mono`), ~32px tall on desktop.
- Active side: filled background (`--color-foreground`), inverted text colour.
- Inactive side: outlined-only, foreground text.
- Tiny vertical separator between the two sides.
- Borrows visual language from existing chips (`StackChip`, `TechChip`).

### Placement

- **Desktop:** in `Navbar.tsx`, right side, near socials/email row.
- **Mobile:** inside `StaggeredMenu` as its own row — sized to 44px tap target.

### Behaviour

- Click the inactive side → fire `start-transition` event with the new locale → wipe runs → `router.push()` swaps the route at full cover.
- Click the active side → no-op.
- Keyboard: focusable as a single group. `Enter` / `Space` triggers a switch (toggles to the other locale).

### Accessibility

- `role="group"` with `aria-label="Language"` on the pill (translated per locale: `"Idioma"` in PT).
- Each side is a `<button>` with `aria-pressed={isActive}`.
- All `aria-label`s read in the *current* language (i.e. they translate too).
- Honours `prefers-reduced-motion` (see transition section).

## SEO, metadata, persistence

### Per-locale metadata

- `<html lang="en">` on `/`; `<html lang="pt-BR">` on `/pt`.
- `generateMetadata` in `[locale]/layout.tsx` returns locale-specific `title`, `description`, OG tags.
- `alternates: { languages: { 'en': '/', 'pt-BR': '/pt' } }` emits `<link rel="alternate" hreflang="...">`.
- `sitemap.ts` updated to emit both URLs with hreflang annotations.
- `robots.ts` unchanged (both indexed).

### OG image

`app/opengraph-image.tsx` becomes locale-aware — pulls headline copy from the dictionary so a `/pt` link previewed in WhatsApp/LinkedIn shows Portuguese text.

### Persistence (cookie, not localStorage)

- Cookie name: `NEXT_LOCALE`.
- Set on toggle click. Expiry: 1 year. `SameSite=Lax`.
- Read in middleware on root `/` requests:
  - No cookie → render English on `/`.
  - Cookie = `pt` → 307 redirect `/` → `/pt`.
  - Cookie = `en` → render English (no-op).
- Cookie is server-readable (middleware needs it on the cold request); `localStorage` is client-only and would cause a flash of English on `/` before the JS reroute. Cookie is the correct tool.

### Auto-redirect explicitly off

No `Accept-Language` sniffing. The cookie is only set by an *explicit* toggle click — first visits always honour the URL the user landed on.

## Risks & things to watch

1. **Translation drift.** TypeScript catches missing keys (since `Dictionary` is derived from `en.ts`), but cannot detect a stale Portuguese value when English changes. Mitigation: a `// TODO(i18n): outdated` convention + a manual review pass before each release.
2. **Mid-transition double-clicks.** If a user hammers the toggle, only one transition runs at a time — the dispatcher ignores `start-transition` events while state ≠ `idle`.
3. **`router.push()` slow on cold loads.** If the route hasn't loaded by 400ms in, the curtain still exits and the user briefly sees the old page. Mitigation: `router.prefetch('/pt')` on hover/focus of the toggle.
4. **`StaggeredMenu` open state during a transition.** Mobile users toggling inside an open menu need the menu to close cleanly when the new route mounts. Should be free since the menu's open state is per-route.
5. **Next 16 specifics.** Per `AGENTS.md`, this isn't the Next.js most training data knows. The implementation plan must start by reading `node_modules/next/dist/docs/` for the current i18n + middleware shape before writing the middleware or the `[locale]` layout.

## Phased delivery

Per Leo's standing preference (ship in phases, stop at every natural boundary):

- **Phase 1 — Routing + dictionaries.** Folder restructure (`[locale]` segment), middleware that rewrites `/` to the `en` locale internally, `en.ts` dictionary populated from existing copy, `pt.ts` created as a structural clone of `en.ts` (English values as placeholders), components consume the dictionary. Both `/` and `/pt` render — `/` in English, `/pt` showing the still-English placeholder copy. No visual regression on `/`. No toggle yet.
- **Phase 2 — Wipe transition + toggle.** `LocaleTransition` overlay, `LocaleToggle` pill in navbar and `StaggeredMenu`. The transition is testable end-to-end. `/pt` still shows English text (Phase 3 fills it in).
- **Phase 3 — Portuguese translations + metadata + cookie + sitemap.** Claude drafts `pt.ts` Portuguese values; Leo reviews/edits. Per-locale metadata, locale-aware OG image, hreflang in `sitemap.ts`, cookie persistence in middleware. Feature complete.

Each phase stops at a natural boundary; Leo confirms before the next begins.

# Visual Refresh Implementation Plan

**Goal:** Refresh respawn.io with a distinctive editorial identity: warm paper palette
(Flexoki + Everforest), IBM Plex typography, a lean post list, and consistent token-driven
styling in `index.css`.

**Approach:** Phase-by-phase refactor. Tokens → typography → surfaces (list/nav/header)
→ prose → cleanup. Each phase ends in a commit the user can preview in-browser before
we continue.

**Branch:** `design-refresh` in `.worktrees/design-refresh/`.

**Stack:** Astro 5, Tailwind 4, `@tailwindcss/typography`, Fontsource for self-hosted fonts, pnpm.

---

## Design tokens (locked in Phase 1)

### Palette — CSS custom properties on `:root` / dark media query

**Light (Flexoki paper):**
- `--color-bg`: `#FFFCF0` (paper)
- `--color-surface`: `#F2F0E5` (base-50)
- `--color-rule`: `#CECDC3` (base-200)
- `--color-faint`: `#878580` (base-400)
- `--color-muted`: `#575653` (base-600)
- `--color-ink`: `#100F0F` (black)
- `--color-accent`: `#205EA6` (flexoki blue)
- `--color-accent-hover`: `#4385BE` (flexoki blue-light)

**Dark (Everforest dark):**
- `--color-bg`: `#2D353B` (bg0)
- `--color-surface`: `#343F44` (bg1)
- `--color-rule`: `#475258` (grey0)
- `--color-faint`: `#859289` (grey1)
- `--color-muted`: `#9DA9A0` (grey2)
- `--color-ink`: `#D3C6AA` (fg)
- `--color-accent`: `#7FBBB3` (everforest blue)
- `--color-accent-hover`: `#A7C080` (everforest green)

### Typography
- `--font-serif`: `"IBM Plex Serif", "Iowan Old Style", Georgia, serif` (body + headings)
- `--font-mono`: `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace` (dates, topics, code)
- `--font-sans`: `"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif` (rare UI use)

---

## Phase 1 — Design tokens & palette plumbing

**Files:** `src/styles/index.css`, `tailwind.config.cjs`, `src/layouts/BaseLayout.astro`

- [ ] Add `:root` block at the top of `index.css` with the light tokens above, plus a
      `@media (prefers-color-scheme: dark) { :root { … } }` block with the dark tokens.
- [ ] Extend `theme.extend.colors` in `tailwind.config.cjs`:
  ```js
  colors: {
    paper: "var(--color-bg)",
    surface: "var(--color-surface)",
    rule: "var(--color-rule)",
    faint: "var(--color-faint)",
    muted: "var(--color-muted)",
    ink: "var(--color-ink)",
    accent: "var(--color-accent)",
    "accent-hover": "var(--color-accent-hover)",
  }
  ```
- [ ] Update `BaseLayout.astro` body class: replace
      `bg-white dark:bg-[#0f0f0e] text-stone-800 dark:text-stone-200 selection:bg-stone-100 dark:selection:bg-stone-800 transition-colors duration-300`
      with `bg-paper text-ink selection:bg-surface`.
- [ ] `pnpm run dev`, open `/`, confirm warm cream light / Everforest dark.
- [ ] Commit: `chore(design): introduce Flexoki/Everforest color tokens`.

**Checkpoint 1:** User approves the surface colors in browser.

---

## Phase 2 — Typography foundation

**Files:** `package.json`, `src/styles/index.css`, `tailwind.config.cjs`, `src/layouts/BaseLayout.astro`

- [ ] `pnpm add @fontsource/ibm-plex-serif @fontsource/ibm-plex-mono @fontsource/ibm-plex-sans`.
- [ ] At the top of `index.css`, add:
  ```css
  @import "@fontsource/ibm-plex-serif/400.css";
  @import "@fontsource/ibm-plex-serif/400-italic.css";
  @import "@fontsource/ibm-plex-serif/600.css";
  @import "@fontsource/ibm-plex-mono/400.css";
  @import "@fontsource/ibm-plex-mono/500.css";
  @import "@fontsource/ibm-plex-sans/500.css";
  ```
- [ ] Add the three font-family vars to `:root` (inside the Phase 1 block).
- [ ] Extend `theme.extend.fontFamily` in `tailwind.config.cjs`:
  ```js
  fontFamily: {
    serif: ["var(--font-serif)"],
    mono: ["var(--font-mono)"],
    sans: ["var(--font-sans)"],
  }
  ```
- [ ] In `BaseLayout.astro` body class, append `font-serif`.
- [ ] Confirm the homepage now renders in Plex Serif; confirm `<code>` / `<pre>` still use the mono stack (they inherit via prose; Shiki code blocks untouched).
- [ ] Commit: `chore(design): adopt IBM Plex family`.

**Checkpoint 2:** User approves the serif body. Easy to swap to another serif here.

---

## Phase 3 — Lean post list + quiet year headers

**Files:** `src/components/PostsList.astro`, `src/styles/index.css`

- [ ] Replace the row block inside the `<li>` with a single flex row — title flex-1, date right-aligned mono:
  ```astro
  <li class="flex items-baseline justify-between gap-6">
    <a href={getPostUrl(post.id)} class="font-serif text-base md:text-lg text-ink hover:text-accent underline-offset-4 hover:underline leading-snug">
      {getFormattedTitle(post.data.title)}
    </a>
    <time
      datetime={post.data.created.toISOString()}
      class="font-mono text-sm text-faint tabular-nums whitespace-nowrap shrink-0"
    >
      {formatDate(post.data.created)}
    </time>
  </li>
  ```
  (Drops the excerpt entirely.)
- [ ] Tighten row spacing: change `space-y-8 md:space-y-12` → `space-y-2 md:space-y-2.5`.
- [ ] Demote year headers: change
      `<h2 class="text-2xl font-extrabold tracking-tighter mb-6">{year}</h2>`
      →
      `<h2 class="font-mono text-xs uppercase tracking-[0.18em] text-faint mb-3">{year}</h2>`.
- [ ] Reduce year-block spacing: `mb-16` → `mb-10`.
- [ ] Delete the `.post-item p { @apply leading-relaxed; }` rule from `index.css`.
- [ ] Commit: `feat(home): lean post list, quiet year headers`.

**Checkpoint 3:** User reviews density and rhythm. Adjust gaps/date color here.

---

## Phase 4 — Topics on homepage

**Files:** `src/components/TagsList.astro`, `src/pages/index.astro`

- [ ] `index.astro`: wrap the `<TagsList>` with a label:
  ```astro
  {tagsWithCounts.length > 0 && (
    <section class="mt-8 md:mt-4 mb-10">
      <h2 class="font-mono text-xs uppercase tracking-[0.18em] text-faint mb-2">Topics</h2>
      <TagsList tags={tags} showCounts={false} />
    </section>
  )}
  ```
- [ ] `TagsList.astro`: drop the `#` prefix and the `(count)` suffix. Update classes to
  `font-mono text-sm text-muted hover:text-accent underline-offset-4 hover:underline pr-3`.
- [ ] Check `tags/[slug].astro:49` — the page title `#{tag}` still uses a `#`, which is fine as a page heading context. Leave it.
- [ ] Commit: `feat(home): rename tags to topics, drop hash prefix`.

**Checkpoint 4:** User reviews the Topics placement and style.

---

## Phase 5 — Header, title, nav

**Files:** `src/components/BlogTitle.astro`, `src/components/Header.astro`, `src/components/Navigation.astro`, `src/components/Icons.astro` (possibly unused after)

- [ ] `BlogTitle.astro`: swap both the `<h1>` and `<h2>` classes to
  `inline-flex font-serif text-2xl md:text-3xl font-semibold tracking-tight leading-tight text-ink`.
- [ ] `Header.astro` tagline `<p>`: change to
  `class="text-muted text-base md:text-lg mt-2"`.
- [ ] `Navigation.astro`: remove `<Icons />` usages and imports; update the `<ul>` to
  `class="${className} flex flex-row justify-start gap-6 font-mono text-xs uppercase tracking-[0.18em] text-muted"`
  and each `<a>` to `class="whitespace-nowrap hover:text-accent underline-offset-4 hover:underline"`.
  Inner content becomes just `About`, `TIL`, `RSS` text (no icon wrappers).
- [ ] Grep `Icons` import references; if `Navigation.astro` was the only consumer, leave the component file alone (may be used elsewhere in future — do not delete preemptively per CLAUDE.md "keep it simple").
- [ ] Commit: `feat(header): typographic header and minimal nav`.

**Checkpoint 5:** User reviews the header and nav.

---

## Phase 6 — Prose and post layout

**Files:** `src/pages/posts/[slug].astro`, `src/pages/about.astro`, `src/styles/index.css`, new `src/components/Prose.astro`

- [ ] Create `src/components/Prose.astro` owning the canonical prose class chain:
  ```astro
  ---
  interface Props { class?: string }
  const { class: extra = "" } = Astro.props;
  ---
  <article
    class={`prose prose-quoteless max-w-none font-serif text-ink
      prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-ink
      prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:font-semibold
      prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:pt-0
      prose-h3:text-xl prose-h3:font-semibold
      prose-p:leading-relaxed prose-li:leading-relaxed
      prose-a:text-accent prose-a:underline-offset-4 hover:prose-a:text-accent-hover
      prose-blockquote:border-accent prose-blockquote:border-l-4
      prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-muted
      prose-code:font-mono prose-code:text-ink
      prose-pre:bg-surface prose-pre:text-ink prose-pre:text-sm
      prose-img:mx-auto prose-img:rounded-sm
      ${extra}`}
  >
    <slot />
  </article>
  ```
- [ ] In `posts/[slug].astro`: replace the giant `<article class="...">` wrapper with `<Prose class="mb-24">`. Keep the `<header>`, `<Content />`, divider, tags list, and publication footer inside. Update the publication footer `<div>` to `class="font-mono text-sm text-faint"`.
- [ ] In `about.astro`: same swap — replace the giant `<article class="...">` wrapper with `<Prose class="mb-24">`.
- [ ] `index.css`: replace hard-coded `bg-gray-*` / `text-gray-*` / `bg-stone-*` in callout, table, figcaption, and inline-code rules with the new tokens via `@apply`:
  - `.callout` bg → `bg-surface`
  - inline `code` bg / text → `bg-surface text-ink`
  - figcaption text → `text-faint`
  - table thead / tr border → `border-rule`, `bg-surface`
  - Keep the Shiki `!important` rules untouched (they're load-bearing and pre-existing warnings).
- [ ] Commit: `feat(post): token-bound prose via shared component`.

**Checkpoint 6:** User reviews a post page in both modes.

---

## Phase 7 — Daily slug, about already done, footer, 404

**Files:** `src/pages/daily/[slug].astro`, `src/pages/404.astro`, `src/components/Footer.astro`

The `/daily` index page and `/tags/<slug>` page get their full treatment in Phases 9–10; this phase just picks up the leaves.

- [ ] In `daily/[slug].astro`: wrap body with `<Prose class="mb-24">`. Change the `<time>` class to `font-mono text-sm text-faint`.
- [ ] In `404.astro`: swap to `<Prose class="text-center py-16 max-w-none">`. Link class → `text-accent underline underline-offset-4 hover:text-accent-hover`.
- [ ] `Footer.astro`: update to
  ```astro
  <footer class="py-12 border-t border-rule mt-16">
    <div class="font-mono text-sm text-faint max-w-3xl mx-auto px-6 md:px-8">
      {config.footer.copyright} {new Date().getFullYear()}
    </div>
  </footer>
  ```
- [ ] Commit: `chore(pages): align remaining pages with tokens`.

**Checkpoint 7:** User clicks through `/`, `/daily`, a daily slug, `/about`, `/tags/<x>`, `/404`.

---

## Phase 8 — CSS cleanup and consistency pass

**Files:** `src/styles/index.css`, `tailwind.config.cjs`

- [ ] Walk `index.css` top-to-bottom:
  - Every remaining `gray-*`, `stone-*`, `blue-*` reference should become a token via `@apply`.
  - Consolidate the two `@media (prefers-color-scheme: dark)` blocks that toggle inline-code and Shiki code colors — simplest form is one block per concern, or a single block at end of file.
  - Remove the `.post-item p` rule if still present (should be gone from Phase 3).
  - Replace any remaining `text-md` (non-standard) with `text-base`.
- [ ] Grep for `font-chonkymedium` in the codebase. If unused, remove the `fontWeight: { chonkymedium: 500 }` entry from `tailwind.config.cjs`.
- [ ] Grep for `tracking-tighter` usage. If only one remains, leave it; if zero remain, remove the `letterSpacing.tighter` entry.
- [ ] Run `pnpm run check` — should report the same 8 pre-existing Shiki `!important` warnings and nothing new.
- [ ] Commit: `chore(css): consolidate tokens, drop dead styles`.

**Checkpoint 8:** Pre-merge review.

---

## Phase 9 — Single tag page polish

**Files:** `src/pages/tags/[slug].astro`

The posts list here already inherits the lean Phase 3 treatment via `<PostsList>`. This phase is about the page header and the surrounding chrome, so a tag page with 30 posts stays scannable.

- [ ] Replace the page `<h1>` with a token-aligned, less shouty version:
  ```astro
  <header class="mb-10">
    <h1 class="font-mono text-xl md:text-2xl text-ink lowercase">#{tag ? tag.data.title : slug}</h1>
    {tag?.data.description && (
      <p class="mt-2 text-muted text-base md:text-lg">{tag.data.description}</p>
    )}
  </header>
  ```
- [ ] If an MDX tag page body exists (`TagContent`), wrap with `<Prose class="mb-10 max-w-none">` instead of the inline `prose dark:prose-invert`.
- [ ] Replace the `<hr class="my-10">` divider with a token rule:
  `<hr class="my-10 border-t border-rule">`.
- [ ] The inline daily rendering block (`tags/[slug].astro:85-119`) is already replaced by `<DailyList daily={dailies} />` from Phase 7. Ensure the section header in that block is the quiet mono style:
  `<h2 class="font-mono text-xs uppercase tracking-[0.18em] text-faint mb-3">Daily Notes</h2>`.
- [ ] Commit: `feat(tags): lean single tag page`.

**Checkpoint 9:** User visits 2–3 tag pages with varying density.

---

## Phase 10 — Civil daily index and daily list

**Files:** `src/components/DailyList.astro`, `src/pages/daily/index.astro`

The current `/daily` page renders the full body of every daily note inline (`daily/index.astro:35-64`). On a site with dozens of dailies that's a wall of text. Make the default DailyList a compact title-or-fallback-preview row; keep a separate rendering path (or prop) if a page needs the expanded view.

- [ ] Shape `DailyList.astro` as a lean list. Row template:
  ```astro
  ---
  import type { CollectionEntry } from "astro:content";

  interface Props { daily: CollectionEntry<"daily">[] }
  const { daily } = Astro.props;

  function formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
      .format(new Date(y, m - 1, d));
  }
  ---
  <ul class="list-none p-0 m-0 space-y-2 md:space-y-2.5">
    {daily.map((note) => (
      <li class="flex items-baseline justify-between gap-6">
        <a
          href={`/daily/${note.id}`}
          class="font-serif text-base md:text-lg text-ink hover:text-accent underline-offset-4 hover:underline leading-snug"
        >
          {note.data.title && note.data.title.length > 0 ? note.data.title : "Note"}
        </a>
        <time class="font-mono text-sm text-faint tabular-nums whitespace-nowrap shrink-0">
          {formatDate(note.id)}
        </time>
      </li>
    ))}
  </ul>
  ```
- [ ] `daily/index.astro`: replace the inline MDX-rendering `<ul>` with `<DailyList daily={dailies} />`. Update the page header:
  ```astro
  <header class="mb-10">
    <h1 class="font-serif text-2xl md:text-3xl font-semibold text-ink">Daily Notes</h1>
    <p class="mt-2 text-muted text-base md:text-lg">{config.daily.description}</p>
  </header>
  ```
      and drop the outer `prose prose-slate dark:prose-invert` wrapper — it's a list page, not a prose page.
- [ ] Remove the now-unused `render` import from `daily/index.astro`.
- [ ] Commit: `feat(daily): civil daily index`.

**Checkpoint 10:** User reviews `/daily` density.

---

## Phase 11 — Shiki light-mode fix

**Bug observed at Phase 3 checkpoint:** code block syntax highlighting appears broken/washed-out in light mode. The dark-mode Shiki overrides use `!important` (see `index.css` lines 169–188), but the light-mode counterpart depends on inline styles Astro emits at build time — and those inline styles reference theme CSS variables that may not be set on the page, or the light theme's `--shiki-light-bg` is now clashing with our cream background.

**Files:** `src/styles/index.css`, `astro.config.mjs` (confirm Shiki config)

- [ ] Open a post with a code block, inspect a `<span>` inside `.astro-code`, note the computed `color` + `background-color`.
- [ ] If `--shiki-light` / `--shiki-light-bg` are undefined on the element, the build-time inline styles are being dropped — fix by ensuring Shiki's dual-theme setup in `astro.config.mjs` is producing the expected theme CSS vars.
- [ ] If the vars resolve but the chosen light theme is illegible on cream paper, pick a Shiki theme whose background complements Flexoki paper (e.g. `github-light`, `catppuccin-latte`, or `vitesse-light`) — and ensure the dark theme still reads well on Everforest (`github-dark-dimmed`, `everforest-dark`, or `vitesse-dark`).
- [ ] Update the override rules in `index.css` accordingly; keep the `!important` markers only where Astro's inline styles would otherwise win.
- [ ] Commit: `fix(shiki): restore light-mode code highlighting`.

---

## Phase 12 — Full verification

- [ ] `pnpm run dev` walk: `/` (light + dark), a post, `/daily`, a daily slug, `/about`, a tag page, `/404`.
- [ ] `pnpm run build` — confirm OG images, RSS, and Astro build all complete without new errors.
- [ ] `pnpm run check` — same baseline warnings, nothing new.
- [ ] User approves.
- [ ] Delete `PLAN.md` from the branch (optional — ask).
- [ ] Ready to merge `design-refresh` → `main`.

---

## Explicitly out of scope
- OG image visual refresh (different pipeline; address if asked).
- Switching Shiki themes (keeps current; we only retheme the chrome around code).
- Adding JS interactivity; stays static.
- Changing `max-w-3xl` reading column; revisit after typography settles.
- Localizing Plex to Cyrillic subset; latin-only for now.

## Future ideas (not in this refresh)
- On single-tag pages, weave dailies into the posts-by-year list instead of rendering them as a separate bottom section. Would need a unified "entries by year" renderer that handles both post and daily shapes. Bigger rewrite — keep separate.

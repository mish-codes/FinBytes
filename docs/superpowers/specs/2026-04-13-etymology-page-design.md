# Etymology Page — Design Spec

**Date:** 2026-04-13
**Status:** Draft — awaiting user review
**Target:** `docs/etymology.html` on the FinBytes Jekyll blog

## Goal

Add an educational etymology page to the FinBytes blog that displays English word roots and their ancestry as an interactive, Obsidian-style force-directed graph. Users can browse curated featured roots, search for any word in the dataset, and explore multi-level ancestry chains (English → Greek/Latin/Old French → Proto-Indo-European).

The page must be free to run (GitHub Pages static hosting, no backend, no paid APIs) and reuse the existing D3 force-graph infrastructure already used by the sitemap overlay.

## Non-goals

- Full coverage of the English language (infeasible; targeted curation only)
- User-submitted entries (static site, no backend)
- Live API lookups at runtime (quality/licensing/CORS issues)
- Per-word static pages for SEO (query-param routing only)
- Open Graph preview cards (deferred — revisit if page gets traffic)
- JavaScript unit tests (consistent with rest of blog, which has none)

## Architecture

### Files

| Path | Purpose |
|---|---|
| `docs/etymology.html` | New Jekyll page. Front matter sets layout, title, permalink. Serializes `site.data.etymology` to inline JSON, renders search box, featured-roots grid, graph canvas, and side panel. |
| `docs/_data/etymology.yml` | Curated seed dataset. Jekyll auto-loads into `site.data.etymology`. Append-only, grows over time. |
| `docs/_data/etymology.README.md` | Contributor doc: schema, language codes, conventions, how to add entries. |
| `docs/assets/js/etymology-graph.js` | Standalone D3 module. Takes dataset + focus word, builds 2-hop subgraph, runs force simulation, handles hover/click/rotation. Borrows patterns from `graph-overlay.html` but is a separate file. |
| `docs/assets/css/etymology.css` | Page-specific styles: language color palette, side panel, featured-roots grid, mobile bottom-sheet. |
| `scripts/validate_etymology.rb` | Standalone Ruby validator. Checks every `parents:` reference resolves, every `id` is unique, every `language` is in the known set. Run manually and on CI. |

### Why a separate JS file

The existing [graph-overlay.html](../../_includes/graph-overlay.html) is a site-wide sitemap overlay triggered from any post. The etymology page is a dedicated page with its own search, side panel, and interaction flow. Sharing code between the two would tangle two different UX flows. `etymology-graph.js` borrows patterns (force params, counter-rotation, hover effects) but not code.

### Navigation integration

Add "Etymology" as a top-level entry in [docs/_includes/header.html](../../_includes/header.html). It does not belong under Python, C++, or QuantLab, and the blog's nav has room for another top-level item.

## Data model

### Schema (per entry in `etymology.yml`)

```yaml
- id: philosophy            # slug-safe unique key
  word: philosophy          # display word (may contain non-Latin script)
  language: en              # ISO code, drives node color
  gloss: "love of wisdom"   # short meaning
  parents: [philo, sophia]  # list of parent entry ids
  featured: true            # optional — true means shown on landing page
  source: wiktionary        # optional — provenance for audit/credibility

- id: philo
  word: φίλος (philos)
  language: grc
  gloss: "loving, dear"
  parents: [pie-bhili]

- id: pie-bhili
  word: "*bʰilos"
  language: pie
  gloss: "friendly"
  parents: []
  source: wiktionary
```

### Field rules

- `id` — slug-safe (lowercase, hyphens, no spaces). Separate from `word` so Greek/Cyrillic display correctly without breaking lookups.
- `word` — display form, may include transliteration in parentheses for non-Latin scripts.
- `language` — ISO code. Known set: `en`, `grc` (Ancient Greek), `la` (Latin), `fro` (Old French), `gem` (Germanic/Old English), `sa` (Sanskrit), `pie` (Proto-Indo-European), `unk` (unknown/other).
- `gloss` — short English meaning, under ~8 words.
- `parents` — list of entry ids. Empty list means root (no known parent). Multi-parent is supported natively (e.g., *television* = `[tele, visio]`).
- `featured` — optional boolean. `true` means the entry appears in the landing-page featured-roots grid. Should be applied to ~10 high-yield roots, not individual words.
- `source` — optional string or URL. Free-form provenance note displayed as a small link in the side panel.

### Curation strategy

Target **~300 entries built from ~50 root clusters** for v1 launch. Density beats count: 50 well-chosen roots with 4–8 English descendants each produce a graph full of sibling clusters, where hovering one root lights up an interesting constellation of related words. A random 300-word list does not.

Seed roots to curate: *philo-, sophia, tele-, bio-, geo-, -ology, -graphy, auto-, photo-, hydro-, chrono-, anthro-, micro-, macro-, poly-, mono-, -phone, -scope, -meter, vid/vis, aqua, terra, anim, cardio, derm, gen, hemo, hyper, hypo, inter, intra, log, manu, mort, neo, omni, path, ped, pod, port, quad, retro, sci, struct, sub, super, sym/syn, tact, trans, ultra, vita*.

Schema is append-only: growing the dataset to thousands of entries later requires zero code changes.

## Page layout & interaction

### Landing state (`/etymology.html`, no query param)

```
┌─────────────────────────────────────────────────┐
│  [🔎 search: type a word...]  [🎲 surprise me]  │
├─────────────────────────────────────────────────┤
│                                                 │
│   Featured roots                                │
│   [philo-] [tele-] [bio-] [geo-] [-ology]       │
│   [photo-] [auto-] [hydro-] [chrono-] [poly-]   │
│                                                 │
│   (color legend in bottom-left corner)          │
└─────────────────────────────────────────────────┘
```

### Focused state (`?w=philosophy`)

```
┌─────────────────────────────────────────────────┐
│  [🔎 search]                [⌂ home]            │
├────────────────────────────────┬────────────────┤
│                                │ philosophy     │
│     ● sophia                   │ en · "love of  │
│      \                         │  wisdom"       │
│       ● philosophy ●──● philo  │                │
│                    \           │ Ancestry:      │
│                     ● pie-bhili│ philo "loving" │
│                                │  + sophia      │
│                                │  "wisdom"      │
│                                │ ← PIE *bʰilos  │
│                                │                │
│                                │ Shares root:   │
│                                │ [philanthropy] │
│                                │ [philology]    │
│                                │ [sophomore]    │
│                                │                │
│                                │ source: wikt.  │
└────────────────────────────────┴────────────────┘
    graph canvas (70%)            side panel (30%)
```

### Interaction flow

1. **Landing** — user sees search box, "surprise me" button, featured-roots grid, color legend.
2. **Entry** — user clicks a featured root, types in search and picks a match, or hits "surprise me". URL updates to `?w=<id>` (pushState — browser back/forward work natively).
3. **Focus render** — graph renders 2-hop subgraph centered on the target word, nodes colored by language, sized by distance from focus.
4. **Hover any node** — tooltip shows word + transliteration + language + gloss.
5. **Click any non-center node** — that node becomes the new focus, URL updates, graph recenters, side panel refreshes.
6. **Click the center (focused) node** — collapses back one step in the exploration chain (same pattern as existing sitemap graph, commit `8cb4632`).
7. **Home button** — clears focus, returns to landing state.
8. **Search miss** — inline message under search box: *"Not in the seed dataset yet. Try one of the featured roots below."* Does not 404 or navigate away.

### Side panel contents (focused state)

- Focused word, language, gloss
- **Ancestry:** text chain walking full parent tree down to roots, regardless of graph visual depth
- **Shares root:** clickable chips for all other entries whose `parents` intersect with the focused word's `parents`
- **source:** small link if `source` field is set on the entry

### Mobile layout

- Side panel collapses to a bottom sheet, swipes up to expand
- Featured roots grid becomes a vertical list
- Graph canvas takes full viewport width
- Touch = hover + click combined (tap to focus, long-press for tooltip)

## Visual language

### Language color palette

| Code | Language | Hex |
|---|---|---|
| `pie` | Proto-Indo-European | `#d4af37` gold |
| `grc` | Ancient Greek | `#4a90e2` blue |
| `la` | Latin | `#c0392b` red |
| `gem` | Germanic / Old English | `#27ae60` green |
| `fro` | Old French | `#8e44ad` purple |
| `sa` | Sanskrit | `#e67e22` orange |
| `en` | Modern English | `#888888` grey |
| `unk` | Unknown / other | `#cccccc` light grey |

### Node sizing

- Focused word: radius 24
- 1-hop parents/children: radius 16
- 2-hop ancestors: radius 10

Same scale family as existing sitemap graph.

### Labels

- Word + transliteration in parentheses for non-Latin scripts (e.g., `φίλος (philos)`)
- Counter-rotated during slow rotation, reusing the logic from commit `a4ab2b9`
- Same font size for all nodes (per commit `b76bd8e` style precedent)

### Legend

Small fixed-position color key in the bottom-left corner of the graph canvas showing each language code → color mapping.

## Accessibility

The force-directed graph is unreadable to screen readers. To mitigate:

- **Visible text fallback:** the side panel always contains a `<ul>` of the focused word's ancestry in plain nested list form, which is screen-reader friendly.
- **`aria-live="polite"` region** wrapping the side panel so focus changes are announced.
- **`<noscript>` fallback** on the main page: renders the featured roots as a plain `<ul>` of links to `?w=<id>`.
- **Keyboard shortcuts:**
  - `/` focuses the search box
  - `Esc` returns to landing state (home)
  - `r` picks a random entry
  - `Tab` cycles through visible graph nodes (focus ring)
  - `Enter` on a focused node = click it

## Edge cases & error handling

- **Search miss** — inline message, does not navigate away.
- **Broken parent reference** (`parents: [foo]` where `foo` has no entry) — `validate_etymology.rb` fails the build. At runtime, graph renders orphan as a grey `unk` node so a single bad entry never crashes the page.
- **Multi-parent words** — both edges rendered, no special casing needed.
- **Cycles** — should not occur (validator checks), but JS traversal uses a visited set capped at depth 10 as defense in depth.
- **Empty dataset** — landing page shows placeholder message.
- **Direct URL to missing word** (`?w=nonexistent`) — treated as search miss, falls back to landing state.
- **Large focused subgraph** (a root with 50+ direct children) — cap visible children at 30, show a "+N more" chip in the side panel.

## Testing

### Automated

- `scripts/validate_etymology.rb` — data integrity. Standalone script, run manually before commits (`ruby scripts/validate_etymology.rb`). Not wired into `jekyll build` to keep the Jekyll build path unchanged. Checks:
  - Every `id` is unique
  - Every `parents:` reference resolves to a real entry
  - Every `language` is in the known set
  - No cycles in the parent graph
- **No JS unit tests.** Consistent with the rest of the blog.

### Manual test checklist (for PR review)

- [ ] Landing page renders with featured roots grid and color legend
- [ ] Search hit (e.g., *philosophy*) focuses that word
- [ ] Search miss shows inline message, does not navigate
- [ ] Clicking a featured root focuses it
- [ ] "Surprise me" picks a random entry
- [ ] Clicking a non-center node recenters the graph on it
- [ ] Clicking the center node collapses back one step
- [ ] Home button returns to landing state
- [ ] Browser back/forward buttons walk the focus chain
- [ ] Hover shows tooltip with word/gloss/language
- [ ] Side panel "Shares root" chips are clickable and recenter
- [ ] Mobile layout collapses side panel to bottom sheet
- [ ] Keyboard shortcuts (`/`, `Esc`, `r`) work
- [ ] Screen reader announces side panel updates
- [ ] `<noscript>` fallback renders when JS is disabled
- [ ] Multi-parent word (*television*) renders both parent edges
- [ ] Multi-level chain (3+ hops back to PIE) renders correctly
- [ ] Color legend matches actual node colors

## Cost

**$0.** All free:
- GitHub Pages hosting (free)
- D3.js (free, CDN or vendored)
- Jekyll (free, already in use)
- No APIs, no keys, no backend

The real cost is curation time: ~a weekend to produce the v1 ~300-entry dataset if you know the roots, or spread over evenings.

## Open questions

None. All design decisions are made.

## Next step

Invoke the writing-plans skill to break this spec into an implementation plan with review checkpoints.

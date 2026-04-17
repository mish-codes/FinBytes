# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Jekyll blog published to GitHub Pages at https://mish-codes.github.io/FinBytes/. Python/C++ examples referenced in posts live in sibling repos (e.g. `quant_lab`) — **this repo contains no executable Python code**, only the blog source in `docs/` and Ruby validation scripts in `scripts/`.

License: CC0 1.0 Universal.

## Commands

### Local Jekyll dev
```bash
cd docs && bundle exec jekyll serve --future
```
`future: true` in `_config.yml` means posts dated ahead of today still render locally (they're live on the site too — the blog is currently being backfilled with post-dated entries).

### Etymology data
The etymology graph at `/etymology.html` is powered by `docs/_data/etymology.yml`. Validate after edits:
```bash
ruby scripts/validate_etymology.rb docs/_data/etymology.yml
```
Minitest suite lives in `scripts/test_validate_etymology.rb` (run with `ruby scripts/test_validate_etymology.rb`). Schema + language codes are documented in `docs/_data/etymology.README.md`.

### Deploy
Pushing to `master` triggers `.github/workflows/pages-deploy.yml` (Ruby 3.3, builds `docs/` with `JEKYLL_ENV=production`, deploys via `actions/deploy-pages@v4`). No manual step.

## Architecture

### Theme
`jekyll-theme-chirpy ~> 7.0` (see `docs/Gemfile`). **Do not hand-roll nav, sidebar, or post chrome** — Chirpy provides them. The only custom includes are `comments.html`, `graph-overlay.html`, `metadata-hook.html`, and `sidebar.html` (augmenting, not replacing, the theme).

### Collections (`docs/_config.yml`)
Four custom collections beyond `_posts`:

| Collection | Dir | Permalink |
|---|---|---|
| `tabs` | `_tabs/` | theme default (sort_by: order) |
| `cpp` | `_cpp/` | `/cpp/:name/` — defaults to `layout: cpp-post` |
| `quant_lab` | `_quant_lab/` | `/quant-lab/:name/` |
| `private` | `_private/` | `/private/:name/` |

`_posts/` defaults to `layout: post`, `comments: true`, `toc: true`.

### Key layouts (`docs/_layouts/`)
- `cpp-post.html` — tabbed layout for C++ series posts
- `quant-lab-project.html` — five-tab layout: concept / python / cpp / csharp / comparative. Each tab body comes from a front-matter field (`page.concept_content`, `page.python_content`, …).
- `quant-lab-mini.html`, `quant-lab-capstone.html` — sibling variants
- `embed.html` — minimal chrome for embeddable pages (etymology graph etc.)

### Tabs / index pages
Top-nav index pages live in `_tabs/` (`python.md`, `cpp.md`, `quant-lab.md`, `math-finance.md`, `comparisons.md`, `demo.md`, `design.md`, `github.md`, `misc.md`, `about.md`). `_pages/` holds standalone legal pages.

### Liquid date gotcha
When filtering/comparing post dates in Liquid, always normalize first:
```liquid
{% assign pd = p.date | date: "%Y-%m-%d" %}
{% if pd >= "2026-01-01" %}...{% endif %}
```
Never compare `p.date` (a Time object) directly to a string. Currently used in `docs/cpp.html`, `docs/notes.html`, `docs/_tabs/design.md`.

### Drafts
`docs/_drafts/` holds long-form idea stubs with deliberately ugly slugs — they're skipped by default. Don't rename or promote them without an explicit ask.

## Git workflow

Work on `working`, merge to `master`, let GitHub Pages redeploy. Full "commit and deploy" sequence:
1. `git add .`
2. `git commit -m "<message>"`
3. `git push origin working`
4. `git checkout master`
5. `git merge working --no-verify -m "<same message>"` — `--no-verify` is required because a global pre-commit hook blocks direct master activity in repos that have a `working` branch
6. `git push origin master`
7. `git checkout working` — always end on `working`

**Never commit `docs/_site/`** (it's the Jekyll build output).

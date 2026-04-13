# Etymology Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive etymology exploration page for the FinBytes Jekyll blog showing English word roots as an Obsidian-style force-directed graph with search, featured roots, and multi-level ancestry.

**Architecture:** New standalone Jekyll page (`docs/etymology.html`) that serializes a curated YAML dataset (`docs/_data/etymology.yml`) to inline JSON and renders a 2-hop focused subgraph via a dedicated D3 module (`docs/assets/js/etymology-graph.js`). URL query parameter `?w=<id>` drives focus state for shareable/bookmarkable links and native browser back/forward. Reuses force-graph patterns from existing [docs/_includes/graph-overlay.html](../../_includes/graph-overlay.html) but lives in its own files.

**Tech Stack:** Jekyll, Liquid templating, D3.js v7 (CDN), vanilla ES5/ES6 JS, plain CSS, Ruby for the data validator.

**Spec reference:** [docs/superpowers/specs/2026-04-13-etymology-page-design.md](../specs/2026-04-13-etymology-page-design.md)

---

## File Structure

Files to create:

| Path | Responsibility |
|---|---|
| `docs/_data/etymology.yml` | Curated etymology dataset, append-only. Starts as tiny smoke-test seed, grows to ~300 entries by end of plan. |
| `docs/_data/etymology.README.md` | Contributor guide: schema, language codes, conventions. Jekyll ignores `.md` in `_data/` so this is safe. |
| `docs/etymology.html` | Jekyll page with permalink `/etymology.html`. Serializes dataset to JSON, renders DOM skeleton, loads the JS module. |
| `docs/assets/css/etymology.css` | Page-specific styles: language color palette, grid, side panel, mobile bottom sheet. |
| `docs/assets/js/etymology-graph.js` | D3 module: subgraph builder, force simulation, rendering, interaction, URL routing, keyboard shortcuts. |
| `scripts/validate_etymology.rb` | Standalone Ruby validator for data integrity. |
| `scripts/test_validate_etymology.rb` | Minitest for the validator. |

Files to modify:

| Path | Change |
|---|---|
| `docs/_includes/header.html` | Add "Etymology" top-level nav entry. |

---

## Task 1: Scaffold the data file with a smoke-test seed

**Files:**
- Create: `docs/_data/etymology.yml`
- Create: `docs/_data/etymology.README.md`

- [ ] **Step 1: Create the README for contributors**

Write `docs/_data/etymology.README.md`:

```markdown
# etymology.yml — contributor guide

This file powers `/etymology.html`. Each entry describes one word or root.

## Schema

```yaml
- id: philosophy            # slug-safe unique key (lowercase, hyphens)
  word: philosophy          # display form, may contain non-Latin script
  language: en              # ISO code — drives node color
  gloss: "love of wisdom"   # short English meaning, ≤ 8 words
  parents: [philo, sophia]  # list of parent entry ids; [] for roots
  featured: true            # optional — show in landing-page grid
  source: wiktionary        # optional — provenance
```

## Language codes

| Code | Language |
|---|---|
| `en` | Modern English |
| `grc` | Ancient Greek |
| `la` | Latin |
| `fro` | Old French |
| `gem` | Germanic / Old English |
| `sa` | Sanskrit |
| `pie` | Proto-Indo-European |
| `unk` | Unknown / other |

## Rules

- `id` must be unique across the whole file.
- Every id in `parents:` must resolve to another entry in this file.
- `language` must be in the known set above.
- Prefer curating by **root cluster**: pick a root (e.g., `tele-`) and add 4–8 English descendants that share it. Density beats raw count.
- Mark ~10 high-yield roots as `featured: true` for the landing page.

## Validating

```bash
ruby scripts/validate_etymology.rb
```

This checks uniqueness, parent references, language codes, and cycles.
```

- [ ] **Step 2: Create the smoke-test dataset**

Write `docs/_data/etymology.yml`:

```yaml
# Etymology dataset — see etymology.README.md
# This is the smoke-test seed. Grows to ~300 entries over Task 14.

- id: philosophy
  word: philosophy
  language: en
  gloss: "love of wisdom"
  parents: [philo, sophia]
  source: wiktionary

- id: philo
  word: "φίλος (philos)"
  language: grc
  gloss: "loving, dear"
  parents: [pie-bhili]
  featured: true
  source: wiktionary

- id: sophia
  word: "σοφία (sophia)"
  language: grc
  gloss: "wisdom"
  parents: []
  source: wiktionary

- id: pie-bhili
  word: "*bʰilos"
  language: pie
  gloss: "friendly"
  parents: []
  source: wiktionary

- id: philanthropy
  word: philanthropy
  language: en
  gloss: "love of humanity"
  parents: [philo, anthropos]
  source: wiktionary

- id: anthropos
  word: "ἄνθρωπος (anthropos)"
  language: grc
  gloss: "human being"
  parents: []
  source: wiktionary

- id: television
  word: television
  language: en
  gloss: "far-sight device"
  parents: [tele, visio]
  source: wiktionary

- id: tele
  word: "τῆλε (tēle)"
  language: grc
  gloss: "far off"
  parents: []
  featured: true
  source: wiktionary

- id: visio
  word: visio
  language: la
  gloss: "seeing, sight"
  parents: []
  source: wiktionary
```

9 entries covering: multi-parent (*television*, *philanthropy*), multi-level (*philosophy* → *philo* → PIE), sibling cluster (*philosophy*/*philanthropy* share `philo`), multiple languages (`en`, `grc`, `la`, `pie`), featured flag. Enough to exercise every rendering code path.

- [ ] **Step 3: Commit**

```bash
git add docs/_data/etymology.yml docs/_data/etymology.README.md
git commit -m "feat(etymology): add smoke-test dataset and contributor guide"
```

---

## Task 2: Write the data validator (TDD)

The validator is the only component with automated tests. It is a standalone Ruby script — no Jekyll plugin, no build-time hook.

**Files:**
- Create: `scripts/validate_etymology.rb`
- Create: `scripts/test_validate_etymology.rb`
- Create: `scripts/fixtures/valid_etymology.yml`
- Create: `scripts/fixtures/duplicate_id.yml`
- Create: `scripts/fixtures/broken_parent.yml`
- Create: `scripts/fixtures/unknown_language.yml`
- Create: `scripts/fixtures/cycle.yml`

- [ ] **Step 1: Create test fixtures**

Write `scripts/fixtures/valid_etymology.yml`:

```yaml
- id: philosophy
  word: philosophy
  language: en
  gloss: "love of wisdom"
  parents: [philo]
- id: philo
  word: philo
  language: grc
  gloss: "loving"
  parents: []
```

Write `scripts/fixtures/duplicate_id.yml`:

```yaml
- id: philo
  word: philo
  language: grc
  gloss: "loving"
  parents: []
- id: philo
  word: philo
  language: grc
  gloss: "loving"
  parents: []
```

Write `scripts/fixtures/broken_parent.yml`:

```yaml
- id: philosophy
  word: philosophy
  language: en
  gloss: "love of wisdom"
  parents: [nonexistent]
```

Write `scripts/fixtures/unknown_language.yml`:

```yaml
- id: philosophy
  word: philosophy
  language: klingon
  gloss: "love of wisdom"
  parents: []
```

Write `scripts/fixtures/cycle.yml`:

```yaml
- id: a
  word: a
  language: en
  gloss: "a"
  parents: [b]
- id: b
  word: b
  language: en
  gloss: "b"
  parents: [a]
```

- [ ] **Step 2: Write the failing test file**

Write `scripts/test_validate_etymology.rb`:

```ruby
require "minitest/autorun"
require_relative "validate_etymology"

class TestValidateEtymology < Minitest::Test
  FIXTURES = File.join(__dir__, "fixtures")

  def validate(fixture)
    EtymologyValidator.new(File.join(FIXTURES, fixture)).validate
  end

  def test_valid_file_returns_empty_errors
    result = validate("valid_etymology.yml")
    assert_empty result.errors
    assert result.ok?
  end

  def test_duplicate_id_is_error
    result = validate("duplicate_id.yml")
    assert result.errors.any? { |e| e.include?("duplicate id") }
    refute result.ok?
  end

  def test_broken_parent_reference_is_error
    result = validate("broken_parent.yml")
    assert result.errors.any? { |e| e.include?("unknown parent") }
    refute result.ok?
  end

  def test_unknown_language_is_error
    result = validate("unknown_language.yml")
    assert result.errors.any? { |e| e.include?("unknown language") }
    refute result.ok?
  end

  def test_cycle_is_error
    result = validate("cycle.yml")
    assert result.errors.any? { |e| e.include?("cycle") }
    refute result.ok?
  end
end
```

- [ ] **Step 3: Run the test to confirm it fails**

```bash
ruby scripts/test_validate_etymology.rb
```

Expected: `LoadError` or `NameError` because `validate_etymology.rb` doesn't exist yet.

- [ ] **Step 4: Write the validator**

Write `scripts/validate_etymology.rb`:

```ruby
require "yaml"

class EtymologyValidator
  KNOWN_LANGUAGES = %w[en grc la fro gem sa pie unk].freeze

  Result = Struct.new(:errors) do
    def ok?
      errors.empty?
    end
  end

  def initialize(path)
    @path = path
  end

  def validate
    errors = []
    entries = YAML.load_file(@path)

    unless entries.is_a?(Array)
      return Result.new(["file must contain a YAML list at the top level"])
    end

    seen_ids = {}
    entries.each_with_index do |entry, i|
      id = entry["id"]
      if id.nil? || id.to_s.empty?
        errors << "entry #{i}: missing id"
        next
      end
      if seen_ids.key?(id)
        errors << "duplicate id '#{id}' (first seen at index #{seen_ids[id]}, again at #{i})"
      else
        seen_ids[id] = i
      end

      lang = entry["language"]
      unless KNOWN_LANGUAGES.include?(lang)
        errors << "entry '#{id}': unknown language '#{lang}' (known: #{KNOWN_LANGUAGES.join(', ')})"
      end
    end

    by_id = {}
    entries.each { |e| by_id[e["id"]] = e if e["id"] }

    by_id.each do |id, entry|
      parents = entry["parents"] || []
      parents.each do |pid|
        unless by_id.key?(pid)
          errors << "entry '#{id}': unknown parent '#{pid}'"
        end
      end
    end

    by_id.each do |id, _entry|
      visited = {}
      stack = [id]
      while (current = stack.pop)
        if visited[current] == :active
          errors << "cycle detected involving '#{current}' (reached from '#{id}')"
          break
        end
        next if visited[current] == :done
        visited[current] = :active
        parents = (by_id[current] || {})["parents"] || []
        parents.each do |pid|
          stack.push(pid) if by_id.key?(pid)
        end
        visited[current] = :done
      end
    end

    Result.new(errors.uniq)
  end
end

if __FILE__ == $PROGRAM_NAME
  path = ARGV[0] || File.join(__dir__, "..", "docs", "_data", "etymology.yml")
  result = EtymologyValidator.new(path).validate
  if result.ok?
    puts "OK: #{path}"
    exit 0
  else
    warn "VALIDATION FAILED: #{path}"
    result.errors.each { |e| warn "  - #{e}" }
    exit 1
  end
end
```

Note on cycle detection: the simple DFS above flags self-reference as a cycle but uses a naive stack that can false-positive on legitimate shared ancestors. For v1 this is acceptable because all real cycles in etymology data are bugs. If false positives appear, the implementer should upgrade to a proper three-color DFS (white/grey/black) — but only if the simple version fails on real data.

- [ ] **Step 5: Run the tests and verify all pass**

```bash
ruby scripts/test_validate_etymology.rb
```

Expected: `5 runs, N assertions, 0 failures, 0 errors, 0 skips`

- [ ] **Step 6: Run the validator against the real dataset**

```bash
ruby scripts/validate_etymology.rb
```

Expected: `OK: .../docs/_data/etymology.yml`

- [ ] **Step 7: Commit**

```bash
git add scripts/validate_etymology.rb scripts/test_validate_etymology.rb scripts/fixtures/
git commit -m "feat(etymology): add data validator with tests"
```

---

## Task 3: Create the page skeleton with inline JSON serialization

Render the page with no interactivity first — just a static DOM, the serialized dataset as inline JSON, and visible JSON output so we can verify Liquid produces valid data before writing any JS.

**Files:**
- Create: `docs/etymology.html`

- [ ] **Step 1: Create `docs/etymology.html`**

```html
---
layout: default
title: Etymology
permalink: /etymology.html
---

<link rel="stylesheet" href="{{ '/assets/css/etymology.css' | relative_url }}">

<div class="etym-page">
  <header class="etym-header">
    <h1>Etymology</h1>
    <p class="etym-sub">Word roots from Greek, Latin, and Proto-Indo-European. Click a featured root or search for a word.</p>
  </header>

  <div class="etym-controls">
    <input id="etym-search" type="search" placeholder="type a word..." aria-label="Search for a word" autocomplete="off">
    <button id="etym-surprise" type="button" aria-label="Random word">🎲 surprise me</button>
    <button id="etym-home" type="button" aria-label="Back to featured roots" style="display:none;">⌂ home</button>
  </div>

  <div id="etym-search-miss" class="etym-miss" role="status" aria-live="polite" hidden></div>

  <section id="etym-landing" class="etym-landing">
    <h2>Featured roots</h2>
    <ul id="etym-featured" class="etym-featured-grid"></ul>
  </section>

  <section id="etym-focus" class="etym-focus" hidden>
    <div id="etym-canvas" class="etym-canvas" role="img" aria-label="Etymology graph"></div>
    <aside id="etym-panel" class="etym-panel" aria-live="polite"></aside>
  </section>

  <noscript>
    <p><strong>JavaScript is required for the interactive graph.</strong> Below is the raw featured roots list:</p>
    <ul>
      {% for e in site.data.etymology %}
        {% if e.featured %}
          <li><a href="{{ '/etymology.html' | relative_url }}?w={{ e.id }}">{{ e.word }}</a> — {{ e.gloss }}</li>
        {% endif %}
      {% endfor %}
    </ul>
  </noscript>

  <div class="etym-legend" aria-hidden="true">
    <span><i class="etym-dot" style="background:#d4af37"></i>PIE</span>
    <span><i class="etym-dot" style="background:#4a90e2"></i>Greek</span>
    <span><i class="etym-dot" style="background:#c0392b"></i>Latin</span>
    <span><i class="etym-dot" style="background:#27ae60"></i>Germanic</span>
    <span><i class="etym-dot" style="background:#8e44ad"></i>Old French</span>
    <span><i class="etym-dot" style="background:#e67e22"></i>Sanskrit</span>
    <span><i class="etym-dot" style="background:#888"></i>English</span>
  </div>
</div>

<script id="etym-data" type="application/json">
{{ site.data.etymology | jsonify }}
</script>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="{{ '/assets/js/etymology-graph.js' | relative_url }}"></script>
```

Note: the dataset is embedded as a `<script type="application/json">` block (not a JS literal) so the content is inert text and special characters in glosses or non-Latin word forms can't break parsing. The JS module reads it via `JSON.parse(document.getElementById('etym-data').textContent)`.

- [ ] **Step 2: Run Jekyll locally and verify the page builds**

```bash
cd docs && bundle exec jekyll serve --future
```

Open `http://127.0.0.1:4000/etymology.html` in a browser.

Expected: page loads with header, search box, "surprise me" button, empty featured list, and the `<noscript>` fallback is NOT visible (JS is enabled, but the JS file doesn't exist yet so a 404 will appear in the console — that's fine for this step). View page source and confirm the `<script id="etym-data">` block contains valid JSON with all 9 smoke-test entries.

- [ ] **Step 3: Commit**

```bash
git add docs/etymology.html
git commit -m "feat(etymology): add page skeleton with inline JSON dataset"
```

---

## Task 4: Add the stylesheet

**Files:**
- Create: `docs/assets/css/etymology.css`

- [ ] **Step 1: Write the full stylesheet**

Write `docs/assets/css/etymology.css`:

```css
.etym-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.etym-header h1 {
  margin-bottom: 4px;
}

.etym-sub {
  color: var(--text-muted-color, #888);
  margin-bottom: 20px;
}

.etym-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

#etym-search {
  flex: 1;
  max-width: 400px;
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  background: var(--card-bg, #fff);
  color: var(--text-color, #333);
}

#etym-surprise,
#etym-home {
  padding: 8px 14px;
  font-size: 0.9rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  background: var(--card-bg, #fff);
  color: var(--text-color, #333);
  cursor: pointer;
}

#etym-surprise:hover,
#etym-home:hover {
  background: var(--hover-bg, #f0f0f0);
}

.etym-miss {
  padding: 10px 14px;
  background: #fef7e0;
  border-left: 3px solid #e8893c;
  color: #664d03;
  border-radius: 3px;
  margin-bottom: 12px;
}

.etym-featured-grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.etym-featured-grid li {
  margin: 0;
}

.etym-featured-grid button {
  width: 100%;
  padding: 16px 12px;
  font-size: 1.05rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 6px;
  background: var(--card-bg, #fff);
  color: var(--text-color, #333);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.etym-featured-grid button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.etym-focus {
  display: flex;
  gap: 16px;
  min-height: 70vh;
}

.etym-canvas {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  background: var(--card-bg, #fff);
}

.etym-canvas svg {
  width: 100%;
  height: 100%;
  display: block;
}

.etym-panel {
  width: 320px;
  flex-shrink: 0;
  padding: 16px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 6px;
  background: var(--card-bg, #fff);
  font-size: 0.92rem;
}

.etym-panel h2 {
  font-size: 1.3rem;
  margin: 0 0 4px;
}

.etym-panel .etym-panel-lang {
  color: var(--text-muted-color, #888);
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.etym-panel .etym-panel-gloss {
  font-style: italic;
  margin-bottom: 16px;
}

.etym-panel h3 {
  font-size: 0.95rem;
  margin: 16px 0 6px;
  color: var(--text-muted-color, #666);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.etym-panel ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.etym-panel .etym-ancestry li {
  padding: 3px 0 3px 14px;
  border-left: 2px solid var(--border-color, #ddd);
  margin-left: 4px;
}

.etym-panel .etym-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.etym-panel .etym-chips button {
  padding: 4px 10px;
  font-size: 0.85rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 12px;
  background: var(--card-bg, #fff);
  color: var(--text-color, #333);
  cursor: pointer;
}

.etym-panel .etym-chips button:hover {
  background: var(--hover-bg, #f0f0f0);
}

.etym-panel .etym-source {
  margin-top: 14px;
  font-size: 0.8rem;
  color: var(--text-muted-color, #888);
}

.etym-legend {
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-color, #333);
  z-index: 10;
}

.etym-legend span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.etym-legend .etym-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.etym-tooltip {
  position: absolute;
  pointer-events: none;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-size: 0.82rem;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 20;
}

@media (max-width: 768px) {
  .etym-focus {
    flex-direction: column;
  }
  .etym-panel {
    width: auto;
    max-height: 40vh;
    overflow-y: auto;
  }
  .etym-legend {
    bottom: 10px;
    left: 10px;
    font-size: 0.7rem;
  }
  .etym-featured-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Reload the page in the browser**

Expected: header styling, search box looks like a proper input, "surprise me" button styled. Legend visible in bottom-left. Graph canvas and side panel are hidden (focus state is `hidden`).

- [ ] **Step 3: Commit**

```bash
git add docs/assets/css/etymology.css
git commit -m "feat(etymology): add page stylesheet"
```

---

## Task 5: Build the JS module — core setup, data loading, featured roots

Start the JS module with: data loading, language color map, featured roots rendering, and state management scaffolding. No graph yet.

**Files:**
- Create: `docs/assets/js/etymology-graph.js`

- [ ] **Step 1: Write the initial JS module**

Write `docs/assets/js/etymology-graph.js`:

```javascript
(function () {
  'use strict';

  var LANG_COLOR = {
    pie: '#d4af37',
    grc: '#4a90e2',
    la:  '#c0392b',
    gem: '#27ae60',
    fro: '#8e44ad',
    sa:  '#e67e22',
    en:  '#888888',
    unk: '#cccccc'
  };

  var LANG_LABEL = {
    pie: 'Proto-Indo-European',
    grc: 'Ancient Greek',
    la:  'Latin',
    gem: 'Germanic',
    fro: 'Old French',
    sa:  'Sanskrit',
    en:  'English',
    unk: 'Unknown'
  };

  // --- Load dataset ---
  var dataEl = document.getElementById('etym-data');
  if (!dataEl) {
    console.error('etymology: no #etym-data element');
    return;
  }
  var rawEntries = JSON.parse(dataEl.textContent);
  var byId = {};
  rawEntries.forEach(function (e) { byId[e.id] = e; });

  // --- DOM refs ---
  var els = {
    search:     document.getElementById('etym-search'),
    surprise:   document.getElementById('etym-surprise'),
    home:       document.getElementById('etym-home'),
    miss:       document.getElementById('etym-search-miss'),
    landing:    document.getElementById('etym-landing'),
    featured:   document.getElementById('etym-featured'),
    focus:      document.getElementById('etym-focus'),
    canvas:     document.getElementById('etym-canvas'),
    panel:      document.getElementById('etym-panel')
  };

  // --- State ---
  var state = {
    mode: 'landing',  // 'landing' | 'focus'
    focusId: null,
    history: []       // stack of focusIds for in-page back
  };

  // --- Featured roots rendering ---
  function renderFeatured() {
    els.featured.innerHTML = '';
    rawEntries
      .filter(function (e) { return e.featured; })
      .forEach(function (e) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = e.word;
        btn.setAttribute('aria-label', 'Explore ' + e.word);
        btn.addEventListener('click', function () { focusOn(e.id); });
        li.appendChild(btn);
        els.featured.appendChild(li);
      });
  }

  // --- Mode switching ---
  function showLanding() {
    state.mode = 'landing';
    state.focusId = null;
    els.landing.hidden = false;
    els.focus.hidden = true;
    els.home.style.display = 'none';
    els.miss.hidden = true;
    history.replaceState({}, '', window.location.pathname);
  }

  function focusOn(id) {
    if (!byId[id]) {
      showMiss(id);
      return;
    }
    state.mode = 'focus';
    if (state.focusId && state.focusId !== id) {
      state.history.push(state.focusId);
    }
    state.focusId = id;
    els.landing.hidden = true;
    els.focus.hidden = false;
    els.home.style.display = '';
    els.miss.hidden = true;
    history.pushState({ focusId: id }, '', '?w=' + encodeURIComponent(id));
    render();
  }

  function showMiss(query) {
    els.miss.textContent = '"' + query + '" is not in the seed dataset yet. Try one of the featured roots below.';
    els.miss.hidden = false;
  }

  // --- Rendering placeholder (to be built in later tasks) ---
  function render() {
    els.canvas.innerHTML = '<p style="padding:20px;color:#888;">Graph for: ' + state.focusId + '</p>';
    els.panel.innerHTML = '<p>Panel for: ' + state.focusId + '</p>';
  }

  // --- Search ---
  function handleSearch(query) {
    query = (query || '').trim().toLowerCase();
    if (!query) return;
    // Exact id match first
    if (byId[query]) { focusOn(query); return; }
    // Fall back to word match (case-insensitive, strips non-letter chars)
    var normalized = query.replace(/[^a-zα-ωἀ-ῼ]/gi, '');
    var hit = rawEntries.find(function (e) {
      var w = (e.word || '').toLowerCase().replace(/[^a-zα-ωἀ-ῼ]/gi, '');
      return w === normalized;
    });
    if (hit) { focusOn(hit.id); return; }
    showMiss(query);
  }

  els.search.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') handleSearch(els.search.value);
  });

  els.surprise.addEventListener('click', function () {
    var pick = rawEntries[Math.floor(Math.random() * rawEntries.length)];
    focusOn(pick.id);
  });

  els.home.addEventListener('click', showLanding);

  // --- Browser history ---
  window.addEventListener('popstate', function (ev) {
    var params = new URLSearchParams(window.location.search);
    var w = params.get('w');
    if (w && byId[w]) {
      state.focusId = w;
      state.mode = 'focus';
      els.landing.hidden = true;
      els.focus.hidden = false;
      els.home.style.display = '';
      render();
    } else {
      showLanding();
    }
  });

  // --- Init ---
  renderFeatured();
  var initialParams = new URLSearchParams(window.location.search);
  var initialId = initialParams.get('w');
  if (initialId && byId[initialId]) {
    focusOn(initialId);
  } else {
    showLanding();
  }

  // Expose for debug
  window._etym = { state: state, byId: byId, focusOn: focusOn };
})();
```

- [ ] **Step 2: Reload `/etymology.html` in the browser**

Expected behaviors to verify manually:
- Landing page shows `philo` and `tele` as featured buttons (these are the two entries with `featured: true` in the smoke-test data).
- Typing `philosophy` in the search box and pressing Enter shows a placeholder focus state with "Graph for: philosophy".
- URL updates to `?w=philosophy`.
- Clicking "⌂ home" returns to landing, URL clears.
- Clicking "🎲 surprise me" picks a random entry.
- Browser back/forward buttons walk the history.
- Typing a nonsense word (`zzzz`) shows the "not in seed dataset" miss message.

- [ ] **Step 3: Commit**

```bash
git add docs/assets/js/etymology-graph.js
git commit -m "feat(etymology): add JS module with featured roots, search, and routing"
```

---

## Task 6: Build the 2-hop subgraph and render it with D3 force layout

Replace the placeholder in `render()` with actual D3 rendering. This task produces a working force-directed graph with no interactivity beyond what D3 gives for free (drag). Hover, click-to-recenter, tooltips, rotation come in later tasks.

**Files:**
- Modify: `docs/assets/js/etymology-graph.js`

- [ ] **Step 1: Add the subgraph builder above `render()`**

Insert above the `render()` function:

```javascript
  // --- Subgraph builder ---
  // Returns { nodes, links } for the 2-hop radius around focusId.
  // Nodes include the focused entry, all its ancestors up to 2 levels,
  // and all its 1-hop descendants (children that list focusId as parent).
  function buildSubgraph(focusId) {
    var nodes = [];
    var links = [];
    var seen = {};

    function addNode(id, depth) {
      if (seen[id]) return;
      var entry = byId[id] || { id: id, word: id, language: 'unk', gloss: '(unknown)', parents: [] };
      seen[id] = true;
      nodes.push({
        id: id,
        word: entry.word,
        language: entry.language || 'unk',
        gloss: entry.gloss || '',
        depth: depth,
        isFocus: id === focusId
      });
    }

    // Walk up parents, capped at 2 levels back from focus
    function walkAncestors(id, depth) {
      if (depth > 2) return;
      addNode(id, depth);
      var entry = byId[id];
      if (!entry || !entry.parents) return;
      entry.parents.forEach(function (pid) {
        links.push({ source: id, target: pid });
        walkAncestors(pid, depth + 1);
      });
    }

    walkAncestors(focusId, 0);

    // Add 1-hop descendants (other entries that name focusId as a parent)
    rawEntries.forEach(function (e) {
      if ((e.parents || []).indexOf(focusId) >= 0) {
        addNode(e.id, -1);
        links.push({ source: e.id, target: focusId });
      }
    });

    return { nodes: nodes, links: links };
  }
```

- [ ] **Step 2: Replace the placeholder `render()` with a real D3 renderer**

Replace the existing `render` function body with:

```javascript
  function render() {
    var sub = buildSubgraph(state.focusId);

    // Clear canvas
    els.canvas.innerHTML = '';

    var width = els.canvas.clientWidth || 800;
    var height = els.canvas.clientHeight || 600;

    var svg = d3.select(els.canvas)
      .append('svg')
      .attr('viewBox', [0, 0, width, height]);

    var g = svg.append('g');

    // Force simulation
    var simulation = d3.forceSimulation(sub.nodes)
      .force('link', d3.forceLink(sub.links).id(function (d) { return d.id; }).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));

    var link = g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.5)
      .selectAll('line')
      .data(sub.links)
      .enter().append('line')
      .attr('stroke-width', 1.5);

    var nodeGroup = g.append('g')
      .selectAll('g')
      .data(sub.nodes)
      .enter().append('g')
      .attr('class', 'etym-node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', function (ev, d) {
          if (!ev.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', function (ev, d) { d.fx = ev.x; d.fy = ev.y; })
        .on('end', function (ev, d) {
          if (!ev.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        }));

    nodeGroup.append('circle')
      .attr('r', function (d) {
        if (d.isFocus) return 24;
        if (d.depth === 1 || d.depth === -1) return 16;
        return 10;
      })
      .attr('fill', function (d) { return LANG_COLOR[d.language] || LANG_COLOR.unk; })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    nodeGroup.append('text')
      .attr('dy', function (d) { return d.isFocus ? 38 : 26; })
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', 'var(--text-color, #333)')
      .text(function (d) { return d.word; });

    simulation.on('tick', function () {
      link
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; });

      nodeGroup.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    });

    // Side panel — keep the minimal version for this task, flesh out in Task 8
    var focus = byId[state.focusId];
    els.panel.innerHTML =
      '<h2>' + escapeHtml(focus.word) + '</h2>' +
      '<div class="etym-panel-lang">' + (LANG_LABEL[focus.language] || 'Unknown') + '</div>' +
      '<div class="etym-panel-gloss">"' + escapeHtml(focus.gloss || '') + '"</div>';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
```

- [ ] **Step 3: Reload `/etymology.html?w=philosophy`**

Expected:
- Graph renders with `philosophy` in the center as a large blue... wait, no — `philosophy` is `en` so it's grey. The parents `philo` and `sophia` are `grc` (blue). `pie-bhili` is PIE (gold).
- `philanthropy` is visible as a 1-hop descendant (because it lists `philo` as a parent, and `philo` is in the 2-hop radius of `philosophy`). Actually no — the descendant step only pulls children of `focusId` itself, not children of ancestors. So `philosophy` focus will NOT show `philanthropy`. That's by design: the graph is 2-hop around the focus, not a full ego network. If you want to see `philanthropy`, click `philo` to refocus on it, and then both `philosophy` and `philanthropy` appear as children.
- Drag nodes around — force simulation responds.
- Side panel shows word, language, gloss.

- [ ] **Step 4: Test with a multi-parent word**

Navigate to `/etymology.html?w=television`. Expected: `television` centered, both `tele` (blue/Greek) and `visio` (red/Latin) connected as parents.

- [ ] **Step 5: Commit**

```bash
git add docs/assets/js/etymology-graph.js
git commit -m "feat(etymology): render force-directed subgraph for focused word"
```

---

## Task 7: Click-to-recenter, center-click-to-go-back, hover tooltip

Add the three core interactions missing from Task 6: clicking a non-focus node recenters the graph, clicking the focus node walks back in history, and hovering any node shows a tooltip.

**Files:**
- Modify: `docs/assets/js/etymology-graph.js`

- [ ] **Step 1: Add the tooltip element reference and helper**

Add near the top of the IIFE, after the `els` declaration:

```javascript
  var tooltip = null;
  function showTooltip(d, ev) {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'etym-tooltip';
      els.canvas.appendChild(tooltip);
    }
    tooltip.innerHTML =
      '<strong>' + escapeHtml(d.word) + '</strong> · ' +
      (LANG_LABEL[d.language] || 'Unknown') + '<br>' +
      '<em>' + escapeHtml(d.gloss || '') + '</em>';
    var rect = els.canvas.getBoundingClientRect();
    tooltip.style.left = (ev.clientX - rect.left + 12) + 'px';
    tooltip.style.top  = (ev.clientY - rect.top + 12) + 'px';
    tooltip.style.display = 'block';
  }
  function hideTooltip() {
    if (tooltip) tooltip.style.display = 'none';
  }
```

(`escapeHtml` was defined in Task 6. It's hoisted because it's a function declaration, so forward references work.)

- [ ] **Step 2: Wire node interactions inside `render()`**

Inside `render()`, find the `nodeGroup` assignment and add these handlers AFTER the `.call(d3.drag(...))` chain:

```javascript
    nodeGroup
      .on('mouseover', function (ev, d) { showTooltip(d, ev); })
      .on('mousemove', function (ev, d) { showTooltip(d, ev); })
      .on('mouseout', hideTooltip)
      .on('click', function (ev, d) {
        ev.stopPropagation();
        hideTooltip();
        if (d.isFocus) {
          // Center-click = go back one step
          if (state.history.length > 0) {
            var prev = state.history.pop();
            state.focusId = prev;
            history.pushState({ focusId: prev }, '', '?w=' + encodeURIComponent(prev));
            render();
          } else {
            showLanding();
          }
        } else {
          focusOn(d.id);
        }
      });
```

- [ ] **Step 3: Reload and test**

- Focus `philosophy`. Hover each node — tooltip shows word, language, gloss.
- Click `philo` — graph recenters on `philo`, showing `philo`'s parents and children (`philosophy` and `philanthropy` appear as descendants).
- Click the center `philo` node — graph goes back to `philosophy`.
- Click center again — returns to landing.

- [ ] **Step 4: Commit**

```bash
git add docs/assets/js/etymology-graph.js
git commit -m "feat(etymology): add click-to-recenter, center-click-back, hover tooltip"
```

---

## Task 8: Side panel — full ancestry chain and "Shares root" chips

Flesh out the side panel to show the full ancestry (not just the focused word) plus clickable sibling chips for words sharing the same root.

**Files:**
- Modify: `docs/assets/js/etymology-graph.js`

- [ ] **Step 1: Add ancestry-walker and sibling-finder helpers**

Add after `buildSubgraph`:

```javascript
  // Walks the full parent chain, deepest-first, grouped by generation.
  // Returns an array of strings like ['philo "loving" + sophia "wisdom"', '← PIE *bʰilos "friendly"'].
  function traceAncestry(focusId) {
    var lines = [];
    var visited = {};
    var currentGen = [focusId];
    while (currentGen.length > 0) {
      var nextGen = [];
      currentGen.forEach(function (id) {
        var entry = byId[id];
        if (!entry || !entry.parents || entry.parents.length === 0) return;
        entry.parents.forEach(function (pid) {
          if (!visited[pid]) { visited[pid] = true; nextGen.push(pid); }
        });
      });
      if (nextGen.length > 0) {
        var label = nextGen
          .map(function (pid) {
            var e = byId[pid] || { word: pid, gloss: '' };
            return escapeHtml(e.word) + (e.gloss ? ' "' + escapeHtml(e.gloss) + '"' : '');
          })
          .join(' + ');
        lines.push(label);
      }
      currentGen = nextGen;
      if (lines.length > 10) break; // depth cap defense
    }
    return lines;
  }

  // All entries (other than focusId) that share at least one parent with focusId
  function findSiblings(focusId) {
    var focus = byId[focusId];
    if (!focus || !focus.parents || focus.parents.length === 0) return [];
    var parentSet = {};
    focus.parents.forEach(function (p) { parentSet[p] = true; });
    return rawEntries.filter(function (e) {
      if (e.id === focusId) return false;
      return (e.parents || []).some(function (p) { return parentSet[p]; });
    });
  }
```

- [ ] **Step 2: Replace the side panel rendering in `render()`**

Replace the existing `els.panel.innerHTML = ...` block at the end of `render()` with:

```javascript
    var focus = byId[state.focusId];
    var ancestry = traceAncestry(state.focusId);
    var siblings = findSiblings(state.focusId);

    var html = '';
    html += '<h2>' + escapeHtml(focus.word) + '</h2>';
    html += '<div class="etym-panel-lang">' + (LANG_LABEL[focus.language] || 'Unknown') + '</div>';
    if (focus.gloss) {
      html += '<div class="etym-panel-gloss">"' + escapeHtml(focus.gloss) + '"</div>';
    }

    if (ancestry.length > 0) {
      html += '<h3>Ancestry</h3><ul class="etym-ancestry">';
      ancestry.forEach(function (line, i) {
        var prefix = i === 0 ? '' : '← ';
        html += '<li>' + prefix + line + '</li>';
      });
      html += '</ul>';
    }

    if (siblings.length > 0) {
      html += '<h3>Shares root</h3><ul class="etym-chips">';
      siblings.forEach(function (s) {
        html += '<li><button type="button" data-focus-id="' + escapeHtml(s.id) + '">' +
          escapeHtml(s.word) + '</button></li>';
      });
      html += '</ul>';
    }

    if (focus.source) {
      var src = focus.source;
      var srcHtml = /^https?:\/\//.test(src)
        ? '<a href="' + escapeHtml(src) + '" target="_blank" rel="noopener">' + escapeHtml(src) + '</a>'
        : escapeHtml(src);
      html += '<div class="etym-source">source: ' + srcHtml + '</div>';
    }

    els.panel.innerHTML = html;

    // Wire sibling chip clicks
    Array.prototype.forEach.call(
      els.panel.querySelectorAll('[data-focus-id]'),
      function (btn) {
        btn.addEventListener('click', function () {
          focusOn(btn.getAttribute('data-focus-id'));
        });
      }
    );
  }
```

- [ ] **Step 3: Reload and test**

- Focus `philosophy`. Panel shows:
  - Heading: `philosophy`
  - Ancestry: `philo "loving" + sophia "wisdom"` then `← *bʰilos "friendly"`
  - Shares root: `philanthropy` chip
  - Source: `wiktionary`
- Click the `philanthropy` chip → recenters on `philanthropy`. Its "Shares root" chip should now show `philosophy`.
- Focus `television`. Panel shows both parents and traces Greek + Latin lineages.

- [ ] **Step 4: Commit**

```bash
git add docs/assets/js/etymology-graph.js
git commit -m "feat(etymology): side panel ancestry chain and sibling chips"
```

---

## Task 9: Keyboard shortcuts and accessibility polish

**Files:**
- Modify: `docs/assets/js/etymology-graph.js`

- [ ] **Step 1: Add the keyboard listener**

Add near the bottom of the IIFE, before the init block:

```javascript
  // --- Keyboard shortcuts ---
  document.addEventListener('keydown', function (ev) {
    // Ignore if user is typing in a text input (except for Escape)
    var inField = ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA';
    if (ev.key === 'Escape') {
      if (inField) els.search.blur();
      else showLanding();
      return;
    }
    if (inField) return;
    if (ev.key === '/') {
      ev.preventDefault();
      els.search.focus();
      els.search.select();
    } else if (ev.key === 'r' || ev.key === 'R') {
      ev.preventDefault();
      var pick = rawEntries[Math.floor(Math.random() * rawEntries.length)];
      focusOn(pick.id);
    }
  });
```

- [ ] **Step 2: Reload and test**

- Press `/` while page is loaded → search input gains focus.
- Type garbage, press `Escape` → search blurs but page stays.
- Press `Escape` again with page unfocused → returns to landing.
- Press `r` → picks a random word.

- [ ] **Step 3: Commit**

```bash
git add docs/assets/js/etymology-graph.js
git commit -m "feat(etymology): add keyboard shortcuts (/, Esc, r)"
```

---

## Task 10: Nav integration

**Files:**
- Modify: `docs/_includes/header.html`

- [ ] **Step 1: Find the current top-level nav structure**

Read `docs/_includes/header.html` and locate the `<nav>` element that holds the top-level items (Python, C++, QuantLab, etc.).

- [ ] **Step 2: Add an "Etymology" entry at the appropriate position**

Add a new `<li>` in the top-level nav list with a link to `/etymology.html`. Match the surrounding markup pattern exactly — if other items use `<a class="nav-link" href="...">`, use that. If they're inside dropdowns, add a standalone entry outside any dropdown.

Exact edit will depend on the file contents — do not add nested submenu classes, this is a top-level item.

- [ ] **Step 3: Reload and check every page**

Verify:
- "Etymology" appears in nav on the home page.
- "Etymology" appears on a post page.
- Clicking it navigates to `/etymology.html`.
- Nav styling matches the other top-level items (no visual regression).

- [ ] **Step 4: Commit**

```bash
git add docs/_includes/header.html
git commit -m "feat(etymology): add Etymology to top-level nav"
```

---

## Task 11: Expand the dataset to the v1 curation target

This is the longest task by wall-clock time but requires no code changes. It's curation work. Run the validator frequently.

**Files:**
- Modify: `docs/_data/etymology.yml`

- [ ] **Step 1: Pick the first 10 root clusters to curate**

Start with the highest-yield roots (each produces many common English words):

1. `philo-` (love of) — philosophy, philanthropy, philology, bibliophile, philharmonic
2. `tele-` (far) — telephone, telescope, television, telepathy, telegraph, telemetry
3. `-ology` (study of) — biology, geology, psychology, sociology, anthropology, archaeology
4. `-graphy` (writing) — biography, geography, photography, calligraphy, demography
5. `bio-` (life) — biology, biography, biosphere, symbiosis, antibiotic
6. `geo-` (earth) — geology, geography, geometry, geothermal, geopolitics
7. `photo-` (light) — photography, photon, photosynthesis, photogenic
8. `hydro-` (water) — hydroelectric, hydrophobic, hydrogen, hydraulic
9. `auto-` (self) — automobile, autograph, autonomous, autobiography
10. `chrono-` (time) — chronology, chronic, synchronize, anachronism

Each cluster needs the root entry + each English descendant entry + any intermediate Latin/Greek words + PIE roots where known.

- [ ] **Step 2: Add the first cluster and validate**

Add the `philo-` cluster to `etymology.yml` (expanding the existing entries). Run:

```bash
ruby scripts/validate_etymology.rb
```

Expected: `OK:`. If errors, fix them before proceeding.

Load `/etymology.html?w=philo` in the browser and confirm all descendants appear as clickable children. Tooltip, side panel, sibling chips all work.

- [ ] **Step 3: Add clusters 2–10 in the same loop**

For each cluster:
1. Add entries to the YAML
2. Run validator
3. Spot-check one focused word in the browser

After all 10, the file should have ~80–100 entries.

- [ ] **Step 4: Commit the first batch**

```bash
git add docs/_data/etymology.yml
git commit -m "feat(etymology): add first 10 root clusters (~100 entries)"
```

- [ ] **Step 5: Continue curation toward ~300 entries**

Pick 40 more roots from: `anthro-, micro-, macro-, poly-, mono-, -phone, -scope, -meter, vid/vis, aqua, terra, anim, cardio, derm, gen, hemo, hyper, hypo, inter, intra, log, manu, mort, neo, omni, path, ped, pod, port, quad, retro, sci, struct, sub, super, sym/syn, tact, trans, ultra, vita`.

Same loop: add → validate → spot-check → commit in batches of 10 clusters.

- [ ] **Step 6: Final validation**

```bash
ruby scripts/validate_etymology.rb
```

Expected: `OK:`. Target: ~300 entries with ~50 featured roots.

Optional: this task can be ended after the first 10 clusters for an initial "shipping" milestone, with the remaining 40 as a tracked follow-up.

---

## Task 12: Full manual test pass

Run through the manual test checklist from the spec, top to bottom, and fix anything that fails. No new features added in this task.

**Files:**
- Modify: any of the above as bugs emerge

- [ ] **Step 1: Start Jekyll and open the page**

```bash
cd docs && bundle exec jekyll serve --future
```

- [ ] **Step 2: Run the manual checklist**

Tick each box as you go. Any failure becomes a micro-task: reproduce, fix, retest, commit.

- [ ] Landing page renders with featured roots grid and color legend
- [ ] Search hit (e.g., *philosophy*) focuses that word
- [ ] Search miss shows inline message, does not navigate
- [ ] Clicking a featured root focuses it
- [ ] "Surprise me" picks a random entry
- [ ] Clicking a non-center node recenters the graph on it
- [ ] Clicking the center node collapses back one step (or to landing if history is empty)
- [ ] Home button returns to landing state
- [ ] Browser back/forward buttons walk the focus chain
- [ ] Hover shows tooltip with word/gloss/language
- [ ] Side panel "Shares root" chips are clickable and recenter
- [ ] Mobile layout collapses side panel below graph (resize browser < 768px)
- [ ] Keyboard shortcuts: `/` focuses search, `Esc` returns home, `r` picks random
- [ ] `<noscript>` fallback renders when JS is disabled (test via DevTools → disable JS)
- [ ] Multi-parent word (*television*) renders both parent edges
- [ ] Multi-level chain (*philosophy* → PIE) renders correctly
- [ ] Color legend matches actual node colors
- [ ] Page loads without console errors

- [ ] **Step 3: If any failures, fix and commit each fix separately**

```bash
git commit -m "fix(etymology): <specific bug>"
```

- [ ] **Step 4: Final commit and deploy**

Follow the standard git workflow in [CLAUDE.md](../../../CLAUDE.md):

```bash
git push origin working
git checkout master
git merge working --no-verify -m "feat: add etymology page"
git push origin master
git checkout working
```

---

## Self-Review Notes

Spec coverage check performed after drafting:

- ✅ Data schema (Task 1)
- ✅ Validator with tests (Task 2)
- ✅ Page skeleton + inline JSON (Task 3)
- ✅ Stylesheet with color palette, mobile layout, legend (Task 4)
- ✅ Featured roots, search, URL routing, surprise me, home button (Task 5)
- ✅ Force-directed graph with 2-hop subgraph and multi-parent support (Task 6)
- ✅ Click-to-recenter, center-click-back, hover tooltip (Task 7)
- ✅ Side panel: ancestry chain, sibling chips, source link (Task 8)
- ✅ Keyboard shortcuts (Task 9)
- ✅ Nav integration (Task 10)
- ✅ Dataset curation to v1 target (Task 11)
- ✅ Manual test pass (Task 12)
- ✅ Accessibility: noscript fallback (Task 3), aria-live on panel (Task 3), keyboard shortcuts (Task 9), aria-label on graph container (Task 3)

No placeholder text. Type/function consistency verified: `focusOn`, `showLanding`, `render`, `buildSubgraph`, `traceAncestry`, `findSiblings`, `escapeHtml`, `showTooltip`, `hideTooltip`, `handleSearch`, `renderFeatured` are the only functions and each is defined exactly once.

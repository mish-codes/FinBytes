# Benchmark Rates: LIBOR Transition — Design Spec

## Goal

Create a tabbed blog post explaining interest rate benchmarks (SONIA, EONIA/€STR, SOFR) and the LIBOR transition, plus a QuantLab Streamlit dashboard page for interactive rate comparison and position PnL calculation. The author worked on overnight PnL jobs that transitioned across these benchmarks — posts reflect real practitioner experience.

## Deliverables

### 1. Tabbed Blog Post

**File:** `docs/_posts/2026-05-04-benchmark-rates-libor-transition.html`
**Layout:** `cpp-post.html` (tabbed)
**Section:** `math-finance`
**Permalink:** `/math-finance/benchmark-rates-libor-transition/`
**Categories:** `Math / Finance`
**Tags:** `[math, finance, libor, sonia, eonia, estr, sofr, benchmark-rates, interest-rates, rfr, overnight-rates, libor-transition, quant-lab]`

#### Tab 1 — Intro

What interest rate benchmarks are, who uses them (banks, funds, corporates), the IBOR family, why a reference rate matters for pricing, discounting, and PnL. Link to the live dashboard demo.

#### Tab 2 — SONIA

Sterling Overnight Index Average. Bank of England administered. Unsecured overnight lending in GBP. Backward-looking. Daily compounding. ~£50bn daily volume. How it's calculated (trimmed volume-weighted median). Publication schedule (9am next business day).

#### Tab 3 — EONIA / €STR

EONIA history (ECB panel-bank survey). Why it was replaced. €STR (Euro Short-Term Rate) — calculated from money market statistical reporting. Fixed spread relationship: EONIA = €STR + 8.5bp during transition. ECB publication by 8am CET.

#### Tab 4 — SOFR

Secured Overnight Financing Rate. Repo-based (US Treasury). NY Fed administered. ~$1tn daily volume. Key difference from LIBOR: secured vs unsecured, backward-looking vs forward-looking. Publication by 8am ET.

#### Tab 5 — Transition

Why LIBOR died: Wheatley Review, rate-rigging scandal (2012), panel banks withdrawing, Andrew Bailey's 2017 announcement. ISDA fallback protocol. Fallback spread adjustments (5-year median). Cessation timeline: GBP LIBOR (end 2021), EUR LIBOR (end 2021), USD LIBOR (June 2023). Tough legacy contracts.

#### Tab 6 — Worked Example

One £10M pay-fixed interest rate swap. Show daily PnL calculation under:
- LIBOR 3M (forward-looking, set at start of period)
- SONIA compounded in arrears (daily compounding over the period)
- Demonstrate the fallback spread impact (SONIA + spread ≈ LIBOR equivalent)

Table with columns: date, overnight rate, daily accrual, cumulative. Summary comparing total interest under each benchmark.

#### Content Style

- Self-contained reference format (no external knowledge assumed)
- Theory → formula → worked numerical example progression
- HTML formatting: `<h2>`, `<h3>`, `<pre><code>`, `<table>`, `<p>`
- Consistent with existing math finance posts

### 2. QuantLab Dashboard Page

**File:** `dashboard/pages/40_Benchmark_Rates.py`

#### Layout

Top-level `st.tabs(["App", "Tests"])` consistent with all other pages.

Inside App tab, from top to bottom:

##### Expanders
- "How it works" — brief explanation, link to blog post
- "What the outputs mean" — explains metrics and charts

##### Position Calculator (top section)
| Field | Widget | Details |
|-------|--------|---------|
| Notional | number_input | Default £10,000,000, step 1,000,000 |
| Currency | selectbox | GBP / EUR / USD (auto-selects SONIA / €STR / SOFR) |
| Position type | radio | Pay fixed / Receive fixed (horizontal) |
| Fixed rate | number_input | Default 4.50%, step 0.25% |
| Start date | date_input | Default 3 months ago |
| End date | date_input | Default today |

**Output:** Table showing daily accrual under the selected benchmark — compounded in arrears — with columns: date, overnight rate, daily accrual, cumulative PnL. Summary metrics comparing total interest.

##### Rate Comparison (below position calculator)
| Section | Content |
|---------|---------|
| Inputs | Selectbox for rate (SONIA, €STR, SOFR, all three), period presets (1m, 3m, 6m, 1y, 2y) |
| Key Metrics | Latest rate, period average, period high/low, volatility |
| Chart 1 | Historical rate time series (overlay when "all three" selected) |
| Chart 2 | Daily rate changes / distribution histogram |

##### Tech stack footer
Outside tabs, consistent with other pages.

#### Data Sources

All free, no API key required:
- **SONIA:** Bank of England Statistical Interactive Database
- **€STR:** ECB Data Portal
- **SOFR:** NY Fed Markets Data

Caching: `@st.cache_data(ttl=3600)` — rates update daily.

**Fallback:** If an API is down, load from bundled CSV files in `dashboard/data/benchmark_rates/`.

### 3. Math Finance Index Update

**File:** `docs/_tabs/math-finance.md`

Add a new subsection "Interest Rate Benchmarks" in the "Yield Curves & Rates" group, linking to the post. Include note about live demo.

### 4. Cross-Linking

- **Blog → Dashboard:** Callout in Intro tab and Worked Example tab linking to `https://quantlabs.streamlit.app/Benchmark_Rates`
- **Dashboard → Blog:** In "How it works" expander, link to `https://mish-codes.github.io/FinBytes/math-finance/benchmark-rates-libor-transition/`

## Test Plan

- Blog post: `cd docs && bundle exec jekyll serve --future` — verify all 6 tabs render, links work
- Dashboard: AppTest smoke test (`test_benchmark_rates.py`) covering page load, title, position calculator widgets, rate selectbox, metrics
- conftest.py: Add mock for BoE/ECB/NY Fed API responses

## Dependencies

- `requests` (existing in requirements.txt) for API calls
- No new packages required

## Out of Scope

- Forward-looking term rates (e.g., Term SONIA, Term SOFR)
- Swap curve construction
- Multi-currency position netting

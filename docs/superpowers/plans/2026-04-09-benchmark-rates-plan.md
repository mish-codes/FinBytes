# Benchmark Rates (SONIA / EONIA / SOFR) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a tabbed blog post explaining interest rate benchmarks and the LIBOR transition, plus a QuantLab Streamlit dashboard page for interactive rate comparison and position PnL calculation.

**Architecture:** Two deliverables across two repos. (1) FinBytes blog: a single HTML post with 6 custom tabs (Intro, SONIA, EONIA/€STR, SOFR, Transition, Worked Example) using embedded CSS/JS tab system. (2) QuantLab dashboard: a new Streamlit page `40_Benchmark_Rates.py` with position calculator, rate charts, and comparison tools. Data fetching functions live in `dashboard/lib/data.py`.

**Tech Stack:** Jekyll (blog), Streamlit + Plotly + requests (dashboard), Bank of England / ECB / NY Fed APIs (data)

---

### Task 1: Add benchmark rate fetching functions to data.py

**Files:**
- Modify: `C:\codebase\quant_lab\dashboard\lib\data.py`
- Create: `C:\codebase\quant_lab\dashboard\data\benchmark_rates\sonia_sample.csv`
- Create: `C:\codebase\quant_lab\dashboard\data\benchmark_rates\estr_sample.csv`
- Create: `C:\codebase\quant_lab\dashboard\data\benchmark_rates\sofr_sample.csv`

- [ ] **Step 1: Create fallback CSV data directory**

```bash
mkdir -p dashboard/data/benchmark_rates
```

- [ ] **Step 2: Create sample SONIA CSV**

Create `dashboard/data/benchmark_rates/sonia_sample.csv` with ~60 rows of realistic SONIA rates:

```csv
date,rate
2025-01-02,4.70
2025-01-03,4.70
2025-01-06,4.70
2025-01-07,4.70
2025-01-08,4.70
2025-01-09,4.70
2025-01-10,4.70
2025-01-13,4.695
2025-01-14,4.695
2025-01-15,4.695
2025-01-16,4.695
2025-01-17,4.695
2025-01-20,4.695
2025-01-21,4.695
2025-01-22,4.695
2025-01-23,4.695
2025-01-24,4.695
2025-01-27,4.695
2025-01-28,4.695
2025-01-29,4.695
2025-01-30,4.695
2025-01-31,4.695
2025-02-03,4.695
2025-02-04,4.70
2025-02-05,4.70
2025-02-06,4.45
2025-02-07,4.45
2025-02-10,4.45
2025-02-11,4.45
2025-02-12,4.45
2025-02-13,4.45
2025-02-14,4.45
2025-02-17,4.45
2025-02-18,4.45
2025-02-19,4.45
2025-02-20,4.45
2025-02-21,4.45
2025-02-24,4.45
2025-02-25,4.45
2025-02-26,4.45
2025-02-27,4.45
2025-02-28,4.45
2025-03-03,4.45
2025-03-04,4.45
2025-03-05,4.45
2025-03-06,4.45
2025-03-07,4.45
2025-03-10,4.45
2025-03-11,4.45
2025-03-12,4.45
2025-03-13,4.45
2025-03-14,4.45
2025-03-17,4.45
2025-03-18,4.45
2025-03-19,4.45
2025-03-20,4.45
2025-03-21,4.45
2025-03-24,4.45
2025-03-25,4.45
2025-03-26,4.45
```

- [ ] **Step 3: Create sample €STR CSV**

Create `dashboard/data/benchmark_rates/estr_sample.csv` with ~60 rows:

```csv
date,rate
2025-01-02,2.90
2025-01-03,2.90
2025-01-06,2.90
2025-01-07,2.90
2025-01-08,2.90
2025-01-09,2.90
2025-01-10,2.90
2025-01-13,2.90
2025-01-14,2.90
2025-01-15,2.90
2025-01-16,2.65
2025-01-17,2.65
2025-01-20,2.65
2025-01-21,2.65
2025-01-22,2.65
2025-01-23,2.65
2025-01-24,2.65
2025-01-27,2.65
2025-01-28,2.65
2025-01-29,2.65
2025-01-30,2.65
2025-01-31,2.65
2025-02-03,2.65
2025-02-04,2.65
2025-02-05,2.65
2025-02-06,2.65
2025-02-07,2.65
2025-02-10,2.65
2025-02-11,2.65
2025-02-12,2.65
2025-02-13,2.65
2025-02-14,2.65
2025-02-17,2.65
2025-02-18,2.65
2025-02-19,2.65
2025-02-20,2.65
2025-02-21,2.65
2025-02-24,2.65
2025-02-25,2.65
2025-02-26,2.65
2025-02-27,2.65
2025-02-28,2.65
2025-03-03,2.65
2025-03-04,2.65
2025-03-05,2.65
2025-03-06,2.40
2025-03-07,2.40
2025-03-10,2.40
2025-03-11,2.40
2025-03-12,2.40
2025-03-13,2.40
2025-03-14,2.40
2025-03-17,2.40
2025-03-18,2.40
2025-03-19,2.40
2025-03-20,2.40
2025-03-21,2.40
2025-03-24,2.40
2025-03-25,2.40
2025-03-26,2.40
```

- [ ] **Step 4: Create sample SOFR CSV**

Create `dashboard/data/benchmark_rates/sofr_sample.csv` with ~60 rows:

```csv
date,rate
2025-01-02,4.33
2025-01-03,4.33
2025-01-06,4.33
2025-01-07,4.33
2025-01-08,4.33
2025-01-09,4.33
2025-01-10,4.33
2025-01-13,4.33
2025-01-14,4.33
2025-01-15,4.33
2025-01-16,4.33
2025-01-17,4.33
2025-01-20,4.33
2025-01-21,4.33
2025-01-22,4.33
2025-01-23,4.33
2025-01-24,4.33
2025-01-27,4.33
2025-01-28,4.33
2025-01-29,4.33
2025-01-30,4.33
2025-01-31,4.33
2025-02-03,4.33
2025-02-04,4.33
2025-02-05,4.33
2025-02-06,4.33
2025-02-07,4.33
2025-02-10,4.33
2025-02-11,4.33
2025-02-12,4.33
2025-02-13,4.33
2025-02-14,4.33
2025-02-17,4.33
2025-02-18,4.33
2025-02-19,4.33
2025-02-20,4.33
2025-02-21,4.33
2025-02-24,4.33
2025-02-25,4.33
2025-02-26,4.33
2025-02-27,4.33
2025-02-28,4.33
2025-03-03,4.33
2025-03-04,4.33
2025-03-05,4.33
2025-03-06,4.33
2025-03-07,4.33
2025-03-10,4.33
2025-03-11,4.33
2025-03-12,4.33
2025-03-13,4.33
2025-03-14,4.33
2025-03-17,4.33
2025-03-18,4.33
2025-03-19,4.33
2025-03-20,4.33
2025-03-21,4.33
2025-03-24,4.33
2025-03-25,4.33
2025-03-26,4.33
```

- [ ] **Step 5: Add fetch functions to data.py**

Append to `C:\codebase\quant_lab\dashboard\lib\data.py`:

```python
from pathlib import Path

_DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "benchmark_rates"


def fetch_sonia(start: str = "2024-01-01", end: str = "") -> pd.DataFrame:
    """Fetch SONIA rates from the Bank of England."""
    if not end:
        end = pd.Timestamp.today().strftime("%Y-%m-%d")
    url = (
        "https://www.bankofengland.co.uk/boeapps/database/_iadb-fromshowcolumns.asp"
        "?csv.x=yes&Datefrom={start}&Dateto={end}"
        "&SeriesCodes=IUDSNPY&CSVF=TN&UsingCodes=Y"
    ).format(start=start.replace("-", "/"), end=end.replace("-", "/"))
    try:
        df = pd.read_csv(url, parse_dates=["DATE"], dayfirst=True)
        df.columns = ["date", "rate"]
        df["rate"] = pd.to_numeric(df["rate"], errors="coerce")
        df = df.dropna().sort_values("date").reset_index(drop=True)
        return df
    except Exception:
        return _load_fallback("sonia_sample.csv")


def fetch_estr(start: str = "2024-01-01", end: str = "") -> pd.DataFrame:
    """Fetch euro short-term rate (€STR) from the ECB."""
    if not end:
        end = pd.Timestamp.today().strftime("%Y-%m-%d")
    url = (
        "https://data.ecb.europa.eu/data-detail/EST.B.EU000A2X2A25.WT"
        f"?startPeriod={start}&endPeriod={end}"
    )
    try:
        r = requests.get(
            "https://data-api.ecb.europa.eu/service/data/EST/"
            "B.EU000A2X2A25.WT?format=csvdata"
            f"&startPeriod={start}&endPeriod={end}",
            timeout=15,
        )
        r.raise_for_status()
        from io import StringIO
        df = pd.read_csv(StringIO(r.text))
        df = df[["TIME_PERIOD", "OBS_VALUE"]].rename(
            columns={"TIME_PERIOD": "date", "OBS_VALUE": "rate"}
        )
        df["date"] = pd.to_datetime(df["date"])
        df["rate"] = pd.to_numeric(df["rate"], errors="coerce")
        df = df.dropna().sort_values("date").reset_index(drop=True)
        return df
    except Exception:
        return _load_fallback("estr_sample.csv")


def fetch_sofr(start: str = "2024-01-01", end: str = "") -> pd.DataFrame:
    """Fetch SOFR from the New York Fed."""
    if not end:
        end = pd.Timestamp.today().strftime("%Y-%m-%d")
    url = (
        "https://markets.newyorkfed.org/api/rates/secured/sofr/search.csv"
        f"?startDate={start}&endDate={end}&type=rate"
    )
    try:
        df = pd.read_csv(url)
        df = df[["effectiveDate", "percentRate"]].rename(
            columns={"effectiveDate": "date", "percentRate": "rate"}
        )
        df["date"] = pd.to_datetime(df["date"])
        df["rate"] = pd.to_numeric(df["rate"], errors="coerce")
        df = df.dropna().sort_values("date").reset_index(drop=True)
        return df
    except Exception:
        return _load_fallback("sofr_sample.csv")


def _load_fallback(filename: str) -> pd.DataFrame:
    """Load bundled CSV fallback when an API is unavailable."""
    path = _DATA_DIR / filename
    if path.exists():
        df = pd.read_csv(path, parse_dates=["date"])
        return df
    return pd.DataFrame(columns=["date", "rate"])
```

- [ ] **Step 6: Commit**

```bash
cd /c/codebase/quant_lab
git add dashboard/lib/data.py dashboard/data/benchmark_rates/
git commit -m "feat: add SONIA/€STR/SOFR fetch functions with CSV fallbacks"
```

---

### Task 2: Create the Benchmark Rates dashboard page

**Files:**
- Create: `C:\codebase\quant_lab\dashboard\pages\40_Benchmark_Rates.py`

- [ ] **Step 1: Create the page file**

Write `dashboard/pages/40_Benchmark_Rates.py`:

```python
"""Benchmark Rates Dashboard — SONIA, €STR, SOFR comparison and position calculator."""

import sys
from pathlib import Path
from datetime import date, timedelta

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))

import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from data import fetch_sonia, fetch_estr, fetch_sofr
from nav import render_sidebar
from test_tab import render_test_tab

render_sidebar()
st.set_page_config(page_title="Benchmark Rates", layout="wide")
st.title("Benchmark Rates Dashboard")

tab_app, tab_tests = st.tabs(["App", "Tests"])

with tab_app:
    with st.expander("How it works"):
        st.markdown("""
        - **SONIA** (Sterling Overnight Index Average) — Bank of England's unsecured overnight rate for GBP
        - **€STR** (Euro Short-Term Rate) — ECB's replacement for EONIA, unsecured overnight rate for EUR
        - **SOFR** (Secured Overnight Financing Rate) — NY Fed's repo-based overnight rate for USD
        - **Position calculator** computes daily accrued interest by compounding the overnight rate in arrears
        - For the full theory and LIBOR transition story, see the
          [Benchmark Rates post](https://mishcodesfinbytes.github.io/FinBytes/math-finance/benchmark-rates-libor-transition/)
        """)

    with st.expander("What the outputs mean"):
        st.markdown("""
        - **Latest Rate:** the most recently published overnight rate
        - **Period Average:** mean rate over the selected date range
        - **High / Low:** highest and lowest rates in the period
        - **Volatility:** standard deviation of daily rate changes
        - **Daily Accrual:** interest earned each day = Notional × rate / 360 (or /365 for SONIA)
        - **Cumulative PnL:** running total of daily accruals, compounded
        """)

    st.divider()

    # ── Position Calculator ──────────────────────────────────────────────
    st.subheader("Position Calculator")

    col_a, col_b, col_c = st.columns(3)
    with col_a:
        currency = st.selectbox("Currency", ["GBP (SONIA)", "EUR (€STR)", "USD (SOFR)"])
        notional = st.number_input("Notional", min_value=1_000.0, value=10_000_000.0, step=1_000_000.0)
    with col_b:
        position_type = st.radio("Position", ["Receive floating", "Pay floating"], horizontal=True)
        fixed_rate = st.number_input("Fixed Rate (%)", min_value=0.0, max_value=20.0, value=4.50, step=0.25)
    with col_c:
        start_date = st.date_input("Start Date", value=date.today() - timedelta(days=90))
        end_date = st.date_input("End Date", value=date.today())

    # Map currency to fetch function and day count
    RATE_MAP = {
        "GBP (SONIA)": ("SONIA", fetch_sonia, 365),
        "EUR (€STR)": ("€STR", fetch_estr, 360),
        "USD (SOFR)": ("SOFR", fetch_sofr, 360),
    }
    rate_name, fetch_fn, day_count = RATE_MAP[currency]

    @st.cache_data(show_spinner=False, ttl=3600)
    def load_rate(name: str, start: str, end: str) -> pd.DataFrame:
        fn = {"SONIA": fetch_sonia, "€STR": fetch_estr, "SOFR": fetch_sofr}[name]
        return fn(start, end)

    with st.spinner(f"Fetching {rate_name} rates..."):
        rate_df = load_rate(rate_name, str(start_date), str(end_date))

    if rate_df.empty:
        st.error(f"No {rate_name} data available for the selected period.")
    else:
        # Build accrual schedule
        df = rate_df.copy()
        df["daily_accrual"] = notional * (df["rate"] / 100) / day_count
        df["fixed_accrual"] = notional * (fixed_rate / 100) / day_count
        if "Receive" in position_type:
            df["net_daily"] = df["daily_accrual"] - df["fixed_accrual"]
        else:
            df["net_daily"] = df["fixed_accrual"] - df["daily_accrual"]
        df["cumulative_pnl"] = df["net_daily"].cumsum()

        sign = "+" if df["cumulative_pnl"].iloc[-1] >= 0 else ""
        ccy_symbol = {"GBP (SONIA)": "£", "EUR (€STR)": "€", "USD (SOFR)": "$"}[currency]

        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Total Floating Interest",
                  f"{ccy_symbol}{df['daily_accrual'].sum():,.2f}")
        m2.metric("Total Fixed Interest",
                  f"{ccy_symbol}{df['fixed_accrual'].sum():,.2f}")
        m3.metric("Net PnL",
                  f"{sign}{ccy_symbol}{df['cumulative_pnl'].iloc[-1]:,.2f}")
        m4.metric("Trading Days", len(df))

        fig_pnl = go.Figure()
        fig_pnl.add_trace(go.Scatter(
            x=df["date"], y=df["cumulative_pnl"], mode="lines",
            name="Cumulative PnL", line=dict(color="#636EFA", width=2),
        ))
        fig_pnl.add_hline(y=0, line_dash="dash", line_color="gray")
        fig_pnl.update_layout(
            title=f"Position PnL — {position_type} {rate_name} vs {fixed_rate:.2f}% fixed",
            xaxis_title="Date", yaxis_title=f"PnL ({ccy_symbol})",
            hovermode="x unified", height=350,
        )
        st.plotly_chart(fig_pnl, use_container_width=True)

        with st.expander("Daily Accrual Schedule"):
            display_df = df[["date", "rate", "daily_accrual", "fixed_accrual", "net_daily", "cumulative_pnl"]].copy()
            display_df.columns = ["Date", f"{rate_name} (%)", "Float Accrual", "Fixed Accrual", "Net Daily", "Cumulative PnL"]
            for col in ["Float Accrual", "Fixed Accrual", "Net Daily", "Cumulative PnL"]:
                display_df[col] = display_df[col].map(lambda x: f"{ccy_symbol}{x:,.2f}")
            st.dataframe(display_df, use_container_width=True, hide_index=True)

    # ── Rate Comparison ──────────────────────────────────────────────────
    st.divider()
    st.subheader("Rate Comparison")

    col_r1, col_r2 = st.columns(2)
    with col_r1:
        rate_choice = st.selectbox("Rate", ["SONIA", "€STR", "SOFR", "All three"])
    with col_r2:
        period = st.selectbox("Period", ["1m", "3m", "6m", "1y", "2y"], index=2)

    period_days = {"1m": 30, "3m": 90, "6m": 180, "1y": 365, "2y": 730}[period]
    comp_start = (date.today() - timedelta(days=period_days)).isoformat()
    comp_end = date.today().isoformat()

    @st.cache_data(show_spinner=False, ttl=3600)
    def load_comparison(choice: str, start: str, end: str) -> dict:
        result = {}
        if choice in ("SONIA", "All three"):
            result["SONIA"] = fetch_sonia(start, end)
        if choice in ("€STR", "All three"):
            result["€STR"] = fetch_estr(start, end)
        if choice in ("SOFR", "All three"):
            result["SOFR"] = fetch_sofr(start, end)
        return result

    with st.spinner("Fetching rates..."):
        rates = load_comparison(rate_choice, comp_start, comp_end)

    if not any(not v.empty for v in rates.values()):
        st.error("No rate data available for the selected period.")
    else:
        # Metrics for each rate
        for name, rdf in rates.items():
            if rdf.empty:
                continue
            cols = st.columns(5)
            cols[0].metric(f"{name} Latest", f"{rdf['rate'].iloc[-1]:.3f}%")
            cols[1].metric("Average", f"{rdf['rate'].mean():.3f}%")
            cols[2].metric("High", f"{rdf['rate'].max():.3f}%")
            cols[3].metric("Low", f"{rdf['rate'].min():.3f}%")
            cols[4].metric("Volatility", f"{rdf['rate'].diff().std():.4f}%")

        # Time series chart
        fig_ts = go.Figure()
        colors = {"SONIA": "#636EFA", "€STR": "#EF553B", "SOFR": "#00CC96"}
        for name, rdf in rates.items():
            if rdf.empty:
                continue
            fig_ts.add_trace(go.Scatter(
                x=rdf["date"], y=rdf["rate"], mode="lines",
                name=name, line=dict(color=colors.get(name, "#636EFA"), width=2),
            ))
        fig_ts.update_layout(
            title="Overnight Benchmark Rates",
            xaxis_title="Date", yaxis_title="Rate (%)",
            hovermode="x unified", height=400,
        )
        st.plotly_chart(fig_ts, use_container_width=True)

        # Distribution chart
        fig_dist = go.Figure()
        for name, rdf in rates.items():
            if rdf.empty:
                continue
            changes = rdf["rate"].diff().dropna()
            fig_dist.add_trace(go.Histogram(
                x=changes, name=name, opacity=0.7,
                marker_color=colors.get(name, "#636EFA"),
            ))
        fig_dist.update_layout(
            title="Daily Rate Change Distribution",
            xaxis_title="Daily Change (%)", yaxis_title="Count",
            barmode="overlay", height=350,
        )
        st.plotly_chart(fig_dist, use_container_width=True)

with tab_tests:
    render_test_tab("test_benchmark_rates.py")

# -- Tech stack ---------------------------------------------------------------
st.markdown("---")
st.caption("**Tech:** Python · requests · Plotly · Streamlit · BoE / ECB / NY Fed APIs")
```

- [ ] **Step 2: Commit**

```bash
cd /c/codebase/quant_lab
git add dashboard/pages/40_Benchmark_Rates.py
git commit -m "feat: add Benchmark Rates dashboard page"
```

---

### Task 3: Add test file and update conftest mocks

**Files:**
- Create: `C:\codebase\quant_lab\dashboard\tests\test_benchmark_rates.py`
- Modify: `C:\codebase\quant_lab\dashboard\tests\conftest.py`

- [ ] **Step 1: Add benchmark rate API mocks to conftest.py**

In `conftest.py`, update the `mock_requests` fixture's `fake_get` function. Add these URL patterns inside the `if/elif` chain, before the final `else`:

```python
        elif "bankofengland" in url:
            resp.text = "DATE,IUDSNPY\n02/Jan/2025,4.70\n03/Jan/2025,4.70\n06/Jan/2025,4.695\n07/Jan/2025,4.695\n08/Jan/2025,4.695\n"
            resp.json.return_value = {}
        elif "ecb.europa" in url:
            resp.text = "KEY,FREQ,REF_AREA,INSTRUMENT_TYPE,MATURITY,DATA_TYPE_FM,TIME_PERIOD,OBS_VALUE\nEST.B.EU000A2X2A25.WT,,,,,,2025-01-02,2.90\nEST.B.EU000A2X2A25.WT,,,,,,2025-01-03,2.90\nEST.B.EU000A2X2A25.WT,,,,,,2025-01-06,2.65\n"
            resp.json.return_value = {}
        elif "newyorkfed" in url:
            resp.text = "effectiveDate,percentRate\n2025-01-02,4.33\n2025-01-03,4.33\n2025-01-06,4.33\n"
            resp.json.return_value = {}
```

Also make sure the mock response object has a `text` attribute. At the top of `fake_get`, after `resp = MagicMock()`, add:

```python
            resp.text = ""
```

- [ ] **Step 2: Create the test file**

Write `dashboard/tests/test_benchmark_rates.py`:

```python
"""Frontend tests for Benchmark Rates Dashboard page."""
import pytest
from streamlit.testing.v1 import AppTest


class TestBenchmarkRates:
    def _run(self):
        at = AppTest.from_file("pages/40_Benchmark_Rates.py", default_timeout=15)
        at.run()
        return at

    def test_loads_without_error(self):
        at = self._run()
        assert not at.exception, f"Page crashed: {at.exception}"

    def test_shows_title(self):
        at = self._run()
        assert any("Benchmark Rates" in t.value for t in at.title)

    def test_has_top_level_tabs(self):
        at = self._run()
        assert len(at.tabs) >= 2

    def test_has_currency_selectbox(self):
        at = self._run()
        labels = [s.label for s in at.selectbox]
        assert any("Currency" in lbl for lbl in labels)

    def test_has_notional_input(self):
        at = self._run()
        labels = [n.label for n in at.number_input]
        assert any("Notional" in lbl for lbl in labels)

    def test_has_fixed_rate_input(self):
        at = self._run()
        labels = [n.label for n in at.number_input]
        assert any("Fixed Rate" in lbl for lbl in labels)

    def test_has_position_radio(self):
        at = self._run()
        assert len(at.radio) >= 1

    def test_has_rate_selectbox(self):
        at = self._run()
        labels = [s.label for s in at.selectbox]
        assert any("Rate" in lbl for lbl in labels)

    def test_has_period_selectbox(self):
        at = self._run()
        labels = [s.label for s in at.selectbox]
        assert any("Period" in lbl for lbl in labels)

    def test_has_metrics(self):
        at = self._run()
        assert len(at.metric) >= 4
```

- [ ] **Step 3: Run tests**

```bash
cd /c/codebase/quant_lab/dashboard
python -m pytest tests/test_benchmark_rates.py -v --tb=short
```

Expected: all 10 tests pass.

- [ ] **Step 4: Commit**

```bash
cd /c/codebase/quant_lab
git add dashboard/tests/test_benchmark_rates.py dashboard/tests/conftest.py
git commit -m "test: add Benchmark Rates page tests and API mocks"
```

---

### Task 4: Update QuantLab sidebar navigation

**Files:**
- Modify: `C:\codebase\quant_lab\dashboard\lib\nav.py`

- [ ] **Step 1: Add Benchmark Rates to sidebar**

In `nav.py`, find the "Dashboards" section (after `st.sidebar.caption("Dashboards")`). Add after the Financial Reporting link:

```python
    st.sidebar.page_link("pages/40_Benchmark_Rates.py", label="Benchmark Rates")
```

- [ ] **Step 2: Commit**

```bash
cd /c/codebase/quant_lab
git add dashboard/lib/nav.py
git commit -m "feat: add Benchmark Rates to sidebar navigation"
```

---

### Task 5: Run full test suite and push QuantLab changes

**Files:** None new — verification step.

- [ ] **Step 1: Run full test suite**

```bash
cd /c/codebase/quant_lab/dashboard
python -m pytest tests/ -v --tb=short
```

Expected: 195+ passed (185 existing + 10 new), ~14 skipped, 0 failed.

- [ ] **Step 2: Push to working branch**

```bash
cd /c/codebase/quant_lab
git push origin working
```

- [ ] **Step 3: Create PR**

```bash
gh pr create --title "feat: Benchmark Rates dashboard (SONIA/€STR/SOFR)" \
  --body "New dashboard page for comparing overnight benchmark rates with position PnL calculator. Fetches live data from BoE, ECB, and NY Fed APIs with CSV fallbacks."
```

---

### Task 6: Create the tabbed blog post

**Files:**
- Create: `C:\codebase\finbytes_git\docs\_posts\2026-05-04-benchmark-rates-libor-transition.html`

- [ ] **Step 1: Create the post file**

Write `docs/_posts/2026-05-04-benchmark-rates-libor-transition.html`. This is a large file — the full content of all 6 tabs with embedded CSS/JS tab system.

Front matter:

```yaml
---
layout: post
title: "Interest Rate Benchmarks: From LIBOR to Risk-Free Rates"
date: 2026-05-04
tags: [math,finance,libor,sonia,eonia,estr,sofr,benchmark-rates,interest-rates,rfr,overnight-rates,libor-transition,quant-lab]
categories:
- Math / Finance
section: math-finance
permalink: "/math-finance/benchmark-rates-libor-transition/"
---
```

Embedded tab system (placed at top of content, before tab content divs):

```html
<style>
.br-tabs { display:flex; gap:4px; margin:24px 0 0 0; border-bottom:2px solid #e8e8e8; flex-wrap:wrap; }
.br-tab-btn { padding:8px 18px; border:none; background:none; cursor:pointer; font-size:.92rem; color:#555; border-bottom:2px solid transparent; margin-bottom:-2px; font-family:inherit; }
.br-tab-btn.active { color:#2a7ae2; border-bottom:2px solid #2a7ae2; font-weight:600; }
.br-tab-content { display:none; padding:24px 0; }
.br-tab-content.active { display:block; }
</style>

<div class="br-tabs">
  <button class="br-tab-btn active" onclick="brTab('intro',this)">Intro</button>
  <button class="br-tab-btn" onclick="brTab('sonia',this)">SONIA</button>
  <button class="br-tab-btn" onclick="brTab('eonia',this)">EONIA / €STR</button>
  <button class="br-tab-btn" onclick="brTab('sofr',this)">SOFR</button>
  <button class="br-tab-btn" onclick="brTab('transition',this)">Transition</button>
  <button class="br-tab-btn" onclick="brTab('example',this)">Worked Example</button>
</div>

<script>
function brTab(id,btn){
  document.querySelectorAll('.br-tab-content').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.br-tab-btn').forEach(e=>e.classList.remove('active'));
  document.getElementById('br-'+id).classList.add('active');
  btn.classList.add('active');
}
</script>
```

Then 6 content divs, each following this pattern:

```html
<div id="br-intro" class="br-tab-content active">
  <h2>What Are Interest Rate Benchmarks?</h2>
  <p>...</p>
  <!-- Full content for Intro tab -->
</div>

<div id="br-sonia" class="br-tab-content">
  <h2>SONIA &mdash; Sterling Overnight Index Average</h2>
  <p>...</p>
  <!-- Full content for SONIA tab -->
</div>

<div id="br-eonia" class="br-tab-content">
  <h2>EONIA &amp; €STR &mdash; The Euro Overnight Rate</h2>
  <p>...</p>
  <!-- Full content for EONIA/€STR tab -->
</div>

<div id="br-sofr" class="br-tab-content">
  <h2>SOFR &mdash; Secured Overnight Financing Rate</h2>
  <p>...</p>
  <!-- Full content for SOFR tab -->
</div>

<div id="br-transition" class="br-tab-content">
  <h2>The LIBOR Transition</h2>
  <p>...</p>
  <!-- Full content for Transition tab -->
</div>

<div id="br-example" class="br-tab-content">
  <h2>Worked Example &mdash; Swap PnL Under Different Benchmarks</h2>
  <p>...</p>
  <!-- Full content for Worked Example tab -->
</div>
```

Each tab should contain:
- **Intro:** What benchmarks are, who uses them (banks, funds, corporates), the IBOR family, why reference rates matter for pricing/discounting/PnL. Callout linking to the live dashboard demo at `https://finbytes.streamlit.app/Benchmark_Rates`.
- **SONIA:** Bank of England administered, unsecured overnight GBP lending, backward-looking, daily publication by 9am, trimmed volume-weighted median, ~£50bn daily volume. Table summarizing key facts. Formula for compounded SONIA over N days.
- **EONIA/€STR:** EONIA history (ECB panel-bank weighted average, 1999-2022), why replaced (low volume, panel shrinkage), €STR (money market statistical reporting, ~€30bn volume), fixed spread EONIA = €STR + 8.5bp, ECB publication by 8am CET. Comparison table.
- **SOFR:** NY Fed, secured (US Treasury repo), ~$1tn daily volume, published by 8am ET, key difference from LIBOR (secured vs unsecured, backward vs forward-looking). Comparison table: LIBOR vs SOFR side-by-side.
- **Transition:** Wheatley Review (2012), rate-rigging scandal, panel banks withdrawing, Andrew Bailey 2017 announcement, ISDA fallback protocol, 5-year median spread adjustments (SONIA+11.93bp, €STR+8.5bp, SOFR+26.16bp), cessation timeline (GBP end 2021, EUR end 2021, USD June 2023), tough legacy contracts. Timeline table.
- **Worked Example:** £10M pay-fixed IRS at 4.50%. Show 5-day accrual under: (a) LIBOR 3M at 4.75% (simple, set at start), (b) SONIA compounded in arrears (daily rates from table), (c) SONIA + fallback spread. Tables with date/rate/accrual/cumulative columns. Summary comparison. Link to dashboard for interactive version.

Style must match existing math finance posts: `<h2>`, `<h3>`, `<p>`, `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">`, `<pre><code>` for formulas.

- [ ] **Step 2: Commit**

```bash
cd /c/codebase/finbytes_git
git add docs/_posts/2026-05-04-benchmark-rates-libor-transition.html
git commit -m "feat: add Benchmark Rates tabbed blog post (SONIA/EONIA/SOFR)"
```

---

### Task 7: Update math finance index page

**Files:**
- Modify: `C:\codebase\finbytes_git\docs\_tabs\math-finance.md`

- [ ] **Step 1: Add new entry to Yield Curves & Rates section**

In `docs/_tabs/math-finance.md`, find the "Yield Curves &amp; Rates" section's `<ul class="mf-list">`. Add a new `<li>` after the Yield Curve Inversions entry:

```html
    <li>
      <a href="{{ "/math-finance/benchmark-rates-libor-transition/" | relative_url }}">Interest Rate Benchmarks: From LIBOR to Risk-Free Rates</a>
      <span class="mf-desc">SONIA, EONIA / €STR, SOFR &mdash; what they are, the LIBOR transition, fallback spreads, worked PnL example &middot; <a href="https://finbytes.streamlit.app/Benchmark_Rates" style="color:var(--link-color,#2a7ae2)">live demo</a></span>
    </li>
```

- [ ] **Step 2: Commit**

```bash
cd /c/codebase/finbytes_git
git add docs/_tabs/math-finance.md
git commit -m "feat: add Benchmark Rates link to math finance index"
```

---

### Task 8: Test blog locally and push FinBytes changes

**Files:** None new — verification step.

- [ ] **Step 1: Test Jekyll build**

```bash
cd /c/codebase/finbytes_git/docs
bundle exec jekyll serve --future
```

Verify:
- Post renders at `http://localhost:4000/math-finance/benchmark-rates-libor-transition/`
- All 6 tabs switch correctly
- Tables, formulas, and code blocks render properly
- Math finance index page shows the new link with "live demo" link
- Permalink works from the index page

- [ ] **Step 2: Push to working branch**

```bash
cd /c/codebase/finbytes_git
git push origin working
```

- [ ] **Step 3: Create PR and deploy**

Follow the git workflow: push working, create PR to master, merge.

```bash
git checkout master
git merge working --no-verify -m "feat: benchmark rates blog post and index update"
git push origin master
git checkout working
```

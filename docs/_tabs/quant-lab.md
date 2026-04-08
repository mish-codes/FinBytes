---
layout: page
title: Quant Lab
icon: fas fa-flask
order: 1
permalink: /quant-lab/
---

<style>
.ql-list { list-style:none; margin:0; padding:0; }
.ql-list li { padding:0.6rem 0; border-bottom:1px solid var(--border-color, #f4f4f4); }
.ql-list li:last-child { border-bottom:none; }
.ql-list a { font-size:0.95rem; color:var(--text-color, #333); text-decoration:none; font-weight:600; }
.ql-list a:hover { color:var(--link-color, #2a7ae2); text-decoration:underline; }
.ql-desc { display:block; font-size:0.82rem; color:var(--text-muted-color, #999); margin-top:0.15rem; }
.ql-badges { display:inline-flex; gap:0.3em; margin-left:0.5em; vertical-align:middle; }
.ql-badge { font-size:0.65rem; font-weight:600; padding:1px 6px; border-radius:3px; }
.ql-badge-capstone { background:#2a7ae2; color:#fff; }
.ql-badge-mini { background:var(--badge-bg, rgba(100,100,100,0.15)); color:var(--text-muted-color, #888); }
.ql-badge-calc { background:rgba(46,160,67,0.15); color:#2ea043; }
.ql-badge-dash { background:rgba(42,122,226,0.15); color:#2a7ae2; }
.ql-badge-ml { background:rgba(163,113,247,0.15); color:#a371f7; }
.ql-tech { display:block; font-size:0.72rem; color:var(--text-muted-color, #aaa); margin-top:0.2rem; }
</style>

<p style="color:var(--text-muted-color, #666); margin-bottom:2rem;">A collection of finance and data science projects &mdash; from calculators and live dashboards to ML models and trading backtests. Each project has a concept breakdown, copy-pasteable code, and an interactive demo.</p>

<ul class="ql-list">
  <li>
    <a href="{{ "/quant-lab/stock-risk-scanner/" | relative_url }}">Stock Risk Scanner</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-capstone">Capstone</span></span>
    <span class="ql-desc">Full-stack portfolio risk analysis — FastAPI, PostgreSQL, Docker, Claude AI, Streamlit dashboard</span>
    <span class="ql-tech">Python &middot; FastAPI &middot; PostgreSQL &middot; Docker &middot; Claude API &middot; Streamlit</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/credit-card-calculator/" | relative_url }}">Credit Card Calculator</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-calc">Calculator</span></span>
    <span class="ql-desc">Payoff schedule, total interest, two calculation modes</span>
    <span class="ql-tech">Python &middot; NumPy &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/loan-amortization/" | relative_url }}">Loan Amortization</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-calc">Calculator</span></span>
    <span class="ql-desc">PMT formula, principal vs interest breakdown, full schedule</span>
    <span class="ql-tech">Python &middot; NumPy &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/loan-comparison/" | relative_url }}">Loan Comparison</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-calc">Calculator</span></span>
    <span class="ql-desc">Side-by-side loan analysis, rate sensitivity</span>
    <span class="ql-tech">Python &middot; NumPy &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/retirement-calculator/" | relative_url }}">Retirement Calculator</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-calc">Calculator</span></span>
    <span class="ql-desc">Compound growth projection with Monte Carlo simulation</span>
    <span class="ql-tech">Python &middot; NumPy &middot; Plotly &middot; Monte Carlo</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/investment-planner/" | relative_url }}">Investment Planner</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-calc">Calculator</span></span>
    <span class="ql-desc">Compound growth with contributions, what-if scenarios</span>
    <span class="ql-tech">Python &middot; NumPy &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/budget-tracker/" | relative_url }}">Budget Tracker</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-calc">Calculator</span></span>
    <span class="ql-desc">Income vs expenses, spending breakdown, surplus/deficit</span>
    <span class="ql-tech">Python &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/currency-dashboard/" | relative_url }}">Currency Dashboard</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-dash">Dashboard</span></span>
    <span class="ql-desc">Live exchange rates, currency converter, rate comparison</span>
    <span class="ql-tech">Python &middot; Exchange Rate API &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/stock-tracker/" | relative_url }}">Stock Tracker</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-dash">Dashboard</span></span>
    <span class="ql-desc">Candlestick charts, volume, 52-week range</span>
    <span class="ql-tech">Python &middot; yfinance &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/stock-analysis/" | relative_url }}">Stock Analysis</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-dash">Dashboard</span></span>
    <span class="ql-desc">SMA, EMA, RSI, MACD, Bollinger Bands — toggle each indicator</span>
    <span class="ql-tech">Python &middot; yfinance &middot; Plotly &middot; Technical Analysis</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/crypto-portfolio/" | relative_url }}">Crypto Portfolio</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-dash">Dashboard</span></span>
    <span class="ql-desc">Live crypto valuation, allocation pie, 24h change</span>
    <span class="ql-tech">Python &middot; CoinGecko API &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/personal-finance/" | relative_url }}">Personal Finance</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-dash">Dashboard</span></span>
    <span class="ql-desc">Net worth, savings rate, debt-to-income ratio</span>
    <span class="ql-tech">Python &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/esg-tracker/" | relative_url }}">ESG Tracker</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-dash">Dashboard</span></span>
    <span class="ql-desc">ESG score comparison, radar chart, sector averages</span>
    <span class="ql-tech">Python &middot; yfinance &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/financial-reporting/" | relative_url }}">Financial Reporting</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-dash">Dashboard</span></span>
    <span class="ql-desc">Auto-generated stats, charts, CSV export</span>
    <span class="ql-tech">Python &middot; yfinance &middot; Plotly &middot; pandas</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/var-cvar/" | relative_url }}">VaR &amp; CVaR</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">Historical and parametric Value at Risk, Conditional VaR</span>
    <span class="ql-tech">Python &middot; NumPy &middot; SciPy &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/time-series/" | relative_url }}">Time Series</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">Trend/seasonal/residual decomposition, ACF</span>
    <span class="ql-tech">Python &middot; statsmodels &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/sentiment-analysis/" | relative_url }}">Sentiment Analysis</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">VADER and TextBlob on financial headlines</span>
    <span class="ql-tech">Python &middot; VADER &middot; TextBlob &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/anomaly-detection/" | relative_url }}">Anomaly Detection</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">Z-score and Isolation Forest on stock returns</span>
    <span class="ql-tech">Python &middot; scikit-learn &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/loan-default/" | relative_url }}">Loan Default Prediction</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">Logistic Regression / Random Forest classification</span>
    <span class="ql-tech">Python &middot; scikit-learn &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/clustering/" | relative_url }}">Customer Clustering</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">K-Means / DBSCAN segmentation with editable data</span>
    <span class="ql-tech">Python &middot; scikit-learn &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/portfolio-optimization/" | relative_url }}">Portfolio Optimization</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">Efficient frontier, max Sharpe, min volatility portfolios</span>
    <span class="ql-tech">Python &middot; SciPy &middot; yfinance &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/algo-trading/" | relative_url }}">Algo Trading Backtest</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">SMA crossover and momentum strategies with equity curve</span>
    <span class="ql-tech">Python &middot; yfinance &middot; Plotly &middot; pandas</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/stock-prediction/" | relative_url }}">Stock Prediction</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">Feature engineering + regression for price forecasting</span>
    <span class="ql-tech">Python &middot; scikit-learn &middot; yfinance &middot; Plotly</span>
  </li>

  <li>
    <a href="{{ "/quant-lab/market-insights/" | relative_url }}">Market Insights</a>
    <span class="ql-badges"><span class="ql-badge ql-badge-mini">Mini Project</span><span class="ql-badge ql-badge-ml">ML &amp; Quant</span></span>
    <span class="ql-desc">Sentiment-price correlation dashboard</span>
    <span class="ql-tech">Python &middot; VADER &middot; yfinance &middot; Plotly</span>
  </li>
</ul>

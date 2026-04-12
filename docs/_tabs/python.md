---
layout: page
title: Python
icon: fab fa-python
order: 2
permalink: /python/
---

<style>
.py-lede { color:var(--text-muted-color, #666); font-size:.95rem; margin-bottom:2.5rem; max-width:580px; line-height:1.7; }
.py-section { margin-bottom:2.5rem; }
.py-section-hdr {
  font-size:.72rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted-color, #999);
  margin-bottom:.6rem; padding-bottom:.5rem; border-bottom:1px solid var(--border-color, #ebebeb);
}
.py-list { list-style:none; margin:0; padding:0; }
.py-list li { padding:.5rem 0; border-bottom:1px solid var(--border-color, #f4f4f4); }
.py-list li:last-child { border-bottom:none; }
.py-list a { font-size:.93rem; color:var(--text-color, #333); text-decoration:none; font-weight:600; }
.py-list a:hover { color:var(--link-color, #2a7ae2); text-decoration:underline; }
.py-desc { display:block; font-size:.82rem; color:var(--text-muted-color, #999); margin-top:.15rem; }
</style>

<p class="py-lede">Python references and guides &mdash; testing, patterns, tools, and the QuantLab exercise blog posts.</p>

<div class="py-section">
  <div class="py-section-hdr">Python References</div>
  <ul class="py-list">
    <li>
      <a href="{{ "/python/decorators/" | relative_url }}">Decorators</a>
      <span class="py-desc">Patterns you'll actually use &mdash; timer, retry, cache, validation, stacking</span>
    </li>
    <li>
      <a href="{{ "/python/big-o/" | relative_url }}">Big O Notation</a>
      <span class="py-desc">Complexity table, Python data structure operations, common mistakes</span>
    </li>
    <li>
      <a href="{{ "/python/py36-to-311/" | relative_url }}">Python 3.6 &rarr; 3.11 Migration</a>
      <span class="py-desc">What breaks and how to fix it &mdash; type hints, dates, pattern matching, async</span>
    </li>
  </ul>
</div>

<div class="py-section">
  <div class="py-section-hdr">Testing &mdash; pytest</div>
  <ul class="py-list">
    <li>
      <a href="{{ "/python/pytest-mocking/" | relative_url }}">Mocking &amp; Monkeypatch</a>
      <span class="py-desc">monkeypatch vs mock.patch, patch-where-used rule, AsyncMock, edge cases</span>
    </li>
    <li>
      <a href="{{ "/python/testing-side-effects/" | relative_url }}">Testing Side Effects</a>
      <span class="py-desc">Files, emails, HTTP APIs, databases &mdash; tmp_path, mock_open, moto, fakeredis</span>
    </li>
    <li>
      <a href="{{ "/python/pytest-fixtures-ci/" | relative_url }}">Fixtures &amp; CI Gotchas</a>
      <span class="py-desc">Scope levels, conftest, parametrize, 6 CI failure modes, pyproject.toml</span>
    </li>
  </ul>
</div>

<div class="py-section">
  <div class="py-section-hdr">QuantLab Exercises</div>
  <ul class="py-list">
    <li>
      <a href="{{ "/python/pytest-tdd-financial-python/" | relative_url }}">TDD with pytest</a>
      <span class="py-desc">Exercise 01 &mdash; red-green-refactor, daily returns, max drawdown</span>
    </li>
    <li>
      <a href="{{ "/python/pydantic-models-trading-data/" | relative_url }}">Pydantic v2 Models</a>
      <span class="py-desc">Exercise 02 &mdash; field validators, computed fields, trading data contracts</span>
    </li>
    <li>
      <a href="{{ "/python/fastapi-your-first-financial-api/" | relative_url }}">FastAPI</a>
      <span class="py-desc">Exercise 03 &mdash; routes, status codes, TestClient, OpenAPI docs</span>
    </li>
    <li>
      <a href="{{ "/python/async-python-for-market-data/" | relative_url }}">Async Python</a>
      <span class="py-desc">Exercise 04 &mdash; asyncio, aiohttp, gather, concurrent price fetching</span>
    </li>
    <li>
      <a href="{{ "/python/yfinance-fetching-market-data/" | relative_url }}">yfinance</a>
      <span class="py-desc">Exercise 05 &mdash; fetching prices, pandas wrangling, data quality</span>
    </li>
    <li>
      <a href="{{ "/python/claude-api-ai-risk-analysis/" | relative_url }}">Claude API</a>
      <span class="py-desc">Exercise 06 &mdash; AI-powered risk narratives, graceful degradation</span>
    </li>
    <li>
      <a href="{{ "/python/postgresql-sqlalchemy-async/" | relative_url }}">PostgreSQL &amp; SQLAlchemy</a>
      <span class="py-desc">Exercise 08 &mdash; async ORM, Alembic migrations, testing with SQLite</span>
    </li>
  </ul>
</div>

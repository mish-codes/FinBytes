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
  <div class="py-section-hdr">QuantLab Exercise Posts</div>
  <ul class="py-list">
    <li>
      <a href="{{ "/2026/04/01/pytest-tdd-financial-python/" | relative_url }}">TDD with pytest</a>
      <span class="py-desc">Exercise 01 &mdash; red-green-refactor, daily returns, max drawdown</span>
    </li>
    <li>
      <a href="{{ "/2026/04/02/pydantic-models-for-trading-data/" | relative_url }}">Pydantic v2 Models</a>
      <span class="py-desc">Exercise 02 &mdash; field validators, computed fields, trading data contracts</span>
    </li>
    <li>
      <a href="{{ "/2026/04/02/fastapi-your-first-financial-api/" | relative_url }}">FastAPI</a>
      <span class="py-desc">Exercise 03 &mdash; routes, status codes, TestClient, OpenAPI docs</span>
    </li>
    <li>
      <a href="{{ "/2026/04/02/async-python-for-market-data/" | relative_url }}">Async Python</a>
      <span class="py-desc">Exercise 04 &mdash; asyncio, aiohttp, gather, concurrent price fetching</span>
    </li>
    <li>
      <a href="{{ "/2026/04/02/yfinance-fetching-market-data/" | relative_url }}">yfinance</a>
      <span class="py-desc">Exercise 05 &mdash; fetching prices, pandas wrangling, data quality</span>
    </li>
    <li>
      <a href="{{ "/2026/04/02/claude-api-ai-risk-analysis/" | relative_url }}">Claude API</a>
      <span class="py-desc">Exercise 06 &mdash; AI-powered risk narratives, graceful degradation</span>
    </li>
    <li>
      <a href="{{ "/2026/04/02/docker-for-python-services/" | relative_url }}">Docker</a>
      <span class="py-desc">Exercise 07 &mdash; multi-stage builds, compose, .dockerignore</span>
    </li>
    <li>
      <a href="{{ "/2026/04/02/postgresql-sqlalchemy-async/" | relative_url }}">PostgreSQL &amp; SQLAlchemy</a>
      <span class="py-desc">Exercise 08 &mdash; async ORM, Alembic migrations, testing with SQLite</span>
    </li>
  </ul>
</div>

<div class="py-section">
  <div class="py-section-hdr">QuantLab Phase 2 — AWS &amp; Bond/Credit Risk (Ex 09–20)</div>
  <ul class="py-list">
    <li>
      <a href="{{ "/2026/04/04/aws-fundamentals-treasury-data/" | relative_url }}">AWS Fundamentals &amp; Treasury Data</a>
      <span class="py-desc">Exercise 09 &mdash; FRED API, IAM, S3 bucket, yield curve classification</span>
    </li>
    <li>
      <a href="{{ "/2026/04/05/s3-par-curve-ingestion/" | relative_url }}">S3 Par Curve Ingestion</a>
      <span class="py-desc">Exercise 10 &mdash; boto3, moto mocks, versioned S3 storage</span>
    </li>
    <li>
      <a href="{{ "/2026/04/06/rds-postgresql-yield-schema/" | relative_url }}">RDS PostgreSQL &amp; Yield Schema</a>
      <span class="py-desc">Exercise 11 &mdash; Alembic migrations, seed from S3, 6-table schema</span>
    </li>
    <li>
      <a href="{{ "/2026/04/07/lambda-spot-curve-bootstrapping/" | relative_url }}">Lambda &amp; Spot Curve Bootstrapping</a>
      <span class="py-desc">Exercise 12 &mdash; Lambda handler, API Gateway REST, 14 tests</span>
    </li>
    <li>
      <a href="{{ "/2026/04/08/cicd-forward-rate-curve/" | relative_url }}">CI/CD &amp; Forward Rate Curve</a>
      <span class="py-desc">Exercise 13 &mdash; GitHub Actions, OIDC, forward rates</span>
    </li>
    <li>
      <a href="{{ "/2026/04/09/terraform-nelson-siegel/" | relative_url }}">Terraform &amp; Nelson-Siegel</a>
      <span class="py-desc">Exercise 14 &mdash; IaC, scipy on Lambda, deployment friction log</span>
    </li>
    <li>
      <a href="{{ "/2026/04/10/sqs-sns-credit-spreads/" | relative_url }}">SQS/SNS &amp; Credit Spreads</a>
      <span class="py-desc">Exercise 15 &mdash; credit spreads, CDS, hazard rates, async messaging</span>
    </li>
    <li>
      <a href="{{ "/2026/04/11/websockets-realtime-spreads/" | relative_url }}">WebSockets &amp; Real-Time Spreads</a>
      <span class="py-desc">Exercise 16 &mdash; API Gateway WS, DynamoDB connections, fan-out</span>
    </li>
    <li>
      <a href="{{ "/2026/04/12/elasticache-bond-caching/" | relative_url }}">ElastiCache &amp; Bond Caching</a>
      <span class="py-desc">Exercise 17 &mdash; Redis cache-aside, TTL strategy, graceful degradation</span>
    </li>
    <li>
      <a href="{{ "/2026/04/13/terraform-advanced-default-probs/" | relative_url }}">Terraform Advanced &amp; Default Probabilities</a>
      <span class="py-desc">Exercise 18 &mdash; piecewise hazard rates, survival curves, modules</span>
    </li>
    <li>
      <a href="{{ "/2026/04/14/cloudwatch-oas-zspreads/" | relative_url }}">CloudWatch &amp; OAS/Z-Spread</a>
      <span class="py-desc">Exercise 19 &mdash; binomial trees, backward induction, callable bonds</span>
    </li>
    <li>
      <a href="{{ "/2026/04/15/integration-testing-credit-var/" | relative_url }}">Integration Testing &amp; Credit VaR</a>
      <span class="py-desc">Exercise 20 &mdash; Monte Carlo, Cholesky, spread duration, portfolio risk</span>
    </li>
  </ul>
</div>

<div class="py-section">
  <div class="py-section-hdr">Explainers &amp; Architecture</div>
  <ul class="py-list">
    <li>
      <a href="{{ "/2026/04/03/quantlab-phase1-explained/" | relative_url }}">Phase 1 Explained</a>
      <span class="py-desc">Every technology and concept from exercises 01&ndash;08, explained from scratch</span>
    </li>
    <li>
      <a href="{{ "/2026/04/16/quantlab-phase2-explained/" | relative_url }}">Phase 2 Explained</a>
      <span class="py-desc">Every AWS service and finance formula from exercises 09&ndash;20</span>
    </li>
    <li>
      <a href="{{ "/2026/04/03/stock-risk-scanner-architecture/" | relative_url }}">Stock Risk Scanner &mdash; Architecture Deep Dive</a>
      <span class="py-desc">Request flow, module breakdown, deployment, async patterns</span>
    </li>
  </ul>
</div>

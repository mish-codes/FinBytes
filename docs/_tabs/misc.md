---
layout: page
title: Misc
icon: fas fa-toolbox
order: 5
permalink: /misc/
---

<style>
.misc-lede { color:var(--text-muted-color, #666); font-size:.95rem; margin-bottom:2.5rem; max-width:580px; line-height:1.7; }
.misc-section { margin-bottom:2.5rem; }
.misc-hdr { font-size:.72rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted-color, #999); margin-bottom:.6rem; padding-bottom:.5rem; border-bottom:1px solid var(--border-color, #ebebeb); display:flex; align-items:baseline; gap:.75rem; }
.misc-hdr .sub { font-weight:400; font-size:.7rem; color:var(--text-muted-color, #bbb); letter-spacing:0; text-transform:none; }
.misc-list { list-style:none; margin:0; padding:0; }
.misc-list li { padding:.5rem 0; border-bottom:1px solid var(--border-color, #f4f4f4); }
.misc-list li:last-child { border-bottom:none; }
.misc-list a { font-size:.93rem; color:var(--text-color, #333); text-decoration:none; line-height:1.4; }
.misc-list a:hover { color:var(--link-color, #2a7ae2); text-decoration:underline; }
.misc-desc { display:block; font-size:.82rem; color:var(--text-muted-color, #999); margin-top:.2rem; }
</style>

<p class="misc-lede">Infrastructure, tooling, and systems. Practical references with code examples you can copy-paste.</p>

<div class="misc-section" id="tech-references">
  <div class="misc-hdr">Technology references <span class="sub">from the QuantLab project</span></div>
  <ul class="misc-list">
    <li>
      <a href="{{ "/misc/aws-services/" | relative_url }}">AWS Services</a>
      <span class="misc-desc">S3, Lambda, API Gateway, RDS, DynamoDB, SQS, SNS, ElastiCache, CloudWatch</span>
    </li>
    <li>
      <a href="{{ "/misc/terraform/" | relative_url }}">Terraform</a>
      <span class="misc-desc">Infrastructure as Code &mdash; init, plan, apply, state, modules</span>
    </li>
    <li>
      <a href="{{ "/misc/fastapi/" | relative_url }}">FastAPI</a>
      <span class="misc-desc">Async APIs, Pydantic models, uvicorn/gunicorn stack</span>
    </li>
    <li>
      <a href="{{ "/misc/postgresql-sqlalchemy/" | relative_url }}">PostgreSQL &amp; SQLAlchemy</a>
      <span class="misc-desc">Async ORM, Alembic migrations, Docker Compose, RDS</span>
    </li>
    <li>
      <a href="{{ "/misc/streamlit/" | relative_url }}">Streamlit</a>
      <span class="misc-desc">Python-only dashboards, secrets, multi-page apps</span>
    </li>
    <li>
      <a href="{{ "/misc/github-actions/" | relative_url }}">GitHub Actions &amp; CI/CD</a>
      <span class="misc-desc">Workflows, OIDC, monorepo patterns</span>
    </li>
  </ul>
</div>

<div class="misc-section" id="redis">
  <div class="misc-hdr">Infrastructure <span class="sub">caching, queues, containers</span></div>
  <ul class="misc-list">
    <li>
      <a href="{{ "/misc/redis-caching/" | relative_url }}">Redis &amp; Caching</a>
      <span class="misc-desc">Data types, cache-aside pattern, TTL, LRU, pub/sub, connection pooling</span>
    </li>
    <li>
      <a href="{{ "/misc/message-queues/" | relative_url }}">Message Queues &amp; RabbitMQ</a>
      <span class="misc-desc">Exchanges, routing, pika, DLQ, RabbitMQ vs Redis vs SQS</span>
    </li>
    <li>
      <a href="{{ "/misc/docker-cicd/" | relative_url }}">Docker &amp; CI/CD</a>
      <span class="misc-desc">Multi-stage builds, docker-compose, GitHub Actions, Kubernetes basics</span>
    </li>
  </ul>
</div>

<div class="misc-section" id="tools">
  <div class="misc-hdr">Tools <span class="sub">CLI, version control</span></div>
  <ul class="misc-list">
    <li>
      <a href="{{ "/misc/argparse-cli/" | relative_url }}">argparse &amp; CLI Tools</a>
      <span class="misc-desc">Arguments, flags, subcommands, the type=bool trap, click/typer</span>
    </li>
    <li>
      <a href="{{ "/misc/git-workflow/" | relative_url }}">Git Workflow</a>
      <span class="misc-desc">Branching, PRs, protected master, merge conflicts, commit conventions</span>
    </li>
  </ul>
</div>

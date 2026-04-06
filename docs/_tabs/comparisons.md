---
layout: page
title: Comparisons
icon: fas fa-exchange-alt
order: 4
permalink: /comparisons/
---

<style>
.cmp-lede { color:var(--text-muted-color, #666); font-size:.95rem; margin-bottom:2.5rem; max-width:620px; line-height:1.7; }
.cmp-list { list-style:none; margin:0; padding:0; }
.cmp-list li { padding:.6rem 0; border-bottom:1px solid var(--border-color, #f4f4f4); }
.cmp-list li:last-child { border-bottom:none; }
.cmp-list a { font-size:.95rem; color:var(--text-color, #333); text-decoration:none; font-weight:600; }
.cmp-list a:hover { color:var(--link-color, #2a7ae2); text-decoration:underline; }
.cmp-desc { display:block; font-size:.82rem; color:var(--text-muted-color, #999); margin-top:.2rem; }
</style>

<p class="cmp-lede">The same task, implemented in multiple languages and libraries. Side-by-side code, comparison tables, and "when to use what" decision guides.</p>

<ul class="cmp-list">
  <li>
    <a href="{{ "/comparisons/pandas-vs-polars/" | relative_url }}">pandas vs polars</a>
    <span class="cmp-desc">Load, filter, group-by, join &mdash; eager vs lazy, memory, speed, API philosophy</span>
  </li>
  <li>
    <a href="{{ "/comparisons/concurrency-models/" | relative_url }}">Concurrency Models</a>
    <span class="cmp-desc">asyncio vs goroutines vs tokio vs threads &mdash; the GIL, I/O-bound vs CPU-bound</span>
  </li>
  <li>
    <a href="{{ "/comparisons/type-systems-validation/" | relative_url }}">Type Systems &amp; Validation</a>
    <span class="cmp-desc">Pydantic vs Zod vs serde &mdash; compile-time vs runtime, error messages, schema generation</span>
  </li>
  <li>
    <a href="{{ "/comparisons/http-clients/" | relative_url }}">HTTP Clients</a>
    <span class="cmp-desc">requests vs reqwest vs fetch vs net/http &mdash; sync, async, timeouts, testing</span>
  </li>
</ul>

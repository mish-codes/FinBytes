---
layout: page
title: Design & Reliability
icon: fas fa-shield-alt
order: 3
permalink: /design/
---

<style>
.cpp-lede { color:var(--text-muted-color, #666); font-size:.95rem; margin-bottom:2.5rem; max-width:580px; line-height:1.7; }
.cpp-section { margin-bottom:2.5rem; }
.cpp-section-hdr {
  display:flex; align-items:baseline; gap:.75rem;
  font-size:.72rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted-color, #999);
  margin-bottom:.6rem; padding-bottom:.5rem; border-bottom:1px solid var(--border-color, #ebebeb);
}
.cpp-section-hdr .sub { font-weight:400; font-size:.7rem; color:var(--text-muted-color, #bbb); letter-spacing:0; text-transform:none; }
.cpp-list { list-style:none; margin:0; padding:0; }
.cpp-list li { display:flex; align-items:baseline; gap:1rem; padding:.4rem 0; border-bottom:1px solid var(--border-color, #f4f4f4); }
.cpp-list li:last-child { border-bottom:none; }
.cpp-date { font-size:.78rem; color:var(--text-muted-color, #ccc); white-space:nowrap; min-width:72px; }
.cpp-list a { font-size:.93rem; color:var(--text-color, #333); text-decoration:none; line-height:1.4; }
.cpp-list a:hover { color:var(--link-color, #2a7ae2); text-decoration:underline; }
.cpp-badge { font-size:.68rem; padding:1px 5px; border-radius:3px; margin-left:6px; background:var(--badge-bg, #f0fdf4); color:var(--badge-color, #27500A); white-space:nowrap; flex-shrink:0; }
</style>

<p class="cpp-lede">Design patterns, defensive engineering, and system reliability &mdash; with implementations in Python, C#, C++, Rust, Go, and TypeScript.</p>

{% assign all_cpp = site.cpp | sort: "date" %}

<div class="cpp-section" id="series-h">
  <div class="cpp-section-hdr">Design patterns <span class="sub">8 posts &middot; Nov 2025&ndash;Jan 2026</span></div>
  <ul class="cpp-list">
    {% for p in all_cpp %}
      {% assign pd = p.date | date: "%Y-%m-%d" %}
      {% if pd >= "2025-11-19" and pd <= "2026-01-14" %}
        <li>
          <span class="cpp-date">{{ p.date | date: "%-d %b %Y" }}</span>
          <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
        </li>
      {% endif %}
    {% endfor %}
  </ul>
</div>

<div class="cpp-section" id="series-i">
  <div class="cpp-section-hdr">Defensive engineering <span class="sub">9 posts &middot; Jan&ndash;Mar 2026</span></div>
  <ul class="cpp-list">
    {% for p in all_cpp %}
      {% assign pd = p.date | date: "%Y-%m-%d" %}
      {% if pd >= "2026-01-21" and pd <= "2026-03-18" %}
        <li>
          <span class="cpp-date">{{ p.date | date: "%-d %b %Y" }}</span>
          <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
        </li>
      {% endif %}
    {% endfor %}
  </ul>
</div>

<div class="cpp-section" id="series-j">
  <div class="cpp-section-hdr">Queues &amp; reliability <span class="sub">9 posts &middot; Mar&ndash;May 2026</span></div>
  <ul class="cpp-list">
    {% for p in all_cpp %}
      {% assign pd = p.date | date: "%Y-%m-%d" %}
      {% if pd >= "2026-03-25" and pd <= "2026-05-20" %}
        <li>
          <span class="cpp-date">{{ p.date | date: "%-d %b %Y" }}</span>
          <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
          {% if p.tags contains "example" %}<span class="cpp-badge">example</span>{% endif %}
        </li>
      {% endif %}
    {% endfor %}
  </ul>
</div>

<div class="cpp-section" id="series-k">
  <div class="cpp-section-hdr">Data structures <span class="sub">6 posts &middot; Jul&ndash;Aug 2026</span></div>
  <ul class="cpp-list">
    {% for p in all_cpp %}
      {% assign pd = p.date | date: "%Y-%m-%d" %}
      {% if pd >= "2026-07-10" and pd <= "2026-08-14" %}
        {% if p.tags contains "data-structures" %}
        <li>
          <span class="cpp-date">{{ p.date | date: "%-d %b %Y" }}</span>
          <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
        </li>
        {% endif %}
      {% endif %}
    {% endfor %}
  </ul>
</div>

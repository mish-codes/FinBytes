# Python Reference Posts — Design Spec

**Date:** 2026-04-21
**Status:** Approved

---

## Goal

16 private reference posts covering core Python concepts. Each is written in interview-answer prose — direct, accurate, the level and order you'd speak it — plus one focused code example. Not public blog posts; accessible only by direct URL.

---

## Location

`_private/` collection (already exists in `_config.yml`).  
Permalinks: `/private/python-<slug>/`  
Not indexed, not in nav, not in any feed.

---

## Front Matter per Post

```yaml
---
layout: post
title: "Python: <Topic>"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-<slug>/
---
```

---

## Content Structure per Post

1. **One-liner** — a single sentence defining the concept (no heading, just the opening line).
2. **Interview-answer prose** — 3–5 short paragraphs in the order you'd speak it: what it is → how it works → why it matters / when it's relevant.
3. **Code block** — one focused snippet illustrating the concept. Minimal, no scaffolding.
4. **"Watch out" line** — one sentence on the most common gotcha, if one exists. Omitted if not applicable.

No subheadings within posts. Length: ~300–500 words prose + code block.

---

## Posts (16 total)

| Slug | Title |
|---|---|
| `python-mro` | Python: MRO and how super() resolves |
| `python-gil` | Python: The GIL and concurrency tradeoffs |
| `python-descriptors` | Python: Descriptors — data, non-data, and what they power |
| `python-data-model` | Python: Data model dunders |
| `python-attribute-lookup` | Python: Attribute lookup order end-to-end |
| `python-scoping` | Python: Name binding and scoping |
| `python-asyncio` | Python: The asyncio execution model |
| `python-generators` | Python: Generator and iterator protocol |
| `python-context-managers` | Python: Context managers and the with protocol |
| `python-gc` | Python: Reference counting and the cyclic garbage collector |
| `python-slots` | Python: __slots__ — what it does and when it matters |
| `python-metaclasses` | Python: Metaclasses |
| `python-import-system` | Python: The import system and module resolution |
| `python-dataclasses` | Python: Dataclasses vs attrs vs plain classes |
| `python-type-system` | Python: Type system basics — Protocol, TypeVar, Generic |
| `python-footguns` | Python: Common footguns |

---

## What's Out of Scope

- No public linking from the Python tab (these are private).
- No series navigation between posts (each is standalone).
- No comments or TOC (standard `post` layout includes these via Chirpy; acceptable).

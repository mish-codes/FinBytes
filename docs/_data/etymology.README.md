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

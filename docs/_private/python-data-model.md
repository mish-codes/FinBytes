---
layout: post
title: "Python: Data model dunders"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-data-model/
---

Python's data model lets you hook into the language's core operations by defining special methods. Three areas come up most often.

`__repr__` vs `__str__`: `__repr__` is the unambiguous, developer-facing representation — ideally something you could `eval()` back to an equivalent object. `__str__` is the readable, end-user-facing representation. `str()` falls back to `__repr__` if `__str__` is not defined, so implementing `__repr__` is the higher-value of the two.

`__eq__` and `__hash__`: defining `__eq__` causes Python to set `__hash__` to `None`, making instances unhashable — they cannot be used in sets or as dict keys. If you want both value equality and hashability, define `__hash__` explicitly. The rule is that objects which compare equal must have the same hash; violating this silently corrupts dictionaries and sets.

`__getattr__` vs `__getattribute__`: `__getattribute__` is called on *every* attribute access without exception. `__getattr__` is called only after normal lookup has *failed*. Override `__getattr__` as a fallback for missing attributes; override `__getattribute__` only when you need to intercept all access, and always delegate to `object.__getattribute__(self, name)` to avoid infinite recursion.

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Point({self.x!r}, {self.y!r})"   # eval-able

    def __eq__(self, other):
        return isinstance(other, Point) and (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))   # required because __eq__ is defined

    def __getattr__(self, name):        # only reached for missing attributes
        raise AttributeError(f"Point has no attribute {name!r}")
```

Watch out: `__getattr__` is not called when the attribute *exists* — it is the last-resort fallback. If you want to intercept access to attributes that *do* exist, you need `__getattribute__`.

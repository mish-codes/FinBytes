---
layout: post
title: "Python: Dataclasses vs attrs vs plain classes"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-dataclasses/
---

All three define data-holding classes. The choice is about how much boilerplate Python generates for you and how much validation and transformation logic you need alongside it.

A plain class gives you full control: you write `__init__`, `__repr__`, `__eq__`, and any other methods yourself. That is correct and often enough for one-off objects, or when the generated defaults do not fit.

`@dataclass` (stdlib, Python 3.7+) auto-generates `__init__`, `__repr__`, and `__eq__` from class-level annotations. Optional flags generate `__hash__`, `__lt__`, and frozen (immutable) variants. Fields with mutable defaults must use `field(default_factory=...)` — a naked mutable default is caught at class definition time with a `ValueError`. `__post_init__` runs after the generated `__init__` and is where you put validation logic. Zero dependencies, readable, and correct for most use cases.

`attrs` (third-party) covers the same ground but with more built-in power: validators run automatically in `__init__`, converters transform values on assignment, and the configuration API is richer. It predated dataclasses and directly influenced their design. Reach for `attrs` when you need per-field validators, converters, or are already in a codebase that depends on it.

```python
from dataclasses import dataclass, field

@dataclass
class Order:
    id: int
    items: list[str] = field(default_factory=list)   # mutable default — must use field()
    total: float = 0.0

    def __post_init__(self):
        if self.total < 0:
            raise ValueError("total cannot be negative")

o1 = Order(id=1, items=["widget"])
o2 = Order(id=1, items=["widget"])
print(o1 == o2)   # True — __eq__ compares field values
print(repr(o1))   # Order(id=1, items=['widget'], total=0.0)
```

Watch out: `@dataclass` fields are ordered — a field with a default cannot be followed by a field without one (same rule as function arguments). If you hit this constraint with inheritance, use `field(default=...)` or restructure the class hierarchy.

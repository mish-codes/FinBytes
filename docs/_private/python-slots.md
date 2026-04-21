---
layout: post
title: "Python: __slots__ — what it does and when it matters"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-slots/
---

By default every Python instance has a `__dict__` — a hash table that stores its attributes. `__dict__` is flexible (you can add arbitrary attributes at runtime) but carries overhead: memory for the dict structure itself, even for objects with just two or three attributes.

Defining `__slots__` as a class-level tuple tells Python to allocate a fixed set of named slots for instances instead of a `__dict__`. Each slot becomes a data descriptor on the class, and the slot value is stored directly in the object's memory layout rather than in a separate hash table. The result: no per-instance `__dict__`, lower memory (often 30–50% for small objects), and slightly faster attribute access because the slot's offset is fixed.

Use `__slots__` when you have many instances of a small, fixed-schema object — nodes in a tree, records in a streaming pipeline, ticks in a market data feed — where the memory saving is meaningful. It also prevents accidentally adding attributes not in the schema, which is occasionally useful as a lightweight interface guard.

```python
import sys

class WithDict:
    def __init__(self, x, y):
        self.x, self.y = x, y

class WithSlots:
    __slots__ = ('x', 'y')
    def __init__(self, x, y):
        self.x, self.y = x, y

a = WithDict(1, 2)
b = WithSlots(1, 2)

print(sys.getsizeof(a.__dict__))   # ~200 bytes dict overhead
# b has no __dict__ — no per-instance dict allocated at all
print(hasattr(b, '__dict__'))      # False
```

Watch out: if a subclass of a slotted class does not define its own `__slots__`, it gets a `__dict__` anyway, negating the memory benefit for subclass instances. Also, `__slots__` prevents weak references unless `'__weakref__'` is explicitly included in the tuple.

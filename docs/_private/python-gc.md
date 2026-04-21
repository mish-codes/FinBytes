---
layout: post
title: "Python: Reference counting and the cyclic garbage collector"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-gc/
---

CPython tracks object lifetime through reference counting. Every object carries a count of how many references point to it. The count increments when you assign the object to a variable, pass it to a function, or store it in a container; it decrements when a reference is removed. When the count reaches zero, the object is deallocated immediately and deterministically — no pause, no delay.

Reference counting is fast and predictable, but it has one fundamental flaw: reference cycles. If object A holds a reference to B and B holds a reference back to A, their counts never reach zero even after all external references are gone. Neither can be freed by reference counting alone.

CPython's cyclic garbage collector handles this. It runs periodically using a generational scheme — three generations, with new objects in generation 0. The collector identifies isolated cycles (groups of objects reachable only from each other, with no external references) and deallocates them. You can inspect and control it via the `gc` module, or disable it for short-lived processes where you know you're not creating cycles.

```python
import gc

class Node:
    def __init__(self, val):
        self.val = val
        self.ref = None

a = Node(1)
b = Node(2)
a.ref = b
b.ref = a    # cycle: a → b → a

del a, b     # external references gone, but refcounts still > 0 due to cycle
gc.collect() # cyclic GC finds the isolated cycle and frees both objects

print(gc.get_count())   # (gen0_count, gen1_count, gen2_count)
```

Watch out: `__del__` finalizers on objects in cycles have historically prevented the cyclic GC from collecting them — since Python 3.4 (PEP 442) this is no longer a hard blocker, but objects with `__del__` in cycles are still a code smell. Prefer context managers or `weakref` for cleanup involving cyclically referenced objects.

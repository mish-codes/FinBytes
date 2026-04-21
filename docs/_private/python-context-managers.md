---
layout: post
title: "Python: Context managers and the with protocol"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-context-managers/
---

A context manager defines `__enter__` and `__exit__`. When Python executes `with expr as x:`, it calls `expr.__enter__()` and binds the return value to `x`. When the block exits — whether normally or via exception — Python calls `expr.__exit__(exc_type, exc_val, exc_tb)`. If those three arguments are `None`, the block exited cleanly; if they are set, an exception occurred.

`__exit__` decides what to do with the exception. Returning a truthy value suppresses it and execution continues after the `with` block. Returning `None` or `False` lets it propagate. This is what makes context managers reliable for resource cleanup: the exit method runs regardless of whether an exception was raised.

`contextlib.contextmanager` lets you write a context manager as a generator function, avoiding the need for a class. Everything before `yield` is the `__enter__` logic; the yielded value becomes the `as` target; everything in the `finally` block is the `__exit__` logic and runs even on exception.

```python
from contextlib import contextmanager
import time

@contextmanager
def timer(label):
    start = time.perf_counter()
    try:
        yield                    # control passes into the with block here
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.4f}s")   # always runs

with timer("build index"):
    index = {v: i for i, v in enumerate(range(1_000_000))}
```

Watch out: if you suppress an exception in `__exit__` (by returning `True`), execution continues after the `with` block, not inside it. If you only want to suppress specific exception types, check `exc_type` before returning `True` — a bare `return True` swallows every exception, including `KeyboardInterrupt`.

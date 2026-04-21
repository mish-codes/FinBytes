---
layout: post
title: "Python: Generator and iterator protocol"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-generators/
---

Python's iterator protocol requires two methods: `__iter__` (returns the iterator itself) and `__next__` (returns the next value or raises `StopIteration`). Any object implementing these can be used in a `for` loop. An iterable only needs `__iter__` — it returns a fresh iterator each time, which carries the traversal state.

A generator function contains `yield`. Calling it does not execute the body; it returns a generator object that implements the iterator protocol automatically. Execution resumes from the last `yield` each time `__next__` is called. This gives you lazy evaluation — values are produced on demand, which matters when a sequence is large or infinite.

Generator expressions (`(x*x for x in range(n))`) are syntactic sugar for simple generators and produce one value at a time. For anything more complex — state between yields, early termination, infinite sequences — a generator function is cleaner than a class implementing `__iter__` and `__next__` by hand.

Generators also support `send(value)`, which resumes the generator and passes a value back in as the result of the `yield` expression, enabling two-way communication between the caller and the generator.

```python
def fibonacci():
    a, b = 0, 1
    while True:          # infinite — safe because it's lazy
        yield a
        a, b = b, a + b

gen = fibonacci()
print([next(gen) for _ in range(8)])   # [0, 1, 1, 2, 3, 5, 8, 13]

# Two-way communication with send()
def accumulator():
    total = 0
    while True:
        value = yield total   # sends total out, receives the next value in
        total += value

acc = accumulator()
next(acc)            # prime: run to the first yield
print(acc.send(10))  # 10
print(acc.send(5))   # 15
```

Watch out: a generator can only be iterated once. After `StopIteration` is raised, further calls to `next()` keep raising it. If you need to iterate a generator multiple times, collect it into a list first, or write a class whose `__iter__` creates a fresh generator each call.

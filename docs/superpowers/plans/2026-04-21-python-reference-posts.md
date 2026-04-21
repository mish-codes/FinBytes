# Python Reference Posts — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 16 private Jekyll reference posts in `docs/_private/`, each covering a core Python concept in interview-answer prose plus one code example.

**Architecture:** One `.md` file per topic under `docs/_private/`, using the existing `post` layout and the `_private` collection (already configured in `_config.yml`). Pages render at `/private/python-<slug>/` — accessible by direct URL, not in nav or sitemap. Four tasks of four posts each, one commit per task.

**Tech Stack:** Jekyll, Markdown, Liquid front matter, `_private/` collection.

---

## Task 1: MRO, GIL, Descriptors, Data model dunders

**Files — create all four:**
- `docs/_private/python-mro.md`
- `docs/_private/python-gil.md`
- `docs/_private/python-descriptors.md`
- `docs/_private/python-data-model.md`

- [ ] **Create `docs/_private/python-mro.md`**

```markdown
---
layout: post
title: "Python: MRO and how super() resolves"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-mro/
---

Python's method resolution order (MRO) determines the sequence in which base classes are searched when you access a method or attribute. It is computed once at class creation time using the C3 linearisation algorithm and stored in `ClassName.__mro__`.

C3 works by merging the MROs of each base class left-to-right, always picking the first class that does not appear later in any other base's MRO. The practical result: Python respects the order you write your base classes, never visits a class twice, and always places a class before its bases.

`super()` is not "call the parent class". It returns a proxy that starts the MRO walk at the class *after* the one where `super()` appears. In a chain `C → A → B → object`, calling `super()` inside `A` looks in `B` next, then `object`. This is what makes cooperative multiple inheritance work: every class in the chain calls `super()`, so the call propagates all the way up rather than stopping at the first base.

The implication is that the class `super()` will delegate to depends on the *full* MRO of the instance being created, not just on what the class directly inherits from. You cannot know which class `super()` in `A` will call without knowing what `A` is mixed into.

```python
class A:
    def greet(self):
        print("A")
        super().greet()   # keeps the chain going

class B:
    def greet(self):
        print("B")
        super().greet()

class C(A, B):
    def greet(self):
        print("C")
        super().greet()

# C.__mro__ → (C, A, B, object)
C().greet()   # prints C, A, B
```

Watch out: if any class in the chain does not call `super().__init__()`, initialisation silently stops there — base classes further along the MRO never run.
```

- [ ] **Create `docs/_private/python-gil.md`**

```markdown
---
layout: post
title: "Python: The GIL and concurrency tradeoffs"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-gil/
---

The Global Interpreter Lock is a mutex in CPython that prevents more than one thread from executing Python bytecode at the same time. It exists because CPython's memory management — specifically reference counting — is not thread-safe without it. Rather than lock every individual object, CPython locks the interpreter itself and releases the lock periodically so other threads can run.

The consequence is that Python threads do not give you parallel CPU execution for pure Python code. Two threads on an eight-core machine still take turns. The GIL is released during I/O operations and by C extensions that opt out (NumPy, for instance), which is why threading still helps for network-bound or I/O-bound work: while one thread blocks waiting for a socket, the GIL is free and another thread runs.

For CPU-bound work you need `multiprocessing`. Each process has its own interpreter and its own GIL, so you get true parallelism. The cost is higher memory and slower communication between processes — you pass data via queues or shared memory rather than shared objects.

`asyncio` is different from both. It is single-threaded, single-process, and achieves concurrency through cooperative scheduling. Coroutines yield control at `await` points; the event loop runs something else while the coroutine waits. No parallelism, but very efficient for handling thousands of concurrent I/O-bound operations.

Rule of thumb: many concurrent I/O operations → asyncio. Simple I/O-bound scripts → threads. CPU-bound work → multiprocessing.

```python
import asyncio, threading, multiprocessing

# asyncio: concurrent I/O, single thread, cooperative
async def fetch(url): ...

# threading: I/O-bound, GIL released during I/O waits
t = threading.Thread(target=do_io_work)

# multiprocessing: CPU-bound, each process gets its own GIL
p = multiprocessing.Process(target=crunch_numbers)
```

Watch out: mixing asyncio and threads is possible but error-prone — use `loop.run_in_executor()` to run blocking code in a thread pool from an async context rather than calling blocking functions directly inside a coroutine.
```

- [ ] **Create `docs/_private/python-descriptors.md`**

```markdown
---
layout: post
title: "Python: Descriptors — data, non-data, and what they power"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-descriptors/
---

A descriptor is any object that defines `__get__`, and optionally `__set__` or `__delete__`. When an attribute lookup finds a descriptor stored on a class (not an instance), Python calls the descriptor's methods instead of returning the object directly. This single mechanism powers `@property`, instance methods, `@classmethod`, and `@staticmethod`.

A *data descriptor* defines both `__get__` and `__set__` (or `__delete__`). It takes priority over the instance's `__dict__`. A *non-data descriptor* defines only `__get__` — the instance `__dict__` takes priority over it, which is why you can shadow a method by setting an instance attribute with the same name.

Functions are non-data descriptors. When you access `obj.method`, Python calls `function.__get__(obj, type(obj))`, which returns a bound method. That is how `self` gets bound — not by any special syntax, but because the function object's `__get__` wraps itself with the instance. `classmethod` and `staticmethod` work the same way but bind differently.

```python
class Validated:
    def __set_name__(self, owner, name):
        self._name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self          # accessed on the class itself
        return obj.__dict__.get(self._name)

    def __set__(self, obj, value):
        if not isinstance(value, (int, float)):
            raise TypeError(f"{self._name} must be numeric")
        obj.__dict__[self._name] = value

class Price:
    amount = Validated()   # descriptor lives on the class, shared by all instances

p = Price()
p.amount = 9.99    # calls Validated.__set__
print(p.amount)    # calls Validated.__get__ → 9.99
p.amount = "free"  # raises TypeError
```

Watch out: store per-instance data in `obj.__dict__` keyed by `self._name`, never on the descriptor instance itself — the descriptor is one object shared across every instance of the class.
```

- [ ] **Create `docs/_private/python-data-model.md`**

```markdown
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
```

- [ ] **Commit task 1**

```bash
git add docs/_private/python-mro.md docs/_private/python-gil.md \
        docs/_private/python-descriptors.md docs/_private/python-data-model.md
git commit -m "content(python-ref): MRO, GIL, descriptors, data model dunders"
```

---

## Task 2: Attribute lookup, scoping, asyncio, generators

**Files — create all four:**
- `docs/_private/python-attribute-lookup.md`
- `docs/_private/python-scoping.md`
- `docs/_private/python-asyncio.md`
- `docs/_private/python-generators.md`

- [ ] **Create `docs/_private/python-attribute-lookup.md`**

```markdown
---
layout: post
title: "Python: Attribute lookup order end-to-end"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-attribute-lookup/
---

When you write `obj.name`, Python calls `type(obj).__getattribute__(obj, 'name')`, which runs the following chain in order.

First, Python searches `type(obj).__mro__` — the class and all its bases. If it finds a *data descriptor* (an object defining both `__get__` and `__set__`), the descriptor's `__get__` is invoked immediately and lookup stops. Data descriptors win over everything else, including the instance dict.

If no data descriptor is found, Python checks `obj.__dict__`. If the name is there, that value is returned directly.

If not in the instance dict, Python searches the class hierarchy again for a *non-data descriptor* (defines only `__get__`). If found, its `__get__` is called.

If none of the above, the raw class attribute is returned as-is.

Finally, if every step fails, `__getattr__` is called if defined. If that also raises `AttributeError`, the lookup fails with the error the caller sees.

```python
class WithProp:
    @property              # @property is a data descriptor (__get__ + __set__)
    def x(self):
        return "from property"

w = WithProp()
w.__dict__['x'] = 99      # write directly into instance dict
print(w.x)                # "from property" — data descriptor beats instance dict

class Plain:
    x = 10                # plain class attribute — non-data, no __get__

p = Plain()
p.__dict__['x'] = 99      # instance dict
print(p.x)                # 99 — instance dict beats non-data class attribute
```

Watch out: this ordering is why you cannot bypass a `@property` setter by writing `self.x = value` from outside the class — `__set__` on the property is called instead. If you genuinely need to write to `__dict__` directly from inside the class, use `self.__dict__['x'] = value`.
```

- [ ] **Create `docs/_private/python-scoping.md`**

```markdown
---
layout: post
title: "Python: Name binding and scoping"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-scoping/
---

Python resolves names using LEGB: Local → Enclosing → Global → Built-in. At any point in code, Python searches those four scopes in order and uses the first match. A name is "local" to a function if it appears on the left side of an assignment anywhere in that function's body — even if the assignment comes after the reference.

Closures capture variables by reference, not by value. The enclosing scope's variable is shared, not copied at the time the closure is created. This causes the classic late-binding problem: closures created in a loop all see the loop variable's *final* value when called, not the value at the moment each closure was defined.

`nonlocal` lets an inner function rebind a variable in its enclosing scope. `global` does the same for module scope. Without these keywords, any assignment in an inner function creates a new local variable, shadowing the outer one rather than rebinding it.

```python
# Late-binding gotcha
fns = [lambda: i for i in range(3)]
print([f() for f in fns])    # [2, 2, 2] — all closures share the same i

# Fix: capture current value as a default argument
fns = [lambda i=i: i for i in range(3)]
print([f() for f in fns])    # [0, 1, 2]

# nonlocal
def counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

c = counter()
print(c(), c(), c())   # 1, 2, 3
```

Watch out: if you assign to a name anywhere in a function body, Python treats it as local *throughout* the entire function — reading it before the assignment raises `UnboundLocalError`, not a lookup in the enclosing scope. This catches people who add an assignment to an existing function and suddenly break a line above it.
```

- [ ] **Create `docs/_private/python-asyncio.md`**

```markdown
---
layout: post
title: "Python: The asyncio execution model"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-asyncio/
---

`asyncio` runs on a single-threaded event loop. The loop maintains a queue of tasks — scheduled coroutines. On each iteration it picks a ready task, runs it until it hits an `await`, then suspends it and moves to the next ready task. There is no thread switching and no parallelism; concurrency comes from coroutines voluntarily yielding control.

A coroutine is a function defined with `async def`. Calling it does not execute it — it returns a coroutine object. To run it you either `await` it from another coroutine, or wrap it in a task with `asyncio.create_task()`, which schedules it on the event loop and lets it run concurrently with the caller. `await` suspends the current coroutine and hands control back to the event loop until the awaited thing completes.

The critical pitfall is blocking the event loop. Any call that does not release control — `time.sleep()`, synchronous file I/O, a `requests.get()`, a CPU-heavy loop — freezes every other coroutine for its entire duration. The event loop is cooperative; it cannot preempt you. Use `asyncio.sleep()` in place of `time.sleep()`, and `loop.run_in_executor()` to push genuinely blocking work into a thread pool.

```python
import asyncio

async def fetch(n):
    print(f"start {n}")
    await asyncio.sleep(1)   # yields control — other tasks run here
    print(f"done {n}")
    return n

async def main():
    # gather runs all three concurrently; total wall time ~1s, not 3s
    results = await asyncio.gather(fetch(1), fetch(2), fetch(3))
    print(results)   # [1, 2, 3]

asyncio.run(main())
```

Watch out: `asyncio.gather()` runs coroutines concurrently within the event loop, but they still execute one at a time — if any coroutine contains a blocking call with no `await`, it starves the others for the entire duration of that call.
```

- [ ] **Create `docs/_private/python-generators.md`**

```markdown
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
```

- [ ] **Commit task 2**

```bash
git add docs/_private/python-attribute-lookup.md docs/_private/python-scoping.md \
        docs/_private/python-asyncio.md docs/_private/python-generators.md
git commit -m "content(python-ref): attribute lookup, scoping, asyncio, generators"
```

---

## Task 3: Context managers, GC, __slots__, metaclasses

**Files — create all four:**
- `docs/_private/python-context-managers.md`
- `docs/_private/python-gc.md`
- `docs/_private/python-slots.md`
- `docs/_private/python-metaclasses.md`

- [ ] **Create `docs/_private/python-context-managers.md`**

```markdown
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
```

- [ ] **Create `docs/_private/python-gc.md`**

```markdown
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
```

- [ ] **Create `docs/_private/python-slots.md`**

```markdown
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
```

- [ ] **Create `docs/_private/python-metaclasses.md`**

```markdown
---
layout: post
title: "Python: Metaclasses"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-metaclasses/
---

A metaclass is the class of a class. Just as an object is an instance of its class, a class is an instance of its metaclass. The default metaclass for every Python class is `type`. When Python executes a `class` statement, it calls the metaclass to construct the class object — passing the class name, tuple of base classes, and namespace dictionary. You can customise this by subclassing `type`.

Overriding `__new__` on a metaclass lets you intercept class creation before the class object exists. Overriding `__init__` runs after creation. Common legitimate uses: enforcing that subclasses implement certain methods, automatically registering subclasses in a plugin registry, or adding methods to every class in a hierarchy.

Before reaching for a metaclass, consider whether `__init_subclass__` or a class decorator solves the problem with less machinery. `__init_subclass__` runs whenever a class is subclassed and covers most registration and validation use cases with far less conceptual overhead. Metaclasses are rarely the right tool unless you need to modify the class namespace during construction, or you are building a framework where users should not have to inherit from a base class.

```python
class RegistryMeta(type):
    _registry = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:            # skip the abstract base class itself
            mcs._registry[name] = cls
        return cls

class Plugin(metaclass=RegistryMeta):
    pass

class AudioPlugin(Plugin): pass
class VideoPlugin(Plugin): pass

print(RegistryMeta._registry)
# {'AudioPlugin': <class 'AudioPlugin'>, 'VideoPlugin': <class 'VideoPlugin'>}
```

Watch out: metaclass conflicts occur when two base classes have different metaclasses. Python raises `TypeError: metaclass conflict`. The resolution is a combined metaclass that inherits from both — but reaching that point usually signals the design is overengineered.
```

- [ ] **Commit task 3**

```bash
git add docs/_private/python-context-managers.md docs/_private/python-gc.md \
        docs/_private/python-slots.md docs/_private/python-metaclasses.md
git commit -m "content(python-ref): context managers, GC, __slots__, metaclasses"
```

---

## Task 4: Import system, dataclasses, type system, footguns

**Files — create all four:**
- `docs/_private/python-import-system.md`
- `docs/_private/python-dataclasses.md`
- `docs/_private/python-type-system.md`
- `docs/_private/python-footguns.md`

- [ ] **Create `docs/_private/python-import-system.md`**

```markdown
---
layout: post
title: "Python: The import system and module resolution"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-import-system/
---

When you write `import foo`, Python first checks `sys.modules` — a cache of every module imported so far. If `foo` is there, the cached module object is returned immediately. This is why importing the same module in ten files does not re-execute the module code ten times.

If not cached, Python searches for the module using a sequence of *finders* stored in `sys.meta_path`. The default finders check built-in modules (compiled into the interpreter), frozen modules, and then the file system. For file system modules, Python searches directories in `sys.path` in order, looking for a `.py` file, a package directory (a directory with `__init__.py`), or a compiled extension.

Once found, a *loader* executes the module code in a fresh namespace. Crucially, the (partially-initialised) module object is added to `sys.modules` *before* the module code finishes running. This is what makes circular imports partially work — the importing module gets back a module object that exists, but attributes defined later in the circular dependency may not exist yet on that object.

```python
import sys, importlib

# sys.modules cache
print('os' in sys.modules)          # True — already imported by Python startup
print('my_module' in sys.modules)   # False if never imported

# Search path
print(sys.path[:3])                 # script dir, PYTHONPATH entries, stdlib

# Force a reload during development (REPL / hot-reload scenarios)
import my_module
importlib.reload(my_module)
```

Watch out: relative imports (`from . import util`) only work inside a package — a directory that Python recognises as a package. Running a file directly as a script (`python package/module.py`) breaks relative imports because the package context is not established. Use `python -m package.module` instead.
```

- [ ] **Create `docs/_private/python-dataclasses.md`**

```markdown
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
```

- [ ] **Create `docs/_private/python-type-system.md`**

```markdown
---
layout: post
title: "Python: Type system basics — Protocol, TypeVar, Generic"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-type-system/
---

Python's type hints are evaluated by static analysers (mypy, pyright) rather than at runtime. The three concepts that come up most in practice are `Protocol`, `TypeVar`, and `Generic`.

`Protocol` enables structural subtyping — duck typing with static verification. A class satisfies a `Protocol` if it has the required methods and attributes, without needing to explicitly inherit from it. This lets you write functions that accept any object behaving a certain way, without imposing a class hierarchy on the caller.

`TypeVar` defines a type variable: a placeholder that the type checker replaces with a concrete type at each call site. A function annotated with a `TypeVar` is generic — the checker can verify that input and output types are consistent with each other. `TypeVar('T', bound=Base)` constrains the variable to subclasses of `Base`.

`Generic[T]` makes a class generic. Callers parameterise it with a concrete type, and the checker tracks what is stored inside — useful for containers, wrappers, and result types.

```python
from typing import Protocol, TypeVar, Generic

class Drawable(Protocol):
    def draw(self) -> None: ...   # any class with draw() satisfies this, no inheritance needed

def render(item: Drawable) -> None:
    item.draw()

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

s: Stack[int] = Stack()
s.push(1)       # checker knows this is int
val = s.pop()   # val inferred as int
```

Watch out: at runtime, generics are erased — `Stack[int]` and `Stack[str]` are the same class object. Type parameters exist only for the static analyser. If you need to inspect type arguments at runtime, use `typing.get_args()` on an annotated variable, not on the class itself.
```

- [ ] **Create `docs/_private/python-footguns.md`**

```markdown
---
layout: post
title: "Python: Common footguns"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-footguns/
---

Three problems appear consistently in code reviews because they are non-obvious and produce bugs that are hard to trace.

**Mutable default arguments.** Default argument values are evaluated once at function definition time, not on each call. If you use a mutable object — a list, dict, or set — as a default, all calls that omit the argument share the same object. Append to it in one call, and every future call without an explicit argument sees the accumulated state. The fix is to default to `None` and create the mutable object inside the function body.

**Late binding in closures.** Closures capture the variable, not its value at the time the closure was created. In a loop that builds closures, all of them share the same loop variable — when called, they see its final value. The idiomatic fix is to capture the current value as a default argument, which is evaluated at closure-creation time.

**`is` vs `==`.** `is` tests object identity — whether two names point to the same object in memory. `==` tests equality — whether two objects have the same value. CPython interns small integers (−5 to 256) and some short strings, which makes `is` appear to work for those values, but this is an implementation detail with no language guarantee.

```python
# Mutable default
def append_to(val, lst=[]):
    lst.append(val)
    return lst

print(append_to(1))   # [1]
print(append_to(2))   # [1, 2] — same list object, not a new one

def append_to(val, lst=None):   # correct
    if lst is None:
        lst = []
    lst.append(val)
    return lst

# Late binding
fns = [lambda: i for i in range(3)]
print([f() for f in fns])      # [2, 2, 2]

fns = [lambda i=i: i for i in range(3)]
print([f() for f in fns])      # [0, 1, 2]

# is vs ==
a, b = 1000, 1000
print(a == b)    # True
print(a is b)    # False — outside the interning range, two separate objects
```

Watch out: `is None` is the correct idiom for None checks (`if x is None:`), because `None` is a guaranteed singleton — the identity test is both correct and marginally faster than `==`. For everything else, use `==`.
```

- [ ] **Commit task 4**

```bash
git add docs/_private/python-import-system.md docs/_private/python-dataclasses.md \
        docs/_private/python-type-system.md docs/_private/python-footguns.md
git commit -m "content(python-ref): import system, dataclasses, type system, footguns"
```

---

## Task 5: Push and verify

- [ ] **Push working branch**

```bash
git push origin working
```

- [ ] **Merge and deploy**

```bash
git checkout master
git merge working --no-verify -m "content(python-ref): 16 private Python reference posts"
git push origin master
git checkout working
```

- [ ] **Spot-check one page renders**

Visit `https://mish-codes.github.io/FinBytes/private/python-mro/` (~60s after push). Confirm the post renders with the correct title and code block. If 404, check that `_config.yml` has `_private` collection with `output: true`.
```

# Design: Python Reference Posts — Add ELIA12 Tab

**Date:** 2026-04-22  
**Scope:** 16 posts in `docs/_private/`, plus one new shared layout

---

## Problem

The 16 private Python reference posts are dense, technical, and written for developers. There is no accessible entry point for someone newer to the language. The request is to add an **ELIA12** tab alongside the existing content on every post — same URL, same page, second tab.

---

## Architecture

### New layout: `docs/_layouts/python-reference-post.html`

Modelled on `cpp-post.html`. Contains:
- Page header (title, date, tags) — same as `cpp-post`
- Two-button tab strip: **Concept** | **ELIA12**
- `{{ content }}` for the tab body divs
- The same `.ql-tabs` CSS and `showTab()` JS copied from `cpp-post.html` (self-contained, no external dependency)

### Post file conversion: `.md` → `.html`

All 16 files in `docs/_private/` are converted from Markdown to HTML. Front matter changes:
- `layout: post` → `layout: python-reference-post`
- `permalink:` unchanged — no broken links

Each file body becomes exactly two divs:

```html
<div id="tab-concept" class="ql-tab-content">
  <!-- existing content, converted from Markdown to HTML -->
</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">
  <!-- new ELIA12 content -->
</div>
```

The Concept tab is active by default (no `style="display:none"`).

---

## Files affected

| File | Change |
|---|---|
| `docs/_layouts/python-reference-post.html` | **Create** |
| `docs/_private/python-mro.html` | Convert + add ELIA12 tab |
| `docs/_private/python-gil.html` | Convert + add ELIA12 tab |
| `docs/_private/python-descriptors.html` | Convert + add ELIA12 tab |
| `docs/_private/python-data-model.html` | Convert + add ELIA12 tab |
| `docs/_private/python-attribute-lookup.html` | Convert + add ELIA12 tab |
| `docs/_private/python-scoping.html` | Convert + add ELIA12 tab |
| `docs/_private/python-asyncio.html` | Convert + add ELIA12 tab |
| `docs/_private/python-generators.html` | Convert + add ELIA12 tab |
| `docs/_private/python-context-managers.html` | Convert + add ELIA12 tab |
| `docs/_private/python-gc.html` | Convert + add ELIA12 tab |
| `docs/_private/python-slots.html` | Convert + add ELIA12 tab |
| `docs/_private/python-metaclasses.html` | Convert + add ELIA12 tab |
| `docs/_private/python-import-system.html` | Convert + add ELIA12 tab |
| `docs/_private/python-dataclasses.html` | Convert + add ELIA12 tab |
| `docs/_private/python-type-system.html` | Convert + add ELIA12 tab |
| `docs/_private/python-footguns.html` | Convert + add ELIA12 tab |
| Old `.md` files | **Delete** (replaced by `.html`) |

---

## ELIA12 content style

Each ELIA12 tab follows this structure, in order:

1. **Grounding analogy** — one physical or everyday thing that maps to the concept (a queue, a relay race, a recipe card, a bouncer at a door). Two to four sentences.
2. **Plain-language explanation** — 100–150 words. No assumed vocabulary. Jargon only introduced with an immediate one-line gloss. Short sentences.
3. **Simplified code example** — the same core concept as the Reference tab, stripped to the minimum needed to demonstrate it. Inline comments explain *what is happening and why* in plain English, not just what the code does syntactically.
4. **"The trick to remember"** — one sentence in a `<div class="cpp-note">` callout. The single most important thing to not get wrong.

Target length per ELIA12 tab: 150–250 words plus code.

---

## ELIA12 content — post by post

### MRO and how super() resolves

**Analogy:** Python keeps a ranked to-do list for every class: "if you can't find the method here, check this one next, then that one." That list is the MRO.

`super()` doesn't just call your parent class. It says "go to the next name on the list." So if the list is C → A → B → object and you call `super()` inside A, Python looks in B next — not back at C. This matters when you mix multiple classes together: the list changes based on the combination, so you can't know where `super()` lands without knowing the full list.

Every class in a cooperative chain passes the baton using `super()`. If one class drops it, the rest of the chain never runs.

```python
class A:
    def greet(self):
        print("A")
        super().greet()   # "pass it to whoever's next on the list"

class B:
    def greet(self):
        print("B")
        super().greet()   # B passes it along too

class C(A, B):
    def greet(self):
        print("C")
        super().greet()   # starts the chain

# Python builds the list: C → A → B → object
C().greet()   # prints C, A, B — walks the whole list
```

**The trick to remember:** if one class skips `super()`, every class after it on the list is silently ignored.

---

### The GIL and concurrency tradeoffs

**Analogy:** Imagine a kitchen with one knife. Multiple chefs (threads) can all be in the kitchen, but only one can use the knife at a time. The GIL is that knife rule.

Python's threads don't run truly in parallel for Python code — they take turns. The lock releases when a thread is waiting for something (like a file download or database query), so threading still helps when you're mostly waiting, not computing.

If you need to actually run things at the same time on multiple CPU cores, you need separate processes — each gets its own kitchen, own knife. The downside is they can't easily share their cutting boards.

`asyncio` is a third option: one chef, one knife, but the chef switches tasks the moment they're waiting for anything, so they're never standing around idle.

```python
import asyncio

async def fetch(n):
    print(f"starting task {n}")
    await asyncio.sleep(1)    # chef puts this task down and picks up another
    print(f"finished task {n}")

async def main():
    # all three run "at the same time" — total wait is ~1s, not 3s
    await asyncio.gather(fetch(1), fetch(2), fetch(3))

asyncio.run(main())
```

**The trick to remember:** threads share the GIL (take turns), processes bypass it (truly parallel), asyncio ignores it (one thread, cooperative switching).

---

### Descriptors — data, non-data, and what they power

**Analogy:** A descriptor is like a smart doorbell. Instead of just ringing when pressed, it can run a custom action — log who rang, check if the time is allowed, play a different sound. Attach one to a class attribute and Python calls the doorbell's logic instead of just handing over the value.

When Python finds a descriptor sitting on a class (not on an instance), it calls the descriptor's `__get__` method instead of returning the object directly. This is how `@property` works — it's just a built-in descriptor. Functions are descriptors too: that's how `self` gets bound when you call a method.

A *data descriptor* also defines `__set__`, so it controls both reading and writing. It beats the instance's own dictionary, which is why a `@property` setter can't be bypassed by writing to the instance directly.

```python
class Validated:
    def __set_name__(self, owner, name):
        self._name = name   # remembers which attribute name it's attached to

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self                      # someone accessed it on the class, not an instance
        return obj.__dict__.get(self._name)  # read from the instance's own storage

    def __set__(self, obj, value):
        if not isinstance(value, (int, float)):
            raise TypeError(f"{self._name} must be a number")
        obj.__dict__[self._name] = value     # store on the instance, not on the descriptor

class Price:
    amount = Validated()   # one descriptor, shared by every Price instance

p = Price()
p.amount = 9.99    # calls __set__ → passes validation
p.amount = "free"  # raises TypeError
```

**The trick to remember:** store per-instance data in `obj.__dict__`, never on the descriptor itself — the descriptor is one object shared by every instance.

---

### Data model dunders

**Analogy:** Python has a list of "magic words" — if you define a method with one of those names on your class, Python calls it automatically at the right moment. `__repr__` is called when Python wants to show your object, `__eq__` when it wants to compare two objects, and so on.

`__repr__` gives the developer-friendly display: ideally something you could paste into a Python prompt to recreate the object. `__str__` gives the user-friendly display. If you only write one, write `__repr__` — Python falls back to it when `__str__` is missing.

`__eq__` lets you define what "equal" means. But defining it wipes out hashability by default, meaning you can't put instances in a set or use them as dict keys. Fix it by also defining `__hash__`.

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"   # shown in the REPL, in tracebacks, everywhere

    def __eq__(self, other):
        # two Points are equal if their coordinates match
        return isinstance(other, Point) and (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        # required because we defined __eq__ — use the same fields
        return hash((self.x, self.y))

p1 = Point(1, 2)
p2 = Point(1, 2)
print(p1 == p2)           # True — __eq__ compared coordinates
print({p1, p2})           # one item — same hash, same equality
print(repr(p1))           # Point(1, 2)
```

**The trick to remember:** if you define `__eq__`, always define `__hash__` too — otherwise your objects silently become unusable in sets and dicts.

---

### Attribute lookup order end-to-end

**Analogy:** When you ask Python for `obj.name`, Python runs through a priority queue — like a bouncer checking four different lists before deciding who gets in. The lists are checked in a fixed order, and the first match wins.

The order is: (1) data descriptor on the class, (2) the instance's own dictionary, (3) non-data descriptor or plain class attribute, (4) `__getattr__` as a last resort. A `@property` is a data descriptor, so it always beats whatever is in the instance's own dictionary — you can't shadow it by setting an instance attribute with the same name.

```python
class WithProp:
    @property              # @property is a data descriptor — highest priority
    def x(self):
        return "from property"

w = WithProp()
w.__dict__['x'] = 99      # written directly into the instance dict
print(w.x)                # "from property" — data descriptor wins

class Plain:
    x = 10                # plain class attribute — lower priority than instance dict

p = Plain()
p.x = 99                  # stored in instance dict
print(p.x)                # 99 — instance dict wins over plain class attribute
```

**The trick to remember:** data descriptors (like `@property`) beat the instance dict; plain class attributes lose to it.

---

### Name binding and scoping

**Analogy:** Python looks for a name like you'd look for your keys — first in your own pockets (local), then in the last jacket you borrowed (enclosing function), then in the house (module globals), then in the junk drawer everyone shares (built-ins). First match wins.

There's one nasty surprise: if you assign to a name *anywhere* in a function body, Python treats it as local *throughout the entire function* — even lines above the assignment. So reading it before assigning raises an error, not a look-up in the outer scope.

Closures capture the variable itself, not its value at the moment the closure was created. In loops this bites hard: every closure ends up seeing the loop variable's final value.

```python
# Surprise: assignment makes x local for the whole function
x = 10
def f():
    print(x)   # UnboundLocalError — x is local because of the line below
    x = 20

# Late-binding closure gotcha
fns = [lambda: i for i in range(3)]
print([f() for f in fns])    # [2, 2, 2] — all closures share the same i

# Fix: capture the value now as a default argument
fns = [lambda i=i: i for i in range(3)]
print([f() for f in fns])    # [0, 1, 2]
```

**The trick to remember:** any assignment in a function makes that name local for the whole function — there's no such thing as "local from here down."

---

### The asyncio execution model

**Analogy:** Imagine one waiter serving many tables. The waiter doesn't clone themselves — they take an order, go put it in, then immediately serve another table while the kitchen works. They're always moving; they never stand waiting. That's asyncio: one thread, many tasks, switching whenever a task is waiting for something.

The key rule is that tasks have to *choose* to hand control back — they're not interrupted. An `await` is the waiter saying "I'm done with this table for now, let me go do something else." A task that never `await`s freezes every other task for its entire duration, because nobody else gets a turn.

```python
import asyncio

async def fetch(n):
    print(f"start {n}")
    await asyncio.sleep(1)   # hands control back to the event loop — other tasks run here
    print(f"done {n}")

async def main():
    # gather runs all three "at the same time"
    # total time: ~1s, because all three are waiting concurrently
    await asyncio.gather(fetch(1), fetch(2), fetch(3))

asyncio.run(main())
# start 1, start 2, start 3 ... (all start before any finish)
# done 1, done 2, done 3
```

**The trick to remember:** if a function doesn't `await` anything, it blocks the whole event loop — use `asyncio.sleep(0)` to yield briefly, or push it to a thread pool with `run_in_executor`.

---

### Generator and iterator protocol

**Analogy:** A regular list gives you all the items at once — like printing every page of a book and handing them over. A generator is more like a storyteller reading one page at a time: you get the next page only when you ask. Nothing is produced until it's needed.

The magic word is `yield`. When Python sees it in a function, the function becomes a generator. Calling the function doesn't run the body at all — it just creates the storyteller. Each time you call `next()` on it, the function runs until the next `yield`, pauses, and hands you the value. When there's nothing left, it stops.

This matters for large or infinite sequences: you never store everything in memory at once.

```python
def fibonacci():
    a, b = 0, 1
    while True:        # infinite loop — safe because nothing runs until you ask
        yield a        # pause here, hand out the value, wait for next()
        a, b = b, a + b

gen = fibonacci()

# ask for 8 values one at a time
print(next(gen))   # 0
print(next(gen))   # 1
print(next(gen))   # 1

# or ask for a batch
print([next(gen) for _ in range(5)])   # [2, 3, 5, 8, 13]
```

**The trick to remember:** a generator can only be walked through once — after it runs out, it's empty for good. Collect it into a list if you need to loop over it more than once.

---

### Context managers and the with protocol

**Analogy:** A context manager is like a changing room attendant. They hand you a key when you enter (`__enter__`), and take it back when you leave (`__exit__`) — whether you walked out calmly or were carried out. The door is always locked behind you.

This is useful for anything that needs guaranteed cleanup: open a file → do work → close it, even if the work crashes. The `with` statement does this automatically. You can write your own with `contextlib.contextmanager` using a generator: everything before `yield` is the setup, everything after is the teardown.

```python
from contextlib import contextmanager
import time

@contextmanager
def timer(label):
    start = time.perf_counter()
    try:
        yield               # hands control into the with block
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.3f}s")   # runs whether or not an exception happened

with timer("sorting"):
    data = sorted(range(1_000_000), reverse=True)

# prints: sorting: 0.083s  (or similar)
```

**The trick to remember:** `__exit__` runs even if an exception is raised — but if you return `True` from it, the exception is silently swallowed, so be deliberate about that.

---

### Reference counting and the cyclic garbage collector

**Analogy:** Every object in Python carries a tally: how many things are pointing at it. When that tally hits zero, the object is deleted immediately — like a library book that gets reshelved the moment the last person returns their copy.

The problem: if two objects point at each other, their tallies never hit zero, even if nobody else in the program can reach them. This is a reference cycle. Python has a second system — the cyclic garbage collector — that periodically hunts for these stranded groups and cleans them up.

```python
import gc

class Node:
    def __init__(self, val):
        self.val = val
        self.ref = None

a = Node(1)
b = Node(2)
a.ref = b     # a points at b
b.ref = a     # b points at a — now they form a cycle

del a, b      # the names are gone, but both objects still have refcount > 0
              # neither gets deleted yet

gc.collect()  # cyclic GC finds the isolated loop and frees both
```

**The trick to remember:** reference counting handles normal cleanup instantly; the cyclic GC is the backup that cleans up objects that are only pointing at each other.

---

### __slots__ — what it does and when it matters

**Analogy:** By default every Python object gets a filing cabinet (`__dict__`) where you can stuff any attribute you like. `__slots__` replaces the cabinet with a fixed set of labelled hooks on the wall — faster to access, much less space, but you can only hang what's listed.

By declaring `__slots__`, you tell Python exactly which attributes instances will have. Python ditches the per-instance dictionary and stores the values directly in the object's memory. For classes where you create millions of instances — price ticks, tree nodes, data records — this can cut memory use by 30–50%.

The trade-off: you can no longer add surprise attributes at runtime, and subclasses that don't also declare `__slots__` get a dict anyway (and lose the savings).

```python
import sys

class WithDict:
    def __init__(self, x, y):
        self.x, self.y = x, y

class WithSlots:
    __slots__ = ('x', 'y')   # only these two attributes are allowed
    def __init__(self, x, y):
        self.x, self.y = x, y

a = WithDict(1, 2)
b = WithSlots(1, 2)

print(sys.getsizeof(a.__dict__))   # ~200 bytes — the hidden dict structure
print(hasattr(b, '__dict__'))      # False — no dict at all
# b.z = 99                         # would raise AttributeError
```

**The trick to remember:** `__slots__` only saves memory if every class in the inheritance chain also defines `__slots__` — one class without it adds a dict back.

---

### Metaclasses

**Analogy:** A class is a factory for objects. A metaclass is a factory for classes. Just as a class controls what its instances look like, a metaclass controls what the class itself looks like when Python creates it.

When Python sees a `class` statement, it calls the metaclass (normally `type`) with the class name, its base classes, and a dictionary of everything defined inside the body. The metaclass returns the finished class object. You can intercept that call to enforce rules, auto-register subclasses, or add methods that would otherwise need to be written by hand in every subclass.

Before writing a metaclass, check whether `__init_subclass__` does the job — it's simpler, runs whenever someone subclasses your class, and covers most registration and validation needs.

```python
class RegistryMeta(type):
    _registry = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:                      # skip the base class itself
            mcs._registry[name] = cls  # auto-register every subclass
        return cls

class Plugin(metaclass=RegistryMeta):
    pass   # the base — not registered

class AudioPlugin(Plugin): pass   # automatically added to the registry
class VideoPlugin(Plugin): pass   # so is this one

print(RegistryMeta._registry)
# {'AudioPlugin': <class 'AudioPlugin'>, 'VideoPlugin': <class 'VideoPlugin'>}
```

**The trick to remember:** reach for `__init_subclass__` first — if you still need to modify the class namespace during creation, then use a metaclass.

---

### The import system and module resolution

**Analogy:** `import foo` is like asking a librarian for a book. First they check the returns desk — maybe someone already brought it back today (`sys.modules` cache). If not, they go look it up on the shelves (`sys.path`). Once found, they read it into a record and put a card in the returns desk so the next person doesn't need to go to the shelves again.

The cache is why importing the same module in ten different files doesn't re-run the module code ten times. The module runs once, and after that everyone gets the same object back from the cache.

Circular imports — where A imports B and B imports A — partially work because the module object goes into the cache before its code finishes running. The risk: if you access something from the circular import before it's been defined, you get an `AttributeError`.

```python
import sys

# Check the cache
print('os' in sys.modules)   # True — Python's startup already imported it

# See where Python looks for files
print(sys.path[:3])          # [script dir, PYTHONPATH entries, stdlib dirs, ...]

# Force a fresh load (useful during development in a REPL)
import importlib
import my_module
importlib.reload(my_module)  # re-reads the file and re-runs the module code
```

**The trick to remember:** always run a file as part of its package (`python -m package.module`) rather than directly — running it directly breaks relative imports because Python doesn't know which package it belongs to.

---

### Dataclasses vs attrs vs plain classes

**Analogy:** You want a box that holds a few named values. A plain class is building the box from scratch with a saw and nails. `@dataclass` is a flat-pack kit — most of the work is done for you. `attrs` is a smarter kit with optional built-in checks that snap together as you assemble.

All three do the same job. The difference is how much boilerplate you write and how much built-in help you get.

`@dataclass` is in the standard library and handles 90% of cases: it auto-generates `__init__`, `__repr__`, and `__eq__` from your field annotations. Use `field(default_factory=list)` whenever a default value is mutable (a list, dict, or set) — otherwise every instance shares the same object.

```python
from dataclasses import dataclass, field

@dataclass
class Order:
    id: int
    items: list[str] = field(default_factory=list)   # each instance gets its own list
    total: float = 0.0

    def __post_init__(self):
        if self.total < 0:
            raise ValueError("total can't be negative")   # validation goes here

o1 = Order(id=1, items=["widget"])
o2 = Order(id=1, items=["widget"])

print(o1 == o2)    # True — __eq__ compares field values automatically
print(repr(o1))    # Order(id=1, items=['widget'], total=0.0) — __repr__ auto-generated
```

**The trick to remember:** mutable defaults (`list`, `dict`, `set`) must use `field(default_factory=...)` — a bare `items: list = []` is caught at class definition time with a `ValueError`.

---

### Type system basics — Protocol, TypeVar, Generic

**Analogy:** Type hints are notes you leave for a spell-checker (mypy or pyright) that runs before your code does. The spell-checker reads your notes and tells you if something doesn't add up — but at runtime Python ignores the notes completely.

`Protocol` is duck typing with a receipt: you write down exactly what methods something needs to have, and the checker verifies that anything passed in actually has them — without forcing you to inherit from a shared base class.

`TypeVar` is a placeholder type: "whatever goes in must be the same type as what comes out." `Generic[T]` makes a whole class work that way — the checker tracks what's stored inside a container.

```python
from typing import Protocol, TypeVar, Generic

class Drawable(Protocol):
    def draw(self) -> None: ...   # anything with a draw() method qualifies — no inheritance needed

def render(item: Drawable) -> None:
    item.draw()   # checker knows draw() exists; no runtime cost

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

s: Stack[int] = Stack()
s.push(1)        # checker: ok, 1 is int
s.push("oops")   # checker: error — expected int
val = s.pop()    # checker knows val is int
```

**The trick to remember:** generics are erased at runtime — `Stack[int]` and `Stack[str]` are the same class object; the type information only exists for the checker.

---

### Common footguns

**Analogy:** These are the three classic traps that even experienced Python developers step into — not because the language is broken, but because the behaviour is consistent with Python's rules, just not what you'd intuitively expect.

**Mutable default arguments** are evaluated once when the function is defined, not on each call. So a list default accumulates across every call that doesn't pass its own list.

**Late-binding closures** capture the variable, not its value. A loop that builds closures will have all of them see the loop variable's *final* value, not the value at creation time.

**`is` vs `==`**: `is` checks whether two names point to the exact same object in memory. `==` checks whether they're equal in value. CPython happens to reuse objects for small integers, which makes `is` look like it works — until it doesn't.

```python
# Mutable default — accumulates across calls
def append_to(val, lst=[]):
    lst.append(val)
    return lst

print(append_to(1))   # [1]
print(append_to(2))   # [1, 2] — same list!

def append_to(val, lst=None):   # correct version
    if lst is None:
        lst = []
    lst.append(val)
    return lst

# Late-binding closure
fns = [lambda: i for i in range(3)]
print([f() for f in fns])      # [2, 2, 2] — all see final i

fns = [lambda i=i: i for i in range(3)]   # fix: default captures value now
print([f() for f in fns])      # [0, 1, 2]

# is vs ==
a, b = 1000, 1000
print(a == b)    # True — same value
print(a is b)    # False — different objects (outside CPython's interning range)
```

**The trick to remember:** use `is` only for `None`, `True`, and `False` — for everything else, use `==`.

---

## Implementation steps (high level)

1. Create `docs/_layouts/python-reference-post.html` (2-tab variant of `cpp-post.html`)
2. For each of the 16 posts:
   a. Create `python-*.html` with `layout: python-reference-post`
   b. Wrap existing content in `<div id="tab-concept">`
   c. Add `<div id="tab-elia12">` with content from this spec
   d. Delete the old `.md` file
3. Verify locally with `bundle exec jekyll serve --future`
4. Commit and push to `working`, merge to `master`

---

## Out of scope

- No changes to any other collection or layout
- No changes to `docs/_config.yml` (the `private` collection config is unchanged)
- No new tags or index page entries

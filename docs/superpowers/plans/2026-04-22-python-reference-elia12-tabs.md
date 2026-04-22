# Python Reference Posts — ELIA12 Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a two-tab layout (Concept / ELIA12) to all 16 Python reference posts in `docs/_private/`.

**Architecture:** Create one new `python-reference-post.html` layout (2-tab variant of `cpp-post.html`), then convert each of the 16 `.md` posts to `.html` with two tab divs — existing content in `tab-concept`, new ELI12 content in `tab-elia12`. Permalinks are unchanged so no links break.

**Tech Stack:** Jekyll, Liquid, HTML/CSS. Reuses `.ql-tabs` CSS and `showTab()` JS pattern already in `cpp-post.html`.

---

## File map

| Action | Path |
|---|---|
| **Create** | `docs/_layouts/python-reference-post.html` |
| Create + delete `.md` | `docs/_private/python-mro.html` |
| Create + delete `.md` | `docs/_private/python-gil.html` |
| Create + delete `.md` | `docs/_private/python-descriptors.html` |
| Create + delete `.md` | `docs/_private/python-data-model.html` |
| Create + delete `.md` | `docs/_private/python-attribute-lookup.html` |
| Create + delete `.md` | `docs/_private/python-scoping.html` |
| Create + delete `.md` | `docs/_private/python-asyncio.html` |
| Create + delete `.md` | `docs/_private/python-generators.html` |
| Create + delete `.md` | `docs/_private/python-context-managers.html` |
| Create + delete `.md` | `docs/_private/python-gc.html` |
| Create + delete `.md` | `docs/_private/python-slots.html` |
| Create + delete `.md` | `docs/_private/python-metaclasses.html` |
| Create + delete `.md` | `docs/_private/python-import-system.html` |
| Create + delete `.md` | `docs/_private/python-dataclasses.html` |
| Create + delete `.md` | `docs/_private/python-type-system.html` |
| Create + delete `.md` | `docs/_private/python-footguns.html` |

---

## Task 1: Create the layout

**Files:**
- Create: `docs/_layouts/python-reference-post.html`

- [ ] **Step 1: Create the layout file**

```html
---
layout: page
---
<article class="post">
  <header class="post-header">
    <h1 class="post-title">{{ page.title }}</h1>
    {% if page.description %}
      <p class="post-description">{{ page.description }}</p>
    {% endif %}
    <p class="post-meta">
      {% if page.date %}<time>{{ page.date | date: "%B %d, %Y" }}</time>{% endif %}
      {% if page.tags.size > 0 %} &middot; {{ page.tags | join: ", " }}{% endif %}
    </p>
  </header>

  <div class="ql-tabs">
    <button class="ql-tab-btn active" onclick="showTab('concept', this)">Concept</button>
    <button class="ql-tab-btn" onclick="showTab('elia12', this)">ELIA12</button>
  </div>

  {{ content }}

</article>

<style>
.ql-tabs {
  display: flex;
  gap: 4px;
  margin: 24px 0 0 0;
  border-bottom: 2px solid #e8e8e8;
}
.ql-tab-btn {
  padding: 8px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
  color: #555;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  font-family: inherit;
}
.ql-tab-btn.active {
  color: #2a7ae2;
  border-bottom: 2px solid #2a7ae2;
  font-weight: 600;
}
.ql-tab-content {
  padding: 24px 0;
}
.cpp-note {
  border-left: 4px solid #e8e8e8;
  padding: 6px 14px;
  font-size: 14px;
  color: #828282;
  margin: 4px 0 20px;
}
.cpp-note code {
  background: #eef;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  padding: 1px 4px;
  font-size: 13px;
  color: #111;
}
</style>

<script>
function showTab(name, btn) {
  document.querySelectorAll('.ql-tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.ql-tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).style.display = 'block';
  btn.classList.add('active');
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add docs/_layouts/python-reference-post.html
git commit -m "feat(layout): add python-reference-post with Concept/ELIA12 tabs"
```

---

## Task 2: python-mro

**Files:**
- Create: `docs/_private/python-mro.html`
- Delete: `docs/_private/python-mro.md`

- [ ] **Step 1: Create `docs/_private/python-mro.html`**

```html
---
layout: python-reference-post
title: "Python: MRO and how super() resolves"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-mro/
---

<div id="tab-concept" class="ql-tab-content">

  <p>Python's method resolution order (MRO) determines the sequence in which base classes are searched when you access a method or attribute. It is computed once at class creation time using the C3 linearisation algorithm and stored in <code>ClassName.__mro__</code>.</p>

  <p>C3 works by merging the MROs of each base class left-to-right, always picking the first class that does not appear later in any other base's MRO. The practical result: Python respects the order you write your base classes, never visits a class twice, and always places a class before its bases.</p>

  <p><code>super()</code> is not "call the parent class". It returns a proxy that starts the MRO walk at the class <em>after</em> the one where <code>super()</code> appears. In a chain <code>C → A → B → object</code>, calling <code>super()</code> inside <code>A</code> looks in <code>B</code> next, then <code>object</code>. This is what makes cooperative multiple inheritance work: every class in the chain calls <code>super()</code>, so the call propagates all the way up rather than stopping at the first base.</p>

  <p>The implication is that the class <code>super()</code> will delegate to depends on the <em>full</em> MRO of the instance being created, not just on what the class directly inherits from. You cannot know which class <code>super()</code> in <code>A</code> will call without knowing what <code>A</code> is mixed into.</p>

  <pre><code class="language-python">class A:
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
C().greet()   # prints C, A, B</code></pre>

  <p>Watch out: if any class in the chain does not call <code>super().__init__()</code>, initialisation silently stops there — base classes further along the MRO never run.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>Imagine Python keeps a ranked to-do list for every class: "if you can't find the method here, check this one next, then that one." That list is the MRO.</p>

  <p><code>super()</code> doesn't just call your parent class. It says "go to the next name on the list." So if the list is <code>C → A → B → object</code> and you call <code>super()</code> inside <code>A</code>, Python looks in <code>B</code> next — not back at <code>C</code>. This matters when you mix multiple classes together: the list changes based on the combination, so you can't know where <code>super()</code> lands without knowing the full list.</p>

  <p>Every class in a cooperative chain passes the baton using <code>super()</code>. If one class drops it, the rest of the chain never runs.</p>

  <pre><code class="language-python">class A:
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
C().greet()   # prints C, A, B — walks the whole list</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> if one class skips <code>super()</code>, every class after it on the list is silently ignored.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-mro.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-mro.html docs/_private/python-mro.md
git commit -m "feat(private): add ELIA12 tab to python-mro"
```

---

## Task 3: python-gil

**Files:**
- Create: `docs/_private/python-gil.html`
- Delete: `docs/_private/python-gil.md`

- [ ] **Step 1: Create `docs/_private/python-gil.html`**

```html
---
layout: python-reference-post
title: "Python: The GIL and concurrency tradeoffs"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-gil/
---

<div id="tab-concept" class="ql-tab-content">

  <p>The Global Interpreter Lock is a mutex in CPython that prevents more than one thread from executing Python bytecode at the same time. It exists because CPython's memory management — specifically reference counting — is not thread-safe without it. Rather than lock every individual object, CPython locks the interpreter itself and releases the lock periodically so other threads can run.</p>

  <p>The consequence is that Python threads do not give you parallel CPU execution for pure Python code. Two threads on an eight-core machine still take turns. The GIL is released during I/O operations and by C extensions that opt out (NumPy, for instance), which is why threading still helps for network-bound or I/O-bound work: while one thread blocks waiting for a socket, the GIL is free and another thread runs.</p>

  <p>For CPU-bound work you need <code>multiprocessing</code>. Each process has its own interpreter and its own GIL, so you get true parallelism. The cost is higher memory and slower communication between processes — you pass data via queues or shared memory rather than shared objects.</p>

  <p><code>asyncio</code> is different from both. It is single-threaded, single-process, and achieves concurrency through cooperative scheduling. Coroutines yield control at <code>await</code> points; the event loop runs something else while the coroutine waits. No parallelism, but very efficient for handling thousands of concurrent I/O-bound operations.</p>

  <p>Rule of thumb: many concurrent I/O operations → asyncio. Simple I/O-bound scripts → threads. CPU-bound work → multiprocessing.</p>

  <pre><code class="language-python">import asyncio, threading, multiprocessing

# asyncio: concurrent I/O, single thread, cooperative
async def fetch(url): ...

# threading: I/O-bound, GIL released during I/O waits
t = threading.Thread(target=do_io_work)

# multiprocessing: CPU-bound, each process gets its own GIL
p = multiprocessing.Process(target=crunch_numbers)</code></pre>

  <p>Watch out: mixing asyncio and threads is possible but error-prone — use <code>loop.run_in_executor()</code> to run blocking code in a thread pool from an async context rather than calling blocking functions directly inside a coroutine.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>Imagine a kitchen with one knife. Multiple chefs (threads) can all be in the kitchen, but only one can use the knife at a time. The GIL is that knife rule.</p>

  <p>Python's threads don't run truly in parallel for Python code — they take turns. The lock releases when a thread is waiting for something (like a file download or database query), so threading still helps when you're mostly waiting, not computing.</p>

  <p>If you need to actually run things at the same time on multiple CPU cores, you need separate processes — each gets its own kitchen, own knife. The downside is they can't easily share their cutting boards.</p>

  <p><code>asyncio</code> is a third option: one chef, one knife, but the chef switches tasks the moment they're waiting for anything, so they're never standing around idle.</p>

  <pre><code class="language-python">import asyncio

async def fetch(n):
    print(f"starting task {n}")
    await asyncio.sleep(1)    # chef puts this task down and picks up another
    print(f"finished task {n}")

async def main():
    # all three run "at the same time" — total wait is ~1s, not 3s
    await asyncio.gather(fetch(1), fetch(2), fetch(3))

asyncio.run(main())</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> threads share the GIL (take turns), processes bypass it (truly parallel), asyncio ignores it (one thread, cooperative switching).</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-gil.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-gil.html docs/_private/python-gil.md
git commit -m "feat(private): add ELIA12 tab to python-gil"
```

---

## Task 4: python-descriptors

**Files:**
- Create: `docs/_private/python-descriptors.html`
- Delete: `docs/_private/python-descriptors.md`

- [ ] **Step 1: Create `docs/_private/python-descriptors.html`**

```html
---
layout: python-reference-post
title: "Python: Descriptors — data, non-data, and what they power"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-descriptors/
---

<div id="tab-concept" class="ql-tab-content">

  <p>A descriptor is any object that defines <code>__get__</code>, and optionally <code>__set__</code> or <code>__delete__</code>. When an attribute lookup finds a descriptor stored on a class (not an instance), Python calls the descriptor's methods instead of returning the object directly. This single mechanism powers <code>@property</code>, instance methods, <code>@classmethod</code>, and <code>@staticmethod</code>.</p>

  <p>A <em>data descriptor</em> defines both <code>__get__</code> and <code>__set__</code> (or <code>__delete__</code>). It takes priority over the instance's <code>__dict__</code>. A <em>non-data descriptor</em> defines only <code>__get__</code> — the instance <code>__dict__</code> takes priority over it, which is why you can shadow a method by setting an instance attribute with the same name.</p>

  <p>Functions are non-data descriptors. When you access <code>obj.method</code>, Python calls <code>function.__get__(obj, type(obj))</code>, which returns a bound method. That is how <code>self</code> gets bound — not by any special syntax, but because the function object's <code>__get__</code> wraps itself with the instance. <code>classmethod</code> and <code>staticmethod</code> work the same way but bind differently.</p>

  <pre><code class="language-python">class Validated:
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
p.amount = "free"  # raises TypeError</code></pre>

  <p>Watch out: store per-instance data in <code>obj.__dict__</code> keyed by <code>self._name</code>, never on the descriptor instance itself — the descriptor is one object shared across every instance of the class.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>A descriptor is like a smart doorbell. Instead of just ringing when pressed, it can run a custom action — log who rang, check if the time is allowed, play a different sound. Attach one to a class attribute and Python calls the doorbell's logic instead of just handing over the value.</p>

  <p>When Python finds a descriptor sitting on a class (not on an instance), it calls the descriptor's <code>__get__</code> method instead of returning the object directly. This is how <code>@property</code> works — it's just a built-in descriptor. Functions are descriptors too: that's how <code>self</code> gets bound when you call a method.</p>

  <p>A <em>data descriptor</em> also defines <code>__set__</code>, so it controls both reading and writing. It beats the instance's own dictionary, which is why a <code>@property</code> setter can't be bypassed by writing to the instance directly.</p>

  <pre><code class="language-python">class Validated:
    def __set_name__(self, owner, name):
        self._name = name   # remembers which attribute name it's attached to

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self                      # accessed on the class, not an instance
        return obj.__dict__.get(self._name)  # read from the instance's own storage

    def __set__(self, obj, value):
        if not isinstance(value, (int, float)):
            raise TypeError(f"{self._name} must be a number")
        obj.__dict__[self._name] = value     # store on the instance, not the descriptor

class Price:
    amount = Validated()   # one descriptor, shared by every Price instance

p = Price()
p.amount = 9.99    # calls __set__ → passes validation
p.amount = "free"  # raises TypeError</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> store per-instance data in <code>obj.__dict__</code>, never on the descriptor itself — the descriptor is one object shared by every instance.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-descriptors.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-descriptors.html docs/_private/python-descriptors.md
git commit -m "feat(private): add ELIA12 tab to python-descriptors"
```

---

## Task 5: python-data-model

**Files:**
- Create: `docs/_private/python-data-model.html`
- Delete: `docs/_private/python-data-model.md`

- [ ] **Step 1: Create `docs/_private/python-data-model.html`**

```html
---
layout: python-reference-post
title: "Python: Data model dunders"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-data-model/
---

<div id="tab-concept" class="ql-tab-content">

  <p>Python's data model lets you hook into the language's core operations by defining special methods. Three areas come up most often.</p>

  <p><code>__repr__</code> vs <code>__str__</code>: <code>__repr__</code> is the unambiguous, developer-facing representation — ideally something you could <code>eval()</code> back to an equivalent object. <code>__str__</code> is the readable, end-user-facing representation. <code>str()</code> falls back to <code>__repr__</code> if <code>__str__</code> is not defined, so implementing <code>__repr__</code> is the higher-value of the two.</p>

  <p><code>__eq__</code> and <code>__hash__</code>: defining <code>__eq__</code> causes Python to set <code>__hash__</code> to <code>None</code>, making instances unhashable — they cannot be used in sets or as dict keys. If you want both value equality and hashability, define <code>__hash__</code> explicitly. The rule is that objects which compare equal must have the same hash; violating this silently corrupts dictionaries and sets.</p>

  <p><code>__getattr__</code> vs <code>__getattribute__</code>: <code>__getattribute__</code> is called on <em>every</em> attribute access without exception. <code>__getattr__</code> is called only after normal lookup has <em>failed</em>. Override <code>__getattr__</code> as a fallback for missing attributes; override <code>__getattribute__</code> only when you need to intercept all access, and always delegate to <code>object.__getattribute__(self, name)</code> to avoid infinite recursion.</p>

  <pre><code class="language-python">class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Point({self.x!r}, {self.y!r})"   # eval-able

    def __eq__(self, other):
        return isinstance(other, Point) and (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))   # required because __eq__ is defined

    def __getattr__(self, name):        # only reached for missing attributes
        raise AttributeError(f"Point has no attribute {name!r}")</code></pre>

  <p>Watch out: <code>__getattr__</code> is not called when the attribute <em>exists</em> — it is the last-resort fallback. If you want to intercept access to attributes that <em>do</em> exist, you need <code>__getattribute__</code>.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>Python has a list of "magic words" — if you define a method with one of those names on your class, Python calls it automatically at the right moment. <code>__repr__</code> is called when Python wants to show your object, <code>__eq__</code> when it wants to compare two objects, and so on.</p>

  <p><code>__repr__</code> gives the developer-friendly display: ideally something you could paste into a Python prompt to recreate the object. <code>__str__</code> gives the user-friendly display. If you only write one, write <code>__repr__</code> — Python falls back to it when <code>__str__</code> is missing.</p>

  <p><code>__eq__</code> lets you define what "equal" means. But defining it wipes out hashability by default, meaning you can't put instances in a set or use them as dict keys. Fix it by also defining <code>__hash__</code>.</p>

  <pre><code class="language-python">class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"   # shown in the REPL, tracebacks, everywhere

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
print(repr(p1))           # Point(1, 2)</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> if you define <code>__eq__</code>, always define <code>__hash__</code> too — otherwise your objects silently become unusable in sets and dicts.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-data-model.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-data-model.html docs/_private/python-data-model.md
git commit -m "feat(private): add ELIA12 tab to python-data-model"
```

---

## Task 6: python-attribute-lookup

**Files:**
- Create: `docs/_private/python-attribute-lookup.html`
- Delete: `docs/_private/python-attribute-lookup.md`

- [ ] **Step 1: Create `docs/_private/python-attribute-lookup.html`**

```html
---
layout: python-reference-post
title: "Python: Attribute lookup order end-to-end"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-attribute-lookup/
---

<div id="tab-concept" class="ql-tab-content">

  <p>When you write <code>obj.name</code>, Python calls <code>type(obj).__getattribute__(obj, 'name')</code>, which runs the following chain in order.</p>

  <p>First, Python searches <code>type(obj).__mro__</code> — the class and all its bases. If it finds a <em>data descriptor</em> (an object defining both <code>__get__</code> and <code>__set__</code>), the descriptor's <code>__get__</code> is invoked immediately and lookup stops. Data descriptors win over everything else, including the instance dict.</p>

  <p>If no data descriptor is found, Python checks <code>obj.__dict__</code>. If the name is there, that value is returned directly.</p>

  <p>If not in the instance dict, Python searches the class hierarchy again for a <em>non-data descriptor</em> (defines only <code>__get__</code>). If found, its <code>__get__</code> is called.</p>

  <p>If none of the above, the raw class attribute is returned as-is.</p>

  <p>Finally, if every step fails, <code>__getattr__</code> is called if defined. If that also raises <code>AttributeError</code>, the lookup fails with the error the caller sees.</p>

  <pre><code class="language-python">class WithProp:
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
print(p.x)                # 99 — instance dict beats non-data class attribute</code></pre>

  <p>Watch out: this ordering is why you cannot bypass a <code>@property</code> setter by writing <code>self.x = value</code> from outside the class — <code>__set__</code> on the property is called instead. If you genuinely need to write to <code>__dict__</code> directly from inside the class, use <code>self.__dict__['x'] = value</code>.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>When you ask Python for <code>obj.name</code>, Python runs through a priority queue — like a bouncer checking four different lists before deciding who gets in. The lists are checked in a fixed order, and the first match wins.</p>

  <p>The order is: (1) data descriptor on the class, (2) the instance's own dictionary, (3) non-data descriptor or plain class attribute, (4) <code>__getattr__</code> as a last resort. A <code>@property</code> is a data descriptor, so it always beats whatever is in the instance's own dictionary — you can't shadow it by setting an instance attribute with the same name.</p>

  <pre><code class="language-python">class WithProp:
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
print(p.x)                # 99 — instance dict wins over plain class attribute</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> data descriptors (like <code>@property</code>) beat the instance dict; plain class attributes lose to it.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-attribute-lookup.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-attribute-lookup.html docs/_private/python-attribute-lookup.md
git commit -m "feat(private): add ELIA12 tab to python-attribute-lookup"
```

---

## Task 7: python-scoping

**Files:**
- Create: `docs/_private/python-scoping.html`
- Delete: `docs/_private/python-scoping.md`

- [ ] **Step 1: Create `docs/_private/python-scoping.html`**

```html
---
layout: python-reference-post
title: "Python: Name binding and scoping"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-scoping/
---

<div id="tab-concept" class="ql-tab-content">

  <p>Python resolves names using LEGB: Local → Enclosing → Global → Built-in. At any point in code, Python searches those four scopes in order and uses the first match. A name is "local" to a function if it appears on the left side of an assignment anywhere in that function's body — even if the assignment comes after the reference.</p>

  <p>Closures capture variables by reference, not by value. The enclosing scope's variable is shared, not copied at the time the closure is created. This causes the classic late-binding problem: closures created in a loop all see the loop variable's <em>final</em> value when called, not the value at the moment each closure was defined.</p>

  <p><code>nonlocal</code> lets an inner function rebind a variable in its enclosing scope. <code>global</code> does the same for module scope. Without these keywords, any assignment in an inner function creates a new local variable, shadowing the outer one rather than rebinding it.</p>

  <pre><code class="language-python"># Late-binding gotcha
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
print(c(), c(), c())   # 1, 2, 3</code></pre>

  <p>Watch out: if you assign to a name anywhere in a function body, Python treats it as local <em>throughout</em> the entire function — reading it before the assignment raises <code>UnboundLocalError</code>, not a lookup in the enclosing scope. This catches people who add an assignment to an existing function and suddenly break a line above it.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>Python looks for a name like you'd look for your keys — first in your own pockets (local), then in the last jacket you borrowed (enclosing function), then in the house (module globals), then in the junk drawer everyone shares (built-ins). First match wins.</p>

  <p>There's one nasty surprise: if you assign to a name <em>anywhere</em> in a function body, Python treats it as local <em>throughout the entire function</em> — even lines above the assignment. So reading it before assigning raises an error, not a look-up in the outer scope.</p>

  <p>Closures capture the variable itself, not its value at the moment the closure was created. In loops this bites hard: every closure ends up seeing the loop variable's final value.</p>

  <pre><code class="language-python"># Surprise: assignment makes x local for the whole function
x = 10
def f():
    print(x)   # UnboundLocalError — x is local because of the line below
    x = 20

# Late-binding closure gotcha
fns = [lambda: i for i in range(3)]
print([f() for f in fns])    # [2, 2, 2] — all closures share the same i

# Fix: capture the value now as a default argument
fns = [lambda i=i: i for i in range(3)]
print([f() for f in fns])    # [0, 1, 2]</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> any assignment in a function makes that name local for the whole function — there's no such thing as "local from here down."</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-scoping.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-scoping.html docs/_private/python-scoping.md
git commit -m "feat(private): add ELIA12 tab to python-scoping"
```

---

## Task 8: python-asyncio

**Files:**
- Create: `docs/_private/python-asyncio.html`
- Delete: `docs/_private/python-asyncio.md`

- [ ] **Step 1: Create `docs/_private/python-asyncio.html`**

```html
---
layout: python-reference-post
title: "Python: The asyncio execution model"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-asyncio/
---

<div id="tab-concept" class="ql-tab-content">

  <p><code>asyncio</code> runs on a single-threaded event loop. The loop maintains a queue of tasks — scheduled coroutines. On each iteration it picks a ready task, runs it until it hits an <code>await</code>, then suspends it and moves to the next ready task. There is no thread switching and no parallelism; concurrency comes from coroutines voluntarily yielding control.</p>

  <p>A coroutine is a function defined with <code>async def</code>. Calling it does not execute it — it returns a coroutine object. To run it you either <code>await</code> it from another coroutine, or wrap it in a task with <code>asyncio.create_task()</code>, which schedules it on the event loop and lets it run concurrently with the caller. <code>await</code> suspends the current coroutine and hands control back to the event loop until the awaited thing completes.</p>

  <p>The critical pitfall is blocking the event loop. Any call that does not release control — <code>time.sleep()</code>, synchronous file I/O, a <code>requests.get()</code>, a CPU-heavy loop — freezes every other coroutine for its entire duration. The event loop is cooperative; it cannot preempt you. Use <code>asyncio.sleep()</code> in place of <code>time.sleep()</code>, and <code>loop.run_in_executor()</code> to push genuinely blocking work into a thread pool.</p>

  <pre><code class="language-python">import asyncio

async def fetch(n):
    print(f"start {n}")
    await asyncio.sleep(1)   # yields control — other tasks run here
    print(f"done {n}")
    return n

async def main():
    # gather runs all three concurrently; total wall time ~1s, not 3s
    results = await asyncio.gather(fetch(1), fetch(2), fetch(3))
    print(results)   # [1, 2, 3]

asyncio.run(main())</code></pre>

  <p>Watch out: <code>asyncio.gather()</code> runs coroutines concurrently within the event loop, but they still execute one at a time — if any coroutine contains a blocking call with no <code>await</code>, it starves the others for the entire duration of that call.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>Imagine one waiter serving many tables. The waiter doesn't clone themselves — they take an order, go put it in, then immediately serve another table while the kitchen works. They're always moving; they never stand waiting. That's asyncio: one thread, many tasks, switching whenever a task is waiting for something.</p>

  <p>The key rule is that tasks have to <em>choose</em> to hand control back — they're not interrupted. An <code>await</code> is the waiter saying "I'm done with this table for now, let me go do something else." A task that never <code>await</code>s freezes every other task for its entire duration, because nobody else gets a turn.</p>

  <pre><code class="language-python">import asyncio

async def fetch(n):
    print(f"start {n}")
    await asyncio.sleep(1)   # hands control back — other tasks run here
    print(f"done {n}")

async def main():
    # gather runs all three "at the same time"
    # total time ~1s because all three wait concurrently
    await asyncio.gather(fetch(1), fetch(2), fetch(3))

asyncio.run(main())
# start 1, start 2, start 3 ... (all start before any finish)
# done 1, done 2, done 3</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> if a function doesn't <code>await</code> anything, it blocks the whole event loop — use <code>asyncio.sleep(0)</code> to yield briefly, or push blocking work to a thread pool with <code>run_in_executor</code>.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-asyncio.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-asyncio.html docs/_private/python-asyncio.md
git commit -m "feat(private): add ELIA12 tab to python-asyncio"
```

---

## Task 9: python-generators

**Files:**
- Create: `docs/_private/python-generators.html`
- Delete: `docs/_private/python-generators.md`

- [ ] **Step 1: Create `docs/_private/python-generators.html`**

```html
---
layout: python-reference-post
title: "Python: Generator and iterator protocol"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-generators/
---

<div id="tab-concept" class="ql-tab-content">

  <p>Python's iterator protocol requires two methods: <code>__iter__</code> (returns the iterator itself) and <code>__next__</code> (returns the next value or raises <code>StopIteration</code>). Any object implementing these can be used in a <code>for</code> loop. An iterable only needs <code>__iter__</code> — it returns a fresh iterator each time, which carries the traversal state.</p>

  <p>A generator function contains <code>yield</code>. Calling it does not execute the body; it returns a generator object that implements the iterator protocol automatically. Execution resumes from the last <code>yield</code> each time <code>__next__</code> is called. This gives you lazy evaluation — values are produced on demand, which matters when a sequence is large or infinite.</p>

  <p>Generator expressions (<code>(x*x for x in range(n))</code>) are syntactic sugar for simple generators and produce one value at a time. For anything more complex — state between yields, early termination, infinite sequences — a generator function is cleaner than a class implementing <code>__iter__</code> and <code>__next__</code> by hand.</p>

  <p>Generators also support <code>send(value)</code>, which resumes the generator and passes a value back in as the result of the <code>yield</code> expression, enabling two-way communication between the caller and the generator.</p>

  <pre><code class="language-python">def fibonacci():
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
print(acc.send(5))   # 15</code></pre>

  <p>Watch out: a generator can only be iterated once. After <code>StopIteration</code> is raised, further calls to <code>next()</code> keep raising it. If you need to iterate a generator multiple times, collect it into a list first, or write a class whose <code>__iter__</code> creates a fresh generator each call.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>A regular list gives you all the items at once — like printing every page of a book and handing them over. A generator is more like a storyteller reading one page at a time: you get the next page only when you ask. Nothing is produced until it's needed.</p>

  <p>The magic word is <code>yield</code>. When Python sees it in a function, the function becomes a generator. Calling the function doesn't run the body at all — it just creates the storyteller. Each time you call <code>next()</code> on it, the function runs until the next <code>yield</code>, pauses, and hands you the value. When there's nothing left, it stops.</p>

  <p>This matters for large or infinite sequences: you never store everything in memory at once.</p>

  <pre><code class="language-python">def fibonacci():
    a, b = 0, 1
    while True:        # infinite loop — safe because nothing runs until you ask
        yield a        # pause here, hand out the value, wait for next()
        a, b = b, a + b

gen = fibonacci()

print(next(gen))   # 0
print(next(gen))   # 1
print(next(gen))   # 1

# or ask for a batch
print([next(gen) for _ in range(5)])   # [2, 3, 5, 8, 13]</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> a generator can only be walked through once — after it runs out, it's empty for good. Collect it into a list if you need to loop over it more than once.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-generators.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-generators.html docs/_private/python-generators.md
git commit -m "feat(private): add ELIA12 tab to python-generators"
```

---

## Task 10: python-context-managers

**Files:**
- Create: `docs/_private/python-context-managers.html`
- Delete: `docs/_private/python-context-managers.md`

- [ ] **Step 1: Create `docs/_private/python-context-managers.html`**

```html
---
layout: python-reference-post
title: "Python: Context managers and the with protocol"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-context-managers/
---

<div id="tab-concept" class="ql-tab-content">

  <p>A context manager defines <code>__enter__</code> and <code>__exit__</code>. When Python executes <code>with expr as x:</code>, it calls <code>expr.__enter__()</code> and binds the return value to <code>x</code>. When the block exits — whether normally or via exception — Python calls <code>expr.__exit__(exc_type, exc_val, exc_tb)</code>. If those three arguments are <code>None</code>, the block exited cleanly; if they are set, an exception occurred.</p>

  <p><code>__exit__</code> decides what to do with the exception. Returning a truthy value suppresses it and execution continues after the <code>with</code> block. Returning <code>None</code> or <code>False</code> lets it propagate. This is what makes context managers reliable for resource cleanup: the exit method runs regardless of whether an exception was raised.</p>

  <p><code>contextlib.contextmanager</code> lets you write a context manager as a generator function, avoiding the need for a class. Everything before <code>yield</code> is the <code>__enter__</code> logic; the yielded value becomes the <code>as</code> target; everything in the <code>finally</code> block is the <code>__exit__</code> logic and runs even on exception.</p>

  <pre><code class="language-python">from contextlib import contextmanager
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
    index = {v: i for i, v in enumerate(range(1_000_000))}</code></pre>

  <p>Watch out: if you suppress an exception in <code>__exit__</code> (by returning <code>True</code>), execution continues after the <code>with</code> block, not inside it. If you only want to suppress specific exception types, check <code>exc_type</code> before returning <code>True</code> — a bare <code>return True</code> swallows every exception, including <code>KeyboardInterrupt</code>.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>A context manager is like a changing room attendant. They hand you a key when you enter (<code>__enter__</code>), and take it back when you leave (<code>__exit__</code>) — whether you walked out calmly or were carried out. The door is always locked behind you.</p>

  <p>This is useful for anything that needs guaranteed cleanup: open a file → do work → close it, even if the work crashes. The <code>with</code> statement does this automatically. You can write your own with <code>contextlib.contextmanager</code> using a generator: everything before <code>yield</code> is the setup, everything after is the teardown.</p>

  <pre><code class="language-python">from contextlib import contextmanager
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

# prints: sorting: 0.083s  (or similar)</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> <code>__exit__</code> runs even if an exception is raised — but if you return <code>True</code> from it, the exception is silently swallowed, so be deliberate about that.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-context-managers.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-context-managers.html docs/_private/python-context-managers.md
git commit -m "feat(private): add ELIA12 tab to python-context-managers"
```

---

## Task 11: python-gc

**Files:**
- Create: `docs/_private/python-gc.html`
- Delete: `docs/_private/python-gc.md`

- [ ] **Step 1: Create `docs/_private/python-gc.html`**

```html
---
layout: python-reference-post
title: "Python: Reference counting and the cyclic garbage collector"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-gc/
---

<div id="tab-concept" class="ql-tab-content">

  <p>CPython tracks object lifetime through reference counting. Every object carries a count of how many references point to it. The count increments when you assign the object to a variable, pass it to a function, or store it in a container; it decrements when a reference is removed. When the count reaches zero, the object is deallocated immediately and deterministically — no pause, no delay.</p>

  <p>Reference counting is fast and predictable, but it has one fundamental flaw: reference cycles. If object A holds a reference to B and B holds a reference back to A, their counts never reach zero even after all external references are gone. Neither can be freed by reference counting alone.</p>

  <p>CPython's cyclic garbage collector handles this. It runs periodically using a generational scheme — three generations, with new objects in generation 0. The collector identifies isolated cycles (groups of objects reachable only from each other, with no external references) and deallocates them. You can inspect and control it via the <code>gc</code> module, or disable it for short-lived processes where you know you're not creating cycles.</p>

  <pre><code class="language-python">import gc

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

print(gc.get_count())   # (gen0_count, gen1_count, gen2_count)</code></pre>

  <p>Watch out: <code>__del__</code> finalizers on objects in cycles have historically prevented the cyclic GC from collecting them — since Python 3.4 (PEP 442) this is no longer a hard blocker, but objects with <code>__del__</code> in cycles are still a code smell. Prefer context managers or <code>weakref</code> for cleanup involving cyclically referenced objects.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>Every object in Python carries a tally: how many things are pointing at it. When that tally hits zero, the object is deleted immediately — like a library book that gets reshelved the moment the last person returns their copy.</p>

  <p>The problem: if two objects point at each other, their tallies never hit zero, even if nobody else in the program can reach them. This is a reference cycle. Python has a second system — the cyclic garbage collector — that periodically hunts for these stranded groups and cleans them up.</p>

  <pre><code class="language-python">import gc

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

gc.collect()  # cyclic GC finds the isolated loop and frees both</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> reference counting handles normal cleanup instantly; the cyclic GC is the backup that cleans up objects that are only pointing at each other.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-gc.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-gc.html docs/_private/python-gc.md
git commit -m "feat(private): add ELIA12 tab to python-gc"
```

---

## Task 12: python-slots

**Files:**
- Create: `docs/_private/python-slots.html`
- Delete: `docs/_private/python-slots.md`

- [ ] **Step 1: Create `docs/_private/python-slots.html`**

```html
---
layout: python-reference-post
title: "Python: __slots__ — what it does and when it matters"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-slots/
---

<div id="tab-concept" class="ql-tab-content">

  <p>By default every Python instance has a <code>__dict__</code> — a hash table that stores its attributes. <code>__dict__</code> is flexible (you can add arbitrary attributes at runtime) but carries overhead: memory for the dict structure itself, even for objects with just two or three attributes.</p>

  <p>Defining <code>__slots__</code> as a class-level tuple tells Python to allocate a fixed set of named slots for instances instead of a <code>__dict__</code>. Each slot becomes a data descriptor on the class, and the slot value is stored directly in the object's memory layout rather than in a separate hash table. The result: no per-instance <code>__dict__</code>, lower memory (often 30–50% for small objects), and slightly faster attribute access because the slot's offset is fixed.</p>

  <p>Use <code>__slots__</code> when you have many instances of a small, fixed-schema object — nodes in a tree, records in a streaming pipeline, ticks in a market data feed — where the memory saving is meaningful. It also prevents accidentally adding attributes not in the schema, which is occasionally useful as a lightweight interface guard.</p>

  <pre><code class="language-python">import sys

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
print(hasattr(b, '__dict__'))      # False</code></pre>

  <p>Watch out: if a subclass of a slotted class does not define its own <code>__slots__</code>, it gets a <code>__dict__</code> anyway, negating the memory benefit for subclass instances. Also, <code>__slots__</code> prevents weak references unless <code>'__weakref__'</code> is explicitly included in the tuple.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>By default every Python object gets a filing cabinet (<code>__dict__</code>) where you can stuff any attribute you like. <code>__slots__</code> replaces the cabinet with a fixed set of labelled hooks on the wall — faster to access, much less space, but you can only hang what's listed.</p>

  <p>By declaring <code>__slots__</code>, you tell Python exactly which attributes instances will have. Python ditches the per-instance dictionary and stores the values directly in the object's memory. For classes where you create millions of instances — price ticks, tree nodes, data records — this can cut memory use by 30–50%.</p>

  <p>The trade-off: you can no longer add surprise attributes at runtime, and subclasses that don't also declare <code>__slots__</code> get a dict anyway.</p>

  <pre><code class="language-python">import sys

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
# b.z = 99                         # would raise AttributeError</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> <code>__slots__</code> only saves memory if every class in the inheritance chain also defines <code>__slots__</code> — one class without it adds a dict back.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-slots.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-slots.html docs/_private/python-slots.md
git commit -m "feat(private): add ELIA12 tab to python-slots"
```

---

## Task 13: python-metaclasses

**Files:**
- Create: `docs/_private/python-metaclasses.html`
- Delete: `docs/_private/python-metaclasses.md`

- [ ] **Step 1: Create `docs/_private/python-metaclasses.html`**

```html
---
layout: python-reference-post
title: "Python: Metaclasses"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-metaclasses/
---

<div id="tab-concept" class="ql-tab-content">

  <p>A metaclass is the class of a class. Just as an object is an instance of its class, a class is an instance of its metaclass. The default metaclass for every Python class is <code>type</code>. When Python executes a <code>class</code> statement, it calls the metaclass to construct the class object — passing the class name, tuple of base classes, and namespace dictionary. You can customise this by subclassing <code>type</code>.</p>

  <p>Overriding <code>__new__</code> on a metaclass lets you intercept class creation before the class object exists. Overriding <code>__init__</code> runs after creation. Common legitimate uses: enforcing that subclasses implement certain methods, automatically registering subclasses in a plugin registry, or adding methods to every class in a hierarchy.</p>

  <p>Before reaching for a metaclass, consider whether <code>__init_subclass__</code> or a class decorator solves the problem with less machinery. <code>__init_subclass__</code> runs whenever a class is subclassed and covers most registration and validation use cases with far less conceptual overhead. Metaclasses are rarely the right tool unless you need to modify the class namespace during construction, or you are building a framework where users should not have to inherit from a base class.</p>

  <pre><code class="language-python">class RegistryMeta(type):
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
# {'AudioPlugin': &lt;class 'AudioPlugin'&gt;, 'VideoPlugin': &lt;class 'VideoPlugin'&gt;}</code></pre>

  <p>Watch out: metaclass conflicts occur when two base classes have different metaclasses. Python raises <code>TypeError: metaclass conflict</code>. The resolution is a combined metaclass that inherits from both — but reaching that point usually signals the design is overengineered.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>A class is a factory for objects. A metaclass is a factory for classes. Just as a class controls what its instances look like, a metaclass controls what the class itself looks like when Python creates it.</p>

  <p>When Python sees a <code>class</code> statement, it calls the metaclass (normally <code>type</code>) with the class name, its base classes, and a dictionary of everything defined inside the body. The metaclass returns the finished class object. You can intercept that call to enforce rules, auto-register subclasses, or add methods that would otherwise need to be written by hand in every subclass.</p>

  <p>Before writing a metaclass, check whether <code>__init_subclass__</code> does the job — it's simpler, runs whenever someone subclasses your class, and covers most registration and validation needs.</p>

  <pre><code class="language-python">class RegistryMeta(type):
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
# {'AudioPlugin': ..., 'VideoPlugin': ...}</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> reach for <code>__init_subclass__</code> first — if you still need to modify the class namespace during creation, then use a metaclass.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-metaclasses.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-metaclasses.html docs/_private/python-metaclasses.md
git commit -m "feat(private): add ELIA12 tab to python-metaclasses"
```

---

## Task 14: python-import-system

**Files:**
- Create: `docs/_private/python-import-system.html`
- Delete: `docs/_private/python-import-system.md`

- [ ] **Step 1: Create `docs/_private/python-import-system.html`**

```html
---
layout: python-reference-post
title: "Python: The import system and module resolution"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-import-system/
---

<div id="tab-concept" class="ql-tab-content">

  <p>When you write <code>import foo</code>, Python first checks <code>sys.modules</code> — a cache of every module imported so far. If <code>foo</code> is there, the cached module object is returned immediately. This is why importing the same module in ten files does not re-execute the module code ten times.</p>

  <p>If not cached, Python searches for the module using a sequence of <em>finders</em> stored in <code>sys.meta_path</code>. The default finders check built-in modules (compiled into the interpreter), frozen modules, and then the file system. For file system modules, Python searches directories in <code>sys.path</code> in order, looking for a <code>.py</code> file, a package directory (a directory with <code>__init__.py</code>), or a compiled extension.</p>

  <p>Once found, a <em>loader</em> executes the module code in a fresh namespace. Crucially, the (partially-initialised) module object is added to <code>sys.modules</code> <em>before</em> the module code finishes running. This is what makes circular imports partially work — the importing module gets back a module object that exists, but attributes defined later in the circular dependency may not exist yet on that object.</p>

  <pre><code class="language-python">import sys, importlib

# sys.modules cache
print('os' in sys.modules)          # True — already imported by Python startup
print('my_module' in sys.modules)   # False if never imported

# Search path
print(sys.path[:3])                 # script dir, PYTHONPATH entries, stdlib

# Force a reload during development (REPL / hot-reload scenarios)
import my_module
importlib.reload(my_module)</code></pre>

  <p>Watch out: relative imports (<code>from . import util</code>) only work inside a package — a directory that Python recognises as a package. Running a file directly as a script (<code>python package/module.py</code>) breaks relative imports because the package context is not established. Use <code>python -m package.module</code> instead.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p><code>import foo</code> is like asking a librarian for a book. First they check the returns desk — maybe someone already brought it back today (<code>sys.modules</code> cache). If not, they go look it up on the shelves (<code>sys.path</code>). Once found, they read it into a record and put a card in the returns desk so the next person doesn't need to go to the shelves again.</p>

  <p>The cache is why importing the same module in ten different files doesn't re-run the module code ten times. The module runs once, and after that everyone gets the same object back from the cache.</p>

  <p>Circular imports — where A imports B and B imports A — partially work because the module object goes into the cache before its code finishes running. The risk: if you access something from the circular import before it's been defined, you get an <code>AttributeError</code>.</p>

  <pre><code class="language-python">import sys

# Check the cache
print('os' in sys.modules)   # True — Python's startup already imported it

# See where Python looks for files
print(sys.path[:3])          # [script dir, PYTHONPATH entries, stdlib dirs, ...]

# Force a fresh load (useful during development in a REPL)
import importlib
import my_module
importlib.reload(my_module)  # re-reads the file and re-runs the module code</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> always run a file as part of its package (<code>python -m package.module</code>) rather than directly — running it directly breaks relative imports because Python doesn't know which package it belongs to.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-import-system.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-import-system.html docs/_private/python-import-system.md
git commit -m "feat(private): add ELIA12 tab to python-import-system"
```

---

## Task 15: python-dataclasses

**Files:**
- Create: `docs/_private/python-dataclasses.html`
- Delete: `docs/_private/python-dataclasses.md`

- [ ] **Step 1: Create `docs/_private/python-dataclasses.html`**

```html
---
layout: python-reference-post
title: "Python: Dataclasses vs attrs vs plain classes"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-dataclasses/
---

<div id="tab-concept" class="ql-tab-content">

  <p>All three define data-holding classes. The choice is about how much boilerplate Python generates for you and how much validation and transformation logic you need alongside it.</p>

  <p>A plain class gives you full control: you write <code>__init__</code>, <code>__repr__</code>, <code>__eq__</code>, and any other methods yourself. That is correct and often enough for one-off objects, or when the generated defaults do not fit.</p>

  <p><code>@dataclass</code> (stdlib, Python 3.7+) auto-generates <code>__init__</code>, <code>__repr__</code>, and <code>__eq__</code> from class-level annotations. Optional flags generate <code>__hash__</code>, <code>__lt__</code>, and frozen (immutable) variants. Fields with mutable defaults must use <code>field(default_factory=...)</code> — a naked mutable default is caught at class definition time with a <code>ValueError</code>. <code>__post_init__</code> runs after the generated <code>__init__</code> and is where you put validation logic. Zero dependencies, readable, and correct for most use cases.</p>

  <p><code>attrs</code> (third-party) covers the same ground but with more built-in power: validators run automatically in <code>__init__</code>, converters transform values on assignment, and the configuration API is richer. It predated dataclasses and directly influenced their design. Reach for <code>attrs</code> when you need per-field validators, converters, or are already in a codebase that depends on it.</p>

  <pre><code class="language-python">from dataclasses import dataclass, field

@dataclass
class Order:
    id: int
    items: list[str] = field(default_factory=list)   # mutable default — must use field()
    total: float = 0.0

    def __post_init__(self):
        if self.total &lt; 0:
            raise ValueError("total cannot be negative")

o1 = Order(id=1, items=["widget"])
o2 = Order(id=1, items=["widget"])
print(o1 == o2)   # True — __eq__ compares field values
print(repr(o1))   # Order(id=1, items=['widget'], total=0.0)</code></pre>

  <p>Watch out: <code>@dataclass</code> fields are ordered — a field with a default cannot be followed by a field without one (same rule as function arguments). If you hit this constraint with inheritance, use <code>field(default=...)</code> or restructure the class hierarchy.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>You want a box that holds a few named values. A plain class is building the box from scratch with a saw and nails. <code>@dataclass</code> is a flat-pack kit — most of the work is done for you. <code>attrs</code> is a smarter kit with optional built-in checks that snap together as you assemble.</p>

  <p>All three do the same job. The difference is how much boilerplate you write and how much built-in help you get.</p>

  <p><code>@dataclass</code> is in the standard library and handles 90% of cases: it auto-generates <code>__init__</code>, <code>__repr__</code>, and <code>__eq__</code> from your field annotations. Use <code>field(default_factory=list)</code> whenever a default value is mutable (a list, dict, or set) — otherwise every instance shares the same object.</p>

  <pre><code class="language-python">from dataclasses import dataclass, field

@dataclass
class Order:
    id: int
    items: list[str] = field(default_factory=list)   # each instance gets its own list
    total: float = 0.0

    def __post_init__(self):
        if self.total &lt; 0:
            raise ValueError("total can't be negative")   # validation goes here

o1 = Order(id=1, items=["widget"])
o2 = Order(id=1, items=["widget"])

print(o1 == o2)    # True — __eq__ compares field values automatically
print(repr(o1))    # Order(id=1, items=['widget'], total=0.0)</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> mutable defaults (<code>list</code>, <code>dict</code>, <code>set</code>) must use <code>field(default_factory=...)</code> — a bare <code>items: list = []</code> is caught at class definition time with a <code>ValueError</code>.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-dataclasses.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-dataclasses.html docs/_private/python-dataclasses.md
git commit -m "feat(private): add ELIA12 tab to python-dataclasses"
```

---

## Task 16: python-type-system

**Files:**
- Create: `docs/_private/python-type-system.html`
- Delete: `docs/_private/python-type-system.md`

- [ ] **Step 1: Create `docs/_private/python-type-system.html`**

```html
---
layout: python-reference-post
title: "Python: Type system basics — Protocol, TypeVar, Generic"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-type-system/
---

<div id="tab-concept" class="ql-tab-content">

  <p>Python's type hints are evaluated by static analysers (mypy, pyright) rather than at runtime. The three concepts that come up most in practice are <code>Protocol</code>, <code>TypeVar</code>, and <code>Generic</code>.</p>

  <p><code>Protocol</code> enables structural subtyping — duck typing with static verification. A class satisfies a <code>Protocol</code> if it has the required methods and attributes, without needing to explicitly inherit from it. This lets you write functions that accept any object behaving a certain way, without imposing a class hierarchy on the caller.</p>

  <p><code>TypeVar</code> defines a type variable: a placeholder that the type checker replaces with a concrete type at each call site. A function annotated with a <code>TypeVar</code> is generic — the checker can verify that input and output types are consistent with each other. <code>TypeVar('T', bound=Base)</code> constrains the variable to subclasses of <code>Base</code>.</p>

  <p><code>Generic[T]</code> makes a class generic. Callers parameterise it with a concrete type, and the checker tracks what is stored inside — useful for containers, wrappers, and result types.</p>

  <pre><code class="language-python">from typing import Protocol, TypeVar, Generic

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
val = s.pop()   # val inferred as int</code></pre>

  <p>Watch out: at runtime, generics are erased — <code>Stack[int]</code> and <code>Stack[str]</code> are the same class object. Type parameters exist only for the static analyser. If you need to inspect type arguments at runtime, use <code>typing.get_args()</code> on an annotated variable, not on the class itself.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>Type hints are notes you leave for a spell-checker (mypy or pyright) that runs before your code does. The spell-checker reads your notes and tells you if something doesn't add up — but at runtime Python ignores the notes completely.</p>

  <p><code>Protocol</code> is duck typing with a receipt: you write down exactly what methods something needs to have, and the checker verifies that anything passed in actually has them — without forcing you to inherit from a shared base class.</p>

  <p><code>TypeVar</code> is a placeholder type: "whatever goes in must be the same type as what comes out." <code>Generic[T]</code> makes a whole class work that way — the checker tracks what's stored inside a container.</p>

  <pre><code class="language-python">from typing import Protocol, TypeVar, Generic

class Drawable(Protocol):
    def draw(self) -> None: ...   # anything with draw() qualifies — no inheritance needed

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
val = s.pop()    # checker knows val is int</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> generics are erased at runtime — <code>Stack[int]</code> and <code>Stack[str]</code> are the same class object; the type information only exists for the checker.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-type-system.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-type-system.html docs/_private/python-type-system.md
git commit -m "feat(private): add ELIA12 tab to python-type-system"
```

---

## Task 17: python-footguns

**Files:**
- Create: `docs/_private/python-footguns.html`
- Delete: `docs/_private/python-footguns.md`

- [ ] **Step 1: Create `docs/_private/python-footguns.html`**

```html
---
layout: python-reference-post
title: "Python: Common footguns"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-footguns/
---

<div id="tab-concept" class="ql-tab-content">

  <p>Three problems appear consistently in code reviews because they are non-obvious and produce bugs that are hard to trace.</p>

  <p><strong>Mutable default arguments.</strong> Default argument values are evaluated once at function definition time, not on each call. If you use a mutable object — a list, dict, or set — as a default, all calls that omit the argument share the same object. Append to it in one call, and every future call without an explicit argument sees the accumulated state. The fix is to default to <code>None</code> and create the mutable object inside the function body.</p>

  <p><strong>Late binding in closures.</strong> Closures capture the variable, not its value at the time the closure was created. In a loop that builds closures, all of them share the same loop variable — when called, they see its final value. The idiomatic fix is to capture the current value as a default argument, which is evaluated at closure-creation time.</p>

  <p><strong><code>is</code> vs <code>==</code>.</strong> <code>is</code> tests object identity — whether two names point to the same object in memory. <code>==</code> tests equality — whether two objects have the same value. CPython interns small integers (−5 to 256) and some short strings, which makes <code>is</code> appear to work for those values, but this is an implementation detail with no language guarantee.</p>

  <pre><code class="language-python"># Mutable default
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
print(a is b)    # False — outside the interning range, two separate objects</code></pre>

  <p>Watch out: <code>is None</code> is the correct idiom for None checks (<code>if x is None:</code>), because <code>None</code> is a guaranteed singleton — the identity test is both correct and marginally faster than <code>==</code>. For everything else, use <code>==</code>.</p>

</div>

<div id="tab-elia12" class="ql-tab-content" style="display:none">

  <p>These are the three classic traps that even experienced Python developers step into — not because the language is broken, but because the behaviour is consistent with Python's rules, just not what you'd intuitively expect.</p>

  <p><strong>Mutable default arguments</strong> are evaluated once when the function is defined, not on each call. So a list default accumulates across every call that doesn't pass its own list.</p>

  <p><strong>Late-binding closures</strong> capture the variable, not its value. A loop that builds closures will have all of them see the loop variable's <em>final</em> value, not the value at creation time.</p>

  <p><strong><code>is</code> vs <code>==</code></strong>: <code>is</code> checks whether two names point to the exact same object in memory. <code>==</code> checks whether they're equal in value. CPython happens to reuse objects for small integers, which makes <code>is</code> look like it works — until it doesn't.</p>

  <pre><code class="language-python"># Mutable default — accumulates across calls
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
print(a is b)    # False — different objects (outside CPython's interning range)</code></pre>

  <div class="cpp-note"><strong>The trick to remember:</strong> use <code>is</code> only for <code>None</code>, <code>True</code>, and <code>False</code> — for everything else, use <code>==</code>.</div>

</div>
```

- [ ] **Step 2: Delete the old Markdown file**

```bash
rm docs/_private/python-footguns.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/_private/python-footguns.html docs/_private/python-footguns.md
git commit -m "feat(private): add ELIA12 tab to python-footguns"
```

---

## Task 18: Verify locally and deploy

- [ ] **Step 1: Start Jekyll locally and verify all 16 posts render correctly**

```bash
cd docs && bundle exec jekyll serve --future
```

Open each URL and confirm:
- Tab strip shows "Concept" (active) and "ELIA12"
- Clicking "ELIA12" switches tab content
- Clicking "Concept" switches back
- No broken layouts or missing content
- Code blocks are syntax-highlighted

URLs to check:
```
http://localhost:4000/private/python-mro/
http://localhost:4000/private/python-gil/
http://localhost:4000/private/python-descriptors/
http://localhost:4000/private/python-data-model/
http://localhost:4000/private/python-attribute-lookup/
http://localhost:4000/private/python-scoping/
http://localhost:4000/private/python-asyncio/
http://localhost:4000/private/python-generators/
http://localhost:4000/private/python-context-managers/
http://localhost:4000/private/python-gc/
http://localhost:4000/private/python-slots/
http://localhost:4000/private/python-metaclasses/
http://localhost:4000/private/python-import-system/
http://localhost:4000/private/python-dataclasses/
http://localhost:4000/private/python-type-system/
http://localhost:4000/private/python-footguns/
```

- [ ] **Step 2: Push to working and merge to master**

```bash
git push origin working
git checkout master
git merge working --no-verify -m "feat(private): add ELIA12 tab to all 16 Python reference posts"
git push origin master
git checkout working
```

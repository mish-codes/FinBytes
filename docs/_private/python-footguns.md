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

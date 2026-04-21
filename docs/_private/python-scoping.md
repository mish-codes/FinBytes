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

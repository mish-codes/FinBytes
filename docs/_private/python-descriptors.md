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

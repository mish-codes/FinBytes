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

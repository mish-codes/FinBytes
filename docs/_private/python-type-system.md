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

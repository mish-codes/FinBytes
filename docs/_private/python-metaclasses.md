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

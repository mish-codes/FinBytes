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

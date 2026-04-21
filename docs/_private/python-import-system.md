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

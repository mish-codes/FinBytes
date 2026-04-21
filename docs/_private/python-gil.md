---
layout: post
title: "Python: The GIL and concurrency tradeoffs"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-gil/
---

The Global Interpreter Lock is a mutex in CPython that prevents more than one thread from executing Python bytecode at the same time. It exists because CPython's memory management — specifically reference counting — is not thread-safe without it. Rather than lock every individual object, CPython locks the interpreter itself and releases the lock periodically so other threads can run.

The consequence is that Python threads do not give you parallel CPU execution for pure Python code. Two threads on an eight-core machine still take turns. The GIL is released during I/O operations and by C extensions that opt out (NumPy, for instance), which is why threading still helps for network-bound or I/O-bound work: while one thread blocks waiting for a socket, the GIL is free and another thread runs.

For CPU-bound work you need `multiprocessing`. Each process has its own interpreter and its own GIL, so you get true parallelism. The cost is higher memory and slower communication between processes — you pass data via queues or shared memory rather than shared objects.

`asyncio` is different from both. It is single-threaded, single-process, and achieves concurrency through cooperative scheduling. Coroutines yield control at `await` points; the event loop runs something else while the coroutine waits. No parallelism, but very efficient for handling thousands of concurrent I/O-bound operations.

Rule of thumb: many concurrent I/O operations → asyncio. Simple I/O-bound scripts → threads. CPU-bound work → multiprocessing.

```python
import asyncio, threading, multiprocessing

# asyncio: concurrent I/O, single thread, cooperative
async def fetch(url): ...

# threading: I/O-bound, GIL released during I/O waits
t = threading.Thread(target=do_io_work)

# multiprocessing: CPU-bound, each process gets its own GIL
p = multiprocessing.Process(target=crunch_numbers)
```

Watch out: mixing asyncio and threads is possible but error-prone — use `loop.run_in_executor()` to run blocking code in a thread pool from an async context rather than calling blocking functions directly inside a coroutine.

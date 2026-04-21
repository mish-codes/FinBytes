---
layout: post
title: "Python: The asyncio execution model"
date: 2026-04-21
tags: [python, reference]
permalink: /private/python-asyncio/
---

`asyncio` runs on a single-threaded event loop. The loop maintains a queue of tasks — scheduled coroutines. On each iteration it picks a ready task, runs it until it hits an `await`, then suspends it and moves to the next ready task. There is no thread switching and no parallelism; concurrency comes from coroutines voluntarily yielding control.

A coroutine is a function defined with `async def`. Calling it does not execute it — it returns a coroutine object. To run it you either `await` it from another coroutine, or wrap it in a task with `asyncio.create_task()`, which schedules it on the event loop and lets it run concurrently with the caller. `await` suspends the current coroutine and hands control back to the event loop until the awaited thing completes.

The critical pitfall is blocking the event loop. Any call that does not release control — `time.sleep()`, synchronous file I/O, a `requests.get()`, a CPU-heavy loop — freezes every other coroutine for its entire duration. The event loop is cooperative; it cannot preempt you. Use `asyncio.sleep()` in place of `time.sleep()`, and `loop.run_in_executor()` to push genuinely blocking work into a thread pool.

```python
import asyncio

async def fetch(n):
    print(f"start {n}")
    await asyncio.sleep(1)   # yields control — other tasks run here
    print(f"done {n}")
    return n

async def main():
    # gather runs all three concurrently; total wall time ~1s, not 3s
    results = await asyncio.gather(fetch(1), fetch(2), fetch(3))
    print(results)   # [1, 2, 3]

asyncio.run(main())
```

Watch out: `asyncio.gather()` runs coroutines concurrently within the event loop, but they still execute one at a time — if any coroutine contains a blocking call with no `await`, it starves the others for the entire duration of that call.

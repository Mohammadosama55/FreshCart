---
name: Generated client DOM iterable types
description: The Orval-generated web client uses Headers.entries and needs iterable DOM typings.
---

The React API client package must include `dom.iterable` in its TypeScript `lib` list because generated request helpers call `Headers.entries()`.

**Why:** Without iterable DOM typings, codegen succeeds but the workspace library typecheck fails on the generated client.

**How to apply:** When regenerating the web client, keep `dom.iterable` enabled in `lib/api-client-react/tsconfig.json`.
---
name: FreshCart shopper identity
description: The current FreshCart account and order ownership model before full authentication.
---

FreshCart profile, saved-address, order-history, and tracking records are scoped by a stable browser-generated client ID stored in local storage, not by an authenticated user account.

**Why:** Authentication was not part of the requested scope, but profile and tracking data still needed to persist server-side and stay isolated between shoppers using different browsers.

**How to apply:** Keep the client ID on every profile, address, order-list, and tracking request. If authentication is introduced later, migrate ownership from this browser identifier to the authenticated subject rather than exposing records across clients.
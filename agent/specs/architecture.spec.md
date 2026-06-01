# Architecture Spec

This spec defines the structural contract for the WA Açaí codebase.

## Scope

- backend module boundaries;
- frontend feature boundaries;
- shared separation of responsibilities;
- explicit dependencies;
- extensibility without hardcoded business rules.

## Rules

- the backend must keep routes, schemas, services, repositories, database, websocket, auth, and utils separated;
- the frontend must keep pages, components, layouts, hooks, services, store, websocket, utils, contexts, and routes separated;
- business rules must live in domain services or persisted rules, not in controllers alone;
- shared cross-cutting concerns must be centralized rather than duplicated;
- code should favor simple interfaces that can grow with the MVP.

## Related

- [architecture.stat](architecture.stat.md)
- [wa-acai.spec](wa-acai.spec.md)

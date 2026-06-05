# WA Açaí Roadmap

This roadmap turns the current WA Açaí contract into an implementation sequence.

## Goal

Build a functional MVP with a clean architecture, room for growth, and a clear separation between storefront, account, admin, and inventory concerns.

## Phases

1. foundation
2. backend domain model
3. authentication and accounts
4. UI shell and role-aware navigation
5. catalog and cart
6. orders and delivery flow
7. inventory and recipes
8. admin panels and dashboards
9. realtime updates
10. PWA and polish

## Domain coverage

- [architecture](../../agent/specs/architecture.spec.md)
- [authentication](../../agent/specs/authentication.spec.md)
- [accounts](../../agent/specs/accounts.spec.md)
- [catalog](../../agent/specs/catalog.spec.md)
- [orders](../../agent/specs/orders.spec.md)
- [inventory](../../agent/specs/inventory.spec.md)
- [settings](../../agent/specs/settings.spec.md)
- [media](../../agent/specs/media.spec.md)
- [realtime](../../agent/specs/realtime.spec.md)
- [pwa](../../agent/specs/pwa.spec.md)
- [ui](../../agent/specs/ui.spec.md)
- [security](../../agent/specs/security.spec.md)
- [admin](../../agent/specs/admin.spec.md)

## Phase notes

- foundation: set up folder structure, settings, database, and shared conventions;
- backend domain model: create users, products, stock products, recipes, orders, movements, and settings;
- authentication and accounts: implement register, login, logout, session handling, and guest-to-account linking;
- UI shell and role-aware navigation: separate guest, authenticated user, cart, and admin entry points;
- catalog and cart: render the public storefront, product composer, and local cart state;
- orders and delivery flow: support confirmation, order numbers, status transitions, and guest data;
- inventory and recipes: validate and deduct stock from stored technical recipes;
- admin panels and dashboards: expose product, stock, order, customer, and operational views;
- realtime updates: add WebSocket channels for relevant events;
- PWA and polish: add offline basics, manifest, installability, and mobile-first finishing.

## Links

- [../../project.overview.md](../../project.overview.md)
- [../../project.update.md](../../project.update.md)
- [../../agent/specs/wa-acai.spec.md](../../agent/specs/wa-acai.spec.md)
- [todo.md](todo.md)

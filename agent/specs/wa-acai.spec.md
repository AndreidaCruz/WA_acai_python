# WA Açaí Spec

This spec defines the product contract for the WA Açaí application.

## Scope

- PWA storefront for açaí, snacks, and add-ons;
- guest ordering without mandatory account creation;
- authenticated customer accounts with order history and profile access;
- administrator access for products, stock, orders, and dashboards;
- online catalog and cart flow similar to a food delivery app;
- backend services for authentication, orders, inventory, and realtime updates;
- frontend built with React and Vite;
- backend built with FastAPI and SQLite.

## Architecture goals

- keep the backend modular, with separated routes, schemas, services, repositories, database, websocket, auth, and utils layers;
- keep the frontend organized by features, with pages, components, layouts, hooks, services, store, websocket, utils, contexts, and routes;
- avoid hardcoded business rules when the rule can be represented in the database;
- avoid duplicated logic across frontend and backend;
- prefer explicit dependencies and simple boundaries that can grow with the MVP.

## Product rules

- guests must be able to browse the catalog, build a cart, and place an order;
- logged-in users must be able to view history, repeat orders, and edit profile data;
- administrators must be able to manage products, stock, orders, and dashboards;
- orders must support customer name, phone, and delivery address before confirmation;
- orders created as guest must still be saved and linked later if the user authenticates;
- product catalog items must support images, descriptions, price, active state, and permitted complements;
- stock items must support unit of measure, current quantity, and minimum threshold;
- complements must consume stock through technical recipes or configured consumption rules;
- stock must not be reduced when an order is created;
- stock must be reduced when the order reaches the configured fulfillment stage;
- all stock changes must be recorded as movements;
- realtime updates must be available for new orders, status changes, and inventory movements;
- the frontend must be able to work as a PWA.

## Data model guidance

- orders must have a public order number separate from the internal identifier;
- orders must support customer name, phone, address, status, observations, and timestamps;
- products must distinguish commercial products from stock products;
- commercial products must support price, description, image, active state, availability, and permitted complements;
- stock products must support unit of measure, current quantity, minimum stock, and active state;
- complement availability must be configurable from stored data rather than hardcoded arrays;
- stock movement history must be preserved for auditing.

## Technical contract

- the backend uses FastAPI;
- persistence uses SQLite;
- authentication uses JWT with secure password hashing;
- the frontend uses React, Vite, React Router, Axios, WebSockets, and PWA support;
- the backend must expose endpoints for auth, catalog, cart/purchase flow, admin management, and stock operations.

## Operational rules

- soft delete must be used for business entities that should remain in history;
- stock must be validated before order confirmation;
- if stock is insufficient, the order cannot be confirmed and a friendly message must be shown;
- stock reduction must happen from recipe and complement consumption data stored in the database;
- admin configuration must be editable without changing source code;
- uploads must persist file paths, not raw binaries, in the database.

## Domain map

- [architecture.spec](architecture.spec.md)
- [authentication.spec](authentication.spec.md)
- [accounts.spec](accounts.spec.md)
- [catalog.spec](catalog.spec.md)
- [orders.spec](orders.spec.md)
- [inventory.spec](inventory.spec.md)
- [settings.spec](settings.spec.md)
- [media.spec](media.spec.md)
- [realtime.spec](realtime.spec.md)
- [pwa.spec](pwa.spec.md)
- [security.spec](security.spec.md)
- [admin.spec](admin.spec.md)

## Related

- [wa-acai.stat](wa-acai.stat.md)
- [project.spec](project.spec.md)
- [../../docs/plans/roadmap.md](../../docs/plans/roadmap.md)
- [../../docs/plans/todo.md](../../docs/plans/todo.md)

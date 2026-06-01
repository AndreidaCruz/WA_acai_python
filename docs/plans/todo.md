# WA Açaí TODO

This TODO keeps the next implementation steps visible while the new contract is being built.

## Immediate

- define the backend folder structure for the new architecture;
- define the database models and migration baseline;
- choose the first authentication slice to implement;
- confirm the initial seed data for products and stock.

## Domain priorities

- architecture first: backend and frontend boundaries;
- security second: authentication and access control;
- data third: accounts, catalog, orders, and inventory;
- operations fourth: settings, media, realtime, admin, and PWA.

## Next

- create the product, order, stock, and settings services;
- add the first API routes and schemas;
- create the React app shell with routing and layout;
- wire the public catalog to backend data.

## Later

- add admin stock adjustments and movement history;
- add guest order capture and order-number display;
- add WebSocket channels for order and dashboard updates;
- add PWA metadata and offline support.

## Links

- [roadmap.md](roadmap.md)
- [../../agent/specs/wa-acai.spec.md](../../agent/specs/wa-acai.spec.md)
- [../../agent/specs/wa-acai.stat.md](../../agent/specs/wa-acai.stat.md)

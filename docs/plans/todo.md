# WA Açaí TODO

This TODO keeps the next implementation steps visible while the new contract is being built.

## Immediate

- finish the role-aware UI shell and make admin/customer navigation unambiguous;
- complete the operational orders board with status updates and refresh actions;
- complete customer user listing and promotion-to-admin controls;
- keep toast notifications consistent across login, admin, checkout, and order flows.

## Domain priorities

- architecture first: backend and frontend boundaries;
- security second: authentication and access control;
- data third: accounts, catalog, orders, and inventory;
- operations fourth: settings, media, realtime, admin, and PWA.

## Next

- keep refining the catalog-to-cart composer flow so the user does not need long scrolling;
- keep admin sections split by responsibility instead of bundling every action into one page;
- extend tracking so the cart and order history stay aligned after checkout.

## Later

- add richer movement history views for inventory auditing;
- add WebSocket channels for live order and dashboard updates;
- add PWA metadata and offline support.

## Links

- [roadmap.md](roadmap.md)
- [../../agent/specs/wa-acai.spec.md](../../agent/specs/wa-acai.spec.md)
- [../../agent/specs/wa-acai.stat.md](../../agent/specs/wa-acai.stat.md)

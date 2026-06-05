# WA Açaí Stat

Last update date: 2026-06-02

## Current state

- the product scope has been reset toward a full delivery-style PWA;
- the convention layer remains intact and separate from the app reset;
- the old implementation was cleared to make room for the new architecture;
- the new backend and frontend base is implemented with modular domain structure;
- the WA Açaí umbrella spec now points to dedicated domain specs for all major contract areas;
- the admin login, catalog load, order creation, and stock deduction smoke flow passed;
- the backend now lives under `backend/src`;
- the one-time admin setup flow was implemented and smoke-tested;
- centralized application logging is enabled and debug runs write to `logs/wa-acai.log`.
- a dedicated UI shell contract is now defined for role-aware navigation, cart entry, and admin access.
- toast alerts now surface login failures, admin actions, and order/cart confirmations in the shell.
- the admin shell is being split into overview, stock, users, and settings sections, while the orders board handles operational status changes.

## Pending items

- rebuild the remaining frontend journeys around the catalog, cart, and admin experience;
- continue filling out the remaining domain flows and UI surfaces;
- tighten the stock and order experiences on the storefront and admin panels;
- keep the backend `src` layout stable;
- keep the setup screen disabled after the first admin is created;
- keep `.stat` traceable as the architecture evolves;
- keep logging centralized and free of sensitive payloads.
- finish the role-aware UI shell and keep customer/admin navigation distinct;
- extend toast/alert behavior to any remaining async flows;
- keep admin user promotion and order status management wired to backend validation.

## Evidence / validation

- updated product contract drafted from the new project concept;
- convention files remain installed and isolated from the app scope;
- planning docs for roadmap and TODO are being added to keep the work ordered;
- the product umbrella was split into dedicated domain specs and stats;
- backend smoke test passed for health, catalog, login, order creation, and stock deduction;
- frontend build passed with Vite;
- first-run admin setup was verified and then locked after creation;
- backend logging was wired into HTTP, auth, orders, admin, websocket, and stock events.
- UI shell rules were captured as a dedicated contract to remove guest/admin ambiguity.
- toast notifications were wired to important shell actions and backend validation errors.
- admin users can now be listed and promoted from the shell, and order status actions are being surfaced in the operational board.

## Commit tracking

- trace_id: `awc-20260602-ui-shell-02`
- commit status: not done
- hash (optional, after the commit):
- message:
- summary: WA Açaí implementation base extended with centralized logging and a role-aware UI shell contract.

## Open risks or doubts

- the new scope is substantially larger than the previous prototype and will need phased completion;
- some domain details still need to be implemented in the UI and APIs.

## Related

- [wa-acai.spec](wa-acai.spec.md)
- [project.stat](project.stat.md)
- [../../docs/plans/roadmap.md](../../docs/plans/roadmap.md)
- [../../docs/plans/todo.md](../../docs/plans/todo.md)

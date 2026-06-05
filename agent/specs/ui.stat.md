# UI Stat

Last update date: 2026-06-02

## Current state

- the UI shell now separates customer and admin navigation more clearly, with role-aware top bar identity and cart entry;
- the product detail flow uses a focused composer so complements do not depend on long scrolling;
- the product composer now uses a two-column layout with preview/image and a visible ingredient list when space allows;
- the composer includes quantity selection and price summary before checkout;
- combo bundles are now being treated as sequential multi-cup composition instead of a single undifferentiated item;
- the admin area is being split into validated role-based sections instead of a generic visible tab;
- alert and toast feedback is present in the shell and should continue to be applied to all async admin and checkout flows;
- the orders area still needs the final polish pass for operational status handling and user management visibility.

## Pending items

- finish the admin orders board with clear status transitions and refresh affordances;
- expose user listing and promotion controls in the admin panel;
- keep the admin shell split into overview, stock, users, and settings sections;
- extend the toast/alert pattern to every important async shell action;
- keep the customer cart as a separate special flow with order tracking after checkout.

## Evidence / validation

- the problem was identified from the current frontend shell and navigation;
- the requirement has now been captured as an explicit UI contract.
- toast notifications are now wired for login errors, admin actions, and order/cart flows.

## Commit tracking

- trace_id: `awc-20260602-ui-shell-02`
- commit status: not done
- hash (optional, after the commit):
- message:
- summary: UI shell contract refined to separate guest, customer, cart, and admin navigation with operational admin sections.

## Related

- [ui.spec](ui.spec.md)
- [wa-acai.spec](wa-acai.spec.md)
- [../../docs/plans/roadmap.md](../../docs/plans/roadmap.md)
- [../../docs/plans/todo.md](../../docs/plans/todo.md)

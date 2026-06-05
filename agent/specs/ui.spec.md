# UI Spec

This spec defines the application shell, navigation, and role-aware user experience for WA Açaí.

## Scope

- top bar navigation;
- guest versus authenticated user presentation;
- customer cart entry and cart focus flow;
- product detail/composer flow;
- admin visibility and automatic admin area entry after backend validation;
- mobile-first navigation and layout behavior.

## Rules

- the top bar must show `Entrar` when no user is authenticated;
- when a user is authenticated, the top bar must show the user name and avatar or equivalent visual identity;
- the label `Guest` must not be used as a permanent top-level navigation identity;
- admin navigation must only be shown when the backend confirms the current session has admin role;
- the admin area must open automatically after login only if the backend validates the user as admin;
- non-admin users must not see admin shell shortcuts as if they were ordinary customer navigation;
- the cart must be reachable from a dedicated top-bar icon or equivalent primary shell control;
- the cart area must support checkout and order tracking as a special flow, not a buried section;
- product cards must open a focused product detail or composer flow for complements and purchase options;
- the user should not need to scroll through the full storefront to complete a single product selection;
- the composer flow should present the product image or preview on one side and a visible ingredient list on the other when the screen size allows it;
- the composer flow should support quantity selection and a clear summary of selected ingredients and extra price before checkout;
- combo products must support multi-step composition when the bundle is made of multiple cups, so each cup can be configured sequentially before checkout;
- customer and admin experiences must remain visually and structurally distinct;
- the UI must remain usable on mobile screens.
- success and error feedback must surface as visible alerts/toasts, including backend validation errors such as invalid login credentials;
- toasts and alerts must be reusable across the shell rather than hand-rolled per page.
- the top bar must not expose a raw `guest` identity label to the customer;
- logged-in user chrome should prefer name/avatar and role-specific badge only when helpful, not duplicate navigation state;
- the admin shell must be split into functional sections such as overview, stock, users, settings, and operational order handling;
- order operations must be readable in the admin shell, while the customer-facing cart remains a separate special flow;
- the UI must not require long vertical scrolling to choose a product and configure complements when a modal or drawer is viable.

## Related

- [ui.stat](ui.stat.md)
- [authentication.spec](authentication.spec.md)
- [admin.spec](admin.spec.md)
- [catalog.spec](catalog.spec.md)
- [orders.spec](orders.spec.md)

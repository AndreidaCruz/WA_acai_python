# Admin Spec

This spec defines admin functionality for managing the store.

## Scope

- product management;
- stock management;
- order management;
- dashboards;
- store configuration;
- operational visibility.
- first-run admin setup when the system has no administrator.

## Rules

- admin areas must be protected by authenticated access;
- admin navigation must only become available after backend validation confirms the user role is admin;
- the first admin must be creatable through a one-time setup screen when no admin exists;
- low-stock alerts must be visible;
- order views must support operational handling;
- configuration changes must be editable in the admin panel;
- admin screens should be split by responsibility rather than bundled into one opaque page.
- admin should provide management of orders, products, stock, customer users, and user promotion to admin.
- the orders area must expose explicit status actions for the operational pipeline;
- customer user management must include listing users and promoting an account to admin from the panel;
- the dashboard must separate overview, stock, users, and settings into distinct navigation sections when the UI benefits from it;
- the admin shell must never impersonate customer navigation labels or guest state.

## Related

- [admin.stat](admin.stat.md)
- [settings.spec](settings.spec.md)
- [inventory.spec](inventory.spec.md)
- [authentication.spec](authentication.spec.md)

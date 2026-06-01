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
- the first admin must be creatable through a one-time setup screen when no admin exists;
- low-stock alerts must be visible;
- order views must support operational handling;
- configuration changes must be editable in the admin panel;
- admin screens should be split by responsibility rather than bundled into one opaque page.

## Related

- [admin.stat](admin.stat.md)
- [settings.spec](settings.spec.md)
- [inventory.spec](inventory.spec.md)
- [authentication.spec](authentication.spec.md)

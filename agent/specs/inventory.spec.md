# Inventory Spec

This spec defines stock products, recipes, movements, and low-stock control.

## Scope

- stock products;
- units of measure;
- current quantities and minimum stock;
- technical recipes;
- stock movements;
- soft delete behavior for stock entities.

## Rules

- stock products must keep unit, quantity, minimum stock, and active state;
- stock must be validated before confirmation;
- stock reduction must come from recipes and complement consumption stored in the database;
- all stock changes must be recorded as movements;
- product removal must be soft delete rather than physical delete;
- low-stock conditions must surface in the admin dashboard.

## Related

- [inventory.stat](inventory.stat.md)
- [orders.spec](orders.spec.md)
- [admin.spec](admin.spec.md)

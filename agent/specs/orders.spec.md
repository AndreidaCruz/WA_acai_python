# Orders Spec

This spec defines order creation, tracking, and lifecycle behavior.

## Scope

- order number generation;
- guest order creation;
- customer contact and delivery data;
- observations on orders;
- order status transitions;
- readiness and fulfillment flow.

## Rules

- internal database IDs must not be exposed as the public order number;
- the order must capture customer name, phone, address, and observations;
- status transitions must follow a defined workflow;
- stock must not be reduced when the order is first created;
- order completion or fulfillment stages must trigger stock consumption according to stored recipes;
- order history must remain intact after completion or cancellation.

## Related

- [orders.stat](orders.stat.md)
- [inventory.spec](inventory.spec.md)
- [accounts.spec](accounts.spec.md)

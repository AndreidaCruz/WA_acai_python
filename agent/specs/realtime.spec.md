# Realtime Spec

This spec defines WebSocket and realtime update behavior.

## Scope

- new order notifications;
- order status updates;
- inventory movement updates;
- dashboard refresh channels;
- separated channels for different audiences.

## Rules

- realtime channels should be split by audience or concern;
- updates must be relevant rather than globally broadcast by default;
- admin dashboards and order monitors must receive only the events they need;
- realtime behavior must not duplicate the source of truth in the database.

## Related

- [realtime.stat](realtime.stat.md)
- [orders.spec](orders.spec.md)
- [inventory.spec](inventory.spec.md)

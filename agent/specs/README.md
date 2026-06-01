# Specs

This directory stores the target project's normative contracts that the agent must read and obey when changing the system.

## Rules

- every active `.spec` must have a `.stat`;
- `.spec` defines durable contract;
- `.stat` records live state;
- do not use `.spec` as a progress log;
- do not use `.stat` to redefine contract;
- this includes system, architecture, product behavior, module contracts, domain rules, and operational policies;
- `docs/` is official human-facing documentation and may reference specs, but it is not the main place for normative contract.

## Convention

- `nome-do-dominio.spec.md`
- `nome-do-dominio.stat.md`

## Initial base

- `project.spec.md`
- `project.stat.md`
- `wa-acai.spec.md`
- `wa-acai.stat.md`

## Domain split

- `architecture.spec.md`
- `architecture.stat.md`
- `authentication.spec.md`
- `authentication.stat.md`
- `accounts.spec.md`
- `accounts.stat.md`
- `catalog.spec.md`
- `catalog.stat.md`
- `orders.spec.md`
- `orders.stat.md`
- `inventory.spec.md`
- `inventory.stat.md`
- `settings.spec.md`
- `settings.stat.md`
- `media.spec.md`
- `media.stat.md`
- `realtime.spec.md`
- `realtime.stat.md`
- `pwa.spec.md`
- `pwa.stat.md`
- `security.spec.md`
- `security.stat.md`
- `admin.spec.md`
- `admin.stat.md`

## Related

- [../policy/README.md](../policy/README.md)

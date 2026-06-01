# Docs

This directory gathers the human layer of the project: explanation, context,
evidence, planning, decisions, and legacy.

## Index

- [contracts/README.md](./contracts/README.md): documentation that explains contracts without replacing the spec;
- [policies/README.md](./policies/README.md): human documentation for governance and usage;
- [reports/README.md](./reports/README.md): evidence, audits, and validation;
- [plans/README.md](./plans/README.md): migrations, phases, and future work;
- [guides/README.md](./guides/README.md): practical guides and playbooks;
- [decisions/README.md](./decisions/README.md): approved and closed decisions;
- [concepts/README.md](./concepts/README.md): concepts and evolution models;
- [legacy/README.md](./legacy/README.md): replaced history or material outside the active base.

## How to read

- use `docs/` to understand the project's human context;
- use `agent/specs/` to read the normative contract;
- use `agent/policy/` to read the agent's durable rules;
- use `agent/README.md` to understand the operational workspace;
- when a doc grows to the point of becoming a rule, consider migrating it to
  `.spec` and `.stat`;
- when a doc cites a file that is not `.md`, use the explicit file path; do
  not create a new note to represent it in Obsidian.

## Related contracts

- [../agent/specs/README.md](../agent/specs/README.md)
- [../agent/specs/project.spec.md](../agent/specs/project.spec.md)
- [../agent/specs/project.stat.md](../agent/specs/project.stat.md)

## Relation to the convention

- [../agent-start-here.md](../agent-start-here.md) is the agent entry point;
- [../agent/policy/README.md](../agent/policy/README.md) concentrates durable policies;
- [../agent/specs/README.md](../agent/specs/README.md) concentrates normative contracts;
- [../agent/README.md](../agent/README.md) concentrates the operational workspace;
- `docs/` complements with human context and conceptual continuity;
- when in doubt between contract and explanation, read the corresponding spec first.

## Related

- [concepts/README.md](./concepts/README.md)
- [../agent/README.md](../agent/README.md)

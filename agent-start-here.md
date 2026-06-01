# Agent Start Here

This is the agent entry point for this project.

Read this file first.
Then follow the order below.

## Reading order

1. `project.overview.md`
2. `project.update.md`
3. `project.migrations.md` when the repository needs version-by-version upgrades
4. `README.md` of the project
5. relevant `.spec` in `agent/specs/`, including system, architecture, contract, or domain specs that govern the change
6. the corresponding `.stat`
7. relevant human, operational, or architecture documentation in `docs/`, when it exists
8. related tests

## Basic rule

- `.spec` is durable contract.
- `.stat` is live state.
- `agent/` is operational workspace.
- detailed rules live in [agent/policy/README.md](agent/policy/README.md).

## Abstraction rule

If the topic seems broad enough to become a contract, first check whether there is already a similar `.spec`.
If there is a conflict, adjust the proposal before creating new documentation.
If it makes sense to formalize it, create a `.spec` with an abstract and stable name.

## Working rule

- keep changes small and coherent;
- validate before advancing;
- record evidence in the appropriate workspace;
- link relevant documents when that helps understand contract, dependency, or continuity;
- when the target is a file that is not `.md`, use an explicit reference to the file or exact path; do not create a new note to represent it;
- do not reorganize existing files without approval;
- update `.stat` when there is real progress;
- update official docs only when contract or usage changes;
- for commits, follow [agent/policy/commit-safety.policy](agent/policy/commit-safety.policy.md) and use `trace_id` when there is a relevant change.

## Adequation protocol

When this repository has already received the convention and needs to be aligned with the standard:

1. apply the convention bootstrap;
2. adjust `graph.json` and the vault exclusions;
3. inventory artifacts, loose files, and operational noise;
4. ask for approval before organizing, moving, or deleting;
5. organize the repository;
6. map documentation that needs to become contract, state, or official docs;
7. propose and, after approval, create or adjust `.spec`, `.stat`, and links;
8. consolidate with `trace_id` and keep `.stat` traceable.

After the bootstrap, use the standard adequation handoff message from the adequation policy and ask for approval to start the next phase.

If you are unsure about the next step, follow [agent/policy/adequation.policy.md](agent/policy/adequation.policy.md).

## Related

- [project.overview.md](project.overview.md)
- [agent/specs/README.md](agent/specs/README.md)
- [agent/policy/README.md](agent/policy/README.md)

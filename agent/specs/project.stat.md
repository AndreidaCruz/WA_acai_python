# Project Stat

Last update date: 2026-06-01

## Current state

- initial convention created;
- base structure available;
- real domains can still be separated into their own specs;
- WA Açaí is now the defined product domain for the repository;
- the standard update flow is installed with `project.update.md` and `project.migrations.md`;
- the project and folder overview entry points are aligned to the standard convention;
- the product implementation was reset to prepare for the new delivery-style scope;
- the WA Açaí domain now has a richer spec/stat/linkage set and a roadmap entry point;
- the new implementation base is now bootstrapped and smoke-tested.
- the backend now lives under `backend/src`;
- the first-run admin setup flow is implemented and smoke-tested.

## Pending items

- define real domain specs when the target project matures;
- adjust operational documentation as concrete usage appears;
- align the WA Açaí implementation with the new delivery-style scope;
- consolidate the adequation roadmap in the new update flow;
- keep the new roadmap and TODO synchronized with the spec and stat;
- keep implementation progress synchronized with the domain stats.
- keep the backend `src` layout and the one-time setup flow stable.

## Evidence / validation

- initial template created;
- workspace structure defined;
- `.spec` and `.stat` convention established;
- WA Açaí scope documented in `wa-acai.spec.md`;
- convention update flow and overview files added for the current bootstrap;
- previous prototype implementation removed from backend and frontend;
- the next implementation plan is now being captured in `docs/plans/`;
- backend and frontend base restored and smoke-tested.
- backend moved to `backend/src` and the one-time admin setup flow verified.

## Commit tracking

- trace_id: `awc-20260601-project-implementation-02`
- commit status: not done
- hash (optional, after the commit):
- message:
- summary: project implementation base rebuilt toward the new WA Açaí delivery-style scope with backend src layout and first-run setup.

## Recommended next step

- replace or split this foundational spec when the project's domains are clear.

## Open risks or doubts

- this spec is only a starting point;
- it should not absorb independent domains for convenience.

## Core rule

- `.stat` records state, pending items, validation, and next steps.
- `.stat` does not redefine contract.

## Related

- [project.spec](project.spec.md)
- [wa-acai.spec](wa-acai.spec.md)
- [../../docs/plans/roadmap.md](../../docs/plans/roadmap.md)
- [../../docs/plans/todo.md](../../docs/plans/todo.md)

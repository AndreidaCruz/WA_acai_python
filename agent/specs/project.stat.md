# Project Stat

Last update date: 2026-06-02

## Current state

- initial convention created;
- base structure available;
- real domains can still be separated into their own specs;
- WA Açaí is now the defined product domain for the repository;
- the standard update flow is installed with `project.update.md` and `project.migrations.md`;
- the project and folder overview entry points are aligned to the standard convention;
- the product implementation was reset to prepare for the new delivery-style scope;
- the WA Açaí domain now has a richer spec/stat/linkage set and a roadmap entry point;
- the new implementation base is now bootstrapped and smoke-tested;
- the backend now lives under `backend/src`;
- the first-run admin setup flow is implemented and smoke-tested;
- application logging is centralized and debug runs write to `logs/wa-acai.log`;
- the launcher now passes `--debug` to the backend entrypoint.
- a dedicated UI shell contract now defines role-aware navigation, cart entry, and admin visibility.
- toast alerts now surface important validation and action feedback in the shell.

## Pending items

- define real domain specs when the target project matures;
- adjust operational documentation as concrete usage appears;
- align the WA Açaí implementation with the new delivery-style scope;
- consolidate the adequation roadmap in the new update flow;
- keep the new roadmap and TODO synchronized with the spec and stat;
- keep implementation progress synchronized with the domain stats;
- keep the backend `src` layout and the one-time setup flow stable;
- keep logging safe, centralized, and free of secrets.
- keep the UI shell aligned with backend role validation.
- keep toast alerts reusable and consistent across the shell.

## Evidence / validation

- initial template created;
- workspace structure defined;
- `.spec` and `.stat` convention established;
- WA Açaí scope documented in `wa-acai.spec.md`;
- convention update flow and overview files added for the current bootstrap;
- previous prototype implementation removed from backend and frontend;
- the next implementation plan is now being captured in `docs/plans/`;
- backend and frontend base restored and smoke-tested;
- backend moved to `backend/src` and the one-time admin setup flow verified;
- backend logging was centralized and validated in debug mode.
- UI shell contract was created to remove guest/admin ambiguity from the navigation layer.
- toast notifications were added for important shell actions and validation errors.

## Commit tracking

- trace_id: `awc-20260602-ui-shell-01`
- commit status: not done
- hash (optional, after the commit):
- message:
- summary: project implementation base extended with centralized logging, debug file output, launcher integration, and a dedicated UI shell contract.

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

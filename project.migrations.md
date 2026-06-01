# Project Migrations

This file records version-by-version upgrade paths for the convention.

## Baseline

- current SemVer baseline: `0.0.1`

## Ledger

| From | To | Purpose |
| --- | --- | --- |
| `0.0.1` | `0.0.2` | bootstrap when update files are missing; install the current update flow and overview entries |

## Rule

- use this file when the repository needs more than one upgrade step;
- keep migrations short and explicit;
- do not hide structural changes inside status notes.

## Related

- [project.update.md](project.update.md)
- [project.overview.md](project.overview.md)

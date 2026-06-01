# Architecture Stat

Last update date: 2026-06-01

## Current state

- the architecture contract is being split out from the product umbrella;
- modular backend and feature-based frontend boundaries are now explicit.

## Pending items

- implement the codebase around the modular structure;
- keep domain rules out of route handlers when a service can own them.

## Evidence / validation

- architecture boundaries documented for both backend and frontend.

## Commit tracking

- trace_id: `awc-20260601-architecture-01`
- commit status: not done
- hash (optional, after the commit):
- message:
- summary: architecture contract split from the product umbrella.

## Related

- [architecture.spec](architecture.spec.md)
- [wa-acai.stat](wa-acai.stat.md)

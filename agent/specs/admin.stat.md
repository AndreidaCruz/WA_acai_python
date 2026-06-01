# Admin Stat

Last update date: 2026-06-01

## Current state

- admin operations are split out as a dedicated contract.
- first-run admin setup is now explicitly part of the admin contract.
- the frontend now exposes a one-time setup screen before the first admin exists.

## Pending items

- define the specific admin screens and permissions in code;
- connect dashboards to orders and inventory data.
- wire the one-time setup screen so it disappears after the first admin.
- keep the first-run screen hidden after initialization.

## Evidence / validation

- admin contract documented independently.
- initial setup flow added to the codebase and contract.
- one-time admin bootstrap verified in the UI/API flow.

## Commit tracking

- trace_id: `awc-20260601-admin-01`
- commit status: not done
- hash (optional, after the commit):
- message:
- summary: admin contract split from the product umbrella.

## Related

- [admin.spec](admin.spec.md)
- [wa-acai.stat](wa-acai.stat.md)

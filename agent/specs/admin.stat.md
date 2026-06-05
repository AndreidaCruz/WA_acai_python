# Admin Stat

Last update date: 2026-06-01

## Current state

- admin operations are split out as a dedicated contract.
- first-run admin setup is explicitly part of the admin contract.
- the frontend exposes a one-time setup screen before the first admin exists.
- the admin shell is being separated into overview, stock, users, and configuration areas, with orders handled as an operational board.

## Pending items

- finish the operational orders board with explicit status transitions and refresh behavior.
- expose customer user listing and promotion to admin from the panel.
- keep all admin actions behind backend validation.
- keep the first-run screen hidden after initialization.

## Evidence / validation

- admin contract documented independently.
- initial setup flow added to the codebase and contract.
- one-time admin bootstrap verified in the UI/API flow.
- admin user promotion and role-aware navigation are now being added to the shell.

## Commit tracking

- trace_id: `awc-20260602-admin-01`
- commit status: not done
- hash (optional, after the commit):
- message:
- summary: admin contract split from the product umbrella and expanded into operational sections.

## Related

- [admin.spec](admin.spec.md)
- [wa-acai.stat](wa-acai.stat.md)

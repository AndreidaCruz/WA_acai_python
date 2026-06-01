# Authentication Stat

Last update date: 2026-06-01

## Current state

- authentication is defined as a distinct contract;
- guest usage and authenticated usage are both supported at the contract level.
- the one-time admin bootstrap flow is now part of the contract.
- the backend exposes setup-status and bootstrap-admin endpoints for first-run initialization.

## Pending items

- implement registration and login endpoints;
- define session token storage strategy;
- document refresh token policy if it is adopted.
- make the one-time admin bootstrap flow visible in the implementation.
- keep the bootstrap flow disabled after the first administrator is created.

## Evidence / validation

- authentication scope split from the product umbrella.
- admin bootstrap rule added to the contract.
- first-run bootstrap flow verified in the API.

## Commit tracking

- trace_id: `awc-20260601-authentication-01`
- commit status: not done
- hash (optional, after the commit):
- message:
- summary: authentication contract split from the product umbrella.

## Related

- [authentication.spec](authentication.spec.md)
- [wa-acai.stat](wa-acai.stat.md)

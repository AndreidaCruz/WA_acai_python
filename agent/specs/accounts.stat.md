# Accounts Stat

Last update date: 2026-06-01

## Current state

- customer and guest account behavior is split out as its own contract.

## Pending items

- implement guest order persistence and later linking;
- implement history and repeat-order access for logged-in users.

## Evidence / validation

- account scope documented separately from authentication.

## Commit tracking

- trace_id: `awc-20260601-accounts-01`
- commit status: not done
- hash (optional, after the commit):
- message:
- summary: accounts contract split from the product umbrella.

## Related

- [accounts.spec](accounts.spec.md)
- [wa-acai.stat](wa-acai.stat.md)

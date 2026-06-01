# Authentication Spec

This spec defines login, logout, registration, and token handling.

## Scope

- account registration;
- login and logout;
- JWT access token handling;
- optional refresh token flow;
- secure password hashing;
- role-aware access for guest, user, and admin flows.

## Rules

- passwords must be hashed before persistence;
- credentials must be validated on the backend;
- JWT access tokens must protect authenticated routes;
- guest flows must remain usable without mandatory registration;
- administrator routes must require authenticated access;
- user sessions must support account recovery and later account linking for guest orders;
- the system must expose a one-time admin bootstrap flow when no admin exists.

## Related

- [authentication.stat](authentication.stat.md)
- [accounts.spec](accounts.spec.md)
- [security.spec](security.spec.md)
- [admin.spec](admin.spec.md)

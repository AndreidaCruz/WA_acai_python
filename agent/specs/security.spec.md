# Security Spec

This spec defines cross-cutting security rules.

## Scope

- authentication protection;
- role-based access;
- form validation;
- safe handling of sessions and tokens;
- low-risk defaults for admin operations.

## Rules

- authenticated routes must require valid tokens;
- admin actions must require admin privileges;
- input validation must happen before persistence or execution;
- secret values must come from environment or secured configuration;
- security rules must be applied consistently across frontend and backend surfaces.

## Related

- [security.stat](security.stat.md)
- [authentication.spec](authentication.spec.md)
- [admin.spec](admin.spec.md)

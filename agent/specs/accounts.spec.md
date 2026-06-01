# Accounts Spec

This spec defines customer and guest account behavior.

## Scope

- registered customer accounts;
- guest order capture;
- profile editing;
- order history;
- guest-to-account linking.

## Rules

- guests may place orders without creating an account;
- orders created as guest must remain savable and linkable later;
- authenticated users must be able to consult history and repeat orders;
- profile data must be editable by the account owner;
- account-related data must remain separate from admin configuration.

## Related

- [accounts.stat](accounts.stat.md)
- [orders.spec](orders.spec.md)
- [authentication.spec](authentication.spec.md)

# Spec de Autenticação

Esta spec define login, logout, registro e tratamento de tokens.

## Escopo

- cadastro de conta;
- login e logout;
- tratamento de token de acesso JWT;
- fluxo opcional de refresh token;
- hash seguro de senha;
- acesso por perfil para fluxos de convidado, usuário e admin.

## Regras

- senhas devem ser hasheadas antes da persistência;
- credenciais devem ser validadas no backend;
- tokens JWT de acesso devem proteger rotas autenticadas;
- fluxos de convidado devem continuar utilizáveis sem cadastro obrigatório;
- rotas administrativas devem exigir acesso autenticado;
- sessões de usuário devem suportar recuperação de conta e vínculo posterior para pedidos de convidado;
- o sistema deve expor um fluxo de bootstrap de admin único quando nenhum admin existir.

## Relacionados

- [authentication.stat](authentication.stat.md)
- [accounts.spec](accounts.spec.md)
- [security.spec](security.spec.md)
- [admin.spec](admin.spec.md)

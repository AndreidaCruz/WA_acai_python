# Spec de Segurança

Esta spec define regras transversais de segurança.

## Escopo

- autenticação;
- autorização;
- proteção de rotas administrativas;
- hash de senhas;
- proteção de sessão e token;
- logging seguro.

## Regras

- segredos não podem aparecer em logs;
- rotas administrativas devem validar perfil;
- o acesso deve ser negado de forma explícita quando a sessão não for válida;
- falhas de autenticação devem ser tratadas sem vazar informação sensível;
- a superfície pública deve continuar utilizável sem conceder acesso indevido.

## Relacionados

- [security.stat](security.stat.md)
- [authentication.spec](authentication.spec.md)
- [admin.spec](admin.spec.md)

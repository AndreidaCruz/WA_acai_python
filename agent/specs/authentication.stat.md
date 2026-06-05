# Estatuto de Autenticação

Data da última atualização: 2026-06-01

## Estado atual

- a autenticação foi definida como contrato distinto;
- o uso como visitante e o uso autenticado são suportados no nível do contrato.
- o fluxo de bootstrap único do admin agora faz parte do contrato.
- o backend expõe endpoints de status de setup e bootstrap do admin para a inicialização do primeiro uso.

## Pendências

- implementar os endpoints de cadastro e login;
- definir a estratégia de armazenamento do token de sessão;
- documentar a política de refresh token se ela for adotada.
- tornar o fluxo de bootstrap único do admin visível na implementação.
- manter o fluxo de bootstrap desativado após a criação do primeiro administrador.

## Evidências / validação

- o escopo de autenticação foi separado do guarda-chuva do produto.
- a regra de bootstrap do admin foi adicionada ao contrato.
- o fluxo de bootstrap de primeiro uso foi verificado na API.

## Controle de commit

- trace_id: `awc-20260601-authentication-01`
- status do commit: não realizado
- hash (opcional, após o commit):
- mensagem:
- resumo: contrato de autenticação separado do guarda-chuva do produto.

## Relacionados

- [authentication.spec](authentication.spec.md)
- [wa-acai.stat](wa-acai.stat.md)

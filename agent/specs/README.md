# Especificações

Esta pasta guarda os contratos normativos do projeto-alvo que o agente deve ler e obedecer ao alterar o sistema.

## Regras

- toda `.spec` ativa deve ter uma `.stat`;
- `.spec` define contrato durável;
- `.stat` registra estado vivo;
- não use `.spec` como log de progresso;
- não use `.stat` para redefinir contrato;
- isso inclui sistema, arquitetura, comportamento do produto, contratos de módulo, regras de domínio e políticas operacionais;
- `docs/` é documentação humana oficial e pode referenciar specs, mas não é o lugar principal para contrato normativo.

## Convenção

- `nome-do-dominio.spec.md`
- `nome-do-dominio.stat.md`

## Base inicial

- `project.spec.md`
- `project.stat.md`
- `wa-acai.spec.md`
- `wa-acai.stat.md`

## Separação por domínio

- `architecture.spec.md`
- `architecture.stat.md`
- `authentication.spec.md`
- `authentication.stat.md`
- `accounts.spec.md`
- `accounts.stat.md`
- `catalog.spec.md`
- `catalog.stat.md`
- `orders.spec.md`
- `orders.stat.md`
- `inventory.spec.md`
- `inventory.stat.md`
- `settings.spec.md`
- `settings.stat.md`
- `media.spec.md`
- `media.stat.md`
- `realtime.spec.md`
- `realtime.stat.md`
- `pwa.spec.md`
- `pwa.stat.md`
- `ui.spec.md`
- `ui.stat.md`
- `security.spec.md`
- `security.stat.md`
- `admin.spec.md`
- `admin.stat.md`

## Relacionados

- [../policy/README.md](../policy/README.md)

# Documentação

Esta pasta reúne a camada humana do projeto: explicações, contexto, evidências,
planejamento, decisões e legado.

## Índice

- [contracts/overview.md](./contracts/overview.md): documentação que explica contratos sem substituir a spec;
- [policies/overview.md](./policies/overview.md): documentação humana sobre governança e uso;
- [reports/overview.md](./reports/overview.md): evidências, auditorias e validações;
- [plans/overview.md](./plans/overview.md): migrações, fases e trabalho futuro;
- [guides/overview.md](./guides/overview.md): guias práticos e playbooks;
- [decisions/overview.md](./decisions/overview.md): decisões aprovadas e encerradas;
- [concepts/overview.md](./concepts/overview.md): conceitos e modelos de evolução;
- [legacy/overview.md](./legacy/overview.md): histórico substituído ou material fora da base ativa.

## Como ler

- use `docs/` para entender o contexto humano do projeto;
- use `agent/specs/` para ler o contrato normativo;
- use `agent/policy/` para ler as regras duráveis do agente;
- use `agent/overview.md` para entender o workspace operacional;
- quando um documento crescer a ponto de virar regra, considere migrá-lo para
  `.spec` e `.stat`;
- quando um documento citar um arquivo que não seja `.md`, use o caminho
  explícito; não crie uma nota nova para representá-lo no Obsidian.

## Contratos relacionados

- [../project.overview.md](../project.overview.md)
- [../project.update.md](../project.update.md)
- [../agent/specs/overview.md](../agent/specs/overview.md)

## Relação com a convenção

- [../agent-start-here.md](../agent-start-here.md) é o ponto de entrada do agente;
- [../agent/policy/overview.md](../agent/policy/overview.md) concentra as políticas duráveis;
- [../agent/specs/overview.md](../agent/specs/overview.md) concentra os contratos normativos;
- [../agent/overview.md](../agent/overview.md) concentra o workspace operacional;
- `docs/` complementa com contexto humano e continuidade conceitual;
- em caso de dúvida entre contrato e explicação, leia primeiro a spec correspondente.

## Relacionados

- [concepts/overview.md](./concepts/overview.md)
- [../agent/overview.md](../agent/overview.md)

# Documentação

Esta pasta reúne a camada humana do projeto: explicações, contexto, evidências,
planejamento, decisões e legado.

## Índice

- [contracts/README.md](./contracts/README.md): documentação que explica contratos sem substituir a spec;
- [policies/README.md](./policies/README.md): documentação humana sobre governança e uso;
- [reports/README.md](./reports/README.md): evidências, auditorias e validações;
- [plans/README.md](./plans/README.md): migrações, fases e trabalho futuro;
- [guides/README.md](./guides/README.md): guias práticos e playbooks;
- [decisions/README.md](./decisions/README.md): decisões aprovadas e encerradas;
- [concepts/README.md](./concepts/README.md): conceitos e modelos de evolução;
- [legacy/README.md](./legacy/README.md): histórico substituído ou material fora da base ativa.

## Como ler

- use `docs/` para entender o contexto humano do projeto;
- use `agent/specs/` para ler o contrato normativo;
- use `agent/policy/` para ler as regras duráveis do agente;
- use `agent/README.md` para entender o workspace operacional;
- quando um documento crescer a ponto de virar regra, considere migrá-lo para
  `.spec` e `.stat`;
- quando um documento citar um arquivo que não seja `.md`, use o caminho
  explícito; não crie uma nota nova para representá-lo no Obsidian.

## Contratos relacionados

- [../agent/specs/README.md](../agent/specs/README.md)
- [../agent/specs/project.spec.md](../agent/specs/project.spec.md)
- [../agent/specs/project.stat.md](../agent/specs/project.stat.md)

## Relação com a convenção

- [../agent-start-here.md](../agent-start-here.md) é o ponto de entrada do agente;
- [../agent/policy/README.md](../agent/policy/README.md) concentra as políticas duráveis;
- [../agent/specs/README.md](../agent/specs/README.md) concentra os contratos normativos;
- [../agent/README.md](../agent/README.md) concentra o workspace operacional;
- `docs/` complementa com contexto humano e continuidade conceitual;
- em caso de dúvida entre contrato e explicação, leia primeiro a spec correspondente.

## Relacionados

- [concepts/README.md](./concepts/README.md)
- [../agent/README.md](../agent/README.md)

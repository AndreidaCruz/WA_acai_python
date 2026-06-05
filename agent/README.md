# Workspace do Agente

Esta pasta concentra o material de trabalho do agente sem poluir a raiz do repositório.

## Entradas úteis

- [../project.overview.md](../project.overview.md)
- [../project.update.md](../project.update.md)
- [../agent-start-here.md](../agent-start-here.md)
- [policy/overview.md](./policy/overview.md)
- [specs/overview.md](./specs/overview.md)
- [../docs/overview.md](../docs/overview.md)

## Estrutura

- `policy/`
  - regras duráveis para o trabalho do agente;
  - convenções de workflow, contrato, documentação e segurança.
- `specs/`
  - especificações normativas;
  - estado de progresso;
  - pares `.spec` / `.stat`.
- `prints/`
  - capturas de tela;
  - imagens temporárias de apoio;
  - comparações visuais.
- `tmp/`
  - prints de teste;
  - capturas temporárias;
  - artefatos descartáveis.
- `reports/`
  - relatórios curtos de validação;
  - resumos de auditoria;
  - saídas que valem a pena manter organizadas.
- `scripts/`
  - scripts auxiliares e pequenas automações;
  - utilitários de teste.
- `test/`
  - testes pequenos e verificações de apoio;
  - rascunhos de validação.
- `note/`
  - notas mais privadas do agente;
  - rascunhos de raciocínio;
  - observações de contexto.

## Regras

- mantenha o restante do repositório limpo;
- não use a raiz para prints e rascunhos;
- promova para documentação oficial apenas o que estiver estável;
- não armazene segredos, tokens, dumps ou dados sensíveis sem motivo explícito.

## Relacionados

- [../agent-start-here.md](../agent-start-here.md)
- [../docs/overview.md](../docs/overview.md)

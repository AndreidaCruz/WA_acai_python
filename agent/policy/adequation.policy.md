# Política de Adequação

- esta política orienta o modo de adequação pós-instalação da convenção;
- use-a quando o repositório já recebeu `standard` e precisa ser alinhado ao contrato de uso;
- não faça mudanças estruturais grandes sem passar pelas fases e aprovações abaixo;
- trate cada fase como um checkpoint reutilizável;
- o objetivo é deixar o repositório pronto para o agente trabalhar com menos ruído e menos suposições.

## Fluxo padrão

1. verificar o bootstrap;
2. alinhar o grafo e as exclusões do vault;
3. mapear ruído, artefatos e arquivos soltos;
4. pedir aprovação para organizar o repositório;
5. organizar o repositório aprovado;
6. mapear documentação que precisa virar contrato ou estado;
7. pedir aprovação para criar ou ajustar contexto e specs;
8. criar ou ajustar contexto, specs, stats e links;
9. pedir aprovação para consolidar e commitar;
10. registrar o resultado em `.stat`.

## Passagem de bastão padrão

Depois do bootstrap, o agente deve encerrar a primeira mensagem com um trecho curto e previsível. O formato recomendado é:

```text
Instalei a convenção, alinhei o grafo e o .gitignore, e li o roadmap de adequação.
Posso iniciar a fase 2: inventário de ruído, artefatos e arquivos soltos?
```

Se aprovado, o agente segue para o inventário.
Se não for aprovado, o agente para e aguarda novas instruções.

Antes de sair de cada fase, o agente deve repetir o mesmo padrão:

- resumir o que encontrou;
- listar os arquivos criados ou alterados;
- mostrar `git status --short`;
- dizer o que planeja fazer na próxima fase;
- pedir aprovação antes de mudar estrutura, mover arquivos ou excluir artefatos.

## Fase 1: bootstrap

- confirmar que `agent-start-here.md` foi lido;
- confirmar que `README.md` e `agent/policy/README.md` foram lidos quando existirem;
- aplicar o `graph.json` recomendado quando o projeto usar Obsidian;
- alinhar o `.gitignore` do projeto para ruído local conhecido;
- criar ou alinhar pontos de entrada mínimos de documentação quando estiverem ausentes, se isso estiver no escopo.

## Fase 2: inventário

- listar arquivos soltos, temporários, caches, artefatos, notas, relatórios e docs legados;
- classificar cada item como:
  - manter;
  - investigar;
  - mover;
  - renomear;
  - excluir;
  - preservar;
- não executar limpeza sem aprovação explícita.

## Fase 3: organização

- mover artefatos para os diretórios corretos;
- remover ruído aprovado;
- alinhar o workspace operacional;
- preservar histórico e evidências úteis.

## Fase 4: contexto e contratos

- identificar quais documentos já são contratos;
- identificar quais documentos precisam virar `.spec` / `.stat`;
- identificar quais documentos são apenas explicação, evidência ou legado;
- propor links entre docs, specs, stats e políticas por domínio e função.

## Fase 5: consolidação

- atualizar `.stat` com progresso real;
- registrar `trace_id` quando houver mudança relevante;
- se houver commit, registrar a mensagem e o hash depois do commit;
- deixar claro o que foi feito, o que ainda está pendente e o que precisa de decisão.

## Aprovação

Antes de avançar entre fases, mostrar:

- resumo do inventário ou da proposta;
- arquivos criados ou alterados;
- `git status --short`;
- dúvidas e decisões pendentes.

## Regra central

- a adequação existe para tornar o repositório compatível com a convenção;
- não transforme a adequação em refatoração arbitrária;
- não pule aprovação quando a fase envolver mudança estrutural.

## Relacionados

- [README.md](../../README.md)
- [../README.md](README.md)
- [../workspace.policy.md](workspace.policy.md)
- [../specs/README.md](../specs/README.md)
- [../specs/project.stat.md](../specs/project.stat.md)

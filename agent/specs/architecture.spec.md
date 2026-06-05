# Spec de Arquitetura

Esta spec define o contrato estrutural da base de código do WA Açaí.

## Escopo

- limites entre módulos do backend;
- limites entre features do frontend;
- separação clara de responsabilidades;
- dependências explícitas;
- possibilidade de evolução sem regras de negócio hardcoded.

## Regras

- o backend deve manter rotas, schemas, serviços, repositórios, banco, websocket, auth e utils separados;
- o frontend deve manter páginas, componentes, layouts, hooks, serviços, store, websocket, utils, contexts e rotas separados;
- regras de negócio devem viver em serviços de domínio ou em regras persistidas, não apenas em controllers;
- preocupações transversais devem ser centralizadas em vez de duplicadas;
- o código deve favorecer interfaces simples que possam crescer com o MVP.

## Relacionados

- [architecture.stat](architecture.stat.md)
- [wa-acai.spec](wa-acai.spec.md)

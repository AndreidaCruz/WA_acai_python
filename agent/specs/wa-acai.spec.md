# Spec do WA Açaí

Esta spec define o contrato do produto para o aplicativo WA Açaí.

## Escopo

- vitrine PWA para açaí, lanches e adicionais;
- pedido de convidado sem criação obrigatória de conta;
- contas autenticadas de cliente com histórico e perfil;
- acesso administrativo para produtos, estoque, pedidos e dashboards;
- fluxo de cardápio e carrinho no estilo delivery;
- serviços de backend para autenticação, pedidos, estoque e atualizações em tempo real;
- frontend construído com React e Vite;
- backend construído com FastAPI e SQLite.

## Objetivos de arquitetura

- manter o backend modular, com rotas, schemas, serviços, repositórios, banco, websocket, auth e utils separados;
- manter o frontend organizado por features, com páginas, componentes, layouts, hooks, serviços, store, websocket, utils, contexts e rotas;
- evitar regras de negócio hardcoded quando a regra puder ser representada no banco;
- evitar lógica duplicada entre frontend e backend;
- preferir dependências explícitas e limites simples que possam crescer com o MVP.

## Regras do produto

- convidados devem poder navegar no cardápio, montar o carrinho e fazer pedido;
- usuários logados devem poder ver histórico, repetir pedidos e editar perfil;
- administradores devem conseguir gerenciar produtos, estoque, pedidos e dashboards;
- os pedidos devem exigir nome, telefone e endereço antes da confirmação;
- pedidos criados como convidado ainda devem ser salvos e vinculados depois, se o usuário autenticar;
- os itens do cardápio devem suportar imagem, descrição, preço, estado ativo e complementos permitidos;
- os itens de estoque devem suportar unidade de medida, quantidade atual e limite mínimo;
- os complementos devem consumir estoque por meio de receitas técnicas ou regras de consumo configuradas;
- o estoque não deve ser reduzido quando um pedido é criado;
- o estoque deve ser reduzido quando o pedido atingir a etapa de fulfillment configurada;
- todas as alterações de estoque devem ser registradas como movimentações;
- atualizações em tempo real devem estar disponíveis para novos pedidos, mudanças de status e movimentações de inventário;
- o frontend deve conseguir funcionar como PWA.
- o shell deve separar com clareza a navegação de cliente e admin, mostrando `Entrar` quando não houver usuário autenticado e exibindo a identidade autenticada quando a sessão existir;
- o shell do admin deve expor áreas operacionais validadas por perfil em vez de uma aba genérica sempre visível;
- o carrinho deve continuar sendo um fluxo especial com tracking pós-checkout, e não uma lista escondida.

## Orientação de modelo de dados

- os pedidos devem ter um número público separado do identificador interno;
- os pedidos devem suportar nome do cliente, telefone, endereço, status, observações e timestamps;
- os produtos devem distinguir produto comercial de produto de estoque;
- os produtos comerciais devem suportar preço, descrição, imagem, estado ativo, disponibilidade e complementos permitidos;
- os produtos de estoque devem suportar unidade de medida, quantidade atual, estoque mínimo e estado ativo;
- a disponibilidade de complementos deve ser configurável a partir de dados persistidos e não de arrays hardcoded;
- o histórico de movimentações de estoque deve ser preservado para auditoria.

## Contrato técnico

- o backend usa FastAPI;
- a persistência usa SQLite;
- a autenticação usa JWT com hash seguro de senha;
- o frontend usa React, Vite, React Router, Axios, WebSockets e suporte a PWA;
- o backend deve expor endpoints para auth, cardápio, fluxo de compra, administração e operações de estoque.

## Regras operacionais

- soft delete deve ser usado para entidades de negócio que precisam permanecer no histórico;
- o estoque deve ser validado antes da confirmação do pedido;
- se o estoque for insuficiente, o pedido não pode ser confirmado e uma mensagem amigável deve ser exibida;
- a redução de estoque deve acontecer com base em dados de receita e consumo de complementos armazenados no banco;
- a configuração do admin deve ser editável sem alterar o código-fonte;
- uploads devem persistir caminhos de arquivo, e não binários crus, no banco.
- eventos críticos da aplicação devem ser registrados centralmente sem segredos, e execuções em debug devem gravar logs em `logs/`;

## Mapa de domínios

- [architecture.spec](architecture.spec.md)
- [authentication.spec](authentication.spec.md)
- [accounts.spec](accounts.spec.md)
- [catalog.spec](catalog.spec.md)
- [orders.spec](orders.spec.md)
- [inventory.spec](inventory.spec.md)
- [settings.spec](settings.spec.md)
- [media.spec](media.spec.md)
- [realtime.spec](realtime.spec.md)
- [pwa.spec](pwa.spec.md)
- [ui.spec](ui.spec.md)
- [security.spec](security.spec.md)
- [admin.spec](admin.spec.md)

## Relacionados

- [wa-acai.stat](wa-acai.stat.md)
- [project.spec](project.spec.md)
- [../../docs/plans/roadmap.md](../../docs/plans/roadmap.md)
- [../../docs/plans/todo.md](../../docs/plans/todo.md)

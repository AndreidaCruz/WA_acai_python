# Estatuto de Interface

Data da última atualização: 2026-06-02

## Estado atual

- a shell de interface agora separa com mais clareza a navegação de cliente e admin, com identidade na barra superior sensível ao papel e entrada para o carrinho;
- o fluxo de detalhe do produto usa um compositor focado para que os complementos não dependam de rolagem longa;
- o compositor de produto agora usa um layout de duas colunas com pré-visualização/imagem e lista visível de ingredientes quando há espaço;
- o compositor inclui seleção de quantidade e resumo de preço antes do checkout;
- os combos passaram a ser tratados como composição sequencial de dois copos, em vez de um item único e indiferenciado;
- a área de admin está sendo dividida em seções validadas por papel, em vez de uma aba genérica visível;
- o feedback por alertas e toasts já existe na shell e deve continuar sendo aplicado a todos os fluxos assíncronos de admin e checkout;
- a área de pedidos ainda precisa do polimento final para tratar status operacionais e visibilidade de gestão de usuários.

## Pendências

- finalizar o painel de pedidos do admin com transições claras de status e ações de atualização;
- expor a listagem de usuários e os controles de promoção no painel de admin;
- manter a shell do admin dividida em visão geral, estoque, usuários e configurações;
- estender o padrão de toast/alerta para toda ação assíncrona importante da shell;
- manter o carrinho do cliente como um fluxo especial separado com acompanhamento do pedido após o checkout.

## Evidências / validação

- o problema foi identificado a partir da shell e da navegação atuais do frontend;
- a necessidade foi registrada como contrato explícito de interface.
- as notificações toast já estão ligadas a erros de login, ações do admin e fluxos de pedido/carrinho.

## Controle de commit

- trace_id: `awc-20260602-ui-shell-02`
- status do commit: não realizado
- hash (opcional, após o commit):
- mensagem:
- resumo: contrato da shell de interface refinado para separar navegação de visitante, cliente, carrinho e admin com seções operacionais.

## Relacionados

- [ui.spec](ui.spec.md)
- [wa-acai.spec](wa-acai.spec.md)
- [../../docs/plans/roadmap.md](../../docs/plans/roadmap.md)
- [../../docs/plans/todo.md](../../docs/plans/todo.md)

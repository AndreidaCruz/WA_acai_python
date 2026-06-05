# WA Açaí TODO

Esta lista mantém visíveis os próximos passos de implementação enquanto o novo contrato é construído.

## Imediato

- finalizar o shell da UI por perfil e deixar a navegação de admin/cliente inequívoca;
- completar o board operacional de pedidos com atualização de status e ações de refresh;
- completar a listagem de usuários clientes e os controles de promoção para admin;
- manter os toasts consistentes em login, admin, checkout e fluxos de pedido.

## Prioridades por domínio

- arquitetura em primeiro lugar: limites entre backend e frontend;
- segurança em segundo: autenticação e controle de acesso;
- dados em terceiro: contas, cardápio, pedidos e estoque;
- operações em quarto: configurações, mídia, realtime, admin e PWA.

## Próximos

- continuar refinando o fluxo do cardápio para o carrinho para evitar rolagem longa;
- manter as seções de admin separadas por responsabilidade em vez de juntar tudo em uma página;
- ampliar o tracking para que carrinho e histórico de pedidos permaneçam alinhados após o checkout.

## Depois

- adicionar visões mais ricas do histórico de movimentações para auditoria de estoque;
- adicionar canais WebSocket para pedidos ao vivo e atualizações do dashboard;
- adicionar metadados de PWA e suporte offline.

## Links

- [roadmap.md](roadmap.md)
- [../../agent/specs/wa-acai.spec.md](../../agent/specs/wa-acai.spec.md)
- [../../agent/specs/wa-acai.stat.md](../../agent/specs/wa-acai.stat.md)

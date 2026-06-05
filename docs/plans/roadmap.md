# Roadmap WA Açaí

Este roadmap transforma o contrato atual do WA Açaí em uma sequência de implementação.

## Objetivo

Construir um MVP funcional com arquitetura limpa, espaço para crescimento e separação clara entre vitrine, conta, admin e estoque.

## Fases

1. base inicial
2. modelo de domínio do backend
3. autenticação e contas
4. shell da UI e navegação por perfil
5. cardápio e carrinho
6. pedidos e fluxo de entrega
7. estoque e receitas
8. painéis e dashboards admin
9. atualizações em tempo real
10. PWA e polimento

## Cobertura de domínios

- [architecture](../../agent/specs/architecture.spec.md)
- [authentication](../../agent/specs/authentication.spec.md)
- [accounts](../../agent/specs/accounts.spec.md)
- [catalog](../../agent/specs/catalog.spec.md)
- [orders](../../agent/specs/orders.spec.md)
- [inventory](../../agent/specs/inventory.spec.md)
- [settings](../../agent/specs/settings.spec.md)
- [media](../../agent/specs/media.spec.md)
- [realtime](../../agent/specs/realtime.spec.md)
- [pwa](../../agent/specs/pwa.spec.md)
- [ui](../../agent/specs/ui.spec.md)
- [security](../../agent/specs/security.spec.md)
- [admin](../../agent/specs/admin.spec.md)

## Notas por fase

- base inicial: preparar a estrutura de pastas, configurações, banco e convenções compartilhadas;
- modelo de domínio do backend: criar usuários, produtos, itens de estoque, receitas, pedidos, movimentações e configurações;
- autenticação e contas: implementar cadastro, login, logout, sessão e vínculo de convidado com conta;
- shell da UI e navegação por perfil: separar os pontos de entrada de convidado, usuário autenticado, carrinho e admin;
- cardápio e carrinho: renderizar a vitrine pública, o compositor de produto e o estado local do carrinho;
- pedidos e fluxo de entrega: suportar confirmação, número de pedido, transições de status e dados de convidado;
- estoque e receitas: validar e dar baixa no estoque a partir das receitas técnicas armazenadas;
- painéis e dashboards admin: expor visões de produto, estoque, pedidos, clientes e operação;
- atualizações em tempo real: adicionar canais WebSocket para eventos relevantes;
- PWA e polimento: adicionar noções básicas de offline, manifesto, instalabilidade e acabamento mobile-first.

## Links

- [../../project.overview.md](../../project.overview.md)
- [../../project.update.md](../../project.update.md)
- [../../agent/specs/wa-acai.spec.md](../../agent/specs/wa-acai.spec.md)
- [todo.md](todo.md)

# Spec de Tempo Real

Esta spec define o comportamento de WebSocket e de atualização em tempo real.

## Escopo

- canais WebSocket;
- atualização ao vivo de pedidos;
- atualização ao vivo de dashboard;
- atualização ao vivo de estoque;
- sincronização de eventos relevantes.

## Regras

- as atualizações em tempo real devem complementar, e não quebrar, o fluxo HTTP normal;
- canais de WebSocket devem ter propósitos claros;
- o frontend deve conseguir reagir a eventos sem recarregar a página;
- eventos importantes devem ser rastreáveis.

## Relacionados

- [realtime.stat](realtime.stat.md)
- [orders.spec](orders.spec.md)
- [inventory.spec](inventory.spec.md)

# Spec de Admin

Esta spec define funcionalidades administrativas para gerenciar a loja.

## Escopo

- painel administrativo;
- pedido e operação;
- estoque;
- usuários;
- configurações;
- promoções de perfil.

## Regras

- o admin deve ser validado pelo backend antes de abrir a área administrativa;
- o painel deve separar responsabilidades em seções claras;
- o admin deve conseguir acompanhar pedidos e mudar status;
- o admin deve conseguir ajustar estoque e promover usuários a admin;
- o painel deve refletir o estado real da loja sem virar um esqueleto solto.

## Relacionados

- [admin.stat](admin.stat.md)
- [orders.spec](orders.spec.md)
- [security.spec](security.spec.md)

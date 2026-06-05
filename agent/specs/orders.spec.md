# Spec de Pedidos

Esta spec define a criação, o rastreio e o comportamento de ciclo de vida dos pedidos.

## Escopo

- geração de número de pedido;
- criação de pedido de convidado;
- dados de contato e entrega do cliente;
- observações do pedido;
- transições de status;
- fluxo de preparação e conclusão.

## Regras

- IDs internos do banco não devem ser expostos como número público do pedido;
- o pedido deve capturar nome, telefone, endereço e observações;
- as transições de status devem seguir um fluxo definido;
- o estoque não deve ser reduzido quando o pedido é criado pela primeira vez;
- etapas de conclusão ou expedição devem disparar consumo de estoque conforme receitas armazenadas;
- o histórico do pedido deve permanecer intacto após conclusão ou cancelamento.

## Relacionados

- [orders.stat](orders.stat.md)
- [inventory.spec](inventory.spec.md)
- [accounts.spec](accounts.spec.md)

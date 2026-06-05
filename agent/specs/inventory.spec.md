# Spec de Estoque

Esta spec define itens de estoque, receitas, movimentações e controle de baixo estoque.

## Escopo

- produtos de estoque;
- receitas técnicas;
- movimentações de estoque;
- limite mínimo de estoque;
- baixa de estoque por pedido.

## Regras

- o consumo de estoque deve vir de dados persistidos de receita e complementos;
- movimentações devem ser registradas para auditoria;
- itens críticos devem ser sinalizados quando o estoque chegar ao mínimo;
- o estoque não deve ser reduzido antes do momento operacional correto do pedido;
- ajustes manuais devem permanecer rastreáveis.

## Relacionados

- [inventory.stat](inventory.stat.md)
- [orders.spec](orders.spec.md)
- [settings.spec](settings.spec.md)

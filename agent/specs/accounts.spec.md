# Spec de Contas

Esta spec define o comportamento de contas de cliente e de convidado.

## Escopo

- contas de cliente registradas;
- captura de pedidos de convidado;
- edição de perfil;
- histórico de pedidos;
- vínculo entre pedido de convidado e conta.

## Regras

- convidados podem fazer pedidos sem criar conta;
- pedidos criados como convidado devem continuar salváveis e vinculáveis depois;
- usuários autenticados devem conseguir consultar histórico e repetir pedidos;
- os dados de perfil devem ser editáveis pelo dono da conta;
- dados de conta devem permanecer separados da configuração administrativa.

## Relacionados

- [accounts.stat](accounts.stat.md)
- [orders.spec](orders.spec.md)
- [authentication.spec](authentication.spec.md)

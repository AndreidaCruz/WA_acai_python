# Spec de Interface

Esta spec define o shell do aplicativo, a navegação e a experiência por perfil do WA Açaí.

## Escopo

- shell do aplicativo;
- navegação por perfil;
- distinção entre cliente, convidado e admin;
- carrinho como fluxo especial;
- feedback visual e toasts;
- formulários e composição de pedido.

## Regras

- o topo deve mostrar `Entrar` quando não houver usuário autenticado;
- quando autenticado, o topo deve mostrar identidade do usuário em vez de `Guest`;
- áreas administrativas devem aparecer somente para admin validado pelo backend;
- o carrinho deve continuar acessível como um fluxo especial, com acompanhamento pós-checkout;
- os formulários devem indicar campos obrigatórios com clareza;
- as confirmações e falhas devem aparecer como feedback visual consistente.

## Relacionados

- [ui.stat](ui.stat.md)
- [catalog.spec](catalog.spec.md)
- [orders.spec](orders.spec.md)
- [admin.spec](admin.spec.md)

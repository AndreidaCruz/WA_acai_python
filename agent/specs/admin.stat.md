# Estatuto de Admin

Data da última atualização: 2026-06-01

## Estado atual

- as operações de admin foram separadas como contrato dedicado.
- o setup inicial do primeiro admin faz parte explicitamente do contrato de admin.
- o frontend expõe uma tela de setup único antes de existir o primeiro admin.
- a shell do admin está sendo separada em áreas de visão geral, estoque, usuários e configuração, com pedidos tratados como um painel operacional.

## Pendências

- finalizar o painel operacional de pedidos com transições explícitas de status e comportamento de atualização.
- expor a listagem de usuários clientes e a promoção para admin pelo painel.
- manter todas as ações de admin validadas pelo backend.
- manter a tela inicial oculta após a inicialização.

## Evidências / validação

- o contrato de admin está documentado de forma independente.
- o fluxo de setup inicial foi adicionado ao código-base e ao contrato.
- o bootstrap único do admin foi verificado no fluxo de UI/API.
- a promoção de usuário admin e a navegação sensível a papel estão sendo adicionadas à shell.

## Controle de commit

- trace_id: `awc-20260602-admin-01`
- status do commit: não realizado
- hash (opcional, após o commit):
- mensagem:
- resumo: contrato de admin separado do guarda-chuva do produto e expandido em seções operacionais.

## Relacionados

- [admin.spec](admin.spec.md)
- [wa-acai.stat](wa-acai.stat.md)

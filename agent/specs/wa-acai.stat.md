# Stat do WA Açaí

Data da última atualização: 2026-06-02

## Estado atual

- o escopo do produto foi resetado para um PWA completo no estilo delivery;
- a camada de convenção continua intacta e separada do reset da aplicação;
- a implementação antiga foi limpa para abrir espaço para a nova arquitetura;
- a nova base de backend e frontend está implementada com estrutura modular por domínio;
- a spec guarda-chuva do WA Açaí agora aponta para specs de domínio dedicadas para todas as áreas principais do contrato;
- o fluxo de smoke test de login de admin, carregamento do cardápio, criação de pedido e baixa de estoque passou;
- o backend agora vive em `backend/src`;
- o fluxo de setup inicial único do admin foi implementado e validado por smoke test;
- o logging centralizado da aplicação está ativo e execuções em debug gravam em `logs/wa-acai.log`;
- existe um contrato dedicado de shell de UI para navegação por perfil, entrada de carrinho e acesso admin;
- os toasts agora exibem falhas de login, ações de admin e confirmações de pedido/carrinho no shell;
- o shell do admin está sendo dividido em visão geral, estoque, usuários e configurações, enquanto o board de pedidos trata das mudanças operacionais de status.

## Pendências

- reconstruir os demais fluxos de frontend em torno da experiência de cardápio, carrinho e admin;
- continuar preenchendo os fluxos de domínio e as superfícies de UI restantes;
- reforçar as experiências de estoque e pedidos na vitrine e nos painéis administrativos;
- manter o layout `src` do backend estável;
- manter a tela de setup desativada depois que o primeiro admin for criado;
- manter `.stat` rastreável conforme a arquitetura evolui;
- manter o logging centralizado e livre de payloads sensíveis;
- finalizar o shell de UI com navegação distinta entre cliente e admin;
- estender o comportamento dos toasts para todos os fluxos assíncronos restantes;
- manter a promoção de usuário admin e o gerenciamento de status de pedidos validados pelo backend.

## Evidências / validação

- o contrato do produto foi rascunhado a partir do novo conceito do projeto;
- os arquivos de convenção continuam instalados e isolados do escopo da aplicação;
- documentos de roadmap e TODO estão sendo usados para ordenar o trabalho;
- a spec guarda-chuva foi dividida em specs e stats de domínio dedicadas;
- o smoke test do backend passou para health, cardápio, login, criação de pedido e baixa de estoque;
- o build do frontend passou com Vite;
- o setup inicial do primeiro admin foi verificado e depois travado;
- o logging do backend foi integrado aos eventos HTTP, auth, pedidos, admin, websocket e estoque;
- as regras do shell de UI foram registradas como contrato dedicado para eliminar ambiguidades entre guest e admin;
- os toasts foram integrados às ações importantes do shell e aos erros de validação do backend;
- admins agora podem ser listados e promovidos pelo shell, e ações de status do pedido estão expostas no board operacional.

## Controle de commit

- trace_id: `awc-20260602-ui-shell-02`
- status do commit: não feito
- hash (opcional, após o commit):
- mensagem:
- resumo: base de implementação do WA Açaí ampliada com logging centralizado e contrato de shell de UI por perfil.

## Riscos ou dúvidas abertas

- o novo escopo é significativamente maior do que o protótipo anterior e vai exigir conclusão em fases;
- alguns detalhes de domínio ainda precisam ser implementados nas UI e nas APIs.

## Relacionados

- [wa-acai.spec](wa-acai.spec.md)
- [project.stat](project.stat.md)
- [../../docs/plans/roadmap.md](../../docs/plans/roadmap.md)
- [../../docs/plans/todo.md](../../docs/plans/todo.md)

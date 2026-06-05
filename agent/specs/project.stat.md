# Stat do Projeto

Data da última atualização: 2026-06-02

## Estado atual

- a convenção inicial foi criada;
- a estrutura base está disponível;
- os domínios reais ainda podem ser separados em specs próprias;
- WA Açaí agora está definido como o domínio de produto do repositório;
- o fluxo padrão de atualização está instalado com `project.update.md` e `project.migrations.md`;
- os pontos de entrada de visão geral do projeto e de pasta estão alinhados à convenção padrão;
- a implementação do produto foi resetada para preparar o novo escopo estilo delivery;
- o domínio WA Açaí agora tem um conjunto mais rico de spec/stat/linkagem e um ponto de entrada de roadmap;
- a nova base de implementação foi bootstrapada e validada por smoke test;
- o backend agora vive em `backend/src`;
- o fluxo de setup inicial do primeiro admin está implementado e validado por smoke test;
- o logging da aplicação é centralizado e execuções em debug gravam em `logs/wa-acai.log`;
- o launcher agora passa `--debug` para o ponto de entrada do backend;
- um contrato dedicado de shell de UI agora define navegação por perfil, entrada para carrinho e visibilidade de admin;
- os toasts de alerta agora exibem feedback importante de validação e ações no shell.

## Pendências

- definir specs reais de domínio quando o projeto alvo amadurecer;
- ajustar a documentação operacional conforme o uso concreto aparecer;
- alinhar a implementação do WA Açaí ao novo escopo estilo delivery;
- consolidar o roadmap de adequação no novo fluxo de atualização;
- manter o roadmap e o TODO sincronizados com a spec e a stat;
- manter o progresso da implementação sincronizado com as stats de domínio;
- manter o layout `src` do backend e o fluxo de setup único estáveis;
- manter o logging seguro, centralizado e sem segredos;
- manter o shell de UI alinhado com a validação de perfil do backend;
- manter os toasts reutilizáveis e consistentes em todo o shell.

## Evidências / validação

- o template inicial foi criado;
- a estrutura do workspace foi definida;
- a convenção `.spec` e `.stat` foi estabelecida;
- o escopo WA Açaí foi documentado em `wa-acai.spec.md`;
- o fluxo de atualização da convenção e os arquivos de visão geral foram adicionados para o bootstrap atual;
- a implementação anterior do protótipo foi removida do backend e do frontend;
- o próximo plano de implementação está sendo registrado em `docs/plans/`;
- a base do backend e do frontend foi restaurada e validada por smoke test;
- o backend foi movido para `backend/src` e o fluxo de setup inicial do admin foi verificado;
- o logging do backend foi centralizado e validado em modo debug;
- o contrato de shell de UI foi criado para eliminar ambiguidades entre guest e admin;
- toasts foram adicionados para ações importantes do shell e erros de validação;
- usuários admin já podem ser listados e promovidos pelo shell, e ações de status de pedido estão sendo expostas no board operacional.

## Controle de commit

- trace_id: `awc-20260602-ui-shell-01`
- status do commit: não feito
- hash (opcional, após o commit):
- mensagem:
- resumo: base de implementação do projeto ampliada com logging centralizado, debug em arquivo e contrato dedicado de shell de UI.

## Próximo passo recomendado

- substituir ou dividir esta spec fundacional quando os domínios do projeto estiverem claros.

## Riscos ou dúvidas abertas

- esta spec é apenas um ponto de partida;
- ela não deve absorver domínios independentes por conveniência.

## Regra central

- `.stat` registra estado, pendências, validação e próximos passos.
- `.stat` não redefine contrato.

## Relacionados

- [project.spec](project.spec.md)
- [wa-acai.spec](wa-acai.spec.md)
- [../../docs/plans/roadmap.md](../../docs/plans/roadmap.md)
- [../../docs/plans/todo.md](../../docs/plans/todo.md)

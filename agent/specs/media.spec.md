# Spec de Mídia

Esta spec define imagens, logos, banners e o tratamento de arquivos enviados.

## Escopo

- imagens de produto;
- imagens de estoque;
- logos e banners da loja;
- caminhos de upload persistidos no banco;
- organização de arquivos de mídia.

## Regras

- o banco deve guardar caminhos, não binários brutos;
- a mídia deve ser associada à entidade correta quando necessário;
- uploads devem permanecer rastreáveis e reaproveitáveis;
- o frontend deve conseguir renderizar imagens de forma simples.

## Relacionados

- [media.stat](media.stat.md)
- [catalog.spec](catalog.spec.md)
- [settings.spec](settings.spec.md)

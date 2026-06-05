# Política do Workspace

- `agent/` é o workspace operacional;
- `tmp` armazena arquivos temporários;
- `prints` armazena screenshots e imagens de teste;
- `reports` armazena relatórios e evidências textuais;
- `scripts` armazena scripts auxiliares;
- `test` armazena testes pequenos;
- `note` armazena notas internas;
- `agent/.gitignore` ignora conteúdo operacional temporário por padrão; `agent/specs/`, `agent/policy/`, `agent/scripts/` e `agent/test/` continuam versionados; se algo em `tmp`, `prints`, `reports` ou `note` virar evidência durável, promova para o lugar correto antes de versionar.
- `agent/prints/` armazena screenshots, imagens de teste, evidências visuais e validações temporárias do agente; `docs/` armazena documentação humana/oficial; `docs/screenshots/` só deve existir se as imagens fizerem parte de documentação humana real.
- o workspace não é documentação oficial;
- nada ali vira contrato por acidente;
- arquivos temporários devem ser limpos ou promovidos;
- não espalhe arquivos fora do workspace.

## Relacionados

- [../specs/README.md](../specs/README.md)
- [../specs/project.stat.md](../specs/project.stat.md)

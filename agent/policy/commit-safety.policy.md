# Política de Segurança de Commit

- execute `git status --short` antes de propor ou fazer um commit;
- revise o diff;
- se o projeto usar Git, as mudanças relevantes devem terminar com `.stat` atualizado; quando aprovadas, também devem terminar com um commit limpo e coerente;
- use um `trace_id` curto e estável para amarrar a mudança antes do commit;
- formato recomendado de `trace_id`: `awc-YYYYMMDD-HHMM-xxxx`, em UTC, com `xxxx` curto alfanumérico;
- registre o `trace_id` em `.stat` e também na mensagem ou no corpo do commit;
- `.stat` pode registrar o hash depois do commit, mas não depende dele para existir;
- se o commit não for feito, `.stat` deve registrar o motivo e o estado do trace;
- não misture arquivos fora do escopo do stage no commit;
- não faça commit de segredos, `.env`, dumps, snapshots ou logs sensíveis;
- não faça commit de arquivos temporários por acidente;
- prefira commits pequenos por fase;
- se necessário, separe mudança de contrato, implementação e limpeza.

## Relacionados

- [../specs/project.stat.md](../specs/project.stat.md)
- [spec-stat.policy.md](spec-stat.policy.md)

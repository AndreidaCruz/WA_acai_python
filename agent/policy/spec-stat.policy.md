# Política de Spec / Stat

- `.spec` é contrato durável;
- `.stat` é estado vivo;
- toda `.spec` ativa deve ter uma `.stat`;
- `agent/specs/` concentra os contratos normativos que guiam mudanças no projeto;
- `docs/` pode referenciar specs, mas não substitui `agent/specs/` como fonte principal de contrato;
- `.stat` não substitui Git, mas pode referenciar `trace_id` e, após o commit, o hash para rastreabilidade;
- `.spec` não registra progresso;
- `.stat` não redefine contrato;
- specs precisam ter domínio claro;
- specs genéricas demais devem ser quebradas;
- atualize `.spec` quando o contrato mudar;
- atualize `.stat` quando o estado mudar.

## Relacionados

- [../specs/README.md](../specs/README.md)
- [../specs/project.spec.md](../specs/project.spec.md)
- [../specs/project.stat.md](../specs/project.stat.md)
- [linking.policy.md](linking.policy.md)

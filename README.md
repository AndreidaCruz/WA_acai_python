# WA Açaí

O WA Açaí está sendo reconstruído como um PWA no estilo delivery para navegação de cardápio, pedidos de convidados, contas autenticadas e controle de estoque para admin.

## Direção atual

- frontend em React + Vite;
- backend FastAPI em `backend/src`;
- persistência em SQLite;
- autenticação JWT;
- atualizações em tempo real de pedidos e estoque;
- consumo baseado em estoque e receitas.

## Como executar localmente

Backend:

```bash
cd backend
python -m src.app.main --debug --host 127.0.0.1 --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Launcher para Windows:

```bat
start-wa-acai.bat
```

O launcher cria `.venv` se necessário, instala dependências, inicia backend e frontend e abre o navegador automaticamente.

Quando iniciado com `--debug`, os logs do backend também são gravados em `logs/wa-acai.log`, além do console.

## Acesso admin

O primeiro admin é criado pela tela de setup único na área administrativa.

## Convenção

- `project.overview.md` é o ponto de entrada do agente;
- `project.update.md` define o fluxo atual de atualização;
- `agent/` contém o workspace durável da convenção;
- `docs/` contém a camada de documentação voltada para pessoas.

## Status

A base de implementação foi reconstruída e validada por smoke test conforme o novo conceito do produto descrito em `agent/specs/wa-acai.spec.md`.

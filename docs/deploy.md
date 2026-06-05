# Deploy da versão de apresentação

Essa é a forma mais simples de publicar o app sem que a banca precise baixar dependências:

## Recomendação

- Frontend: Vercel
- Backend: Render
- Banco: Neon Postgres

## Por que essa combinação

- Vercel publica o frontend React/Vite com uma URL pronta
- Render publica a API FastAPI em uma URL pública
- Neon fornece o Postgres em nuvem com `DATABASE_URL`

## O que já está pronto no projeto

- o frontend já lê `VITE_API_URL`
- o backend agora lê `DATABASE_URL`, `SECRET_KEY` e `CORS_ORIGINS`
- o `manifest.webmanifest` já existe no frontend

## Variáveis de ambiente

### Backend

- `DATABASE_URL`
- `SECRET_KEY`
- `CORS_ORIGINS`

### Frontend

- `VITE_API_URL`

## Passo a passo

1. Criar o banco no Neon e copiar a `DATABASE_URL`
2. Publicar o backend no Render
3. Setar no Render:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `CORS_ORIGINS` com a URL do frontend publicado
4. Publicar o frontend na Vercel
5. Setar na Vercel:
   - `VITE_API_URL` com a URL do backend
6. Abrir a URL pública do frontend

## Comando de start do backend

Use:

```bash
python -m src.app.main --host 0.0.0.0 --port $PORT
```

Se quiser habilitar logs em arquivo no ambiente de desenvolvimento, inicie com `--debug`. Nesse modo, os eventos ficam em `logs/wa-acai.log` além do console.

## Observação importante

Se você usar SQLite, o banco vai ficar amarrado ao arquivo local do servidor e isso não é uma boa base para exposição pública. Para apresentação, use Postgres externo.

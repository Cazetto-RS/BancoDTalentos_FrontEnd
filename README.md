# Banco de Talentos — Front-end

Interface React/TypeScript do Banco de Talentos da Point Media.

## Ambiente

```bash
npm ci
cp .env.example .env
npm run dev
```

```env
VITE_API_URL=http://localhost:3000
```

Em produção, use a URL pública da API no Render, sem barra final:

```env
VITE_API_URL=https://sua-api.onrender.com
```

Na API, configure `CORS_ORIGINS` com o domínio exato do front.

## Scripts

| Comando | Função |
|---|---|
| `npm run dev` | Desenvolvimento |
| `npm run build` | TypeScript e build de produção |
| `npm run lint` | Análise estática |
| `npm run preview` | Visualiza o build |

## Integração

- `src/services/api.ts`: cliente HTTP, URL por ambiente, JWT e erros.
- `src/contexts/AuthContext.tsx`: login, logout e sessão persistida.
- `ProtectedRoute`: bloqueia visitante e cargo incompatível.
- Login direciona candidato para `/perfil` e RH/admin para `/admin/dashboard`.
- Respostas 401 removem automaticamente a sessão local.
- Cadastro cria conta, faz login e salva o perfil base.
- Vagas públicas, candidaturas, vagas administrativas e candidatos usam a API.

## Rotas

| Rota | Acesso |
|---|---|
| `/` | Público |
| `/sobre` | Público |
| `/vagas-abertas` | Público |
| `/cadastro` | Público |
| `/login` | Público |
| `/perfil` | Candidato |
| `/admin/dashboard` | RH/Admin |
| `/admin/vagas` | RH/Admin |
| `/admin/candidatos` | RH/Admin |
| qualquer outra | Página 404 |

Cada rota define título no formato `Página | Banco de Talentos`. O favicon usa `public/favicon.svg`.

## Autenticação

O navegador mantém `talentos:token` e `talentos:user` no `localStorage`. Isso permite restaurar a sessão após atualização da página. A API continua sendo a autoridade: token inválido/expirado produz 401 e limpa a sessão.

Proteção visual não substitui segurança do servidor; a API verifica novamente o cargo em cada endpoint privado.

## Render

A API contém `render.yaml`. Após publicar:

1. configure `DATABASE_URL`;
2. configure `CORS_ORIGINS` com o domínio do front;
3. aplique a migration no Neon;
4. configure `VITE_API_URL` no serviço que hospedar o front;
5. gere um novo build do front.

## Uploads

Foto e PDFs ainda dependem de um serviço de arquivos. O front e a API já possuem os campos de URL, mas não enviam binários diretamente ao Neon.

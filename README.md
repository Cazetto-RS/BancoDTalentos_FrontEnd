# Banco de Talentos — Front-end

Interface React/TypeScript do Banco de Talentos da Point Media.

## Ambiente

Refatoração visual de 29/10/2026, com identidade e integrações preservadas. Consulte [REFATORACAO.md](REFATORACAO.md) para alterações e validações.

Ambiente validado: Node.js 24.22.1. Os testes usam o suporte nativo a TypeScript do Node.

Se você já tem um `.env` configurado, mantenha-o. Copie `.env.example` apenas em uma instalação nova.

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
| `npm test` | Testes da busca e dos filtros de vagas |
| `npm run preview` | Visualiza o build |

## Integração

- `src/services/api.ts`: cliente HTTP, URL por ambiente, JWT e erros.
- `src/contexts/AuthContext.tsx`: login, logout e sessão persistida.
- `ProtectedRoute`: bloqueia visitante e cargo incompatível.
- Login direciona candidato para `/perfil` e RH/admin para `/admin/dashboard`.
- Respostas 401 removem automaticamente a sessão local.
- Cadastro guarda os dados em uma área temporária, confirma o código recebido por e-mail e somente então cria a conta. A própria confirmação já abre a sessão, evitando uma segunda chamada de login.
- Recuperação de senha usa código de seis dígitos e encerra as sessões antigas.
- Vagas públicas, candidaturas, vagas administrativas e candidatos usam a API.

## Rotas

| Rota | Acesso |
|---|---|
| `/` | Público |
| `/sobre` | Público |
| `/vagas-abertas` | Público |
| `/cadastro` | Público |
| `/login` | Público |
| `/esqueci-senha` | Público |
| `/perfil` | Candidato |
| `/admin/dashboard` | RH/Admin |
| `/admin/vagas` | RH/Admin |
| `/admin/candidatos` | RH/Admin |
| qualquer outra | Página 404 |

Cada rota define título no formato `Página | Banco de Talentos`. O favicon usa `public/favicon.svg`.

## Autenticação

Com “Manter conectado” marcado, o navegador salva `talentos:token` e `talentos:user` no `localStorage`. Sem marcar, usa `sessionStorage` e encerra a sessão quando o navegador é fechado. A API continua sendo a autoridade: token inválido/expirado produz 401 e limpa a sessão.

Proteção visual não substitui segurança do servidor; a API verifica novamente o cargo em cada endpoint privado.

## Render

A API contém `render.yaml`. Após publicar:

1. configure `DATABASE_URL`;
2. configure `CORS_ORIGINS` com o domínio do front;
3. aplique a migration no Neon;
4. configure `VITE_API_URL` no serviço que hospedar o front;
5. gere um novo build do front.

## Uploads

Foto, currículo, certificados e carta de recomendação são enviados pela API ao bucket privado configurado no Supabase Storage. Os arquivos são visualizados por URLs temporárias assinadas.

## Executar no Windows

Abra o terminal na pasta do projeto e execute `npm ci` e `npm run dev`. Se precisar criar um `.env` no PowerShell, use `Copy-Item .env.example .env` antes de iniciar. O servidor de desenvolvimento mostra o endereço local no terminal.

## Atualização de interface e autenticação (08/11/2026)

Consulte [MELHORIAS_UI_E_SEGURANCA.md](MELHORIAS_UI_E_SEGURANCA.md) para conhecer o tema claro/escuro persistente, os componentes visuais padronizados, o cartão de cadastro com rolagem interna e os estados de bloqueio de login. O bloqueio de cinco tentativas requer a API atualizada fornecida em conjunto.

# Banco de Talentos — Front-end

Interface web do Banco de Talentos da Point Media. O projeto reúne a área pública para candidatos e o painel administrativo utilizado por administradores e profissionais de RH.

Nesta versão, o painel administrativo foi padronizado para compartilhar os mesmos componentes visuais, priorizar o azul da marca, funcionar nos temas claro e escuro e se adaptar a celulares, tablets, notebooks e monitores.

## Tecnologias

- React 19
- TypeScript 6
- Vite 8
- React Router 7
- Chart.js 4
- CSS modularizado por página e por componente
- Oxlint

## Pré-requisitos

- Node.js 20.19 ou superior (recomendado: Node.js 22 LTS)
- npm 10 ou superior

## Instalação e execução

```bash
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação, normalmente `http://localhost:5173`.

Para gerar e conferir a versão de produção:

```bash
npm run build
npm run preview
```

Para verificar a qualidade estática do código:

```bash
npm run lint
```

## Rotas

### Área pública

| Rota | Página |
| --- | --- |
| `/` | Início |
| `/sobre` | Sobre o projeto |
| `/vagas-abertas` | Vagas disponíveis |
| `/perfil` | Perfil do candidato |
| `/cadastro` | Cadastro em etapas |
| `/login` | Login |

### Painel administrativo

| Rota | Página |
| --- | --- |
| `/admin/dashboard` | Indicadores e gráficos |
| `/admin/vagas` | Gestão de vagas |
| `/admin/candidatos` | Gestão de candidatos |

A rota `/admin` redireciona para o Dashboard.

## Estrutura principal

```text
src/
├── assets/                 # Imagens realmente utilizadas
├── components/
│   ├── admin/              # Componentes reutilizáveis do painel
│   ├── common/             # Componentes compartilhados gerais
│   ├── jobs/               # Componentes das vagas públicas
│   └── layout/             # Navbar e sidebar
├── constants/              # Configurações e categorias reutilizadas
├── layouts/                # Estruturas das áreas pública e administrativa
├── pages/
│   ├── admin/              # Dashboard, vagas e candidatos
│   └── external/           # Páginas públicas
├── styles/                 # Estilos globais, compartilhados e por tela
└── types/                  # Tipos de domínio do painel
```

As páginas são carregadas de forma assíncrona com `React.lazy`, reduzindo o JavaScript inicial enviado ao navegador.

## Padrão visual do painel administrativo

### Cores e temas

As cores principais ficam em `src/styles/GlobalStyle.css`. Use sempre as variáveis CSS, principalmente:

```css
var(--color-primary)
var(--color-primary-hover)
var(--color-background)
var(--color-surface)
var(--color-surface-muted)
var(--color-text)
var(--color-text-muted)
var(--color-border)
```

O azul `--color-primary` é a cor de ação e destaque. Verde, amarelo e vermelho ficam reservados a estados semânticos, como contratado/ativo, pausado e fechado/dispensado.

O tema escolhido é salvo no `localStorage` com a chave `admin-theme`. As preferências de notificação usam `admin-preferences`.

### Ícones preenchidos

Todos os ícones administrativos são centralizados em `src/components/admin/AdminIcon.tsx`.

```tsx
import AdminIcon from '../../components/admin/AdminIcon'

<AdminIcon name="briefcase" aria-hidden="true" />
```

Evite criar SVGs administrativos diretamente dentro das páginas. Se um novo ícone for necessário, adicione-o ao tipo `AdminIconName` e ao mapa `paths` do componente.

### Cards de indicadores

Dashboard, Vagas e Candidatos usam o mesmo componente `AdminSummaryCards.tsx`. Isso garante o mesmo tamanho, espaçamento, tipografia, fundo e comportamento responsivo nas três páginas.

### Seletores de status

Os status de candidatos e vagas utilizam `AdminStatusSelect.tsx`. O `select` cobre toda a área visual do campo, então não é necessário clicar exatamente no texto ou na seta. O componente mantém foco visível e nome acessível para leitores de tela.

### Gráficos

Os gráficos do Dashboard são criados com Chart.js em `DashboardPage.tsx`.

- O gráfico de linha adapta textos, grade e pontos ao tema atual.
- O gráfico de rosca não usa bordas nos segmentos, evitando contornos contrastantes ao trocar o tema.
- As instâncias são destruídas ao trocar de tema ou sair da página, evitando canvas duplicado e vazamento de memória.

## Responsividade

O painel utiliza os seguintes comportamentos:

- Monitores: quatro cards de indicadores e tabelas completas.
- Notebooks e tablets horizontais: dois cards por linha e redução progressiva de colunas secundárias.
- Tablets e celulares: sidebar convertida em menu lateral, tabelas convertidas em cards e barras de ferramentas reorganizadas.
- Celulares estreitos: cards de indicadores em uma coluna, ações com alvos maiores e textos longos limitados sem rolagem horizontal.

O conteúdo administrativo possui sua própria rolagem em `.admin-layout__content`; a sidebar permanece fixa. Nos modais, somente o conteúdo interno rola, mantendo cabeçalho e ações acessíveis.

## Acessibilidade e boas práticas

- Elementos interativos usam `button`, `a`, `label` e `select` de forma semântica.
- Botões apenas com ícone possuem `aria-label` e `title` quando necessário.
- Modais possuem `role="dialog"`, `aria-modal`, foco inicial e fechamento pela tecla `Escape`.
- Estados ativos usam `aria-current`, `aria-pressed`, `aria-checked` ou `role="switch"` conforme o controle.
- O foco por teclado é visível com `--color-focus-ring`.
- Animações são reduzidas com `prefers-reduced-motion`.
- Textos auxiliares e metadados usam peso 400 para melhorar o conforto de leitura.
- Vagas e candidatos exibem seis registros por página antes da paginação.

## Dados atuais e integração com a API

Os dados administrativos ainda são mocks locais em:

- `src/pages/admin/DashboardPage.tsx`
- `src/pages/admin/AdminJobsPage.tsx`
- `src/pages/admin/AdminCandidatesPage.tsx`

Para conectar a API sem acoplar rede à interface, a próxima etapa recomendada é criar:

```text
src/services/api.ts
src/services/jobs.ts
src/services/candidates.ts
src/hooks/useJobs.ts
src/hooks/useCandidates.ts
```

Os serviços devem transformar as respostas da API nos tipos `AdminJob` e `AdminCandidate`. As páginas continuam responsáveis apenas por filtros, paginação e interação visual.

Operações que hoje alteram o estado local e deverão chamar a API:

- criação, edição e mudança de status da vaga;
- mudança de etapa e favorito do candidato;
- carregamento dos indicadores do Dashboard;
- dados do perfil administrativo e preferências persistidas no servidor.

Enquanto a API não está conectada, alterações de vagas e candidatos são perdidas ao recarregar. Tema e preferências do painel são exceções porque ficam no `localStorage`.

## Convenções para manutenção

- Use TypeScript e evite `any`.
- Reaproveite `components/admin` antes de criar novas versões.
- Use variáveis de `GlobalStyle.css` em vez de cores fixas, exceto estados semânticos.
- Mantenha ícones administrativos preenchidos e centralizados em `AdminIcon`.
- Novos filtros devem reiniciar a paginação para a página `1`.
- Restaure qualquer `overflow` alterado ao desmontar um modal.
- Antes de entregar uma alteração, execute `npm run lint` e `npm run build`.

## Scripts disponíveis

| Comando | Função |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica TypeScript e gera a produção |
| `npm run lint` | Analisa o código com Oxlint |
| `npm run preview` | Visualiza localmente o build de produção |

## Autenticação

As rotas administrativas ainda não possuem proteção real no front-end. Quando a autenticação for conectada, adicione um guard que valide sessão e perfil (`admin` ou `rh`) antes de renderizar `AdminLayout`.

A autorização definitiva também deve ser validada pela API; esconder opções no front-end não substitui a validação no servidor.

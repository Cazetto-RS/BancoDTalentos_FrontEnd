# BancoDTalentos_FrontEnd

# Frontend Banco de Talentos - Point Media / Fatec Tatuí

## Sobre o projeto

O **Banco de Talentos** é uma aplicação web desenvolvida para a empresa **Point Media** em parceria com a **Fatec Tatuí**.

O projeto tem como objetivo disponibilizar uma plataforma para cadastro, organização e gerenciamento de candidatos interessados em oportunidades profissionais.

A aplicação possui uma área pública, utilizada pelos candidatos, e uma área administrativa, destinada aos profissionais de Recursos Humanos e administradores da plataforma.

O frontend foi desenvolvido com foco em:

- Responsividade;
- Acessibilidade;
- Organização dos componentes;
- Facilidade de utilização;
- Padronização visual;
- Integração futura com a API do Banco de Talentos.

---

# Funcionalidades

A aplicação possui as seguintes funcionalidades:

## Área pública

- Visualização da página inicial;
- Apresentação da empresa e do projeto;
- Consulta de vagas abertas;
- Pesquisa de vagas por cargo, tecnologia ou área;
- Visualização das informações de uma vaga;
- Cadastro de candidatos dividido em etapas;
- Armazenamento temporário dos dados do cadastro;
- Adição e remoção de experiências e formações;
- Visualização e edição do perfil do candidato;
- Página de autenticação;
- Interface responsiva para diferentes dispositivos.

## Área administrativa

- Dashboard com indicadores do processo seletivo;
- Gráfico de evolução das inscrições;
- Gráfico de distribuição dos candidatos por status;
- Exibição das áreas mais disputadas;
- Exibição das inscrições mais recentes;
- Cadastro de novas vagas;
- Edição das informações das vagas;
- Alteração do status das vagas;
- Compartilhamento de vagas por URL e QR Code;
- Pesquisa, filtros, ordenação e paginação de vagas;
- Gerenciamento de candidatos;
- Alteração da etapa do candidato;
- Marcação de candidatos como favoritos;
- Visualização detalhada do perfil do candidato;
- Modal de configurações administrativas;
- Visualização do perfil do administrador ou profissional de RH;
- Alternância entre tema claro e tema escuro;
- Preferências administrativas armazenadas localmente.

---

# Tecnologias utilizadas

## Frontend

O projeto foi desenvolvido utilizando:

- **React**  
  Biblioteca utilizada para construção das interfaces e componentes da aplicação.

- **TypeScript**  
  Utilizado para adicionar tipagem estática, melhorar a organização e reduzir erros durante o desenvolvimento.

- **Vite**  
  Ferramenta utilizada para execução do ambiente de desenvolvimento e geração do build de produção.

- **React Router DOM**  
  Biblioteca responsável pelo gerenciamento das rotas e navegação entre as páginas.

- **Chart.js**  
  Biblioteca utilizada para criação dos gráficos do Dashboard administrativo.

- **CSS**  
  Utilizado para estilização, responsividade, temas e adaptação da interface.

- **Oxlint**  
  Ferramenta utilizada para análise estática e padronização do código.

---

# Instalação e configuração

## 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

Acesse o diretório do projeto:

```bash
cd BancoDTalentos_FrontEnd
```

---

## 2. Instale as dependências

```bash
npm install
```

---

## 3. Execute o projeto

Modo de desenvolvimento:

```bash
npm run dev
```

Após iniciar o projeto, o Vite exibirá o endereço da aplicação no terminal.

Normalmente:

```text
http://localhost:5173
```

---

## 4. Gere o build de produção

```bash
npm run build
```

Os arquivos de produção serão gerados dentro da pasta:

```text
dist
```

---

## 5. Visualize o build de produção

```bash
npm run preview
```

---

# Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica o TypeScript e gera o build de produção |
| `npm run lint` | Analisa o código utilizando Oxlint |
| `npm run preview` | Executa localmente o build de produção |

---

# Estrutura do projeto

```text
BancoDTalentos_FrontEnd
│
├── public
│   ├── favicon.svg
│   └── icons.svg
│
├── src
│   │
│   ├── App.tsx
│   ├── main.tsx
│   │
│   ├── assets
│   │   ├── logo.png
│   │   ├── fatec-tatui.jpg
│   │   └── svgs
│   │       └── Profile.svg
│   │
│   ├── components
│   │   │
│   │   ├── admin
│   │   │   ├── AdminIcon.tsx
│   │   │   ├── AdminSettingsModal.tsx
│   │   │   ├── AdminStatusSelect.tsx
│   │   │   ├── AdminSummaryCards.tsx
│   │   │   ├── CandidateDetailsModal.tsx
│   │   │   ├── JobFormModal.tsx
│   │   │   └── JobShareModal.tsx
│   │   │
│   │   ├── common
│   │   │   └── AlertModal.tsx
│   │   │
│   │   ├── jobs
│   │   │   ├── JobApplicationModal.tsx
│   │   │   └── JobCategoryIcon.tsx
│   │   │
│   │   └── layout
│   │       ├── AdminSidebar
│   │       │   └── AdminSidebar.tsx
│   │       │
│   │       └── NavBar
│   │           └── Navbar.tsx
│   │
│   ├── constants
│   │   └── jobCategories.ts
│   │
│   ├── layouts
│   │   ├── Admin
│   │   │   └── AdminLayout.tsx
│   │   │
│   │   └── Navbar
│   │       └── ExternalLayout.tsx
│   │
│   ├── pages
│   │   │
│   │   ├── admin
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AdminJobsPage.tsx
│   │   │   └── AdminCandidatesPage.tsx
│   │   │
│   │   └── external
│   │       ├── HomePage.tsx
│   │       ├── AboutPage.tsx
│   │       ├── JobsPage.tsx
│   │       ├── ProfilePage.tsx
│   │       ├── RegistrationPage.tsx
│   │       └── LoginPage.tsx
│   │
│   ├── styles
│   │   ├── GlobalStyle.css
│   │   ├── AdminShared.css
│   │   ├── AdminLayout.css
│   │   ├── AdminSidebar.css
│   │   ├── DashboardPage.css
│   │   ├── AdminJobsPage.css
│   │   ├── AdminCandidatesPage.css
│   │   ├── AdminJobModal.css
│   │   ├── AdminCandidateModal.css
│   │   ├── AdminSettingsModal.css
│   │   └── ...
│   │
│   └── types
│       ├── AdminCandidate.ts
│       └── AdminUser.ts
│
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

# Arquitetura do frontend

O frontend utiliza uma arquitetura baseada na separação de responsabilidades:

```text
Routes
   |
   ↓
Layouts
   |
   ↓
Pages
   |
   ↓
Components
   |
   ↓
Services / API
```

A camada de serviços será adicionada durante a integração definitiva com a API.

---

## Routes

As rotas são definidas no arquivo:

```text
src/App.tsx
```

O projeto utiliza carregamento assíncrono com `React.lazy` e `Suspense`.

Esse recurso evita que todas as páginas sejam carregadas ao mesmo tempo, diminuindo o tamanho inicial do JavaScript enviado ao navegador.

---

## Layouts

Os Layouts definem as estruturas principais da aplicação.

### ExternalLayout

Utilizado pelas páginas públicas e responsável por exibir a barra de navegação principal.

### AdminLayout

Utilizado pelas páginas administrativas e responsável por exibir:

- Sidebar;
- Conteúdo administrativo;
- Controle do tema;
- Área de rolagem do painel.

---

## Pages

As páginas representam as telas completas da aplicação.

Elas são divididas entre:

```text
pages/external
```

Páginas utilizadas pelos candidatos e visitantes.

```text
pages/admin
```

Páginas utilizadas por administradores e profissionais de Recursos Humanos.

---

## Components

Os componentes representam partes reutilizáveis da interface.

Exemplos:

- Cards de indicadores;
- Ícones administrativos;
- Seletores de status;
- Modais;
- Navbar;
- Sidebar;
- Formulários;
- Categorias de vagas.

---

## Types

A pasta `types` contém as interfaces e tipos utilizados pelo TypeScript.

Exemplos:

```text
AdminCandidate
AdminUser
CandidateStatus
```

A tipagem facilita a integração futura com os dados retornados pela API.

---

# Rotas da aplicação

## Área pública

| Rota | Página |
| --- | --- |
| `/` | Página inicial |
| `/sobre` | Sobre o projeto |
| `/vagas-abertas` | Vagas disponíveis |
| `/perfil` | Perfil do candidato |
| `/cadastro` | Cadastro do candidato |
| `/login` | Autenticação |

---

## Área administrativa

| Rota | Página |
| --- | --- |
| `/admin` | Redireciona para o Dashboard |
| `/admin/dashboard` | Dashboard administrativo |
| `/admin/vagas` | Gerenciamento de vagas |
| `/admin/candidatos` | Gerenciamento de candidatos |

---

# Sistema visual

As principais variáveis de cores estão localizadas em:

```text
src/styles/GlobalStyle.css
```

Exemplo:

```css
--color-primary: #169cf9;
--color-primary-hover: #0586df;
--color-background: #eee7ea;
--color-surface: #ffffff;
--color-text: #30303a;
--color-text-muted: #53525a;
--color-border: #e4dfe2;
```

A cor azul definida em `--color-primary` é utilizada como cor principal da aplicação.

As cores verde, amarela e vermelha são utilizadas apenas para representar estados específicos.

Exemplos:

- Verde: vaga ativa ou candidato contratado;
- Amarelo: vaga pausada;
- Vermelho: vaga fechada ou candidato dispensado;
- Azul: ações, informações e status em andamento.

---

# Componentes administrativos reutilizáveis

## AdminIcon

Centraliza os SVGs utilizados pelo painel administrativo.

```tsx
<AdminIcon name="briefcase" />
```

Os ícones administrativos utilizam preenchimento por `fill`, mantendo o mesmo padrão visual.

---

## AdminSummaryCards

Componente responsável pelos quatro cards exibidos no topo das páginas:

- Dashboard;
- Vagas;
- Candidatos.

A utilização de um único componente mantém as páginas visualmente padronizadas.

---

## AdminStatusSelect

Componente utilizado para alterar os status de vagas e candidatos.

Toda a área visual do campo é clicável, permitindo abrir as opções sem precisar clicar exatamente no texto ou na seta.

---

# Dashboard

O Dashboard utiliza o **Chart.js** para apresentar informações do processo seletivo.

Os gráficos disponíveis são:

- Evolução das inscrições;
- Distribuição dos candidatos por etapa;
- Áreas mais disputadas;
- Candidatos adicionados recentemente.

Os gráficos também respondem à alteração entre tema claro e escuro.

O gráfico de rosca não utiliza bordas entre os segmentos, evitando contornos claros no tema escuro ou escuros no tema claro.

---

# Temas

O painel administrativo possui:

- Tema claro;
- Tema escuro.

A preferência é armazenada no navegador utilizando:

```text
localStorage
```

Chave utilizada:

```text
admin-theme
```

As configurações administrativas também são armazenadas localmente com a chave:

```text
admin-preferences
```

---

# Responsividade

A aplicação foi desenvolvida para funcionar em:

- Celulares;
- Tablets;
- Notebooks;
- Monitores convencionais;
- Monitores maiores.

Principais comportamentos responsivos:

- Sidebar convertida em menu lateral nos dispositivos menores;
- Cards reorganizados conforme a largura disponível;
- Tabelas administrativas convertidas em cards;
- Filtros reorganizados em múltiplas linhas;
- Modais adaptados ao tamanho da tela;
- Textos longos limitados para evitar vazamento;
- Paginação adaptada para dispositivos móveis;
- Área administrativa com rolagem independente;
- Cabeçalhos dos modais separados da área rolável.

---

# Acessibilidade

Foram aplicadas práticas de acessibilidade, como:

- Uso de elementos HTML semânticos;
- Textos alternativos;
- Identificação de botões com `aria-label`;
- Foco visível para navegação por teclado;
- Uso de `aria-current` nos links ativos;
- Uso de `aria-pressed` em botões de estado;
- Uso de `role="dialog"` nos modais;
- Fechamento dos modais com a tecla `Escape`;
- Suporte à configuração `prefers-reduced-motion`;
- Texto oculto para leitores de tela;
- Indicador de carregamento acessível durante a troca de páginas.

---

# Integração com a API

Atualmente, as páginas administrativas utilizam dados simulados para desenvolvimento e validação visual.

Os dados estão localizados principalmente em:

```text
src/pages/admin/DashboardPage.tsx
src/pages/admin/AdminJobsPage.tsx
src/pages/admin/AdminCandidatesPage.tsx
```

Durante a integração com a API, recomenda-se criar:

```text
src
├── services
│   ├── api.ts
│   ├── authService.ts
│   ├── jobsService.ts
│   └── candidatesService.ts
│
└── hooks
    ├── useAuth.ts
    ├── useJobs.ts
    └── useCandidates.ts
```

Fluxo esperado:

```text
Página
   |
   ↓
Hook
   |
   ↓
Service
   |
   ↓
API Banco de Talentos
   |
   ↓
PostgreSQL
```

Operações que deverão ser integradas:

- Login e autenticação;
- Cadastro de usuários;
- Cadastro e edição de vagas;
- Alteração do status das vagas;
- Consulta de candidatos;
- Alteração da etapa dos candidatos;
- Favoritos;
- Upload de currículos;
- Upload de imagens;
- Indicadores do Dashboard;
- Informações do administrador ou RH.

---

# Segurança

A segurança definitiva será controlada pela API.

O frontend deverá trabalhar com:

- Tokens JWT;
- Proteção das rotas administrativas;
- Controle de sessão;
- Diferenciação entre candidato, RH e administrador;
- Tratamento de token expirado;
- Redirecionamento de usuários não autenticados;
- Validação dos arquivos enviados;
- Comunicação segura com a API.

A ocultação de páginas ou botões no frontend não substitui a validação de permissões realizada pelo backend.

---

# Melhorias futuras

Algumas melhorias planejadas:

- Integração completa com a API;
- Proteção das rotas administrativas;
- Verificação de e-mail por código;
- Recuperação de senha;
- Upload de currículo em PDF;
- Upload de foto de perfil;
- Persistência do cadastro em etapas;
- Validação avançada dos formulários;
- Exibição de mensagens retornadas pela API;
- Testes automatizados;
- Testes de acessibilidade;
- Implementação de notificações;
- Utilização de inteligência artificial para análise de candidatos;
- Melhorias no sistema de busca e filtros.

---

# Grupo

- **Rafael Sandei Cazetto**  
  Responsável pelo desenvolvimento do backend e validação da qualidade da integração com o frontend.

- **Pedro Henrique Aragão**  
  Responsável pelo desenvolvimento do frontend.

- **Ícaro Cau**  
  Responsável pela documentação e parte textual do projeto.

- **Enzo Gaioto Soares**  
  Responsável pela elaboração do artigo e revisão textual.

---

# Projeto

Desenvolvido como projeto acadêmico para a **Fatec Tatuí**, em parceria com a empresa **Point Media**.
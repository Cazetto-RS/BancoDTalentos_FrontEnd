# Refatoração visual — Point Media

Entrega de 29/10/2026. O objetivo foi melhorar o acabamento e a interação preservando a identidade do Banco de Talentos.

## Identidade preservada

Logo original, azul e rosa da marca, navegação escura, mensagem principal da Home, conteúdo institucional e organização das páginas foram mantidos. As rotas e os contratos com a API continuam os mesmos.

## Alterações

- Tipografia, espaçamentos, bordas, sombras, botões e campos padronizados com variáveis CSS.
- Home com o mesmo título e subtítulo, fundo suave nas cores da marca e ação de pesquisa visível.
- Menu móvel com fechamento por Escape e retorno do foco ao botão; link para pular ao conteúdo e foco visível nos controles.
- Transições discretas, respeitando a preferência por movimento reduzido.
- Busca de vagas que ignora acentos e maiúsculas, filtros cumulativos por área/modelo/contrato, contagem de resultados e paginação responsiva.
- Estados de carregamento, lista vazia, nenhum resultado e erro com tentativa de recarregamento.
- Cadastro com as sete etapas visíveis no indicador. Competência, nível e experiência ocupam a mesma largura das áreas de interesse e se empilham no celular.
- Ícone de visibilidade de senha reaproveitado entre login e cadastro, eliminando SVG duplicado.
- Ajustes visuais nas telas de perfil, vagas administrativas, candidatos, dashboard, configurações e modais, mantendo seus fluxos.

## Organização do código

| Arquivo | Responsabilidade |
|---|---|
| `src/styles/GlobalStyle.css` | Variáveis de aparência, temas, foco e transições compartilhadas. |
| `src/styles/externalInterface.css` | Composição da Home e campo de pesquisa compartilhado. |
| `src/utils/jobSearch.ts` | Normalização da pesquisa e aplicação dos filtros, sem efeitos externos. |
| `src/pages/external/JobsPage.tsx` | Carregamento da API, estados da listagem, filtros, paginação e abertura do modal existente. |
| `src/layouts/Navbar/ExternalLayout.tsx` | Contêiner externo, navegação acessível e retorno ao início ao mudar de rota. |
| `tests/jobSearch.test.mjs` | Cinco testes para pesquisa, filtros combinados, ausência de resultados e limpeza. |

## Validação realizada

`npm run build` e `npm test` concluídos com sucesso em Node.js 24.22.1. Nenhuma dependência foi adicionada.

Conferência no navegador em desktop e larguras de 390 e 320 pixels. Foram revisados a Home, menu, login, cadastro, competências, perfil, dashboard, listagens administrativas e configurações em tema claro/escuro. Na lista pública foram verificados filtros combinados, limpeza, paginação, abertura do modal e estados vazio/erro. As telas dependentes de autenticação e dados foram verificadas com respostas fictícias locais, excluídas desta entrega.

O cliente HTTP (`api.ts`), o contexto de autenticação, a proteção de rotas, o componente de candidatura e a lógica de recuperação de senha permanecem iguais aos do ZIP recebido. A lógica de envio e confirmação do cadastro não foi alterada.

Não foi realizado teste ponta a ponta com a API real: cadastro, e-mail de verificação, reenvio com temporizador, recuperação de senha, uploads e gravações devem ser conferidos com seu backend local. Não houve publicação em produção.

## Como executar

Mantenha o seu `.env` com a URL correta da API. Na pasta do projeto:

```bash
npm ci
npm run dev
```

Para validar e gerar a versão de produção:

```bash
npm test
npm run build
```

O ZIP contém o código-fonte e o arquivo de dependências travadas. `node_modules`, builds anteriores, histórico Git e arquivos temporários de teste não fazem parte do pacote.

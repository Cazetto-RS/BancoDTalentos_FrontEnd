# Compartilhamento de vagas privadas

As alterações exigem publicar a API e o frontend juntos.

1. Configure `VITE_API_URL` no frontend com o endereço da API (por exemplo `https://sua-api.onrender.com`). O modal obtém um caminho assinado da API autenticada e constrói o link com esta variável, sem `VITE_PUBLIC_SITE_URL`.
2. Configure `CORS_ORIGINS` na API incluindo o domínio HTTPS do frontend publicado. **O primeiro domínio HTTPS deve ser o frontend de destino para quem escaneia o QR Code.** Em ambiente local sem HTTPS configurado, use `http://localhost:5173`.
3. RH/Admin: em Gerenciar vagas, clicar em Compartilhar vaga gera um link com assinatura HMAC e validade de 30 dias; QRServer cria a imagem QR desse link. Não envie informações de sessão na URL.
4. O link abre `/vagas/compartilhar/:id/:token` na API, que redireciona ao frontend com os parâmetros de convite. O candidato deve fazer login; após login retorna à URL original, consulta `/vagas/convite/:id/:token` com JWT e pode se candidatar com o mesmo convite.
5. A listagem de vagas mantém visibilidade exclusivamente pública. As rotas por ID não aceitam vaga privada sem o token assinado. Vagas pausadas/fechadas não aceitam candidatura.
6. Os convites expiram após 30 dias. Alterar `JWT_SECRET` invalida todos os convites e sessões; não faça isso inadvertidamente. A implementação não permite revogação individual de convite (exigiria armazenar tokens/revogação no banco).
7. O QRServer é externo e recebe o link de convite para produzir o QR. Trate esse link como um convite de acesso: quem tem o link e uma conta autenticada pode acessar a vaga. Não é um convite restrito a uma pessoa específica.

Testes sugeridos: vaga pública listada; vaga privada invisível na listagem; acesso privado sem token dá 404; QR válido redireciona ao frontend; usuário deslogado retorna ao convite após login; candidatura privada com/sem token válido; candidatura de vaga fechada falha; convite adulterado/expirado falha; perfil RH/Admin não envia candidatura.

# QR Code — compartilhamento de vagas

O modal `src/components/admin/JobShareModal.tsx` agora solicita um QR Code verdadeiro à API HTTPS `https://api.qrserver.com/v1/create-qr-code/`. O QR codifica apenas o endereço gerado pela função `createJobShareUrl` do arquivo `src/services/jobStorage.ts`, sem credenciais.

O serviço de terceiros recebe a URL pública da vaga. O QR pode deixar de carregar se o serviço ficar indisponível ou se houver bloqueio de rede; o usuário ainda pode copiar o link. Não é necessário adicionar chaves de API ou alterar o backend para gerar o QR.

### Ambiente local

O link gerado pelo navegador em `localhost` não abre em outros dispositivos. Para testar com celular, configure opcionalmente `VITE_PUBLIC_SITE_URL=https://seu-frontend.vercel.app` no `.env` local e reinicie o Vite. Essa URL deve apontar à versão publicada que contém a mesma vaga no mesmo backend.

### Atenção às vagas privadas

A API atual não expõe vagas privadas em `/vagas`. Portanto, ainda que o QR seja válido, a página pública não consegue abrir vagas privadas. Não torne essas vagas públicas automaticamente: um eventual compartilhamento privado exige projeto de autorização por token e validação no backend.

### Teste

1. Abra o painel administrativo > vagas, e clique em compartilhar uma vaga pública ativa.
2. Compare o link mostrado com a URL de destino do QR Code no celular.
3. Abra o link em uma janela anônima e confirme que a vaga aparece.
4. Teste a cópia do link e a mensagem de indisponibilidade simulando bloqueio ao domínio api.qrserver.com.

Comandos locais após instalar dependências: `npm ci`, `npm run build`, `npm test`.

# HCGV C-224 — Médico Psiquiatria

Plataforma de estudos estática, responsiva e instalável (PWA) para o concurso da FHCGV.

## Publicar no GitHub Pages
1. Crie um repositório no GitHub e envie todo o conteúdo desta pasta para a branch `main`.
2. Em **Settings → Pages**, selecione **GitHub Actions** como fonte.
3. A workflow `pages.yml` publica o site automaticamente.
4. A workflow `daily-update.yml` roda diariamente às 07:00 (horário de Belém), verifica fontes oficiais e renova as questões do dia.

## Questões realmente inéditas todos os dias
A atualização funciona sem chave usando rotação do banco local. Para gerar questões inéditas por IA diariamente:
1. Crie uma chave de API da OpenAI.
2. No repositório: **Settings → Secrets and variables → Actions → New repository secret**.
3. Nome: `OPENAI_API_KEY`.
4. Cole a chave. A workflow passa a gerar 8 novas questões por dia; se houver qualquer falha, usa automaticamente o banco local.

## Atualizações oficiais
O script acompanha páginas oficiais configuradas em `scripts/daily_update.py`. Uma alteração detectada é exibida no painel **Atualizações diárias**, sempre com link para a fonte. Mudanças legais ou de edital devem ser conferidas no documento oficial antes de alterar a estratégia de prova.

## Vercel / Netlify
O repositório também contém `vercel.json` e `netlify.toml`; basta importar o repositório nessas plataformas. O GitHub Actions continua sendo responsável pelos arquivos de atualização diária.

## Uso offline
Depois de publicado, abra o site no Safari/Chrome e use **Adicionar à Tela de Início**. O service worker mantém a plataforma-base disponível offline; dados diários são atualizados quando houver conexão.

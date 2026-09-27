# HCGV C-224 — Médico Psiquiatria

Site estático no GitHub Pages. Agora mostra a próxima atividade, uma sessão interrompida ou descanso. Cronograma, Conteúdos, Praticar, Histórico e Fontes ficam separados.

## Planejamento e dados
Cronograma calculado a partir de tempo disponível, registros anteriores, erros e revisões vencidas. Projeção não presume cumprimento. Pesos pedagógicos não representam divisão oficial de questões entre Clínica e Psiquiatria. Domingo prioriza revisão.

Dados locais na chave original hcgv-c224-psy-v1. Backup anterior à migração preservado. Exporte o histórico para trocar de aparelho. Não existe sincronização automática ou acesso à conta BIPP Prime. O servidor não acessa o histórico local.

## Conteúdo
Programa indexado; acervo didático parcial. Sínteses introdutórias, roteiros externos e materiais pendentes são identificados. Questões autorais com referências, não oficiais. Inspiração em prova anterior identificada quando verificada.

BIPP Prime exige índice e títulos reais fornecidos pelo usuário. MEDGRUPO/MEDCURSO/MED vinculados por páginas oficiais públicas, sem reprodução de apostilas pagas. Gratuito não significa domínio público. Fontes lista os materiais pendentes.

## Atualização diária
Workflow às 07:00 de Belém compara páginas oficiais, informa falhas e seleciona oito exercícios do banco. Não gera conteúdo médico ou legal por IA. Mudança de página não comprova retificação. Publica no mesmo workflow, pois commits do GITHUB_TOKEN não disparam outro workflow de push.

O cronograma individual é recalculado ao usar o site e na virada do dia enquanto aberto. Aulas e questões externas exigem registro manual.

## Desenvolvimento
Sirva esta pasta por HTTP. Entrada: index.html, engine.js e app-v2.js. Acervo: data/catalog.js e data/questions.js. Arquivos legados preservados, não carregados pela nova interface. Cache offline requer primeiro acesso conectado.

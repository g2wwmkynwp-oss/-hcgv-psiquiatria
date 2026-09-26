const WEEKLY_PLAN = {
  target: "9h15 de estudo-base por semana + até 1h30 opcional. Em novembro, subir gradualmente para 11–12h/semana se a rotina estiver tolerando bem.",
  principle: "Blocos pesados pela manhã/fim da manhã; noites protegidas para residência, grupos, jantar, piano e desaceleração. Sábado recebe o treino mais longo; domingo fica leve, especialmente quando houver plantão noturno.",
  days: [
    {
      day:"Segunda",
      fixed:"Musculação 07:00–08:00 · IML 15:00 · Instituto Maués 19:00–21:00",
      study:"09:00–10:15",
      duration:"1h15",
      subject:"SUS / Saúde Pública",
      work:"45 min teoria/lei seca (rodízio: CF 196–200 → Lei 8.080 → Decreto 7.508 → Lei 8.142 → PNAB) + 20 min questões + 10 min caderno de erros.",
      backup:"10:45–12:00 se houver atendimento particular pela manhã.",
      note:"Não deslocar estudo para depois do grupo; preservar jantar e desaceleração."
    },
    {
      day:"Terça",
      fixed:"Musculação 06:20–07:20 · IML 14:00",
      study:"09:00–10:30",
      duration:"1h30",
      subject:"Psiquiatria — núcleo pesado",
      work:"50 min conteúdo (psicopatologia, humor, psicóticos, substâncias, psicofarmacologia) + 30 min questões + 10 min recuperação sem consulta.",
      backup:"10:30–12:00.",
      note:"Bloco principal de Psiquiatria da semana."
    },
    {
      day:"Quarta",
      fixed:"CESUPA Almirante 08:30 · natação 17:00–18:00 (ou 19:00–20:00 quando houver Núcleo)",
      study:"10:30–12:00",
      duration:"1h30",
      subject:"Clínica Geral",
      work:"Síndromes e conduta: cardio/pneumo → gastro/hepato → nefro/eletrólitos → endócrino → infecto → emergências. 45 min revisão dirigida + 35 min questões + 10 min algoritmo de conduta.",
      backup:"13:30–15:00.",
      note:"Quando houver Núcleo, manter estudo diurno; não usar a noite."
    },
    {
      day:"Quinta",
      fixed:"Musculação 06:20–07:20 · IML 08:30 · Instituto Maués 19:00–21:00",
      study:"11:00–12:00",
      duration:"1h",
      subject:"Legislação + Português",
      work:"Semanas alternadas: 35 min lei seca + 25 min questões; ou 40 min Português (interpretação/sintaxe/regência/crase) + 20 min correção.",
      backup:"14:00–15:00, se livre.",
      note:"Dia fragmentado: usar bloco compacto; nada de estudo após 21:00."
    },
    {
      day:"Sexta",
      fixed:"Musculação 06:20–07:20 · CEMEC 08:00 · Ophir Loyola 14:00",
      study:"10:30–11:45",
      duration:"1h15",
      subject:"Psiquiatria aplicada + RLM/Ética em rodízio",
      work:"50 min Psiquiatria (infância, idosos, mulheres, sono, personalidade, emergências, suicídio/forense) + 25 min RLM ou Ética alternados por semana.",
      backup:"11:45–13:00, respeitando almoço e deslocamento para o Ophir.",
      note:"Fechar a semana útil revisando os erros mais frequentes."
    },
    {
      day:"Sábado",
      fixed:"Natação 17:00–18:00 · evitar compromissos profissionais à tarde/noite",
      study:"09:00–11:00",
      duration:"2h",
      subject:"Simulado / integração",
      work:"Semanas 1–3: 30–40 questões mistas cronometradas + correção. A cada 2 semanas: substituir os 40 min finais por uma discursiva. Em novembro: evoluir para simulados de 50 questões.",
      backup:"13:30–15:30 se o bloco da manhã for perdido.",
      note:"Bloco de maior valor para medir desempenho real, não para teoria passiva."
    },
    {
      day:"Domingo",
      fixed:"Dia livre; quando houver plantão Pedreira, início 19:00",
      study:"10:00–10:45",
      duration:"45 min",
      subject:"Revisão 1–7–21 + planejamento",
      work:"20 min flashcards/caderno de erros + 15 min lei seca ou fórmulas + 10 min planejar a semana seguinte. Sem conteúdo novo.",
      backup:"Se não houver plantão e estiver descansado: estender até 11:15 para recuperar algum bloco perdido.",
      note:"Com plantão noturno, não usar a tarde para compensar estudo; preservar descanso."
    }
  ],
  rotation: [
    ["Semana A","Psiquiatria: psicopatologia + humor · Clínica: cardio/pneumo · SUS: CF + Lei 8.080 · Legislação: Lei 5.810 · Português: interpretação/sintaxe · RLM: regra de três/probabilidade."],
    ["Semana B","Psiquiatria: psicóticos + substâncias + psicofármacos · Clínica: gastro/nefro · SUS: Decreto 7.508 + Lei 8.142 · Legislação: Lei 6.304 · Português: concordância/regência/crase · Ética/qualidade."],
    ["Semana C","Psiquiatria: ansiedade/somáticos/dissociação/personalidade · Clínica: endócrino/reumato · SUS: PNAB · Legislação: Lei 9.341 · Português: pontuação/coerência · RLM: conjuntos/equações."],
    ["Semana D","Psiquiatria: infância/idoso/mulher/sono/alimentares · Clínica: infecto + emergências · SUS: Portaria 2.048 + revisão · legislação: revisão geral · Português/RLM/Ética por erros."],
    ["Semana E","Psiquiatria: emergências/suicídio/forense/ECT · Clínica: emergências + Código de Ética Médica · SUS: revisão acumulada · simulado completo e discursiva."]
  ]
};

const SOURCE_NEEDS = [
  {subject:"Psiquiatria",need:"Enviar",priority:"Prioridade máxima",what:"PDF/apostila do seu curso preparatório; resumos próprios; material de psicofarmacologia; questões comentadas da Consulplan; referências clínicas que você já usa e quer que orientem as aulas.",why:"É o conteúdo mais específico e o site precisa de uma fonte didática definida para produzir aulas completas sem depender apenas de sínteses gerais."},
  {subject:"Clínica Geral",need:"Enviar",priority:"Prioridade máxima",what:"Apostila/PDF de Clínica Geral voltado a concurso ou revisão médica; banco de questões; resumos de urgências/emergências.",why:"O edital é muito amplo. Uma fonte-base permite decidir profundidade e evitar estudo enciclopédico."},
  {subject:"Português",need:"Enviar",priority:"Alta",what:"Apostila ou curso que você pretende usar, idealmente focado na Consulplan, mais questões comentadas.",why:"A gramática pode ser ensinada de muitas formas; usar seu curso reduz divergência de nomenclatura e nível."},
  {subject:"Raciocínio Lógico-Matemático",need:"Enviar",priority:"Alta",what:"Apostila/curso + listas de questões da banca.",why:"Precisamos alinhar fórmulas, métodos e nível de dificuldade ao material que você realmente estudará."},
  {subject:"Ética e Qualidade no Serviço Público",need:"Enviar se tiver",priority:"Média",what:"Apostila específica do curso ou questões da Consulplan.",why:"O edital é conceitual e curto; consigo construir a base sem material privado, mas a apostila ajuda a reproduzir o vocabulário da banca."},
  {subject:"SUS / Políticas de Saúde Pública",need:"Opcional",priority:"Média",what:"Não é obrigatório enviar. Se tiver apostila do curso, envie para complementar.",why:"CF, Lei 8.080, Lei 8.142, Decreto 7.508, PNAB e demais normas podem ser estudados diretamente em fontes oficiais públicas."},
  {subject:"Legislação estadual",need:"Opcional",priority:"Baixa",what:"Não precisa enviar as leis se não quiser. Apostilas comentadas são úteis, mas os textos oficiais bastam como fonte primária.",why:"Lei 5.810/1994, Lei 6.304/2000 e Lei 9.341/2021 são públicas e podem ser trabalhadas diretamente da norma vigente."},
  {subject:"Questões Consulplan",need:"Enviar",priority:"Prioridade máxima",what:"Qualquer PDF, caderno de prova, lista de questões comentadas ou exportação da plataforma que você usa, especialmente Medicina/Psiquiatria/SUS.",why:"Esse material é o melhor sinal para calibrar estilo, profundidade, pegadinhas e vocabulário da banca."},
  {subject:"Discursiva",need:"Enviar se tiver",priority:"Alta",what:"Modelos corrigidos, espelhos, propostas discursivas e orientações do curso/banca.",why:"Permite calibrar estrutura e critérios de correção para o formato mais próximo possível da prova."}
];
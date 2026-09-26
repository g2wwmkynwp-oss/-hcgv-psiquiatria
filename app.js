const STORAGE='hcgv-c224-psy-v1';
let state=JSON.parse(localStorage.getItem(STORAGE)||'{}');
if(!state.topics) state.topics={};
function save(){localStorage.setItem(STORAGE,JSON.stringify(state)); updateProgress();}
function key(cat,i){return cat+'::'+i}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
const exam=new Date('2026-12-13T08:00:00-03:00');
const diff=Math.ceil((exam-new Date())/86400000);document.getElementById('countdown').textContent=diff>0?diff:'prova realizada';
const w=document.getElementById('weights');w.innerHTML=Object.entries(WEIGHTS).map(([n,x])=>`<div class="weight-row"><b>${n}</b><div class="bar"><i style="width:${x.pct}%"></i></div><span>${x.pts.toFixed(1).replace('.',',')} pt</span></div>`).join('');
function renderCurriculum(filter=''){
 const root=document.getElementById('curriculum'); const f=filter.trim().toLowerCase();
 root.innerHTML='';
 Object.entries(SYLLABUS).forEach(([cat,topics])=>{
   const visible=topics.map((t,i)=>[t,i]).filter(([t])=>!f||t.toLowerCase().includes(f)||cat.toLowerCase().includes(f)); if(!visible.length)return;
   const done=topics.filter((_,i)=>state.topics[key(cat,i)]?.done).length;
   const d=document.createElement('details'); d.className='curriculum-category'; d.open=!!f;
   d.innerHTML=`<summary><span>${esc(cat)} <span class="small">${done}/${topics.length}</span></span><span style="width:140px"><span class="progress"><span style="width:${Math.round(100*done/topics.length)}%"></span></span></span></summary><div class="topics"></div>`;
   const wrap=d.querySelector('.topics');
   visible.forEach(([t,i])=>{const k=key(cat,i), v=state.topics[k]||{done:false,level:'novo'}; const row=document.createElement('div');row.className='topic';row.innerHTML=`<input type="checkbox" ${v.done?'checked':''} aria-label="Concluído"><span>${esc(t)}</span><select><option value="novo">Novo</option><option value="revisao">Revisão</option><option value="dominio">Domínio</option></select>`;row.querySelector('select').value=v.level||'novo';row.querySelector('input').onchange=e=>{state.topics[k]={...(state.topics[k]||{}),done:e.target.checked};save();renderCurriculum(document.getElementById('topicSearch').value)};row.querySelector('select').onchange=e=>{state.topics[k]={...(state.topics[k]||{}),level:e.target.value};save()};wrap.appendChild(row)});
   root.appendChild(d);
 })
 updateProgress();
}
function updateProgress(){let total=0,done=0;Object.entries(SYLLABUS).forEach(([c,ts])=>ts.forEach((_,i)=>{total++;if(state.topics[key(c,i)]?.done)done++;}));let p=total?Math.round(done*100/total):0;document.getElementById('globalProgress').style.width=p+'%';document.getElementById('globalProgressText').textContent=`${p}% · ${done}/${total} tópicos`;}
document.getElementById('topicSearch').oninput=e=>renderCurriculum(e.target.value);
function expandAll(open){document.querySelectorAll('#curriculum details').forEach(d=>d.open=open)}
function exportProgress(){const b=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='hcgv-c224-backup.json';a.click();URL.revokeObjectURL(a.href)}
document.getElementById('importFile').onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{state=JSON.parse(r.result);if(!state.topics)state.topics={};save();renderCurriculum();alert('Backup importado.')}catch(err){alert('Arquivo de backup inválido.')}};r.readAsText(file)};
renderCurriculum();
const psych=document.getElementById('psychAtlas'); PSYCH.forEach(x=>{psych.innerHTML+=`<div class="card atlas-card"><span class="tag">${x.priority}</span><h3>${esc(x.title)}</h3><p><b>Dominar:</b> ${esc(x.study)}</p><p><b>Armadilhas:</b> ${esc(x.traps)}</p><p class="focusline"><b>Recuperação ativa:</b> ${esc(x.recall)}</p></div>`});
const cg=document.getElementById('clinicalGrid');CLINICAL.forEach(x=>cg.innerHTML+=`<div class="card"><span class="tag">Clínica</span><h3>${esc(x.title)}</h3><p>${esc(x.topics)}</p><div class="focusline"><b>Foco de prova:</b> ${esc(x.focus)}</div></div>`);
const sg=document.getElementById('susGrid');SUS.forEach(x=>sg.innerHTML+=`<div class="card"><h3>${esc(x.title)}</h3><p>${esc(x.core)}</p><p class="focusline"><b>Como estudar:</b> ${esc(x.method)}</p></div>`);
const lg=document.getElementById('lawGrid');LAWS.forEach(x=>lg.innerHTML+=`<div class="card"><span class="tag">Lei seca</span><h3>${esc(x.title)}</h3><p><b>Foco:</b> ${esc(x.focus)}</p><p><b>Método:</b> ${esc(x.study)}</p><a class="btn ghost" href="${x.url}" target="_blank" rel="noopener">Abrir texto oficial</a></div>`);
const pg=document.getElementById('phaseGrid');PHASES.forEach(x=>pg.innerHTML+=`<div class="card plan-phase"><div class="date">${x.dates}</div><h3>${x.name}</h3><p><b>Meta:</b> ${x.goal}</p><p>${x.plan}</p></div>`);
document.getElementById('adminRows').innerHTML=ADMIN.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('');
document.getElementById('sources').innerHTML=SOURCES.map(s=>`<a href="${s.url}" target="_blank" rel="noopener"><span>${esc(s.label)}</span><em>${esc(s.type)}</em></a>`).join('');
const catPriority={'Psiquiatria':28,'Clínica Geral':22,'Políticas de Saúde Pública':25,'Língua Portuguesa':10,'Legislação':7,'Raciocínio Lógico-Matemático':5,'Ética e Qualidade':3};
function unfinished(cat){return SYLLABUS[cat].map((t,i)=>({t,i,k:key(cat,i),level:state.topics[key(cat,i)]?.level||'novo',done:!!state.topics[key(cat,i)]?.done})).filter(x=>!x.done||x.level!=='dominio')}
function pickTopic(cat){const u=unfinished(cat);if(!u.length)return SYLLABUS[cat][Math.floor(Math.random()*SYLLABUS[cat].length)];u.sort((a,b)=>({novo:0,revisao:1,dominio:2}[a.level]-{novo:0,revisao:1,dominio:2}[b.level]));return u[0].t}
function makeToday(){let mins=Math.max(30,Math.min(360,Number(document.getElementById('minutes').value)||120));let focus=document.getElementById('todayFocus').value;let cats;
 if(focus!=='auto') cats=[focus]; else cats=Object.keys(catPriority).sort((a,b)=>catPriority[b]-catPriority[a]);
 let blocks=Math.max(2,Math.min(5,Math.round(mins/35)));let base=Math.floor(mins/blocks);let chosen=[];
 if(focus!=='auto'){chosen=Array(blocks).fill(focus)} else {let pool=[];Object.entries(catPriority).forEach(([c,p])=>{for(let i=0;i<Math.ceil(p/5);i++)pool.push(c)});while(chosen.length<blocks){let c=pool[Math.floor(Math.random()*pool.length)]; if(chosen.length<3 && chosen.includes(c))continue;chosen.push(c)}}
 let lines=[`SESSÃO DE ${mins} MINUTOS · ${new Date().toLocaleDateString('pt-BR')}`,`Objetivo: sair com evidência de recuperação, não apenas de leitura.`,` `];
 chosen.forEach((c,idx)=>{let dur=idx===chosen.length-1?mins-base*(chosen.length-1):base;let q=Math.max(4,Math.round(dur/4));lines.push(`BLOCO ${idx+1} · ${c} · ${dur} min`,`Tema: ${pickTopic(c)}`,`• ~${Math.round(dur*.38)} min teoria/lei dirigida`,`• ~${Math.round(dur*.17)} min recordar sem consulta (5 perguntas ou mapa em branco)`,`• ~${Math.round(dur*.45)} min: ${q} questões + correção dos erros`,` `)});
 lines.push('FECHAMENTO · 3 min','Registre: 1 erro conceitual, 1 ponto a revisar amanhã e sua % de acerto.');document.getElementById('todayOutput').textContent=lines.join('\n')}
let quizCat='Psiquiatria',quizIndex=0,quizCorrect=0,quizTotal=0,currentList=[];
function renderCats(){let cats=[...new Set(QUIZ.map(q=>q.cat))];document.getElementById('quizCats').innerHTML='<h3>Área</h3>'+cats.map(c=>`<button class="${c===quizCat?'':'secondary'}" onclick="setQuizCat('${c.replace(/'/g,"\'")}')">${c}</button>`).join('');}
function setQuizCat(c){quizCat=c;quizIndex=0;currentList=QUIZ.filter(q=>q.cat===c);renderCats();showQuestion()}
function showQuestion(){if(!currentList.length)currentList=QUIZ.filter(q=>q.cat===quizCat);const q=currentList[quizIndex%currentList.length];document.getElementById('quizCatTag').textContent=q.cat;document.getElementById('quizScore').textContent=`${quizCorrect}/${quizTotal}`;document.getElementById('quizQuestion').textContent=q.q;document.getElementById('quizExplain').innerHTML='';document.getElementById('quizOptions').innerHTML=q.opts.map((o,i)=>`<button class="qopt" onclick="answerQuiz(this,${i})">${String.fromCharCode(65+i)}) ${esc(o)}</button>`).join('')}
function answerQuiz(btn,i){const q=currentList[quizIndex%currentList.length];document.querySelectorAll('.qopt').forEach((b,j)=>{b.disabled=true;if(j===q.a)b.classList.add('correct')});quizTotal++;if(i===q.a)quizCorrect++;else btn.classList.add('wrong');document.getElementById('quizScore').textContent=`${quizCorrect}/${quizTotal}`;document.getElementById('quizExplain').innerHTML=`<div class="explain"><b>${i===q.a?'Correta.':'Incorreta.'}</b> ${esc(q.ex)}</div>`}
function nextQuestion(){quizIndex=(quizIndex+1)%currentList.length;showQuestion()}function resetQuiz(){quizCorrect=0;quizTotal=0;showQuestion()}renderCats();setQuizCat('Psiquiatria');
let fc=-1;function newFlashcard(){fc=(fc+1+Math.floor(Math.random()*(FLASHCARDS.length-1)))%FLASHCARDS.length;document.getElementById('fcQ').textContent=FLASHCARDS[fc][0];document.getElementById('fcA').textContent=FLASHCARDS[fc][1];document.getElementById('flashcard').classList.remove('flipped');document.getElementById('fcIndex').textContent=`Cartão ${fc+1} de ${FLASHCARDS.length}`}newFlashcard();
const prompts=[
['Cuidado comunitário em saúde mental','Discuta como a atenção comunitária em saúde mental pode articular territorialidade, continuidade do cuidado e manejo de crises no SUS.'],
['Prevenção do suicídio','Analise o papel do médico na identificação de risco suicida, proteção imediata e articulação da rede de cuidados, evitando reducionismos baseados apenas em escalas.'],
['Delirium no hospital geral','Explique por que o reconhecimento precoce do delirium é relevante para segurança do paciente e descreva princípios gerais de abordagem clínica.'],
['Integração entre Psiquiatria e Clínica','Discuta a importância de reconhecer causas clínicas de alterações comportamentais e cognitivas em pacientes atendidos em hospital geral.'],
['Atenção integral no SUS','Relacione integralidade, regionalização e coordenação do cuidado à assistência de pessoas com transtornos mentais.'],
['Ética e autonomia','Discuta a relação entre autonomia do paciente, avaliação de capacidade decisória e dever de proteção em situações psiquiátricas complexas.'],
['Uso de substâncias','Analise desafios do cuidado a pessoas com transtornos por uso de substâncias, considerando estigma, comorbidades e continuidade assistencial.'],
['Segurança na psicofarmacologia','Discuta como avaliação clínica, monitorização e educação do paciente contribuem para uso seguro de psicofármacos em contexto hospitalar.']
];
function newPrompt(){let p=prompts[Math.floor(Math.random()*prompts.length)];document.getElementById('promptTitle').textContent=p[0];document.getElementById('promptText').textContent=p[1]}
const essay=document.getElementById('essay');essay.oninput=()=>{let txt=essay.value.trim();let words=txt?txt.split(/\s+/).length:0;document.getElementById('wordCount').textContent=words+' palavras';document.getElementById('lineEstimate').textContent='~'+Math.ceil(words/10)+' linhas digitais estimadas'};
let timerHandle=null,timerSec=2700;function startTimer(){clearInterval(timerHandle);timerSec=2700;timerHandle=setInterval(()=>{timerSec--;let m=Math.floor(timerSec/60),s=timerSec%60;document.getElementById('timer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;if(timerSec<=0){clearInterval(timerHandle);alert('Tempo encerrado.')}},1000)}
function scoreEssay(){let s=0;document.querySelectorAll('.rubric input').forEach(i=>{let v=Math.max(0,Math.min(Number(i.dataset.max),Number(i.value)||0));s+=v});document.getElementById('essayScore').textContent=s.toFixed(1).replace('.',',')+' / 5,0'}
const links=[...document.querySelectorAll('nav a')];const sections=[...document.querySelectorAll('main section[id]')];new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-30% 0px -60% 0px'}).observe?.(document.querySelector('#painel'));
const obs=new IntersectionObserver(es=>{es.filter(e=>e.isIntersecting).forEach(e=>links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))) },{rootMargin:'-25% 0px -65% 0px',threshold:0});sections.forEach(s=>obs.observe(s));
links.forEach(a=>a.onclick=()=>document.getElementById('sidebar').classList.remove('open'));
async function loadDaily(){
  const u=document.getElementById('dailyUpdates'), q=document.getElementById('dailyQuestions'), st=document.getElementById('syncStatus');
  try{
    const [ur,qr]=await Promise.all([fetch('data/updates.json?ts='+Date.now()),fetch('data/daily_questions.json?ts='+Date.now())]);
    const ud=await ur.json(), qd=await qr.json();
    st.textContent='Última sincronização: '+(ud.generated_at||qd.generated_at||'—')+' · Atualização automática diária quando publicado no GitHub.';
    u.innerHTML=(ud.items&&ud.items.length?ud.items:[{title:'Sem mudança oficial relevante',date:ud.generated_at||'',summary:'Nenhuma alteração oficial relevante detectada na última varredura.'}]).map(x=>`<div class="daily-item"><div class="daily-meta">${esc(x.date||'')}</div><h4>${esc(x.title||'Atualização')}</h4><div>${esc(x.summary||'')}</div>${x.url?`<a href="${x.url}" target="_blank" rel="noopener">Fonte oficial</a>`:''}</div>`).join('');
    q.innerHTML=(qd.questions||[]).map((x,i)=>`<details class="daily-q"><summary><b>${i+1}. ${esc(x.q)}</b></summary><ol type="A">${(x.opts||[]).map(o=>`<li>${esc(o)}</li>`).join('')}</ol><div class="answerbox"><b>Gabarito:</b> ${esc(x.answer)}<br><b>Comentário:</b> ${esc(x.explanation||'')}</div></details>`).join('')||'Nenhuma questão carregada.';
  }catch(e){u.textContent='Abra esta versão por um servidor/site publicado para receber as atualizações diárias.';q.textContent='As questões diárias aparecem automaticamente na versão online.';}
}
loadDaily();
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});


/* Plano semanal personalizado e mapa de fontes */
const sourceNeedsRows=document.getElementById('sourceNeedsRows');
if(sourceNeedsRows && typeof SOURCE_NEEDS!=='undefined'){
  sourceNeedsRows.innerHTML=SOURCE_NEEDS.map(x=>`<tr><td><b>${esc(x.subject)}</b></td><td>${esc(x.need)}</td><td><span class="tag ${x.priority.includes('máxima')?'red':x.priority==='Alta'?'gold':''}">${esc(x.priority)}</span></td><td>${esc(x.what)}</td><td>${esc(x.why)}</td></tr>`).join('');
}
if(typeof WEEKLY_PLAN!=='undefined'){
  const wt=document.getElementById('weeklyTarget'), wp=document.getElementById('weeklyPrinciple');
  if(wt) wt.textContent=WEEKLY_PLAN.target;
  if(wp) wp.textContent=WEEKLY_PLAN.principle;
  const rows=document.getElementById('weeklyRows');
  if(rows) rows.innerHTML=WEEKLY_PLAN.days.map(x=>`<tr><td><b>${esc(x.day)}</b><div class="small">${esc(x.duration)}</div></td><td>${esc(x.fixed)}</td><td><b>${esc(x.study)}</b><div class="small">${esc(x.note)}</div></td><td><b>${esc(x.subject)}</b></td><td>${esc(x.work)}</td><td>${esc(x.backup)}</td></tr>`).join('');
  const rot=document.getElementById('rotationGrid');
  if(rot) rot.innerHTML=WEEKLY_PLAN.rotation.map(x=>`<div class="card"><span class="tag">${esc(x[0])}</span><p style="margin-bottom:0">${esc(x[1])}</p></div>`).join('');
}

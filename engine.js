/* Pure planning rules. Dates are civil dates in America/Belem. */
const Engine=(()=>{
 const cats=Object.keys(SYLLABUS), weights=[28,22,25,7,10,5,3];
 const defaults=[45,75,90,90,60,75,120];
 const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Belem',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const add=(d,n)=>{let x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
 const weekday=d=>new Date(d+'T12:00:00Z').getUTCDay();
 const key=(c,i)=>c+'::'+i;
 const topics=()=>Object.entries(SYLLABUS).flatMap(([cat,ts])=>ts.map((title,i)=>({id:key(cat,i),cat,title,index:i})));
 function normalize(s){s=s&&typeof s==='object'&&!Array.isArray(s)?s:{};s.topics=s.topics&&typeof s.topics==='object'&&!Array.isArray(s.topics)?s.topics:{};for(const p of ['journal','attempts','essays'])if(!Array.isArray(s[p]))s[p]=[];for(const p of ['cards','notes','lessons','days'])if(!s[p]||typeof s[p]!=='object'||Array.isArray(s[p]))s[p]={};s.settings=s.settings||{};s.schema=2;return s}
 const dayTotal=(s,d)=>s.journal.filter(x=>x.date===d&&!x.deleted).reduce((a,x)=>a+(Number(x.minutes)||0),0);
 const budget=(s,d)=>Math.max(0,Math.min(240,Number(s.days[d]?.budget??s.settings.weekly?.[weekday(d)]??defaults[weekday(d)])));
 function next(s,date=today(),exclude=[]){
  let all=topics().filter(t=>!exclude.includes(t.id));
  const recent=s.journal.filter(x=>!x.deleted&&x.date>=add(date,-7)&&x.date<=date);
  const mins=Object.fromEntries(cats.map(c=>[c,recent.filter(x=>x.cat===c).reduce((a,x)=>a+x.minutes,0)]));
  const total=Object.values(mins).reduce((a,b)=>a+b,0);
  const rows=all.map(t=>{
   const p=s.topics[t.id]||{},attempts=s.attempts.filter(a=>a.topic===t.id),last=attempts.slice(-5),errors=last.filter(a=>!a.correct).length;
   const due=p.due&&p.due<=date;let stage=due?'review':p.theory&&!p.practice?'questions':!p.done&&!p.theory?'theory':null;
   if(!stage)return null;
   const def=weights[cats.indexOf(t.cat)]-100*(mins[t.cat]||0)/Math.max(total,1);
   const age=due?Math.min(30,Math.floor((new Date(date)-new Date(p.due))/86400000)):0;
   const rank=(due?200+age:p.theory?120:0)+def+errors*8+(p.externalAccuracy<.7?12:0)-t.index*.05;
   return {...t,stage,rank,minutes:stage==='theory'?25:stage==='questions'?15:10,reason:due?'Revisão prevista para '+p.due:errors?'Retomar erros recentes':p.theory?'Fixar a leitura ou aula registrada':'Avançar no programa e equilibrar as disciplinas'};
  }).filter(Boolean).filter(t=>weekday(date)!==0||t.stage!=='theory');
  rows.sort((a,b)=>b.rank-a.rank||a.id.localeCompare(b.id));
  let chosen=rows[0];
  if(!chosen&&weekday(date)===0){const done=all.find(t=>(s.topics[t.id]?.done||s.topics[t.id]?.theory)&&s.topics[t.id]?.last!==date);if(done)chosen={...done,stage:'review',minutes:10,reason:'Domingo reservado à recuperação do que já foi estudado'}}
  return chosen||null;
 }
 function plan(s,date=today()){
  let remaining=Math.max(0,budget(s,date)-dayTotal(s,date)),items=[],used=[];
  const dueCards=Object.entries(s.cards).filter(([id,c])=>c.due<=date);
  if(dueCards.length&&remaining){let minutes=Math.min(10,remaining);items.push({id:'cards',title:'Revisar cartões vencidos',stage:'cards',minutes,reason:dueCards.length+' cartões aguardando revisão'});remaining-=minutes}
  const essayDue=weekday(date)===6&&!s.journal.some(x=>x.date>=add(date,-13)&&x.kind==='essay'&&!x.deleted);
  if(essayDue&&remaining>=25){items.push({id:'essay',title:'Escrever uma discursiva',stage:'essay',minutes:25,reason:'Treino quinzenal de argumentação'});remaining-=25}
  while(remaining>0&&items.length<10){let t=next(s,date,used);if(!t)break;t={...t,minutes:Math.min(t.minutes,remaining)};items.push(t);used.push(t.id);remaining-=t.minutes}
  return items;
 }
 function complete(s,t,kind,minutes,date=today(),extra={}){
  if(!Number.isFinite(minutes)||minutes<1||minutes>240)throw new Error('Informe de 1 a 240 minutos.');
  const topic=topics().find(x=>x.id===t);const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  s.journal.push({id,date,topic:t,cat:topic?.cat||extra.cat||'Revisão',kind,minutes,...extra});
  if(topic&&extra.completed!==false){const p=s.topics[t]||{};if(kind==='theory'||kind==='lesson')p.theory=true;if(kind==='questions')p.practice=true;
   if(kind==='review'){p.reviewCount=(p.reviewCount||0)+1;p.due=add(date,[1,7,21,45][Math.min(p.reviewCount,3)]);}
   else p.due=add(date,1);
   p.last=date;p.done=!!(p.done||(p.theory&&p.practice));p.level=p.done?'revisao':p.level||'novo';s.topics[t]=p;
  }return id;
 }
 return {today,add,weekday,key,topics,normalize,dayTotal,budget,next,plan,complete,defaults,cats};
})();
if(typeof module!=='undefined')module.exports=Engine;

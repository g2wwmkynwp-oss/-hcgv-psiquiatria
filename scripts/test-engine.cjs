const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({Intl,Date,console});
for(const file of ['data/syllabus.js','data/catalog.js','data/questions.js','engine.js']) vm.runInContext(fs.readFileSync(file,'utf8'),c);
vm.runInContext(`
 const s=Engine.normalize({topics:{'Psiquiatria::0':{done:true,level:'revisao'}}});
 globalThis.results={topics:Engine.topics().length,questions:QUESTIONS.length};
 globalThis.checks=[];
 function check(x){checks.push(Boolean(x))}
 check(s.topics['Psiquiatria::0'].done);
 const d='2026-09-28',id='Psiquiatria::4';
 Engine.complete(s,id,'lesson',25,d,{completed:false});check(!s.topics[id]);
 Engine.complete(s,id,'lesson',25,d);check(s.topics[id].theory&&s.topics[id].due==='2026-09-29');
 check(Engine.dayTotal(s,d)===50);
 check(Engine.plan(s,d).reduce((a,x)=>a+x.minutes,0)<=Engine.budget(s,d)-50);
 check(Engine.next(s,'2026-09-29').id===id);
 s.days[d]={budget:0};check(Engine.plan(s,d).length===0);
 Engine.complete(s,'Psiquiatria::0','review',10,d);check(s.topics['Psiquiatria::0'].done);
 check(QUESTIONS.every(q=>q.a>=0&&q.a<q.opts.length&&q.refs.every(r=>REFERENCES[r])&&Engine.topics().some(t=>t.id===q.topic)));
 check(Engine.topics().every(t=>lessonFor(t.cat,t.index)?.refs.every(r=>REFERENCES[r])));
 check(new Set(QUESTIONS.map(q=>q.id)).size===QUESTIONS.length);
`,c);
assert(c.checks.every(Boolean),JSON.stringify(c.checks));
console.log('PASS',c.checks.length,'checks',c.results);

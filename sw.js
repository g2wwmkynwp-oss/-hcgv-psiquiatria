const CACHE='hcgv-psy-v4';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest',
'./data/syllabus.js','./data/weights.js','./data/psych.js','./data/clinical.js','./data/sus.js','./data/laws.js','./data/sources.js','./data/flashcards.js','./data/quiz.js','./data/phases.js','./data/admin.js','./data/weekly.js',
'./data/updates.json','./data/daily_questions.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('/data/updates.json')||e.request.url.includes('/data/daily_questions.json')){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
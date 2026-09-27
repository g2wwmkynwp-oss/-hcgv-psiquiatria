const CACHE='hcgv-psy-v5-adaptive';
const ASSETS=['./','./index.html','./styles.css','./app-v2.js','./engine.js','./manifest.webmanifest','./data/catalog.js','./data/questions.js',
'./data/syllabus.js','./data/weights.js','./data/psych.js','./data/clinical.js','./data/sus.js','./data/laws.js','./data/sources.js','./data/flashcards.js','./data/quiz.js','./data/phases.js','./data/admin.js','./data/weekly.js',
'./data/updates.json','./data/daily_questions.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('hcgv-psy-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('/data/updates.json')||e.request.url.includes('/data/daily_questions.json')){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));return;
  }
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r}).catch(()=>caches.match(e.request)));
});

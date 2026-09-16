const CACHE='overunder-v47';
const CORE=['./','./index.html','./style.css','./premium-v3.css','./data.js','./script.js','./v33.js','./manifest.webmanifest','./assets/logo.png','./assets/logo-main-transparent.png.png','./assets/logo-header-transparent.png.png','./assets/arena-bg.png.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));});

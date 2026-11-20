/// <reference lib="deno.ns" />
const CACHE='cyber-manager-shell-v1';const SHELL=['/','/manifest.webmanifest','/icon.svg'];
self.addEventListener('install',(event:any)=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))));
self.addEventListener('activate',(event:any)=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',(event:any)=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==location.origin||url.pathname.startsWith('/rest/')||url.pathname.startsWith('/auth/')||url.pathname.startsWith('/functions/'))return;event.respondWith(fetch(req).then((res:Response)=>{if(res.ok&&url.origin===location.origin)caches.open(CACHE).then(c=>c.put(req,res.clone()));return res}).catch(()=>caches.match(req).then((cached:Response|undefined)=>cached||caches.match('/'))))});

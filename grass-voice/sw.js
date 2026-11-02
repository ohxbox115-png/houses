/* Grass Voice: включает изоляцию страницы (COOP/COEP), чтобы распознавание работало в несколько потоков даже на хостинге без своих заголовков (GitHub Pages). */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.cache==="only-if-cached"&&r.mode!=="same-origin")return;
  let url;try{url=new URL(r.url)}catch(_){return}
  if(url.origin!==self.location.origin)return;
  e.respondWith(fetch(r).then(res=>{
    if(!res||res.status===0||res.type==="opaque")return res;
    const h=new Headers(res.headers);
    h.set("Cross-Origin-Embedder-Policy","require-corp");
    h.set("Cross-Origin-Opener-Policy","same-origin");
    h.set("Cross-Origin-Resource-Policy","same-origin");
    return new Response(res.body,{status:res.status,statusText:res.statusText,headers:h});
  }).catch(()=>fetch(r)));
});

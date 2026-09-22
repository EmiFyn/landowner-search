/* Landowner Search's service worker.

   The app has to open at the bottom of a lane with no signal, so its own files
   are taken on install and served from the cache from then on — it never waits
   on the network to start.

   The register itself is NOT cached here. It comes from another site (the
   Acorn repository), is fetched with cache:"no-store", and is kept by the page
   in IndexedDB, still encrypted. This worker only ever answers for the app's
   own files; everything else goes straight to the network untouched.

   VERSION is stamped by build.py. A new version installs beside the old one and
   waits: the page offers "Update now" rather than reloading under somebody. */
var VERSION = "1.0-bcb79ebb";
var CACHE = "landowner-search-" + VERSION;
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./leaf.svg",
             "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png", "./favicon.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){
      return (k.indexOf("landowner-search-")===0 && k!==CACHE)? caches.delete(k) : null;
    }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method!=="GET") return;
  if(new URL(req.url).origin !== self.location.origin) return;   // the register, and anything else: not ours
  if(req.mode==="navigate"){
    e.respondWith(caches.match("./index.html").then(function(hit){ return hit || fetch(req); }));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch:true}).then(function(hit){
    return hit || fetch(req).catch(function(){ return new Response("", {status:503, statusText:"offline"}); });
  }));
});

self.addEventListener("message", function(e){ if(e.data==="skipWaiting") self.skipWaiting(); });

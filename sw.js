/* Acorn's service worker.

   The whole point of this app is that it works in a van with no signal, so the
   rule here is simple and strict: once installed, the app NEVER waits on the
   network to start. Every file it needs is taken on install and served from the
   cache from then on; the network is only ever consulted in the background, to
   find out whether a newer version exists.

   That is cache-first rather than network-first, and it is deliberate. A crew
   opening the app at the bottom of a lane with one bar must not sit looking at a
   spinner while a fetch times out.

   VERSION is bumped by the build. Changing it is what makes a new release
   install: the old cache is thrown away and the new files are taken. */
var VERSION = "0.82-ab4d86cd";
var CACHE   = "acorn-" + VERSION;

/* Everything the app is. index.html is the big one (8 MB) because it carries
   the PDF libraries and the whole network lookup inside it — a crew that
   installed on the yard wifi must have those with them, not discover they are
   missing at the roadside. */
var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./favicon.png"
];


self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      /* addAll fails the whole install if any one file 404s, which is what we
         want for the shell — a half-installed app is worse than none. */
      return c.addAll(SHELL);
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;

  /* A navigation always gets the app, whatever the URL and whatever the
     network is doing — this is what makes it open instantly offline. */
  if(req.mode === "navigate"){
    e.respondWith(
      caches.match("./index.html").then(function(hit){
        return hit || fetch(req);
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function(hit){
      return hit || fetch(req).catch(function(){
        /* nothing cached and no network: let the app's own offline handling
           deal with it rather than throwing a network error at the user */
        return new Response("", {status: 503, statusText: "offline"});
      });
    })
  );
});

/* The page asks for this after it has loaded, so a crew who opened the app on
   wifi picks up a new release without being interrupted mid-form. */
self.addEventListener("message", function(e){
  if(e.data === "skipWaiting") self.skipWaiting();
});

/* Landowner Search service worker.

   The app must open in a van with no signal, so once installed it never waits
   on the network to start: the app itself is served from the cache, and only
   the data files are fetched live.

   VERSION is set by build.py. Changing it is what installs a new release: the
   old cache is thrown away and the new files are taken. */
var VERSION = "5dd1ce75";
var CACHE = "landowners-" + VERSION;

var SHELL = ["./", "./index.html", "./manifest.webmanifest",
             "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png", "./favicon.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(SHELL);
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;                 /* the log is a POST: leave it alone */
  var url = new URL(req.url);
  /* the data and the user list are always live - the app keeps its own copy */
  if (/(landowners\.enc|users\.json)/.test(url.pathname)) return;

  if (req.mode === "navigate") {
    e.respondWith(caches.match("./index.html").then(function (hit) { return hit || fetch(req); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    return hit || fetch(req).catch(function () {
      return new Response("", { status: 503, statusText: "offline" });
    });
  }));
});

self.addEventListener("message", function (e) { if (e.data === "skipWaiting") self.skipWaiting(); });

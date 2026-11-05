/* Service worker del envoltorio del Portal de Gestión Interna.
   Solo guarda en el celular los archivos de ESTA carpeta (la página del envoltorio, el manifiesto y los íconos),
   para que la app abra rápido y pueda mostrar el aviso de «sin conexión».
   El portal y las herramientas (script.google.com) NUNCA se guardan: siempre se cargan en línea.
   Cuando cambies algo de esta carpeta, sube VERSION para que los celulares descarten la copia anterior. */
var VERSION = 'pgi-envoltorio-2026-11-05h';
var ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './iconos/icono-192.png',
  './iconos/icono-512.png',
  './iconos/icono-maskable-512.png',
  './iconos/apple-touch-icon.png',
  './iconos/favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) { return c.addAll(ARCHIVOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (claves) {
        return Promise.all(claves.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

/* Primero la red (así siempre se ve la última versión); si no hay internet, la copia guardada. */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(function (resp) {
        if (resp && resp.ok && resp.type === 'basic') {
          var copia = resp.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copia); });
        }
        return resp;
      })
      .catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (r) {
          return r || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error());
        });
      })
  );
});

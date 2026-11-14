/* Service worker del envoltorio del Portal de Gestión Interna.
   Solo guarda en el celular los archivos de ESTA carpeta (la página del envoltorio, el manifiesto y los íconos).
   El portal y las herramientas (script.google.com) NUNCA se guardan: siempre se cargan en línea.

   Desde noviembre 9 de 2026 la app abre con la copia guardada (al instante, sin esperar a GitHub) y, por
   detrás, descarga la versión nueva para la próxima vez. Antes esperaba siempre a GitHub y, con mala señal,
   la app se quedaba en la pantalla de inicio antes de empezar siquiera a cargar el portal.
   Por eso un cambio en esta carpeta se ve la SEGUNDA vez que se abre la app después de subirlo.
   Cuando cambies algo de esta carpeta, sube VERSION para que los celulares descarten la copia anterior. */
var VERSION = 'pgi-envoltorio-2026-11-13a';
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
      .then(function (c) {
        /* cache: 'reload' = pedirle los archivos a GitHub, no a la copia del navegador. */
        return c.addAll(ARCHIVOS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
      })
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

/* Primero la copia guardada (la app abre al instante); por detrás se trae la versión nueva de la red y se
   guarda para la próxima vez. Si no hay copia, se espera a la red. La página de la app se guarda una sola
   vez, sin importar lo que traiga la dirección (?abrir=…, ?diag=1). */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  var esPagina = req.mode === 'navigate';
  var clave = esPagina ? new Request('./index.html') : req;
  var deLaRed = fetch(esPagina ? new Request('./index.html', { cache: 'no-cache' }) : req)
    .then(function (resp) {
      if (resp && resp.ok && resp.type === 'basic' && !resp.redirected) {
        var copia = resp.clone();
        return caches.open(VERSION).then(function (c) { return c.put(clave, copia); }).then(function () { return resp; });
      }
      return resp;
    });

  e.respondWith(
    caches.match(clave, { ignoreSearch: true }).then(function (guardada) {
      if (guardada) {
        e.waitUntil(deLaRed.catch(function () { }));
        return guardada;
      }
      return deLaRed.catch(function () { return Response.error(); });
    })
  );
});

/* Service worker del envoltorio del Portal de Gestión Interna.
   Solo guarda en el equipo los archivos de ESTA carpeta (la página de la app, el manifiesto y los íconos).
   El portal y las herramientas (script.google.com) NUNCA se guardan: siempre se cargan en línea.

   - La app abre con la copia guardada de index.html (al instante, sin esperar a GitHub) y, por detrás,
     pregunta a GitHub si hay una versión nueva para la próxima vez. Por eso un cambio en esta carpeta se
     ve la SEGUNDA vez que se abre la app después de subirlo.
   - Íconos y manifiesto: se sirven de la copia guardada y NO se vuelven a pedir a GitHub cada vez que se
     abre la app (antes se pedían todos en cada apertura). Se renuevan al subir VERSION.
   - Al instalarse guarda solo lo necesario para abrir (unos 75 KB); los íconos grandes los guarda la
     primera vez que el equipo los pide. Antes bajaba casi 1 MB de íconos justo mientras el portal cargaba,
     y si uno solo fallaba con mala señal, la instalación se perdía.
   - Si la app se abre sin internet y todavía no tenía la página guardada, muestra una pantalla propia de
     «Sin conexión» con «Reintentar», en vez del error del navegador.
   Cuando cambies algo de esta carpeta, sube VERSION para que los equipos descarten la copia anterior. */
var VERSION = 'pgi-envoltorio-2026-11-17a';

/* Lo que se guarda al instalar: lo mínimo para que la app abra sin GitHub. */
var BASICOS = [
  './index.html',
  './manifest.webmanifest',
  './iconos/icono-carga.png',
  './iconos/favicon-32.png'
];
/* Lo único que este service worker guarda (además de lo anterior), y solo cuando el equipo lo pide. */
var ESTATICOS = [
  './iconos/icono-192.png',
  './iconos/icono-512.png',
  './iconos/icono-maskable-512.png',
  './iconos/apple-touch-icon.png'
];

var BASE = new URL('./', self.location).pathname;
var RUTAS_ESTATICAS = BASICOS.concat(ESTATICOS).map(function (u) { return new URL(u, self.location).pathname; });

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) {
        /* cache: 'reload' = pedirle los archivos a GitHub, no a la copia del navegador. Uno por uno: si un
           ícono falla, los demás quedan guardados igual. Solo index.html es indispensable. */
        return Promise.all(BASICOS.map(function (u) {
          var req = new Request(u, { cache: 'reload' });
          var p = fetch(req).then(function (r) {
            if (!r || !r.ok) throw new Error('HTTP ' + (r && r.status));
            return c.put(u, r);
          });
          return u === './index.html' ? p : p.catch(function () { });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (claves) {
        return Promise.all(claves.filter(function (k) { return k !== VERSION && k.indexOf('pgi-envoltorio-') === 0; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

function guardarEnCopia(clave, resp) {
  if (!resp || !resp.ok || resp.type !== 'basic' || resp.redirected) return Promise.resolve();
  var copia = resp.clone();
  return caches.open(VERSION).then(function (c) { return c.put(clave, copia); }).catch(function () { });
}

function buscarEnCopia(clave) {
  /* Si el almacenamiento del equipo falla (lleno o borrado), se sigue como si no hubiera copia. */
  return caches.match(clave, { ignoreSearch: true }).catch(function () { return undefined; });
}

function paginaSinConexion() {
  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#39a900">' +
    '<title>Sin conexión · Portal de Gestión Interna</title><style>' +
    'html,body{margin:0;height:100%;background:#f8fafc;font-family:Segoe UI,Tahoma,Arial,sans-serif;color:#2c3e50}' +
    'body{display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;text-align:center}' +
    '.c{max-width:420px;background:#fff;border-radius:16px;border-left:8px solid #39a900;box-shadow:0 15px 35px rgba(0,0,0,.1);padding:28px 24px}' +
    'h1{font-size:1.1rem;margin:0 0 8px}p{color:#6c757d;font-size:.92rem;line-height:1.5;margin:0 0 18px}' +
    'button{min-height:44px;padding:10px 22px;border-radius:10px;border:2px solid #39a900;background:#39a900;color:#fff;font:inherit;font-weight:700;cursor:pointer}' +
    '</style></head><body><div class="c" role="alert"><h1>Sin conexión a internet</h1>' +
    '<p>El Portal de Gestión Interna necesita internet. Revisa tu conexión; se abrirá solo cuando vuelva.</p>' +
    '<button type="button" onclick="location.reload()">Reintentar</button></div>' +
    '<script>addEventListener("online",function(){setTimeout(function(){location.reload()},400+Math.random()*2600)})</script>' +
    '</body></html>';
  return new Response(html, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* La página de la app (la carpeta o index.html, con o sin ?abrir=…, ?diag=1). Otras páginas de esta
     carpeta (por ejemplo privacidad.html) se piden a la red tal cual. */
  if (req.mode === 'navigate') {
    if (url.pathname !== BASE && url.pathname !== BASE + 'index.html') return;
    var deLaRed = fetch(new Request('./index.html', { cache: 'no-cache' }))
      .then(function (resp) { return guardarEnCopia('./index.html', resp).then(function () { return resp; }); });
    e.respondWith(
      buscarEnCopia('./index.html').then(function (guardada) {
        if (guardada) {
          e.waitUntil(deLaRed.catch(function () { }));
          return guardada;
        }
        return deLaRed.then(function (r) { return (r && r.ok) ? r : (r || paginaSinConexion()); })
          .catch(function () { return paginaSinConexion(); });
      })
    );
    return;
  }

  /* Manifiesto e íconos: primero la copia; si no está, la red (y se guarda). Lo demás (LEEME, robots,
     vista-previa.jpg…) no pasa por aquí. */
  if (RUTAS_ESTATICAS.indexOf(url.pathname) === -1) return;
  var clave = '.' + url.pathname.slice(BASE.length - 1);
  e.respondWith(
    buscarEnCopia(clave).then(function (guardada) {
      if (guardada) return guardada;
      return fetch(req).then(function (resp) {
        e.waitUntil(guardarEnCopia(clave, resp));
        return resp;
      });
    })
  );
});

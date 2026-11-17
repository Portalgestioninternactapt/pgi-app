# App instalable del Portal de Gestión Interna

Esta carpeta se publica en **GitHub Pages**. No es un proyecto de Apps Script: solo muestra el portal a pantalla completa y permite instalarlo como app en Android, iPhone y computador.

| Archivo | Para qué |
|---|---|
| `index.html` | La app: muestra el portal y ayuda a instalarla. **Arriba está `URL_PORTAL`** (la URL /exec del portal). |
| `manifest.webmanifest` | Nombre, ícono y color de la app instalada. |
| `sw.js` | Guarda solo estos archivos para que la app abra rápido. El portal nunca se guarda. |
| `privacidad.html` | Política de privacidad pública (16 de noviembre de 2026). Google la exige para poner «En producción» la pantalla de consentimiento del proyecto de Google Cloud del portal (INSTRUCCIONES.md 3.1). Su dirección: `https://portalgestioninternactapt.github.io/pgi-app/privacidad.html`. |
| `iconos/` | Íconos de la app, `icono-carga.png` (copia liviana del ícono, solo para la pantalla de carga; desde la versión `2026-11-17a`) y `vista-previa.jpg` (1200×630), la imagen que sale al compartir el enlace por WhatsApp o correo. Puedes reemplazarlos por otros con el mismo nombre y tamaño. |
| `robots.txt` | Deja pasar a WhatsApp, Facebook, Teams y otros que arman la vista previa, y pide a los buscadores no indexar (solo sirve si el repositorio es `USUARIO.github.io`). La página trae además `noindex`. |

Los pasos completos para publicarla están en **INSTRUCCIONES.md, sección 13**.

**Vista previa al compartir:** la definen las etiquetas `og:` del `<head>` de `index.html`. Llevan la dirección completa de la app (`https://portalgestioninternactapt.github.io/pgi-app/`): si cambias el usuario o el nombre del repositorio, cámbiala ahí también.

**Aviso «Está tardando más de lo normal» (versión `2026-11-13a`):** sale solo si la página no ha empezado a mostrarse después de 25 segundos **con la app a la vista** (`SEG_AVISO_LENTO`, arriba en `index.html`). El tiempo en segundo plano o con la pantalla apagada no cuenta. La página se muestra apenas avisa que armó su contenido, sin esperar a que terminen de bajar todas las imágenes, y el aviso se quita solo cuando llega. La ✕ del aviso es «Seguir esperando». Detalle en **INSTRUCCIONES.md, sección 13.4.2**.

**Cargas lentas para el Monitor del portal (versión `2026-11-15a`):** la app mide cuánto tarda cada página en verse, contando solo el tiempo con la app a la vista. Si tarda **8 segundos o más** (`SEG_CARGA_LENTA`), si sale el aviso «Está tardando» o si la persona toca «Volver…» porque se cansó de esperar, guarda la medida en el celular (`pgi_medidas`, máximo 20, se descartan a las 6 horas) y se la entrega al portal, que la muestra en el panel → pestaña **Monitor**. Se borra del celular cuando el portal confirma que la guardó. Las cargas normales no se envían. Detalle en **INSTRUCCIONES.md, sección 3.1**.

**Barra de abajo en Android (versión `2026-11-16b`):** en la app instalada, Chrome le pinta a la barra de navegación del celular (la de los botones o la rayita de gestos, abajo) el color `theme_color` de `manifest.webmanifest`. Por eso salía verde. Ahora `theme_color` es `#f8fafc`, el mismo fondo de la app, y la barra de abajo se ve clara. La barra de arriba (la de la hora y la batería) sigue verde porque la pone `<meta name="theme-color" content="#39a900">` de `index.html`. Si algún día se quiere la de abajo verde otra vez, vuelve a poner `"theme_color": "#39a900"`. En las apps ya instaladas el cambio llega solo cuando Chrome revisa el manifiesto (al abrir la app, como máximo una vez al día; a veces tarda unos días). Si se necesita ya: desinstalar la app y volver a instalarla. En iPhone no hay barra de color abajo.

**Optimización de carga y estabilidad (versión `2026-11-17a`, `index.html`, `sw.js`, `manifest.webmanifest` e `iconos/`):**
- **Página de error de Google:** si la página que se abre no saluda a la app en 5 s (`SEG_REVISAR_FALLA`), lo que se ve es un error de Google (por ejemplo, demasiadas ejecuciones al mismo tiempo), la página «sin conexión» del navegador o un inicio de sesión de Google. Antes la app se quedaba ahí sin salida. Ahora sale abajo «El portal no terminó de abrir… · Reintentar ahora» (en una herramienta: «Volver al portal»). El portal se reintenta solo tras una espera al azar de 3 a 8 s, como máximo 2 veces cada 5 minutos.
- **Varios usuarios a la vez:** los reintentos solos (error de Google o cuando vuelve el wifi) esperan un tiempo al azar, para que no le lleguen todos a Google en el mismo segundo.
- **Internet lento:** la pantalla de carga usa `icono-carga.png` (23 KB en vez de 86 KB). El service worker se registra cuando el portal ya se ve, guarda al instalarse solo unos 75 KB (antes casi 1 MB de íconos mientras el portal cargaba) y ya no vuelve a pedir los íconos a GitHub cada vez que se abre la app. Se abre por adelantado la conexión con el sitio de Bootstrap que usan todas las páginas.
- **Sin internet y sin copia guardada:** pantalla propia «Sin conexión a internet» con «Reintentar», que se recarga sola cuando vuelve la conexión.
- **Una sola ventana:** en Chrome y Edge, abrir la app instalada cuando ya está abierta trae al frente la ventana que ya estaba (`launch_handler` del manifiesto), con su sesión. Un enlace `…/?abrir=herramienta` se le pasa al portal.
- **Compatibilidad:** se quitaron dos cosas que no funcionaban en navegadores de hace 3–4 años (`inset` y `replaceChildren`) y la pantalla de carga ya no se oscurece con el «modo oscuro forzado» de Chrome o Samsung Internet.
- Los íconos del manifiesto (`icono-192`, `icono-512`, `icono-maskable-512`) no cambiaron, para que Android no avise «el ícono de la app cambió». `apple-touch-icon.png` quedó más liviano (19 KB).

**Cuándo hay que volver a subir algo aquí:** solo si cambia la URL del portal, la dirección de la app, el nombre, el ícono, la imagen de vista previa o el color, o cuando una versión nueva de la app lo pida (como la `2026-11-17a`: sube `index.html`, `sw.js`, `manifest.webmanifest`, `LEEME.md`, `iconos/icono-carga.png` e `iconos/apple-touch-icon.png`). Los cambios del portal y de las herramientas se publican en Apps Script como siempre.

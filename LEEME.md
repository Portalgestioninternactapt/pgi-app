# App instalable del Portal de Gestión Interna

Esta carpeta se publica en **GitHub Pages**. No es un proyecto de Apps Script: solo muestra el portal a pantalla completa y permite instalarlo como app en Android, iPhone y computador.

| Archivo | Para qué |
|---|---|
| `index.html` | La app: muestra el portal y ayuda a instalarla. **Arriba está `URL_PORTAL`** (la URL /exec del portal). |
| `manifest.webmanifest` | Nombre, ícono y color de la app instalada. |
| `sw.js` | Guarda solo estos archivos para que la app abra rápido. El portal nunca se guarda. |
| `iconos/` | Íconos de la app y `vista-previa.jpg` (1200×630), la imagen que sale al compartir el enlace por WhatsApp o correo. Puedes reemplazarlos por otros con el mismo nombre y tamaño. |
| `robots.txt` | Deja pasar a WhatsApp, Facebook, Teams y otros que arman la vista previa, y pide a los buscadores no indexar (solo sirve si el repositorio es `USUARIO.github.io`). La página trae además `noindex`. |

Los pasos completos para publicarla están en **INSTRUCCIONES.md, sección 13**.

**Vista previa al compartir:** la definen las etiquetas `og:` del `<head>` de `index.html`. Llevan la dirección completa de la app (`https://portalgestioninternactapt.github.io/pgi-app/`): si cambias el usuario o el nombre del repositorio, cámbiala ahí también.

**Aviso «Está tardando más de lo normal» (versión `2026-11-13a`):** sale solo si la página no ha empezado a mostrarse después de 25 segundos **con la app a la vista** (`SEG_AVISO_LENTO`, arriba en `index.html`). El tiempo en segundo plano o con la pantalla apagada no cuenta. La página se muestra apenas avisa que armó su contenido, sin esperar a que terminen de bajar todas las imágenes, y el aviso se quita solo cuando llega. La ✕ del aviso es «Seguir esperando». Detalle en **INSTRUCCIONES.md, sección 13.4.2**.

**Cargas lentas para el Monitor del portal (versión `2026-11-15a`):** la app mide cuánto tarda cada página en verse, contando solo el tiempo con la app a la vista. Si tarda **8 segundos o más** (`SEG_CARGA_LENTA`), si sale el aviso «Está tardando» o si la persona toca «Volver…» porque se cansó de esperar, guarda la medida en el celular (`pgi_medidas`, máximo 20, se descartan a las 6 horas) y se la entrega al portal, que la muestra en el panel → pestaña **Monitor**. Se borra del celular cuando el portal confirma que la guardó. Las cargas normales no se envían. Detalle en **INSTRUCCIONES.md, sección 3.1**.

**Cuándo hay que volver a subir algo aquí:** solo si cambia la URL del portal, la dirección de la app, el nombre, el ícono, la imagen de vista previa o el color, o cuando una versión nueva de la app lo pida (como la `2026-11-15a`: sube `index.html` y `sw.js`). Los cambios del portal y de las herramientas se publican en Apps Script como siempre.

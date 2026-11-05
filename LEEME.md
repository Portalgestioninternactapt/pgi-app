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

**Cuándo hay que volver a subir algo aquí:** solo si cambia la URL del portal, la dirección de la app, el nombre, el ícono, la imagen de vista previa o el color. Los cambios del portal y de las herramientas se publican en Apps Script como siempre.

# MiRadio · Lemeit

Reproductor personal de cuatro radios argentinas. Sitio estático sin compilación, compatible con instalación como PWA.

## Desarrollo

Servir esta carpeta con un servidor HTTP, por ejemplo `python -m http.server 8767`. Abrir en el navegador y seleccionar una emisora. No abrir el HTML directamente como archivo.

- `index.html`: interfaz y metadatos.
- `styles.css`: paleta Lemeit (carbón cálido, crema, naranja óxido), adaptación móvil y movimiento reducido.
- `app.js`: reproducción, HLS, controles accesibles y preferencias locales.
- `assets/`: imágenes separadas de las emisoras y nueva marca de MiRadio.
- `sw.js`: caché de interfaz; las transmisiones no se guardan. Incrementar la versión al actualizar recursos.
- `hls.min.js`: hls.js 1.6.13; licencia en `hls.LICENSE`.

## Verificación

`node --check app.js`, `node --check sw.js` y prueba en navegador. Revisar reproducción, detener, cambiar de emisora, volumen, teclado, pantalla móvil e instalación PWA.

Los logos de emisoras pertenecen a sus respectivas marcas. Se conservan los originales incorporados por el repositorio; Radio 10 tiene una versión sin fondo blanco. Las variantes visuales no implican afiliación. El logo propio de MiRadio se generó con ImageGen. Ver `docs/design.md` para procedencia y decisiones.

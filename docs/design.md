# MiRadio · rediseño Lemeit

## Dirección visual

Paleta tomada del sitio personal Lemeit/aboutme: carbón cálido `#1A1612`, superficie `#221E18`, crema `#F2ECE4`; acento naranja `#D9691F` para controles y foco. Tipografía Space Grotesk para títulos y DM Sans para lectura, con alternativas del sistema si Google Fonts no está disponible. Dial decorativo construido en CSS, no representa datos de señal.

Se conservan las cuatro emisoras y sus URLs. La reproducción HLS de El Destape y Radio 10 mantiene hls.js 1.6.13. La animación de barras indica reproducción: es decorativa y no mide volumen ni calidad de señal; se desactiva con movimiento reducido.

## Imágenes y procedencia

- `assets/miradio-mark-v2.png`: segunda propuesta original para MiRadio, creada con la herramienta integrada ImageGen; sustituye el monograma descartado. Radio mínima, marfil y antena naranja, fondo transparente. Los íconos PWA son derivados de tamaño con fondo carbón y margen de seguridad para máscaras.
- `assets/radio10.png`: versión de la imagen original ya incorporada al repositorio, editada con ImageGen para quitar el fondo blanco. En la interfaz se presenta en crema por contraste. No es una nueva marca oficial.
- `assets/destape.png`: imagen original del repositorio editada con ImageGen para quitar el fondo blanco y el círculo azul, conservando el texto. No es una nueva marca oficial.
- `assets/station-2.png`, `assets/station-3.png`: logos originales de La Tribu y Aspen extraídos del HTML existente, sin generación ni redibujo. El recorte circular y la composición en pantalla eliminan los recuadros del fondo.
- Los logos de las emisoras pertenecen a sus titulares; este rediseño no afirma afiliación. Los originales se pueden recuperar del historial anterior de Git.

## Prompts finales (herramienta integrada, sin API/CLI)

### MiRadio

Use case: logo-brand. Create an extremely simple minimalist icon for MiRadio by Lemeit. One small retro radio symbol, straight rectangular ivory outline with slightly rounded corners, one circular speaker represented by only a circle outline and two short horizontal tuning lines on the right, a single short rust-orange antenna diagonal above it. Maximum 6 simple geometric strokes. Warm ivory #F2ECE4 plus orange #D9691F accent only. Uniform thick strokes, crisp flat solid vector-like graphic, no shading, no texture, no gradients, no waves, no letters, no monogram, no words, no enclosing tile. Centered, generous padding. Truly transparent background. Elegant understated functional app icon legible at 24px.

### Radio 10

Use case: background-extraction. Edit target: Radio 10 existing logo. Remove only the white background, make it truly transparent. Preserve exact original R10 lettering, AM 710 text and radio-wave geometry, proportions and blue/cyan colors. Trim excess blank padding with a small transparent margin. Crisp clean edges, do not invent or redraw identity, do not add any elements.

### El Destape

Use case: background-extraction. Edit target: El Destape radio existing logo. Remove the white outside background and the dark blue circular badge, leaving only original orange/red lettering am 1070 El Destape on genuinely transparent background. Preserve the exact original typography, text, layout and red color without changing letter shapes. Clean sharp edges, small transparent margin, no additions, no white rectangle or blue circle.

## Actualización PWA

La caché `miradio-v9` incluye interfaz, logos, íconos y hls.js. Las peticiones de transmisiones externas no se interceptan. Las fuentes web son opcionales; sin conexión se usa la tipografía del sistema. La radio requiere internet. El cambio de ícono en el lanzador de Android puede depender del ciclo de actualización de Chrome.

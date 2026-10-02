# Proyecto: MetroTech — página plana (one-page)

MetroTech es una marca de Salazar Arias Company (Pereira, Risaralda, Colombia) enfocada en soluciones tecnológicas para empresas. Esta es su página informativa de una sola pantalla con navegación por anclas. **No es un e-commerce**: no hay catálogo, carrito, checkout ni panel.

**Fuente de verdad:** `manual de marca/MANUAL DE MARCA METROTECH.pdf`. Ante una duda de marca, se abre el manual.

## 1. Cómo trabajar

- Por fases (sección 9). Al terminar cada una, resumen y esperar aprobación antes de seguir.
- Commits pequeños y descriptivos, en una rama por fase (`fase-1`, `fase-2`…).
- **No inventar información de la empresa** (servicios, cifras, clientes, testimonios, contacto). Lo que falta va como ejemplo marcado (`"ejemplo": true`) o `PENDIENTE` en `contenido.json`.
- Si algo es ambiguo, preguntar.
- Revisar cada pantalla a 390 px y 1440 px antes de entregarla.
- Todo en español.

## 2. Arquitectura (la de Tu Móvil, sin cambiar de stack)

| Parte | Dónde | Desarrollo |
|---|---|---|
| Página (Angular 21, standalone, TS estricto) | `frontend/src` | http://localhost:4220 |
| Código compartido: tokens, componentes CSS, contenido, entornos | `frontend/comun` | — |
| Contenido editable | `frontend/public/contenido.json` | — |
| API (PHP 8.2 + mysqli) | `backend/controladores` | http://localhost/metrotech/backend/controladores |
| Base (MariaDB) | `backend/sql/metrotech.sql` | base `metrotech` |

- Estilos: **CSS plano** con tokens en `frontend/comun/tokens.css` y componentes en `frontend/comun/componentes.css`. Ningún color, tamaño o espacio fuera de los tokens.
- Elementos de marca como componentes de Angular en `frontend/src/app/marca/`.
- **Íconos de contenido: propios** (`<mt-icono>` en `src/app/marca/icono.ts`), dibujados con el lenguaje del logo: trazo geométrico de esquina viva y los remates de la línea del monograma (cuadro y rombo) en celeste. Van en un mosaico azul oscuro (`.icono-marca`) para que se vean. Nombres válidos en `NOMBRES_ICONO`. Lucide queda solo para controles de interfaz (menú, flechas, pausa, avisos) y redes sociales.
- Backend: `enrutador.php` (CORS, cabeceras, errores JSON) + `despachar()` con niveles de permiso cerrados por defecto. Credenciales en `*.local.php` (en .gitignore) con su `*.local.ejemplo.php`.
- Apache cerrado por defecto: el `.htaccess` raíz niega todo; solo abren `backend/controladores/` y el build.
- No se agregan librerías sin justificarlo y sin aprobación.

## 3. Color

Solo los colores del manual (lámina 13: «Solo los colores establecidos en el manual son permitidos»).

| Token | Valor | Uso |
|---|---|---|
| `--azul-oscuro` | `#0E2233` · Pantone 282 C | Estructura. Texto, botones principales, enlaces, zona oscura |
| `--celeste` | `#158DB4` · Pantone 639 C | Tecnología, innovación, claridad en los datos. **Solo acento** |
| Tintes | `--celeste-50/100/200`, `--azul-50` | Fondos y superficies |
| Neutros | blanco, negro, grises | Texto secundario, bordes |

- El celeste con texto blanco da 3,82:1 y sobre azul oscuro 4,25:1: **no cumple AA en texto normal**. Va en íconos, títulos grandes, bordes, líneas y fondos decorativos; nunca como fondo de botón ni en texto pequeño.
- El logo trae su propio celeste (`#0382B5`, distinto al de la paleta): el archivo del logo no se toca.
- Colores de estado del formulario: **propuesta pendiente de aprobación** (`--verde-estado`, `--rojo-estado` y sus versiones claras para zona oscura). Siempre con ícono y palabra.
- Zonas por `data-theme` en cada `<section>`: `light` (blanco), `tint` (celeste muy claro), `dark` (azul oscuro) y `celeste` (bandas de llamado, como el logo sobre celeste). En `celeste` el azul oscuro da 4,25:1 y el blanco 3,82:1: **solo títulos de 24 px o más y botones**, nunca texto pequeño.

**Inconsistencias del manual que no se replican:** la lámina del monograma llama al celeste «limpieza, claridad» (texto heredado de otra marca); la lámina 2 habla de «verde y azul», pero el verde es de Salazar Arias Company, no de MetroTech; las líneas decorativas de las láminas usan `#002060`, que no es corporativo.

## 4. Tipografía

- El manual exige **Acumin Variable Concept, Semibold**, también en la web. Es de Adobe Fonts y requiere licencia y kit: **no se descarga de fuentes no oficiales**.
- Mientras no haya kit, va **Archivo** (Google Fonts), variable en peso y ancho. Se cambia en dos lugares: `--fuente` en `tokens.css` y el `<link>` de `src/index.html`.
- Escala: H1 36→64, H2 30→44, H3 22→28, H4 20, H5 18, H6 16 (títulos en 600); cuerpo L 18, cuerpo 16, pequeño 14, micro 12; botón 16/600.

## 5. Logotipo

- Archivos en `frontend/public/img/marca/`, **exportados de los vectores del PDF sin redibujar** (láminas 8 y 19): `logo-color`, `logo-sobre-celeste`, `logo-sobre-negro`, `logo-gris-sobre-blanco`, `monograma-color`, `monograma-sobre-celeste`, `monograma-sobre-negro`, `logo-salazar-arias`.
- Siempre con el componente `<mt-logo>`: aplica el espacio en blanco (¼ del alto) y pasa al monograma si el ancho queda por debajo de 96 px.
- Monograma para tamaños pequeños, favicon y cabecera en móvil.
- Pie (azul oscuro): versión `sobre-negro` (M gris, T blanca).
- **Prohibido**: sombras o efectos, fondos de colores no corporativos, distorsiones o perspectivas, colores no corporativos.

## 6. Elementos gráficos (con moderación, mucho espacio en blanco)

| Componente | Qué es |
|---|---|
| `<mt-regla>` | Marcas de regla de la M: bordes de sección, separadores, héroe |
| `<mt-linea-nodos>` | Línea con rombo de la T: separadores, línea de tiempo, conexión de tarjetas. `[animar]` la dibuja al entrar en pantalla |
| `<mt-marca-agua>` | Monograma MT gigante a baja opacidad en una esquina |
| `<mt-franjas>` | Franjas diagonales celestes en esquina inferior |
| `<mt-doble-linea>` | Doble línea vertical (azul oscuro + celeste) de encabezados |
| `.acento-linea` | Línea vertical fina junto a un texto corto (como el slogan) |
| `<mt-titulo-seccion>` | Título de sección con doble línea |
| `<mt-ejemplo>` | Marca CONTENIDO DE EJEMPLO |

## 7. Referencia visual

`manual de marca/diseño.png` es una referencia de composición (una plantilla corporativa ajena): héroe oscuro a todo el ancho con imágenes de fondo, tarjetas que se montan sobre el borde del héroe, bloques con imagen y bandas de color. **Se toma la composición, nunca su color, tipografía, logo, textos ni imágenes**: todo eso sale del manual de MetroTech. Su naranja equivale aquí a los azules de la marca.

- **Héroe:** carrusel de fondo a todo el ancho que **pasa solo cada 6 s** (también con el puntero encima y con movimiento reducido, en ese caso sin el acercamiento de la imagen). Velo azul oscuro para que el texto siempre se lea, un mensaje por diapositiva (`hero.diapositivas` en `contenido.json`). Botón de pausa (obligatorio por accesibilidad), se detiene solo mientras alguien lo recorre con el teclado o con la pestaña oculta; flechas del teclado y deslizar.
- **Fotos del carrusel:** 4 imágenes **generadas con IA** (Runway) en la paleta de la marca: sala de control (integración), medición con calibrador (precisión), centro de datos (estructura) y reunión de equipo de espaldas (acompañamiento). Sin textos, logos ni caras reconocibles, para que nadie las tome por el equipo o las instalaciones reales. Están en `public/img/hero/foto-*` a 960 y 1920 px; se cambian por fotos reales de la empresa con el mismo par de tamaños.
- **Pilares** montados sobre el borde inferior del héroe; **Quiénes somos** con imagen y bloque azul oscuro encima; **banda celeste** de llamado antes de Contacto.

## 8. Tono y contenido

- Slogan: «Tecnología que impulsa tu operación». Concepto: «Sistema que conecta todo» (integración + precisión + estructura). Propósito: transformar datos en decisiones confiables.
- Tono: profesional con empatía, innovador, confiable y cercano. Dirigido a empresas.
- Valores (lámina 16): familia como valor central, perseverancia y constancia, responsabilidad y disciplina, lealtad (interna y con clientes), integralidad en soluciones, educación continua del personal, profesionalismo con empatía.
- Los datos de contacto de la papelería del manual son de ejemplo: **no se usan**.
- Las imágenes de papelería y uniformes del manual son ilustrativas: se presentan como identidad de marca, nunca como fotos del equipo real. La de papelería **no se usa**: muestra la dirección, el teléfono y el correo de ejemplo del manual. A la de uniformes se le quitó el logo distorsionado que traía en la esquina.
- Todo el texto vive en `frontend/public/contenido.json`.

## 9. Contacto

- **Los mensajes van por WhatsApp** (decisión del 2 de octubre de 2026): el formulario valida los datos y abre WhatsApp con el mensaje ya escrito. No pasa por el servidor ni se guarda.
- Al lado del formulario se muestran el correo y los demás datos de contacto de `contenido.json`.
- Sin número configurado, el formulario se ve pero no envía y lo dice.
- **Panel administrativo: más adelante**, no ahora. Cuando llegue, el backend ya tiene la estructura de Tu Móvil para crecer.

## 10. Calidad

- Móvil primero y adaptable a cualquier pantalla: se audita de 320 a 2560 px y en celular horizontal, sin desplazamiento horizontal, sin elementos fuera de pantalla ni textos cortados. Tableta (600–899) con su propia disposición (pilares en 3 columnas, datos y pie en 2); en monitores de 1920 px o más el contenedor se ensancha y la letra sube.
- AA: contraste, foco visible (2 px en `--foco`), etiquetas en campos, textos alternativos, navegación por teclado.
- Movimiento sutil y solo con `prefers-reduced-motion: no-preference`.
- Imágenes WebP al tamaño en que se muestran, `loading="lazy"` fuera de la primera pantalla.

## 11. Fases

- **Fase 0 · Preparación.** ✔ Entregada.
- **Fase 1 · Base y sistema de diseño.** ✔ Aprobada. Estructura, `contenido.json`, tokens, componentes base y elementos de marca; muestrario en `/sistema`.
- **Fase 2 · Página plana.** Cabecera, héroe, quiénes somos, soluciones, cómo trabajamos, valores, identidad, contacto por WhatsApp y pie.
- **Fase 3 · Calidad.** Responsive, animaciones, AA, rendimiento, SEO (título, descripción, Open Graph, datos estructurados, favicon).

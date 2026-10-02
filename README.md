# MetroTech · página web

Página informativa de una sola pantalla para MetroTech, marca de soluciones tecnológicas para empresas de Salazar Arias Company (Pereira). Las reglas del proyecto (marca, arquitectura y fases) están en [`CLAUDE.md`](CLAUDE.md).

| Parte | Dónde | En desarrollo |
|---|---|---|
| Página (Angular 21) | `frontend/src` | http://localhost:4220 |
| Muestrario del sistema de diseño | `frontend/src/app/sistema` | http://localhost:4220/sistema |
| Contenido editable | `frontend/public/contenido.json` | — |
| API (PHP 8.2 + mysqli) | `backend/controladores` | http://localhost/metrotech/backend/controladores |
| Base (MariaDB) | `backend/sql/metrotech.sql` | base `metrotech` |

## Requisitos

- **XAMPP** con PHP 8.2 o superior (`mysqli`, `mbstring`).
- **MariaDB 10.4** o superior.
- **Node.js 22** y npm.

## Instalación en desarrollo

```bash
# 1. El proyecto va en C:\xampp\htdocs\metrotech. Arranca Apache y MySQL en XAMPP.

# 2. La base.
C:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 < backend\sql\metrotech.sql

# 3. El frontend. --legacy-peer-deps porque los peers de vitest chocan (igual que en Tu Móvil).
cd frontend
npm install --legacy-peer-deps
npx ng serve sitio --port 4220
```

Comprobar el backend: http://localhost/metrotech/backend/controladores/estado.php?control=ping debe responder `{"resultado":"ok","base":true}`.

## Editar el contenido

Todo el texto está en `frontend/public/contenido.json`. Se edita ahí, sin tocar código; en producción basta con subir el archivo nuevo.

- Secciones con `"ejemplo": true` muestran la marca **CONTENIDO DE EJEMPLO** hasta que llegue el texto real.
- Lo que dice `PENDIENTE` es un dato que la empresa todavía no ha entregado.

### Activar el formulario de contacto (WhatsApp)

El formulario no envía correos: abre WhatsApp con el mensaje ya escrito. Para activarlo, en `contacto` de `contenido.json`:

```json
"whatsapp": "573001234567",
"whatsappVisible": "+57 300 123 4567",
"correo": "contacto@empresa.com",
"correoVisible": "contacto@empresa.com"
```

`whatsapp` va con indicativo de país, sin espacios ni signos. Con el número puesto también aparece el botón flotante de WhatsApp.

## Cambiar la tipografía

Hoy va **Archivo** en lugar de **Acumin Variable Concept** (Adobe Fonts, con licencia). Cuando exista el kit de Adobe Fonts:

1. En `frontend/src/index.html`, cambiar el `<link>` de Google Fonts por el del kit.
2. En `frontend/comun/tokens.css`, dejar `--fuente: 'acumin-variable', …` con el nombre que dé el kit.

## Logos

Los SVG de `frontend/public/img/marca/` salieron de los vectores del manual en PDF, sin redibujar. Si el diseñador entrega los SVG originales, se reemplazan con el mismo nombre de archivo.

## Despliegue

```bash
cd frontend
npx ng build sitio --base-href /metrotech/
```

| Ruta pública | Qué se sube |
|---|---|
| `/metrotech/` | el contenido de `frontend/dist/sitio/browser/` |
| `/metrotech/backend/` | la carpeta `backend/` |

Si la página va en la raíz del dominio, cambiar `apiUrl` en `frontend/comun/environments/environment.ts` y el `--base-href`, y agregar el dominio a `origenesPermitidos()` en `backend/modelos/seguridad.php`.

- [ ] HTTPS activo.
- [ ] `conexion.local.php` con la base del hosting e importado `backend/sql/metrotech.sql`.
- [ ] Los `.htaccess` subidos (backend y build).
- [ ] `contenido.json` sin `PENDIENTE` ni `"ejemplo": true`.

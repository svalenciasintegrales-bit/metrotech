/**
 * Configuración del servidor de Hostinger.
 *
 * Allí la página queda en la raíz del dominio (public_html) y la API en
 * public_html/backend/controladores. Se usa con `npm run build:hostinger`.
 */
export const environment = {
  produccion: true,
  apiUrl: '/backend/controladores'
};

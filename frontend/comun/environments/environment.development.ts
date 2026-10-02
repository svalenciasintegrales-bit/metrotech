/**
 * Configuración de desarrollo.
 *
 * `ng serve` levanta la página en :4220 y el backend lo sirve Apache en :80,
 * así que aquí la URL de la API sí tiene que ser absoluta. Ese cruce de
 * puertos es el que obliga al CORS del enrutador.
 */
export const environment = {
  produccion: false,
  apiUrl: 'http://localhost/metrotech/backend/controladores'
};

/**
 * Configuración de producción.
 *
 * La ruta del backend es absoluta desde la raíz del dominio, no
 * `http://localhost/...`: así el mismo build sirve en cualquier servidor sin
 * recompilar. Angular reemplaza este archivo por
 * `environment.development.ts` cuando se corre `ng serve`.
 *
 * PENDIENTE: si la página va en la raíz del dominio y no en /metrotech/,
 * cambiar `apiUrl` y el `--base-href` del build.
 */
export const environment = {
  produccion: true,
  apiUrl: '/metrotech/backend/controladores'
};

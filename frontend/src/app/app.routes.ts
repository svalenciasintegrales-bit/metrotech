import { Routes } from '@angular/router';

/**
 * Es una página plana: todo vive en una sola ruta y se navega por anclas.
 *
 * `/sistema` es el muestrario del sistema de diseño (tokens, componentes y
 * elementos de marca en las tres zonas). Interno: noindex y fuera del menú.
 *
 * Fase 1: la página todavía no existe (es la fase 2), así que la raíz
 * lleva al muestrario.
 */
export const routes: Routes = [
  {
    path: 'sistema',
    loadComponent: () => import('./sistema/sistema').then(m => m.Sistema),
    title: 'Sistema de diseño · MetroTech'
  },
  { path: '', redirectTo: 'sistema', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

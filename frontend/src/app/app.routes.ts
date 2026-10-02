import { Routes } from '@angular/router';

/**
 * Es una página plana: todo vive en una sola ruta y se navega por anclas.
 *
 * `/sistema` es el muestrario del sistema de diseño (tokens, componentes y
 * elementos de marca en las tres zonas). Interno: noindex y fuera del menú.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pagina/pagina').then(m => m.Pagina)
  },
  {
    path: 'sistema',
    loadComponent: () => import('./sistema/sistema').then(m => m.Sistema),
    title: 'Sistema de diseño · MetroTech'
  },
  { path: '**', redirectTo: '' }
];

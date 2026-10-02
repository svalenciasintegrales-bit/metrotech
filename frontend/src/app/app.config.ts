import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';

import { cargarContenido } from '../../comun/contenido';
import { proveerIconos } from '../../comun/iconos';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // `anchorScrolling` para que /#contacto llegue a su sección al abrir el
    // enlace; el desplazamiento suave lo pone el CSS (`scroll-behavior`),
    // que respeta `prefers-reduced-motion`.
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),

    provideHttpClient(),

    proveerIconos(),

    // Todo el texto sale de `public/contenido.json`, antes de la primera pantalla.
    provideAppInitializer(() => cargarContenido(inject(HttpClient)))
  ]
};
